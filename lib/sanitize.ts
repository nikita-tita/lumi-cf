/**
 * Pre-LLM sensitive-data detector for Lumi BFF.
 *
 * Scans free-form transcription / document text for patterns that
 * should never reach an LLM (or be saved into CRM notes):
 * - RU internal passport: `1234 567890`
 * - EU / international passport: two-letter country + 7-9 digits (e.g. AA1234567)
 * - Credit / debit card: 13–19 digit run with optional separators (Luhn loose)
 * - US SSN: `123-45-6789`
 * - IBAN: `DE89 3704 0044 0532 0130 00` / no-space variant
 *
 * Returned shape when a match is found lets the caller return early
 * with a `rejected_sensitive` outcome (see CallLogSummary schema).
 *
 * Design notes:
 * - Patterns are conservative. We prefer missing a borderline case
 *   over false-positive blocking a realtor's notes. Test suite pins
 *   that apartment numbers, years, and phone-like strings do NOT fire.
 * - Luhn is NOT fully validated because real-world dictated card
 *   numbers are often slightly misheard — we trip on digit-count and
 *   density, not strict checksum. Realtors rarely dictate cards; any
 *   false-positive is acceptable compared to false-negative.
 * - Sanitizer runs BEFORE the LLM call so rejected input consumes zero
 *   external quota.
 */

export type SensitiveReason = "passport" | "card" | "ssn" | "iban";

export type SensitiveCheck =
  | { ok: true }
  | { ok: false; reason: SensitiveReason; pattern: string; match: string };

/** 2 chars country + 7-9 digits = typical international passport. */
const EU_PASSPORT_RE = /\b[A-Z]{2}\s?\d{7,9}\b/;

/**
 * Russian internal passport: 4 digits, space/hyphen/nbsp optional, then 6
 * digits. Avoid matching random long phone numbers by requiring a space
 * or boundary between groups.
 */
const RU_PASSPORT_RE = /\b\d{4}[ \u00a0\-]\d{6}\b/;

/** US SSN: 3-2-4 grouping, tight dashes. */
const SSN_RE = /\b\d{3}-\d{2}-\d{4}\b/;

/**
 * IBAN: 2-letter country code, 2 check digits, 10-30 alphanumeric body.
 * We require the full 15-34 char form to avoid tripping on "RU" + 2-digit
 * street numbers. Allow internal spaces every 4 chars.
 */
const IBAN_RE = /\b[A-Z]{2}\d{2}(?:[ ]?[A-Z0-9]){10,30}\b/;

/**
 * Credit card: 13-19 consecutive digits possibly broken by spaces or
 * hyphens every 4.
 */
const CARD_GROUPED_RE = /\b(?:\d{4}[ \-]){3}\d{3,4}\b/;
const CARD_UNBROKEN_RE = /\b\d{13,19}\b/;

/**
 * Check a single piece of text. Returns the first match; we don't
 * bother listing all matches because the caller will reject the whole
 * input anyway.
 */
export function checkSensitive(input: string | null | undefined): SensitiveCheck {
  if (!input || typeof input !== "string") return { ok: true };
  const text = input.trim();
  if (text.length === 0) return { ok: true };

  // Check in priority order — passport + card are the realtor-relevant
  // cases; SSN + IBAN are included because any user might paste.

  const ru = text.match(RU_PASSPORT_RE);
  if (ru) return { ok: false, reason: "passport", pattern: "RU", match: ru[0] };

  const eu = text.match(EU_PASSPORT_RE);
  if (eu && isPlausiblePassport(eu[0])) {
    return { ok: false, reason: "passport", pattern: "EU", match: eu[0] };
  }

  const ssn = text.match(SSN_RE);
  if (ssn) return { ok: false, reason: "ssn", pattern: "US", match: ssn[0] };

  const iban = text.match(IBAN_RE);
  if (iban) return { ok: false, reason: "iban", pattern: "global", match: iban[0] };

  const grouped = text.match(CARD_GROUPED_RE);
  if (grouped) return { ok: false, reason: "card", pattern: "grouped", match: grouped[0] };

  const unbroken = text.match(CARD_UNBROKEN_RE);
  if (unbroken && unbroken.index !== undefined && looksLikeCardContext(text, unbroken.index)) {
    return { ok: false, reason: "card", pattern: "unbroken", match: unbroken[0] };
  }

  return { ok: true };
}

/**
 * Upper-case two letters + 7-9 digits. We guard against phone numbers
 * with a country-code prefix like "RU 8123456789" by requiring tight
 * country-letters + digits form.
 */
function isPlausiblePassport(match: string): boolean {
  const stripped = match.replace(/\s+/g, "");
  return /^[A-Z]{2}\d{7,9}$/.test(stripped);
}

/**
 * When we see an unbroken 13-19 digit run, only treat as card if nearby
 * context mentions "card" / "карт" / "visa" / "mastercard" / "номер".
 * Otherwise it's more likely a room number, serial, invoice ID, etc.
 */
function looksLikeCardContext(text: string, matchIdx: number): boolean {
  const windowChars = 60;
  const before = text.slice(Math.max(0, matchIdx - windowChars), matchIdx).toLowerCase();
  const after = text.slice(matchIdx).slice(0, windowChars).toLowerCase();
  const scope = before + after;
  // ASCII words — use \b; Cyrillic substring — use plain include to
  // avoid \b limitation (JS \b is ASCII-only even with /u flag for this
  // scope).
  if (/\b(card|carte|visa|master|mastercard|amex|cvv|carta|tarjeta)\b/i.test(scope)) {
    return true;
  }
  if (scope.includes("карт") || scope.includes("карты") || scope.includes("картa")) {
    return true;
  }
  return false;
}

/**
 * Build the rejection summary mobile receives when sanitizer trips.
 * Matches the `CallLogSummary` shape (see ai-proxy.ts) with the new
 * `rejected_sensitive` outcome. Caller spreads into response.
 */
export function buildRejectedSummary(check: Extract<SensitiveCheck, { ok: false }>): {
  outcome: "rejected_sensitive";
  note: string;
  confidence: 0;
  rejected_reason: SensitiveReason;
} {
  const humanReason: Record<SensitiveReason, string> = {
    passport: "Passport number detected. Not logged — upload the document via Documents instead.",
    card: "Card number detected. Not logged for your protection.",
    ssn: "Social-security number detected. Not logged.",
    iban: "Bank-account number detected. Not logged.",
  };
  return {
    outcome: "rejected_sensitive",
    note: humanReason[check.reason],
    confidence: 0,
    rejected_reason: check.reason,
  };
}

export function isSensitiveSanitiseConfigured(): boolean {
  // No env needed; sanitizer is always active. Kept for symmetry with
  // other lib helpers (isSupabaseConfigured, etc).
  return true;
}
