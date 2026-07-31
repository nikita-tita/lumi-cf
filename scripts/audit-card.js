#!/usr/bin/env node
/**
 * Замерочный скрипт публичной визитки агента (`lumi.estate/agent/<slug>`).
 *
 * Повод: 2026-07-31 обнаружилось, что вёрстка не держит собственные лимиты
 * (колонка цифр сжималась до 41px при нужных 74, подписи в 10px, контраст
 * дисклеймера 2.31:1, чекбокс согласия 16×16) — и НИ ОДИН существующий гейт
 * этого не поймал. Дефекты нашли ручным замером в браузере (§1 диагноза,
 * lumi-mobile `docs/design/PUBLIC-PROFILE-REDESIGN.md`). Этот скрипт — тот же
 * замер, но автоматом и по нескольким ширинам/темам разом.
 *
 * Берёт URL (живая страница) ИЛИ локальный HTML-файл, гоняет playwright по
 * нескольким ширинам вьюпорта и обеим цветовым схемам, ищет:
 *   1. переполнение элементов (scrollWidth/Height > clientWidth/Height)
 *   2. горизонтальный скролл страницы
 *   3. шрифт мельче порога читаемости
 *   4. тач-таргеты меньше 44px
 *   5. контраст текста ниже WCAG AA (4.5:1, 3:1 для крупного текста)
 *
 * Скрытые элементы (display:none/visibility:hidden/aria-hidden, офскрин-приём
 * вроде honeypot-поля формы `left:-9999px`) в отчёт НЕ попадают — ложные
 * срабатывания здесь дороже пропусков (см. README/PUBLIC-PROFILE-REDESIGN §5).
 *
 * Почему playwright: в репозитории на момент написания не было ни playwright,
 * ни puppeteer. Выбран playwright — у него из коробки эмуляция viewport +
 * `colorScheme` на уровне контекста (не нужно инжектить media-query хаки),
 * предсказуемый headless Chromium в CI (`playwright install --with-deps`) и
 * его уже использует часть экосистемы Next/Cloudflare-проектов для e2e.
 *
 * Использование:
 *   node scripts/audit-card.js <url-или-путь-к-html> [флаги]
 *   node scripts/audit-card.js https://lumi.estate/agent/amina-hassan-dubai
 *   node scripts/audit-card.js ./out/agent/demo.html --json
 *
 * Флаги:
 *   --widths=320,375,768,1280   ширины вьюпорта (по умолчанию — эти четыре)
 *   --schemes=light,dark        цветовые схемы (по умолчанию обе)
 *   --timeout=20000             таймаут навигации, мс
 *   --json                      машиночитаемый вывод вместо таблицы
 *
 * Код возврата: 0 — дефектов нет, 1 — есть дефекты (или страница не открылась),
 * 2 — ошибка использования (нет цели, не найден файл).
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ─── Пороги ──────────────────────────────────────────────────────────────

const DEFAULT_WIDTHS = [320, 375, 768, 1280];
const DEFAULT_SCHEMES = ['light', 'dark'];
const VIEWPORT_HEIGHT = 1000;
const DEFAULT_TIMEOUT = 20000;

const MIN_FONT_SIZE = 12; // px — абсолютный пол читаемости
const MIN_BODY_FONT_SIZE = 16; // px — для «текста-предложения» на мобильном
const BODY_TEXT_MIN_LENGTH = 24; // символов — эвристика «это предложение, не лейбл/цифра»
const MIN_TOUCH_TARGET = 44; // px — WCAG 2.5.5 / Apple HIG
const MIN_CONTRAST_NORMAL = 4.5; // WCAG AA, обычный текст
const MIN_CONTRAST_LARGE = 3.0; // WCAG AA, крупный текст (>=24px или >=18.66px bold)
const OVERFLOW_TOLERANCE = 1; // px — округление суб-пиксельного рендера
const MAX_PRINTED_PER_GROUP = 30; // строк в человекочитаемой таблице на одну (width×scheme)

// ─── Цвет/контраст — чистые функции ────────────────────────────────────────
//
// ВАЖНО: это независимая копия той же логики, что зашита внутрь
// `browserAudit()` ниже. Дублирование намеренное: `browserAudit` целиком
// сериализуется и выполняется в браузере (playwright `page.evaluate`), у него
// нет доступа к модулям Node — весь код там обязан быть самодостаточным.
// Здесь эти функции существуют для юнит-тестов (см. `__tests__/audit-card.test.ts`)
// и как единственный источник правды при чтении/правке — меняешь тут, проверь
// то же место внутри `browserAudit`.

function parseColor(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const m = raw.match(/^rgba?\(([^)]+)\)$/i);
  if (!m) return null;
  const parts = m[1].split(',').map((s) => parseFloat(s.trim()));
  const [r, g, b, a = 1] = parts;
  if ([r, g, b].some((v) => Number.isNaN(v))) return null;
  return { r, g, b, a: Number.isNaN(a) ? 1 : a };
}

function blendOver(fg, bg) {
  const a = fg.a + bg.a * (1 - fg.a);
  if (a === 0) return { r: 255, g: 255, b: 255, a: 0 };
  const mix = (cf, cb) => (cf * fg.a + cb * bg.a * (1 - fg.a)) / a;
  return { r: mix(fg.r, bg.r), g: mix(fg.g, bg.g), b: mix(fg.b, bg.b), a };
}

function relativeLuminance(c) {
  const chan = (v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * chan(c.r) + 0.7152 * chan(c.g) + 0.0722 * chan(c.b);
}

function contrastRatio(a, b) {
  const la = relativeLuminance(a) + 0.05;
  const lb = relativeLuminance(b) + 0.05;
  return la > lb ? la / lb : lb / la;
}

// ─── Аудит внутри браузера ──────────────────────────────────────────────
//
// Один самодостаточный колбэк для `page.evaluate`. Ничего снаружи (кроме
// `config`) сюда не долетает — только браузерные глобалы (document, window,
// getComputedStyle).

function browserAudit(config) {
  function parseColor(raw) {
    if (!raw || typeof raw !== 'string') return null;
    const m = raw.match(/^rgba?\(([^)]+)\)$/i);
    if (!m) return null;
    const parts = m[1].split(',').map((s) => parseFloat(s.trim()));
    const r = parts[0];
    const g = parts[1];
    const b = parts[2];
    const a = parts.length > 3 ? parts[3] : 1;
    if ([r, g, b].some((v) => Number.isNaN(v))) return null;
    return { r: r, g: g, b: b, a: Number.isNaN(a) ? 1 : a };
  }

  function blendOver(fg, bg) {
    const a = fg.a + bg.a * (1 - fg.a);
    if (a === 0) return { r: 255, g: 255, b: 255, a: 0 };
    function mix(cf, cb) {
      return (cf * fg.a + cb * bg.a * (1 - fg.a)) / a;
    }
    return { r: mix(fg.r, bg.r), g: mix(fg.g, bg.g), b: mix(fg.b, bg.b), a: a };
  }

  function relativeLuminance(c) {
    function chan(v) {
      const x = v / 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    }
    return 0.2126 * chan(c.r) + 0.7152 * chan(c.g) + 0.0722 * chan(c.b);
  }

  function contrastRatio(a, b) {
    const la = relativeLuminance(a) + 0.05;
    const lb = relativeLuminance(b) + 0.05;
    return la > lb ? la / lb : lb / la;
  }

  // Скрыт ли элемент по-настоящему (display/visibility/aria-hidden), или это
  // офскрин-приём вроде honeypot-поля (`position:absolute; left:-9999px`).
  // Такие элементы не должны попадать в отчёт ни по одной проверке — ложные
  // срабатывания здесь дороже пропусков.
  function isHidden(el) {
    let node = el;
    while (node && node.nodeType === 1) {
      const cs = getComputedStyle(node);
      if (cs.display === 'none') return true;
      if (cs.visibility === 'hidden' || cs.visibility === 'collapse') return true;
      if (node.getAttribute && node.getAttribute('aria-hidden') === 'true') return true;
      node = node.parentElement;
    }
    if (el.tagName === 'INPUT' && el.type === 'hidden') return true;
    const rect = el.getBoundingClientRect();
    // офскрин: элемент целиком уехал за левый/верхний край (honeypot-приём)
    if (rect.right <= 0 || rect.bottom <= 0) return true;
    if (rect.width === 0 && rect.height === 0) return true;
    return false;
  }

  function hasOwnText(el) {
    const kids = el.childNodes;
    for (let i = 0; i < kids.length; i++) {
      const n = kids[i];
      if (n.nodeType === 3 && n.textContent.trim().length > 0) return true;
    }
    return false;
  }

  function isLeafish(el) {
    return el.childElementCount === 0 || hasOwnText(el);
  }

  function snippet(el) {
    return el.textContent.trim().replace(/\s+/g, ' ').slice(0, 40);
  }

  function cssPath(el) {
    const parts = [];
    let node = el;
    let depth = 0;
    while (node && node.nodeType === 1 && depth < 4) {
      let part = node.tagName.toLowerCase();
      if (node.id) {
        part += '#' + node.id;
        parts.unshift(part);
        break;
      }
      const cls =
        node.className && typeof node.className === 'string'
          ? node.className.trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.')
          : '';
      if (cls) part += '.' + cls;
      parts.unshift(part);
      node = node.parentElement;
      depth++;
    }
    return parts.join(' > ');
  }

  function getEffectiveBackground(el) {
    const layers = [];
    let node = el;
    while (node) {
      const cs = getComputedStyle(node);
      const bg = parseColor(cs.backgroundColor);
      if (bg && bg.a > 0) {
        layers.push(bg);
        if (bg.a >= 1) break;
      }
      node = node.parentElement;
    }
    let result = { r: 255, g: 255, b: 255, a: 1 }; // допущение: окно браузера белое
    for (let i = layers.length - 1; i >= 0; i--) {
      result = blendOver(layers[i], result);
    }
    return result;
  }

  const findings = [];
  const all = document.querySelectorAll('*');
  const skipTags = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEMPLATE: 1 };
  const touchTags = { A: 1, BUTTON: 1, INPUT: 1, LABEL: 1 };

  for (let i = 0; i < all.length; i++) {
    const el = all[i];
    if (skipTags[el.tagName]) continue;
    if (isHidden(el)) continue;

    const rect = el.getBoundingClientRect();
    const cs = getComputedStyle(el);

    // 1. переполнение — только на «листовых» элементах (иначе контейнер и его
    // текстовый ребёнок дублируют одну и ту же находку)
    if (isLeafish(el)) {
      if (el.clientWidth > 0 && cs.overflowX !== 'auto' && cs.overflowX !== 'scroll') {
        const diff = el.scrollWidth - el.clientWidth;
        if (diff > config.overflowTolerance) {
          findings.push({
            type: 'overflow-x',
            severity: 'error',
            selector: cssPath(el),
            detail: 'scrollWidth ' + el.scrollWidth + 'px > clientWidth ' + el.clientWidth + 'px',
            value: el.scrollWidth,
            threshold: el.clientWidth,
            text: snippet(el),
          });
        }
      }
      if (el.clientHeight > 0 && cs.overflowY !== 'auto' && cs.overflowY !== 'scroll') {
        const diff = el.scrollHeight - el.clientHeight;
        if (diff > config.overflowTolerance) {
          findings.push({
            type: 'overflow-y',
            severity: 'error',
            selector: cssPath(el),
            detail: 'scrollHeight ' + el.scrollHeight + 'px > clientHeight ' + el.clientHeight + 'px',
            value: el.scrollHeight,
            threshold: el.clientHeight,
            text: snippet(el),
          });
        }
      }
    }

    // 2. шрифт мельче порога — только там, где есть собственный текст
    if (hasOwnText(el)) {
      const fontSize = parseFloat(cs.fontSize);
      const text = el.textContent.trim();
      if (fontSize < config.minFont) {
        // Абсолютный пол читаемости — нарушение независимо от роли текста.
        findings.push({
          type: 'font-too-small',
          severity: 'error',
          selector: cssPath(el),
          detail: fontSize + 'px < ' + config.minFont + 'px',
          value: fontSize,
          threshold: config.minFont,
          text: snippet(el),
        });
      } else if (fontSize < config.minBodyFont && text.length >= config.bodyTextMinLen) {
        // Эвристика по длине текста не различает «это .bio» от «это длинный
        // дисклеймер/лейбл, для которого 12px — задокументированная норма»
        // (PUBLIC-PROFILE-REDESIGN.md §1.2: порог для .micro/.disclaimer — 12px,
        // 16px требуется только для основного текста типа .bio/.role). Поэтому
        // это предупреждение, а не жёсткая находка — не должно ронять гейт.
        findings.push({
          type: 'font-small-for-body',
          severity: 'warning',
          selector: cssPath(el),
          detail: fontSize + 'px < ' + config.minBodyFont + 'px (текст из ' + text.length + ' симв.)',
          value: fontSize,
          threshold: config.minBodyFont,
          text: snippet(el),
        });
      }
    }

    // 3. тач-таргеты — меряем сам интерактивный элемент, не обёртку. Так же
    // это делает большинство аудиторов (Lighthouse tap-targets и т.п.):
    // визуальный глиф чекбокса/радио — это то, во что целится палец, даже
    // если формально клик по соседнему <label> тоже сработает. Сознательно
    // не пытаемся «скомпенсировать» маленький чекбокс большим label — именно
    // такое компенсирование дало 16×16 чекбокс на проде незамеченным.
    if (touchTags[el.tagName]) {
      const w = rect.width;
      const h = rect.height;
      if (w > 0 && h > 0 && (w < config.minTouch || h < config.minTouch)) {
        findings.push({
          type: 'touch-target',
          severity: 'error',
          selector: cssPath(el),
          detail: Math.round(w) + '×' + Math.round(h) + 'px < ' + config.minTouch + 'px',
          value: Math.round(Math.min(w, h)),
          threshold: config.minTouch,
          text: snippet(el),
        });
      }
    }

    // 4. контраст — только там, где есть собственный текст
    if (hasOwnText(el)) {
      const fg = parseColor(cs.color);
      if (fg) {
        const bg = getEffectiveBackground(el);
        const fgResolved = fg.a < 1 ? blendOver(fg, bg) : fg;
        const ratio = contrastRatio(fgResolved, bg);
        const fontSize = parseFloat(cs.fontSize);
        const fontWeight = parseInt(cs.fontWeight, 10) || 400;
        const isLarge = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
        const min = isLarge ? config.minContrastLarge : config.minContrastNormal;
        if (ratio < min) {
          findings.push({
            type: 'contrast',
            severity: 'error',
            selector: cssPath(el),
            detail: ratio.toFixed(2) + ':1 < ' + min + ':1',
            value: Number(ratio.toFixed(2)),
            threshold: min,
            text: snippet(el),
          });
        }
      }
    }
  }

  const docEl = document.documentElement;
  const pageOverflowX = docEl.scrollWidth > window.innerWidth + config.overflowTolerance;
  if (pageOverflowX) {
    findings.push({
      type: 'page-scroll-x',
      severity: 'error',
      selector: 'html',
      detail: 'document.scrollWidth ' + docEl.scrollWidth + 'px > innerWidth ' + window.innerWidth + 'px',
      value: docEl.scrollWidth,
      threshold: window.innerWidth,
      text: '',
    });
  }

  return {
    findings: findings,
    pageScrollWidth: docEl.scrollWidth,
    innerWidth: window.innerWidth,
  };
}

// ─── CLI ────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {
    target: null,
    widths: DEFAULT_WIDTHS,
    schemes: DEFAULT_SCHEMES,
    json: false,
    strict: false,
    timeout: DEFAULT_TIMEOUT,
    help: false,
  };
  const rest = [];
  for (const a of argv) {
    if (a === '--json') args.json = true;
    else if (a === '--strict') args.strict = true;
    else if (a === '--help' || a === '-h') args.help = true;
    else if (a.startsWith('--widths=')) {
      args.widths = a
        .slice('--widths='.length)
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isFinite(n) && n > 0);
    } else if (a.startsWith('--schemes=')) {
      args.schemes = a
        .slice('--schemes='.length)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (a.startsWith('--timeout=')) {
      const t = Number(a.slice('--timeout='.length));
      if (Number.isFinite(t) && t > 0) args.timeout = t;
    } else {
      rest.push(a);
    }
  }
  args.target = rest[0] || null;
  return args;
}

function resolveTarget(target) {
  if (/^https?:\/\//i.test(target)) return target;
  if (/^file:\/\//i.test(target)) return target;
  const abs = path.resolve(process.cwd(), target);
  if (fs.existsSync(abs)) return 'file://' + abs;
  throw new Error('Цель не найдена: не URL (http/https) и не существующий файл — ' + target);
}

const HELP_TEXT = `Замерочный скрипт публичной визитки агента.

Использование:
  node scripts/audit-card.js <url-или-путь-к-html> [флаги]

Флаги:
  --widths=320,375,768,1280   ширины вьюпорта
  --schemes=light,dark        цветовые схемы
  --timeout=20000             таймаут навигации, мс
  --json                      машиночитаемый вывод
  --strict                    считать предупреждения (severity=warning) находками для кода возврата

Находки бывают error (жёсткое нарушение — переполнение, скролл страницы,
тач-таргет, контраст, шрифт <12px) и warning (рекомендация — текст читался бы
лучше на 16px, но 12px формально соответствует порогу секции §1.2). warning не
роняет гейт без --strict.

Код возврата: 0 — error-находок нет, 1 — есть error-находки (или страница не
открылась), 2 — ошибка использования.
`;

async function auditTarget(target, opts) {
  // playwright — devDependency; require лениво, чтобы --help работал без него.
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const results = [];
  try {
    for (const width of opts.widths) {
      for (const scheme of opts.schemes) {
        const context = await browser.newContext({
          viewport: { width, height: VIEWPORT_HEIGHT },
          colorScheme: scheme,
        });
        const page = await context.newPage();
        const entry = { width, scheme, findings: [], error: null };
        try {
          await page.goto(target, { waitUntil: 'networkidle', timeout: opts.timeout });
          const config = {
            minFont: MIN_FONT_SIZE,
            minBodyFont: MIN_BODY_FONT_SIZE,
            bodyTextMinLen: BODY_TEXT_MIN_LENGTH,
            minTouch: MIN_TOUCH_TARGET,
            minContrastNormal: MIN_CONTRAST_NORMAL,
            minContrastLarge: MIN_CONTRAST_LARGE,
            overflowTolerance: OVERFLOW_TOLERANCE,
          };
          const result = await page.evaluate(browserAudit, config);
          entry.findings = result.findings;
          entry.pageScrollWidth = result.pageScrollWidth;
          entry.innerWidth = result.innerWidth;
        } catch (err) {
          entry.error = err && err.message ? err.message : String(err);
        } finally {
          await context.close();
        }
        results.push(entry);
      }
    }
  } finally {
    await browser.close();
  }
  return results;
}

function printTable(target, results) {
  console.log('Замер визитки: ' + target);
  console.log('='.repeat(60));
  let totalErrors = 0;
  let totalWarnings = 0;
  const byType = {};
  for (const r of results) {
    for (const f of r.findings) {
      byType[f.type] = (byType[f.type] || 0) + 1;
      if (f.severity === 'warning') totalWarnings++;
      else totalErrors++;
    }
  }

  for (const r of results) {
    const header = r.width + 'px / ' + r.scheme;
    if (r.error) {
      console.log('\n' + header + ' — ОШИБКА НАВИГАЦИИ: ' + r.error);
      continue;
    }
    const errCount = r.findings.filter((f) => f.severity !== 'warning').length;
    const warnCount = r.findings.length - errCount;
    console.log('\n' + header + ' — находок: ' + errCount + ' (+ ' + warnCount + ' предупреждений)');
    if (r.findings.length === 0) continue;
    const shown = r.findings.slice(0, MAX_PRINTED_PER_GROUP);
    for (const f of shown) {
      const tag = f.severity === 'warning' ? 'warn' : 'error';
      console.log('  [' + tag + '/' + f.type + '] ' + f.selector + '  ' + f.detail + (f.text ? '  «' + f.text + '»' : ''));
    }
    if (r.findings.length > shown.length) {
      console.log('  ... и ещё ' + (r.findings.length - shown.length));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Итого: ' + totalErrors + ' error, ' + totalWarnings + ' warning');
  if (totalErrors + totalWarnings > 0) {
    for (const [type, count] of Object.entries(byType)) {
      console.log('  ' + type + ': ' + count);
    }
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.target) {
    console.log(HELP_TEXT);
    process.exit(args.help ? 0 : 2);
  }

  let target;
  try {
    target = resolveTarget(args.target);
  } catch (err) {
    console.error(err.message);
    process.exit(2);
  }

  const results = await auditTarget(target, {
    widths: args.widths,
    schemes: args.schemes,
    timeout: args.timeout,
  });

  const hasNavError = results.some((r) => r.error);
  const errorFindings = results.reduce(
    (acc, r) => acc + r.findings.filter((f) => f.severity !== 'warning').length,
    0
  );
  const warningFindings = results.reduce(
    (acc, r) => acc + r.findings.filter((f) => f.severity === 'warning').length,
    0
  );

  if (args.json) {
    console.log(JSON.stringify({ target, results }, null, 2));
  } else {
    printTable(target, results);
  }

  const failing = hasNavError || errorFindings > 0 || (args.strict && warningFindings > 0);
  process.exit(failing ? 1 : 0);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
  });
}

module.exports = {
  parseColor,
  blendOver,
  relativeLuminance,
  contrastRatio,
  parseArgs,
  resolveTarget,
  auditTarget,
  browserAudit,
};
