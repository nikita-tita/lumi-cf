/**
 * Shared AI proxy helpers for Lumi BFF endpoints.
 *
 * Responsibilities:
 *   - Forward chat requests to Anthropic Messages API with prompt-caching
 *     (cache_control: ephemeral) on the real-estate system prompt.
 *   - Per-userId in-memory rate limit (warm-Lambda only — good enough for
 *     beta. Upgrade to Upstash when scale calls for it).
 *   - Strict CORS for the Lumi mobile app + dev origins.
 *   - Graceful 503 when ANTHROPIC_API_KEY is missing so the mobile app
 *     falls back to its local mock cleanly.
 */

import { checkSensitive, buildRejectedSummary } from "./sanitize";

export const ANTHROPIC_MODEL = "claude-haiku-4-5";
export const ANTHROPIC_VERSION = "2023-06-01";
export const ANTHROPIC_BETAS = "prompt-caching-2024-07-31";

const RL_WINDOW_MS = 60_000;
const RL_MAX = 10; // per user per minute
const rl = new Map<string, { count: number; resetAt: number }>();

export type AnthropicContent =
  | { type: "text"; text: string; cache_control?: { type: "ephemeral" } };

export interface AnthropicMessage {
  role: "user" | "assistant";
  content: string | AnthropicContent[];
}

export interface AnthropicRequest {
  system?: string | AnthropicContent[];
  messages: AnthropicMessage[];
  max_tokens?: number;
  temperature?: number;
}

export interface AnthropicResponse {
  content: { type: "text"; text: string }[];
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  };
}

/** Hit rate limit? Returns `null` when allowed, `Response` when denied. */
export function rateLimit(userId: string): Response | null {
  const now = Date.now();
  const entry = rl.get(userId);
  if (!entry || entry.resetAt < now) {
    rl.set(userId, { count: 1, resetAt: now + RL_WINDOW_MS });
    return null;
  }
  if (entry.count >= RL_MAX) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return jsonResponse(
      { error: "rate_limited", retry_after: retryAfter },
      429,
      { "Retry-After": String(retryAfter) },
    );
  }
  entry.count++;
  return null;
}

/** JSON response with CORS headers applied. */
export function jsonResponse(
  body: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      ...corsHeaders(),
      ...extraHeaders,
    },
  });
}

/** CORS preflight + exposed headers. Allow Lumi mobile + local dev. */
export function corsHeaders(): Record<string, string> {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type, x-user-id",
    "access-control-max-age": "86400",
  };
}

export function handleOptions(): Response {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

/** Extract userId from header; fall back to `anonymous`. */
export function getUserId(req: Request): string {
  return req.headers.get("x-user-id")?.slice(0, 64) ?? "anonymous";
}

// ── Bearer-token verification (B-058) ────────────────────────────────
//
// BFF accepts `Authorization: Bearer <jwt>` from the Lumi main API auth
// stack. We verify it by round-tripping to `${MAIN_API_URL}/auth/me`
// (cheap GET, tiny payload) and cache the resulting user_id for 5 min
// per token hash so we don't hammer main API on every BFF call.
//
// When verification succeeds the caller treats the derived id as
// authoritative; otherwise it falls back to `x-user-id` (dev preview,
// anonymous clients). Flip `BFF_REQUIRE_AUTH=true` to reject anything
// unverified in production.

const MAIN_API_URL_DEFAULT = "https://api.lumi.estate/api";
const AUTH_CACHE_TTL_MS = 5 * 60 * 1000;
const AUTH_CACHE_MAX = 500;
const authCache = new Map<string, { userId: string; expiresAt: number }>();

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const hashBuf = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hashBuf), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Round-trip to main API `/auth/me`. Returns user id when token is
 *  valid, null otherwise. Cached per token hash for 5 min.
 *
 *  Test-mode bypass (B-065): when `BFF_TEST_BEARER` env is set, any
 *  token with that exact value resolves to `BFF_TEST_USER_ID` (or
 *  `test-user` if unset) WITHOUT hitting main API. Lets CI / runner
 *  exercise Bearer-gated flows without a real auth roundtrip.
 *  NEVER enable this in production. */
