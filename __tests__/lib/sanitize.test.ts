/**
 * Unit tests for `lib/sanitize.ts` — sensitive-data pre-LLM filter.
 *
 * Balanced between catching real ID/card/SSN/IBAN patterns and NOT
 * tripping on normal agent speech (apartment numbers, phone digits,
 * addresses, years).
 */

import { checkSensitive, buildRejectedSummary } from "../../lib/sanitize";

describe("checkSensitive — positive matches", () => {
  it("detects RU passport format 4-digit + 6-digit", () => {
    const r = checkSensitive("Запиши паспорт Иванова 4532 789012, выдан 15.03.2015");
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.reason).toBe("passport");
      expect(r.pattern).toBe("RU");
      expect(r.match).toBe("4532 789012");
    }
  });

  it("detects RU passport with hyphen separator", () => {
    const r = checkSensitive("паспорт 4532-789012");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("passport");
  });

  it("detects EU passport 2-letter + 8 digits", () => {
    const r = checkSensitive("Passport number AB12345678, expires 2030");
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.reason).toBe("passport");
      expect(r.pattern).toBe("EU");
    }
  });

  it("detects US SSN 3-2-4 format", () => {
    const r = checkSensitive("SSN is 123-45-6789 for the mortgage");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("ssn");
  });

  it("detects IBAN with country code + 22 chars", () => {
    const r = checkSensitive("Wire to DE89370400440532013000 please");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("iban");
  });

  it("detects grouped credit card 4-4-4-4", () => {
    const r = checkSensitive("card number 4532 1234 5678 9010");
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.reason).toBe("card");
      expect(r.pattern).toBe("grouped");
    }
  });

  it("detects unbroken 16-digit with 'visa' context", () => {
    const r = checkSensitive("It was a visa card 4532123456789010 thanks");
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.reason).toBe("card");
      expect(r.pattern).toBe("unbroken");
    }
  });

  it("detects unbroken 16-digit with 'карта' RU context", () => {
    const r = checkSensitive("номер карты 4532123456789010");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("card");
  });
});

describe("checkSensitive — false-positive immunity", () => {
  it("does not trip on apartment numbers like 'apartment 42, floor 3'", () => {
    expect(checkSensitive("Встреча в квартире 42, этаж 3").ok).toBe(true);
    expect(checkSensitive("Apartment 123 on Arbat").ok).toBe(true);
  });

  it("does not trip on 4-digit + 6-digit separated by newline / mixed content", () => {
    // Here "2026" + newline + "123456" isn't a passport pattern because
    // the separator must be space/nbsp/hyphen within boundary.
    expect(checkSensitive("Встреча 2026\nДом 123456").ok).toBe(true);
  });

  it("does not trip on phone numbers with country code", () => {
    expect(checkSensitive("Позвонил +351 91 234 56 78, не ответил").ok).toBe(true);
    expect(checkSensitive("Phone +7 495 123 45 67").ok).toBe(true);
  });

  it("does not trip on price + year combos", () => {
    expect(checkSensitive("Цена 250000 евро, закрываем до конца 2026").ok).toBe(true);
    expect(checkSensitive("Sale price 450,000 EUR in 2026").ok).toBe(true);
  });

  it("does not trip on invoice numbers without card context", () => {
    // 16 digits but no 'card' / 'visa' / 'карта' nearby — the unbroken
    // pattern requires card context.
    expect(checkSensitive("Invoice 1234567812345678 issued today").ok).toBe(true);
  });

  it("does not trip on ID-shaped string inside URL / email", () => {
    // We deliberately do NOT scan URLs for sensitive patterns
    // (false-positive heavy). Realtors rarely dictate URLs verbatim.
    expect(
      checkSensitive("See https://example.com/user/1234567812345678 for the listing").ok,
    ).toBe(true);
  });

  it("does not trip on street addresses with numbers", () => {
    expect(checkSensitive("Arbat 12, floor 3, apartment 42").ok).toBe(true);
    expect(checkSensitive("ул. Тверская 1-2, кв. 103").ok).toBe(true);
  });

  it("does not trip on short numeric strings", () => {
    expect(checkSensitive("Встреча в 15:00 в кабинете 403").ok).toBe(true);
    expect(checkSensitive("Budget 5000 EUR").ok).toBe(true);
  });

  it("treats empty / whitespace / null as ok", () => {
    expect(checkSensitive("").ok).toBe(true);
    expect(checkSensitive("   ").ok).toBe(true);
    expect(checkSensitive(null).ok).toBe(true);
    expect(checkSensitive(undefined).ok).toBe(true);
  });
});

describe("checkSensitive — mixed / tricky cases", () => {
  it("catches passport even inside a longer realistic note", () => {
    const long =
      "Позвонил Иванову, согласен на показ в субботу в 11:00 на Арбате 12. Попросил записать паспорт для резервации: 4532 789012, выдан 15.03.2015 отделом ВД.";
    const r = checkSensitive(long);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("passport");
  });

  it("catches SSN preceded by 'social-security' verbiage", () => {
    const r = checkSensitive("For the US mortgage application, social-security 555-44-3333");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("ssn");
  });

  it("catches IBAN anchored to a realistic banking line", () => {
    const r = checkSensitive("Перевод на счёт IBAN: AT611904300234573201 до четверга");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("iban");
  });

  it("prefers passport over card when both present (priority order)", () => {
    const r = checkSensitive("паспорт 4532 789012, карта VISA 4532 1234 5678 9010");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("passport");
  });
});

describe("buildRejectedSummary", () => {
  it("produces the expected shape for passport rejection", () => {
    const check = { ok: false, reason: "passport", pattern: "RU", match: "4532 789012" } as const;
    const r = buildRejectedSummary(check);
    expect(r.outcome).toBe("rejected_sensitive");
    expect(r.confidence).toBe(0);
    expect(r.rejected_reason).toBe("passport");
    expect(r.note).toContain("Passport");
  });

  it("produces Russian-safe note for card rejection", () => {
    const check = { ok: false, reason: "card", pattern: "grouped", match: "x" } as const;
    const r = buildRejectedSummary(check);
    expect(r.note).toContain("Card");
  });
});
