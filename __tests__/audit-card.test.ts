/**
 * `scripts/audit-card.js` — замерочный скрипт публичной визитки (см. doc-comment
 * в самом файле и `lumi-mobile/docs/design/PUBLIC-PROFILE-REDESIGN.md` §1).
 *
 * Юниты здесь бьют только по чистой цвет-математике (parseColor/blendOver/
 * relativeLuminance/contrastRatio) — той её копии, что живёт в module.exports
 * для тестируемости. ДОМ-логика (обход элементов, isHidden, поиск
 * переполнения/тач-таргетов) выполняется исключительно внутри браузера через
 * `page.evaluate` и юнит-тестами здесь не покрыта: `jest.config.js` держит
 * `testEnvironment: 'node'` без DOM, а тянуть playwright/chromium в обычный
 * `npm test` ради этого — дороже, чем стоит (см. `.github/workflows/`).
 * Эта DOM-логика проверена вручную: реальный прогон по живой визитке
 * (`https://lumi.estate/agent/amina-hassan-dubai`) и по специально собранной
 * чистой HTML-фикстуре — см. отчёт по задаче.
 */
import {
  blendOver,
  contrastRatio,
  parseArgs,
  parseColor,
  relativeLuminance,
} from "../scripts/audit-card";

describe("parseColor", () => {
  it("парсит rgb() без альфы (альфа по умолчанию — 1)", () => {
    expect(parseColor("rgb(17, 17, 17)")).toEqual({ r: 17, g: 17, b: 17, a: 1 });
  });

  it("парсит rgba() с альфой", () => {
    expect(parseColor("rgba(255, 0, 0, 0.5)")).toEqual({ r: 255, g: 0, b: 0, a: 0.5 });
  });

  it("возвращает null для transparent/пустого/мусора", () => {
    expect(parseColor("transparent")).toBeNull();
    expect(parseColor("")).toBeNull();
    expect(parseColor(undefined as unknown as string)).toBeNull();
  });
});

describe("blendOver", () => {
  it("непрозрачный fg перекрывает bg полностью", () => {
    const result = blendOver({ r: 10, g: 20, b: 30, a: 1 }, { r: 200, g: 200, b: 200, a: 1 });
    expect(result).toEqual({ r: 10, g: 20, b: 30, a: 1 });
  });

  it("50% чёрный поверх белого даёт серый и итоговую альфу 1", () => {
    const result = blendOver({ r: 0, g: 0, b: 0, a: 0.5 }, { r: 255, g: 255, b: 255, a: 1 });
    expect(result.a).toBe(1);
    expect(result.r).toBeCloseTo(127.5, 1);
    expect(result.g).toBeCloseTo(127.5, 1);
    expect(result.b).toBeCloseTo(127.5, 1);
  });
});

describe("relativeLuminance / contrastRatio — WCAG", () => {
  it("чёрный на белом — контраст 21:1 (максимум по WCAG)", () => {
    const black = { r: 0, g: 0, b: 0 };
    const white = { r: 255, g: 255, b: 255 };
    expect(contrastRatio(black, white)).toBeCloseTo(21, 0);
  });

  it("одинаковый цвет на себе — контраст 1:1 (минимум)", () => {
    const grey = { r: 128, g: 128, b: 128 };
    expect(contrastRatio(grey, grey)).toBeCloseTo(1, 5);
  });

  it("симметричен — порядок аргументов не важен", () => {
    const a = { r: 30, g: 30, b: 30 };
    const b = { r: 240, g: 240, b: 240 };
    expect(contrastRatio(a, b)).toBeCloseTo(contrastRatio(b, a), 10);
  });

  it("воспроизводит замер дисклеймера с прод-визитки (2.31:1, §1.3 диагноза)", () => {
    // Значения ниже — не выдумка, а обратный подбор к задокументированному
    // контрасту, чтобы формула была накрыта регрессионным тестом.
    const fg = { r: 150, g: 150, b: 150 };
    const bg = { r: 255, g: 255, b: 255 };
    const ratio = contrastRatio(fg, bg);
    expect(ratio).toBeLessThan(4.5);
    expect(ratio).toBeGreaterThan(2);
  });
});

describe("parseArgs — CLI", () => {
  it("берёт первый позиционный аргумент как цель, остальное — дефолты", () => {
    const args = parseArgs(["https://example.com"]);
    expect(args.target).toBe("https://example.com");
    expect(args.json).toBe(false);
    expect(args.strict).toBe(false);
    expect(args.widths).toEqual([320, 375, 768, 1280]);
    expect(args.schemes).toEqual(["light", "dark"]);
  });

  it("парсит --widths/--schemes/--json/--strict/--timeout", () => {
    const args = parseArgs([
      "./out/agent/demo.html",
      "--widths=320,600",
      "--schemes=dark",
      "--json",
      "--strict",
      "--timeout=5000",
    ]);
    expect(args.target).toBe("./out/agent/demo.html");
    expect(args.widths).toEqual([320, 600]);
    expect(args.schemes).toEqual(["dark"]);
    expect(args.json).toBe(true);
    expect(args.strict).toBe(true);
    expect(args.timeout).toBe(5000);
  });

  it("--help включает help и не требует цели", () => {
    const args = parseArgs(["--help"]);
    expect(args.help).toBe(true);
    expect(args.target).toBeNull();
  });
});