export async function verifyBearerToken(token: string): Promise<string | null> {
  if (!token || token.length < 8) return null;

  // Test bypass (dev / CI only — never ship with BFF_TEST_BEARER set in
  // production env vars).
  //
  // S11/C1 — prod safety guard: if BFF_TEST_BEARER is set AND we're in
  // NODE_ENV=production, fail closed. Prevents accidentally shipping
  // the bypass. Returns null (auth fail) + logs so ops sees the signal.
  const testBearer = process.env.BFF_TEST_BEARER;
  if (testBearer) {
    if (process.env.NODE_ENV === "production") {
      // Loud log so this lands in Vercel runtime logs.
      // Never throw — fail closed and let caller handle 401.
      // eslint-disable-next-line no-console
      console.error(
        "[ai-proxy] FATAL: BFF_TEST_BEARER must NOT be set in production. Ignoring; auth will fail.",
      );
      return null;
    }
    if (token === testBearer) {
      return process.env.BFF_TEST_USER_ID || "test-user";
    }
  }

  const hash = await sha256Hex(token);
  const now = Date.now();
  const cached = authCache.get(hash);
  if (cached && cached.expiresAt > now) return cached.userId;

  const base = (process.env.MAIN_API_URL || MAIN_API_URL_DEFAULT).replace(/\/+$/, "");
  try {
    const res = await fetch(`${base}/auth/me`, {
      method: "GET",
      headers: { authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { user?: { id?: string } };
    const userId = body?.user?.id;
    if (!userId) return null;
    authCache.set(hash, { userId, expiresAt: now + AUTH_CACHE_TTL_MS });
    // Evict oldest entries when cache grows too big (simple LRU-lite).
    if (authCache.size > AUTH_CACHE_MAX) {
      const first = authCache.keys().next().value;
      if (first !== undefined) authCache.delete(first);
    }
    return userId;
  } catch {
    return null;
  }
}

export interface AuthedUser {
  /** The id the route should scope work to. */
  userId: string;
  /** `true` when the id came from a verified JWT; `false` if it came
   *  from the `x-user-id` header fallback. Routes can use this to
   *  tighten policy when `BFF_REQUIRE_AUTH=true`. */
  verified: boolean;
}

/**
 * Unified user resolution:
 * 1. Prefer `Authorization: Bearer <jwt>` → verified via main API
 *    `/auth/me`. This is the only source that cannot be spoofed.
 * 2. Fall back to `x-user-id` header (dev, mock users, pre-auth
 *    rollout) — unless `BFF_REQUIRE_AUTH=true`, in which case we
 *    return `null` and the route should 401.
 */
export async function resolveAuthedUser(req: Request): Promise<AuthedUser | null> {
  const authz = req.headers.get("authorization");
  if (authz && /^bearer\s+/i.test(authz)) {
    const token = authz.replace(/^bearer\s+/i, "").trim();
    const verified = await verifyBearerToken(token);
    if (verified) return { userId: verified, verified: true };
    if (process.env.BFF_REQUIRE_AUTH === "true") return null;
    // bearer sent but invalid → don't silently trust x-user-id; reject
    return null;
  }

  if (process.env.BFF_REQUIRE_AUTH === "true") return null;

  const header = req.headers.get("x-user-id")?.slice(0, 64);
  if (!header || header === "anonymous") return null;
  return { userId: header, verified: false };
}

/** Call Anthropic Messages API with prompt-caching. */
export async function callAnthropic(
  req: AnthropicRequest,
): Promise<AnthropicResponse> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY not set");
  const body = {
    model: ANTHROPIC_MODEL,
    max_tokens: req.max_tokens ?? 1024,
    temperature: req.temperature ?? 0.7,
    system: req.system,
    messages: req.messages,
  };
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": ANTHROPIC_VERSION,
      "anthropic-beta": ANTHROPIC_BETAS,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Anthropic ${res.status}: ${text.slice(0, 200)}`);
  }
  return (await res.json()) as AnthropicResponse;
}

/** Safe-parse a JSON body from a Request. Returns `null` on any error. */
export async function readJson<T>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

// ── Shared call-log summariser ───────────────────────────────────────
// Both /call-log-summary (text in) and /voice-log (audio in, Whisper
// transcription) converge here. Keeps the prompt + parser in one place
// so changes to the schema don't drift between endpoints.

export type CallOutcome =
  | "interested"
  | "thinking"
  | "declined"
  | "no_answer"
  | "rejected_sensitive";

export interface CallLogSummary {
  outcome: CallOutcome;
  note: string;
  todo?: string;
  stage_change?: string;
  confidence: number;
  /** Optional structured additions — present when the model or the
   *  pre-processing layer can determine them. Mobile consumers
   *  ignore unknown fields safely. */

  /** When sanitizer rejects input — why (passport / card / ssn / iban). */
  rejected_reason?: string;
  /** ISO-8601 date-time when the transcription implies a specific moment. */
  scheduled_at_iso?: string;
  /** true when the time reference is fuzzy (утром, после обеда, в конце марта). */
  scheduled_at_fuzzy?: boolean;
  /** true when bare hour 1-12 without AM/PM cue or hour > 23 — mobile prompts user. */
  time_ambiguous?: boolean;
  /** IANA zone name when the caller mentions a foreign TZ (по нью-йоркскому). */
  timezone?: string;
  /** true when Whisper output was shorter / fingerprint-matched silence. */
  detected_silence?: boolean;
}

export interface CallLogClient {
  name?: string;
  stage?: string;
  language?: string;
}

const VALID_OUTCOMES: readonly CallOutcome[] = [
  "interested",
  "thinking",
  "declined",
  "no_answer",
  "rejected_sensitive",
];

/** Loose ISO-8601 check: accepts YYYY-MM-DD or full date-time. */
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2})?(?:[.,]\d+)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;

/** Basic IANA zone check: Area/City or UTC. Deliberately forgiving. */
const TIMEZONE_RE = /^[A-Za-z_+-]+(?:\/[A-Za-z_+-]+){0,2}$/;

const VALID_STAGES = [
  "new",
  "showing",
  "showing_done",
  "interested",
  "documents",
  "done",
];

const CALL_LOG_SYSTEM_PROMPT = `You summarise a real-estate agent's post-call recording into a strict JSON
object. Output only ONE JSON object — no preamble, no code fences, no trailing
text.

REQUIRED keys:

- outcome: one of "interested" | "thinking" | "declined" | "no_answer".
  Do NOT emit "rejected_sensitive" — that outcome is reserved for the
  server-side sanitizer layer and is never generated by you.
- note: 1–3 sentence summary, max 240 characters, no emoji, factual, no
  invented names/prices.
- confidence: 0..1 number. 0.9+ when the transcription is unambiguous,
  0.5–0.7 when the outcome is inferred from tone, <0.5 when truly unclear.

OPTIONAL keys:

- todo: short imperative phrase for the next action ("Saturday showing
  11:00", "Send shortlist by Friday"). Omit if nothing committed.
- stage_change: one of "new" | "showing" | "showing_done" | "interested" |
  "documents" | "done". Only propose a move that the conversation clearly
  supports given the client's current stage.
- scheduled_at_iso: ISO-8601 date (YYYY-MM-DD) or date-time
  (YYYY-MM-DDTHH:mm) when the transcription implies a concrete moment.
  Omit when the time is fuzzy, past, or unresolvable.
- scheduled_at_fuzzy: true when the time reference is vague
  ("утром", "после обеда", "в конце марта", "morning", "after lunch").
  Emit this instead of scheduled_at_iso — do NOT guess a concrete hour.
- time_ambiguous: true when a bare hour 1–12 is given without AM/PM
  indication (e.g. "в 9", "at 3") or when an impossible hour > 23 is
  mentioned. The note should describe the ambiguity in this case.
- timezone: IANA zone name (e.g. "America/New_York", "Europe/Lisbon")
  when the caller explicitly mentions a foreign timezone ("по
  нью-йоркскому времени", "CET", "EST"). Default to agent's local when
  not mentioned — omit in that case.

TIME VALIDATION RULES:

1. Hours > 23 or < 0 are IMPOSSIBLE. When you see "25:00", "в 25 часов",
   "в 30 утра": do NOT invent a time for the \`todo\`. Emit
   \`time_ambiguous: true\` and describe the ambiguity in \`note\`
   ("Невалидное время 25:00 — уточнить у клиента"). Set confidence ≤ 0.5.

2. Bare hour 1-12 without AM/PM cue ("в 9", "at 3", "в три") is
   ambiguous. If the speech provides context ("утром", "вечером", "after
   lunch") — resolve confidently. If no cue — emit \`time_ambiguous: true\`.
   Do NOT silently default to a specific hour; keep \`todo\` descriptive
   (e.g. "Встреча в 9 — уточнить: утром или вечером") and lower
   confidence to 0.6-0.7.

3. References > 12 months in the future ("через 5 лет", "in 10 years")
   are almost always loose. Do NOT emit \`todo\` or \`scheduled_at_iso\`.
   Mark confidence ≤ 0.3 and note the long-term nature in \`note\`.

4. Past-tense utterances ("вчера звонил", "yesterday called", "last
   week met") log the event into \`note\` but DO NOT emit \`todo\`
   (no future action) and DO NOT emit \`scheduled_at_iso\`.

5. Fuzzy time references without a concrete clock ("утром", "morning",
   "после обеда", "after lunch", "в конце марта", "end of March",
   "вечером") are NOT guessable. Emit \`scheduled_at_fuzzy: true\` and
   leave \`scheduled_at_iso\` omitted. The \`todo\` may preserve the
   fuzzy phrase verbatim — mobile will prompt user to pick exact time.

6. Abbreviations like "вс", "пн", "пт" or "Sun", "Mon", "Fri" must be
   explicitly expanded in \`note\` — don't force them into \`todo\`
   without the agent being able to verify.

7. Destructive bulk verbs with vague scope ("отмени всё что я сказал",
   "delete everything", "удали всё") must NOT produce \`stage_change\`
   or \`todo\`. Set outcome to "declined" with a clear note suggesting
   the agent narrow the request manually.

AMBIGUITY RULES:

- Unresolvable references ("ему", "той группе", "как вчера
  договорились") when no prior context is visible in the current
  transcription: confidence ≤ 0.5, describe the ambiguity in \`note\`,
  omit \`todo\`.
- When two distinct intents appear in one transcription ("позвонил
  Пете И напомни в пятницу"), pick the PRIMARY (usually the call
  being logged) for \`outcome\` and fold the secondary into \`todo\`.
- Corrections mid-sentence ("в 10, нет подожди, в 11") — always use
  the LATEST specified value.

NICKNAME RULES:

When the transcription uses a Russian diminutive and the agent's CRM
may have the formal form, mention the likely match in \`note\` but
DO NOT silently rewrite the client name. Common mappings:

- Маша, Маня → Мария
- Петя, Петюша, Петрович (дружески) → Пётр
- Саша, Шура → Александр / Александра
- Вова, Вован → Владимир
- Катя, Катюша → Екатерина
- Лена, Леночка → Елена
- Таня, Танюшка → Татьяна
- Даша → Дарья
- Миша, Мишаня → Михаил
- Юля → Юлия
- Серёжа, Серёга → Сергей

Example note prefix when using a nickname: "Детали: упомянута 'Маше'
— возможно Мария Иванова (ник). Уточнить."

Strictly respect the LANGUAGE of the transcription in the \`note\` and
\`todo\` fields. English is default when unclear.`;

function buildCallLogUserPrompt(transcription: string, client?: CallLogClient): string {
  const stage = client?.stage ? `Current stage: ${client.stage}` : "";
  const name = client?.name ? `Client name: ${client.name}` : "";
  const lang = client?.language ? `Language: ${client.language}` : "";
  return [
    "Summarise this call into the JSON schema described in the system prompt.",
    name,
    stage,
    lang,
    "Transcription:",
    transcription,
  ]
    .filter(Boolean)
    .join("\n");
}

function parseCallLogSummary(raw: string): CallLogSummary | null {
  const trimmed = raw.trim().replace(/^```(?:json)?/, "").replace(/```$/, "").trim();
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(trimmed) as Record<string, unknown>;
  } catch {
    return null;
  }
  const outcome =
    typeof data.outcome === "string" &&
    (VALID_OUTCOMES as readonly string[]).includes(data.outcome)
      ? (data.outcome as CallOutcome)
      : null;
  const note = typeof data.note === "string" ? data.note.slice(0, 240) : null;
  const confidenceRaw = typeof data.confidence === "number" ? data.confidence : null;
  if (!outcome || note === null || confidenceRaw === null) return null;

  const confidence = Math.min(1, Math.max(0, confidenceRaw));
  const todo =
    typeof data.todo === "string" && data.todo.trim() ? data.todo.slice(0, 160) : undefined;
  const stage_change =
    typeof data.stage_change === "string" && VALID_STAGES.includes(data.stage_change)
      ? data.stage_change
      : undefined;

  // ── Optional structured fields (B-062 / B-063 / pass-through) ──────
  const rejected_reason =
    typeof data.rejected_reason === "string" && data.rejected_reason.trim()
      ? data.rejected_reason.slice(0, 80)
      : undefined;
  const scheduled_at_iso =
    typeof data.scheduled_at_iso === "string" && ISO_DATE_RE.test(data.scheduled_at_iso)
      ? data.scheduled_at_iso
      : undefined;
  const scheduled_at_fuzzy =
    data.scheduled_at_fuzzy === true ? true : undefined;
  const time_ambiguous = data.time_ambiguous === true ? true : undefined;
  const timezone =
    typeof data.timezone === "string" &&
    data.timezone.length > 0 &&
    data.timezone.length < 64 &&
    TIMEZONE_RE.test(data.timezone)
      ? data.timezone
      : undefined;
  const detected_silence = data.detected_silence === true ? true : undefined;

  return {
    outcome,
    note,
    todo,
    stage_change,
    confidence,
    rejected_reason,
    scheduled_at_iso,
    scheduled_at_fuzzy,
    time_ambiguous,
    timezone,
    detected_silence,
  };
}

// ── Daily-plan extraction (multi-event from one transcription) ──────
// B-064: /api/ai/call-log-summary is structurally single-intent; when
// an agent dictates "8 утра планёрка, 9 показ, 11 банк, 14 просмотр",
// we want an array of events. This helper shares the schema validation
// pattern with summarizeCallLog but outputs a list.

export type EventDraftType = "meeting" | "showing" | "call" | "visit" | "todo" | "other";

export interface EventDraft {
  title: string;
  type?: EventDraftType;
  scheduled_at_iso?: string;
  scheduled_at_fuzzy?: boolean;
  time_ambiguous?: boolean;
  timezone?: string;
  location?: string;
  client_name?: string;
  confidence: number;
}

export interface DailyPlanExtraction {
  events: EventDraft[];
  overall_confidence: number;
  /** If the model detected text that didn't fit an event (pleasantries,
   *  greetings, random notes). Can be displayed as footer in the
   *  review card. */
  leftover_note?: string;
}

const DAILY_PLAN_SYSTEM_PROMPT = `You parse a real-estate agent's voice dictation of their daily plan
into a JSON object with a list of events.

Output ONLY one JSON object — no preamble, no code fences.

Schema:
{
  "events": [
    {
      "title": "short phrase (e.g. 'Показ квартиры Петрову')",
      "type": "meeting" | "showing" | "call" | "visit" | "todo" | "other",
      "scheduled_at_iso": "YYYY-MM-DDTHH:mm" (optional — when concrete),
      "scheduled_at_fuzzy": true (optional — when fuzzy like "утром"),
      "time_ambiguous": true (optional — for bare 1-12 without AM/PM, or impossible hours),
      "timezone": "IANA zone" (optional),
      "location": "address string" (optional, only if clearly stated),
      "client_name": "name" (optional),
      "confidence": 0..1
    },
    ...
  ],
  "overall_confidence": 0..1,
  "leftover_note": "optional string — text that didn't fit any event"
}

RULES:
- Each distinct action-with-time becomes one event. "In 8 meeting, in 9
  showing, in 11 bank" = 3 events.
- Items without a time ("купить кофе") → type: "todo", scheduled_at_fuzzy: true.
- Same time validation as call-log-summary: reject hours > 23, flag
  time_ambiguous for bare 1-12 without AM/PM.
- When times are relative to "today" / "tomorrow", emit "scheduled_at_iso"
  only if you can resolve to YYYY-MM-DD. Otherwise omit.
- Respect the LANGUAGE of the input in title/location/client_name.
- Do NOT invent events. If the input is empty/gibberish, return
  { "events": [], "overall_confidence": 0 }.`;

function parseDailyPlan(raw: string): DailyPlanExtraction | null {
  const trimmed = raw.trim().replace(/^```(?:json)?/, "").replace(/```$/, "").trim();
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(trimmed) as Record<string, unknown>;
  } catch {
    return null;
  }
  const rawEvents = Array.isArray(data.events) ? data.events : null;
  if (!rawEvents) return null;

  const events: EventDraft[] = [];
  for (const raw of rawEvents as Record<string, unknown>[]) {
    if (!raw || typeof raw !== "object") continue;
    const title = typeof raw.title === "string" ? raw.title.slice(0, 160) : null;
    const confidenceRaw = typeof raw.confidence === "number" ? raw.confidence : 0.5;
    if (!title) continue;
    const confidence = Math.min(1, Math.max(0, confidenceRaw));
    const type =
      typeof raw.type === "string" &&
      ["meeting", "showing", "call", "visit", "todo", "other"].includes(raw.type)
        ? (raw.type as EventDraftType)
        : undefined;
    const scheduled_at_iso =
      typeof raw.scheduled_at_iso === "string" && ISO_DATE_RE.test(raw.scheduled_at_iso)
        ? raw.scheduled_at_iso
        : undefined;
    const scheduled_at_fuzzy = raw.scheduled_at_fuzzy === true ? true : undefined;
    const time_ambiguous = raw.time_ambiguous === true ? true : undefined;
    const timezone =
      typeof raw.timezone === "string" &&
      raw.timezone.length > 0 &&
      raw.timezone.length < 64 &&
      TIMEZONE_RE.test(raw.timezone)
        ? raw.timezone
        : undefined;
    const location =
      typeof raw.location === "string" && raw.location.trim()
        ? raw.location.slice(0, 200)
        : undefined;
    const client_name =
      typeof raw.client_name === "string" && raw.client_name.trim()
        ? raw.client_name.slice(0, 80)
        : undefined;
    events.push({
      title,
      type,
      scheduled_at_iso,
      scheduled_at_fuzzy,
      time_ambiguous,
      timezone,
      location,
      client_name,
      confidence,
    });
  }
  const overallRaw =
    typeof data.overall_confidence === "number" ? data.overall_confidence : 0.5;
  const overall_confidence = Math.min(1, Math.max(0, overallRaw));
  const leftover_note =
    typeof data.leftover_note === "string" && data.leftover_note.trim()
      ? data.leftover_note.slice(0, 240)
      : undefined;
  return { events, overall_confidence, leftover_note };
}

// ── Bulk-update extraction (S9/B-069) ────────────────────────────────
//
// "Перенеси все показы после 17:00 завтра на послезавтра" → structured
// filter + update object the mobile UI can preview before applying.
//
// Ranked behind `extractDailyPlan` because daily-plan matches shorter
// dictations; bulk-update needs explicit "все"/"all"/"cancel" cue.

export type BulkFilterType = "keyword" | "date_range" | "time_range" | "all";

export interface BulkFilter {
  type: BulkFilterType;
  /** Free-text predicate: keyword ("showing"), ISO range
   *  ("2026-04-25/2026-04-26"), time range ("17:00-23:59"), or "all". */
  value: string;
}

export interface BulkUpdate {
  /** Minutes to shift; positive = later, negative = earlier. */
  shift_minutes?: number;
  /** New date (YYYY-MM-DD) — keep time-of-day unchanged. */
  new_date?: string;
  /** Set to true to cancel affected events (mobile asks for confirm). */
  cancel?: true;
}

export interface BulkUpdateExtraction {
  filter: BulkFilter;
  update: BulkUpdate;
  confidence: number;
  /** Matches `extractDailyPlan.leftover_note` convention — on sanitiser
   *  reject, set to `rejected_sensitive:<reason>`. */
  leftover_note?: string;
}

const VALID_FILTER_TYPES: readonly BulkFilterType[] = [
  "keyword",
  "date_range",
  "time_range",
  "all",
];

const BULK_UPDATE_SYSTEM_PROMPT = `You parse a real-estate agent's voice command to update multiple
events at once into a JSON object.

Output ONLY one JSON object — no preamble, no code fences.

Schema:
{
  "filter": {
    "type": "keyword" | "date_range" | "time_range" | "all",
    "value": "string"
  },
  "update": {
    "shift_minutes": number (optional, positive=later, negative=earlier),
    "new_date": "YYYY-MM-DD" (optional),
    "cancel": true (optional)
  },
  "confidence": 0..1
}

EXAMPLES:
- "Перенеси все показы на час позже" →
  {"filter":{"type":"keyword","value":"показ"}, "update":{"shift_minutes":60}, "confidence":0.9}
- "Move all showings after 17:00 tomorrow to the day after" →
  {"filter":{"type":"time_range","value":"tomorrow 17:00-23:59"}, "update":{"new_date":"<next-day-iso>"}, "confidence":0.85}
- "Отмени все встречи в пятницу" →
  {"filter":{"type":"date_range","value":"friday"}, "update":{"cancel":true}, "confidence":0.9}

RULES:
- If no obvious multi-event intent → confidence ≤ 0.3.
- filter.type MUST be one of the 4 enum values.
- exactly ONE of shift_minutes / new_date / cancel MUST be set.
- Never invent an update when the input is ambiguous — set confidence≤0.3 instead.`;

function parseBulkUpdate(raw: string): BulkUpdateExtraction | null {
  const trimmed = raw.trim().replace(/^\`\`\`(?:json)?/, "").replace(/\`\`\`$/, "").trim();
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(trimmed) as Record<string, unknown>;
  } catch {
    return null;
  }

  const filterRaw = data.filter as Record<string, unknown> | undefined;
  const updateRaw = data.update as Record<string, unknown> | undefined;
  if (!filterRaw || !updateRaw) return null;

  const filterType = typeof filterRaw.type === "string" ? filterRaw.type : null;
  if (!filterType || !(VALID_FILTER_TYPES as readonly string[]).includes(filterType)) {
    return null;
  }
  const filterValue = typeof filterRaw.value === "string" ? filterRaw.value.slice(0, 200) : "";

  const update: BulkUpdate = {};
  if (typeof updateRaw.shift_minutes === "number" && Number.isFinite(updateRaw.shift_minutes)) {
    // Clamp ±48h so a hallucinated huge number doesn't nuke the calendar.
    update.shift_minutes = Math.max(-2880, Math.min(2880, updateRaw.shift_minutes));
  }
  if (typeof updateRaw.new_date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(updateRaw.new_date)) {
    update.new_date = updateRaw.new_date;
  }
  if (updateRaw.cancel === true) {
    update.cancel = true;
  }
  // Exactly one of the three must be set.
  const updateKeys = Object.keys(update);
  if (updateKeys.length !== 1) return null;

  const confidenceRaw = typeof data.confidence === "number" ? data.confidence : 0.3;
  const confidence = Math.min(1, Math.max(0, confidenceRaw));

  const leftover =
    typeof data.leftover_note === "string" && data.leftover_note.trim()
      ? data.leftover_note.slice(0, 240)
      : undefined;

  return {
    filter: { type: filterType as BulkFilterType, value: filterValue },
    update,
    confidence,
    leftover_note: leftover,
  };
}

/**
 * Turn a voice command into a structured bulk-update directive. Sanitiser
 * runs first (same as other endpoints). Returns null on malformed model
 * output so route handler can respond 502.
 */
export async function extractBulkUpdate(
  transcription: string,
  client?: CallLogClient,
): Promise<BulkUpdateExtraction | null> {
  const check = checkSensitive(transcription);
  if (!check.ok) {
    return {
      filter: { type: "all", value: "" },
      update: { cancel: true },
      confidence: 0,
      leftover_note: `rejected_sensitive:${check.reason}`,
    };
  }

  const system: AnthropicContent[] = [
    { type: "text", text: BULK_UPDATE_SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
  ];
  const userMsg = buildCallLogUserPrompt(transcription, client);
  const res = await callAnthropic({
    system,
    messages: [{ role: "user", content: userMsg }],
    max_tokens: 500,
    temperature: 0.2,
  });
  const raw = res.content[0]?.type === "text" ? res.content[0].text : "";
  return parseBulkUpdate(raw);
}

/**
 * Turn a multi-intent daily-plan transcription into a list of event
 * drafts. Sanitiser runs first — zero model cost if sensitive data is
 * detected.
 */
export async function extractDailyPlan(
  transcription: string,
  client?: CallLogClient,
): Promise<DailyPlanExtraction | null> {
  const check = checkSensitive(transcription);
  if (!check.ok) {
    // Sanitised — bail out with zero events. Mobile can show a toast.
    return { events: [], overall_confidence: 0, leftover_note: `rejected_sensitive:${check.reason}` };
  }

  const system: AnthropicContent[] = [
    { type: "text", text: DAILY_PLAN_SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
  ];
  const userMsg = buildCallLogUserPrompt(transcription, client);
  const res = await callAnthropic({
    system,
    messages: [{ role: "user", content: userMsg }],
    max_tokens: 1500, // larger — multiple events
    temperature: 0.2,
  });
  const raw = res.content[0]?.type === "text" ? res.content[0].text : "";
  return parseDailyPlan(raw);
}

/**
 * Turn a raw transcription into a structured call-log summary via
 * Anthropic. Returns `null` when the model output can't be parsed —
 * caller should respond with 502 so mobile can fall back.
 *
 * Before the LLM call, `checkSensitive` scans for passport / card / SSN
 * / IBAN patterns. If found, the function short-circuits with a
 * `rejected_sensitive` outcome (no Anthropic request is made — zero
 * model cost on rejection).
 */
export async function summarizeCallLog(
  transcription: string,
  client?: CallLogClient,
): Promise<CallLogSummary | null> {
  // Sanitizer — reject before the LLM sees (and before rate-limit is
  // consumed externally).
  const check = checkSensitive(transcription);
  if (!check.ok) {
    const rej = buildRejectedSummary(check);
    return {
      outcome: rej.outcome,
      note: rej.note,
      confidence: rej.confidence,
      rejected_reason: rej.rejected_reason,
    };
  }

  const system: AnthropicContent[] = [
    { type: "text", text: CALL_LOG_SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
  ];
  const userMsg = buildCallLogUserPrompt(transcription, client);
  const res = await callAnthropic({
    system,
    messages: [{ role: "user", content: userMsg }],
    max_tokens: 600,
    temperature: 0.2,
  });
  const raw = res.content[0]?.type === "text" ? res.content[0].text : "";
  return parseCallLogSummary(raw);
}
