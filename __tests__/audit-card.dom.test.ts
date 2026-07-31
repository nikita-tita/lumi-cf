/**
 * Реальная (не декоративная) проверка детектора `scripts/audit-card.js`.
 *
 * `__tests__/audit-card.test.ts` покрывает только обвязку (цвет-математику,
 * разбор CLI-аргументов) — приёмка (2026-07-31) справедливо указала, что эти
 * юниты не ловят ни один слом самого детектора: отключи проверку переполнения,
 * опусти порог контраста или тач-таргета — тесты всё равно зелёные. Инструмент,
 * построенный ловить молчаливые поломки, сам молча ломался.
 *
 * Здесь — два самодостаточных HTML-фикстура (строками, без внешних файлов):
 *  - BROKEN_HTML: подложены гарантированные переполнение, шрифт 10px, чекбокс
 *    16×16 и пара цветов с контрастом ~1.25:1 (посчитано заранее через
 *    `contrastRatio` — не «на глаз»), плюс honeypot-поле.
 *  - CLEAN_HTML: тот же набор элементов, но каждый в пределах порога, плюс тот
 *    же honeypot.
 *
 * Проверяем НЕ общий счёт находок (хрупко — версия шрифта/рендерера чуть
 * подвинет число), а множество ТИПОВ находок: на broken обязаны появиться все
 * четыре типа, на clean — ни одного error, и honeypot нигде не всплывает.
 *
 * Самопроверка теста (сделана вручную при написании, тем же способом, что и в
 * приёмке): временно отключал каждую из четырёх проверок в `browserAudit`
 * (overflow-x, font-too-small, touch-target, contrast) по одной — тест краснел
 * ровно на той находке, проверку которой выключили. Возвращал обратно.
 *
 * Отдельно от `npm test`: playwright — тяжёлая зависимость (реальный Chromium),
 * тянуть её в обычный прогон тестов (и в блокирующий `npm test` в deploy.yml)
 * означало бы то же самое «дорого на каждый деплой», от которого ушли в
 * CI (см. `.github/workflows/deploy.yml` и `audit-card.yml`). Поэтому у этого
 * файла свой jest-конфиг (`jest.config.audit-card.js`) и свой npm-скрипт
 * (`npm run test:audit-card`), исключённый из дефолтного `npm test`
 * (`jest.config.js` → `testPathIgnorePatterns`) — гоняется в CI только там,
 * где Chromium уже так и так поднимается: `audit-card.yml`.
 */
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { auditTarget } from "../scripts/audit-card";

type Finding = { type: string; severity?: string; selector: string };

const BROKEN_HTML = `<!doctype html>
<html lang="ru"><head><meta charset="utf-8">
<style>
  body { margin: 0; font-family: sans-serif; background: #ffffff; }
  .wrap { width: 300px; padding: 10px; }
  /* гарантированное переполнение: nowrap + overflow:hidden в узком боксе */
  .overflow-box { width: 50px; white-space: nowrap; overflow: hidden; font-size: 16px; }
  /* гарантированно мельче порога читаемости (12px) */
  .tiny-text { font-size: 10px; }
  /* контраст ~1.25:1 (см. doc-comment) — далеко за порогом 4.5:1 */
  .low-contrast { color: rgb(230, 230, 230); background: rgb(255, 255, 255); font-size: 16px; }
  /* гарантированно меньше тач-таргета 44px */
  input.tiny-checkbox { width: 16px; height: 16px; }
  .hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
</style></head>
<body>
  <div class="wrap">
    <div class="overflow-box">Этот текст точно шире пятидесяти пикселей и не влезает</div>
    <div class="tiny-text">Мелкий текст в десять пикселей</div>
    <p class="low-contrast">Едва различимый текст низкого контраста на белом фоне</p>
    <label>
      <input type="checkbox" class="tiny-checkbox" id="agree">
      <span>Согласие</span>
    </label>
    <div class="hp" aria-hidden="true">
      <label for="company">Company</label>
      <input type="text" id="company" name="company" tabindex="-1" autocomplete="off">
    </div>
  </div>
</body></html>`;

const CLEAN_HTML = `<!doctype html>
<html lang="ru"><head><meta charset="utf-8">
<style>
  body { margin: 0; font-family: sans-serif; background: #ffffff; color: #111111; }
  .wrap { width: 300px; padding: 16px; }
  .box { width: 200px; font-size: 16px; }
  .label { font-size: 12px; color: #444444; }
  a.cta {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 44px; min-height: 44px; padding: 10px 16px;
    font-size: 16px; background: #1a4fd6; color: #ffffff; text-decoration: none;
  }
  label.consent { display: flex; align-items: center; gap: 10px; min-height: 44px; }
  label.consent input[type="checkbox"] { width: 44px; height: 44px; flex-shrink: 0; }
  label.consent span { font-size: 16px; }
  .hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
</style></head>
<body>
  <div class="wrap">
    <div class="box">Достаточно широкий контейнер для этого текста без проблем с переносом строк</div>
    <div class="label">Подпись двенадцать</div>
    <a class="cta" href="tel:+70000000000">Позвонить</a>
    <label class="consent">
      <input type="checkbox" id="agree">
      <span>Согласие на обработку данных передано корректно и читаемо</span>
    </label>
    <div class="hp" aria-hidden="true">
      <label for="company">Company</label>
      <input type="text" id="company" name="company" tabindex="-1" autocomplete="off">
    </div>
  </div>
</body></html>`;

function writeFixture(name: string, html: string): string {
  const file = path.join(os.tmpdir(), `audit-card-dom-test-${name}-${process.pid}.html`);
  fs.writeFileSync(file, html, "utf8");
  return "file://" + file;
}

const RUN_OPTS = { widths: [375], schemes: ["light"], timeout: 15000 };
const TEST_TIMEOUT = 30000;

describe("audit-card.js — детектор на подложенных дефектах (не обвязка)", () => {
  it(
    "находит все 4 подложенных дефекта по типу, а honeypot не трогает",
    async () => {
      const target = writeFixture("broken", BROKEN_HTML);
      const results = await auditTarget(target, RUN_OPTS);
      expect(results).toHaveLength(1);
      const [entry] = results;
      expect(entry.error).toBeNull();

      const findings = entry.findings as Finding[];
      const types = new Set(findings.map((f) => f.type));

      expect(types).toContain("overflow-x");
      expect(types).toContain("font-too-small");
      expect(types).toContain("touch-target");
      expect(types).toContain("contrast");

      // honeypot (offscreen + aria-hidden, тот же приём, что в lib/agent-card.ts
      // `.hp`) не должен попасть в отчёт ни по одной проверке.
      const hpFindings = findings.filter(
        (f) => f.selector.includes("company") || f.selector.includes(".hp")
      );
      expect(hpFindings).toEqual([]);
    },
    TEST_TIMEOUT
  );

  it(
    "молчит на чистой фикстуре (те же элементы, но в пределах порогов) — honeypot тоже молчит",
    async () => {
      const target = writeFixture("clean", CLEAN_HTML);
      const results = await auditTarget(target, RUN_OPTS);
      expect(results).toHaveLength(1);
      const [entry] = results;
      expect(entry.error).toBeNull();

      const findings = entry.findings as Finding[];
      const errorFindings = findings.filter((f) => f.severity !== "warning");
      expect(errorFindings).toEqual([]);

      const hpFindings = findings.filter(
        (f) => f.selector.includes("company") || f.selector.includes(".hp")
      );
      expect(hpFindings).toEqual([]);
    },
    TEST_TIMEOUT
  );
});
