/**
 * Unit tests for the CallLogSummary schema expansion (Sprint S6 Fix 1).
 *
 * We import the module and test `summarizeCallLog` end-to-end with
 * stubbed Anthropic + stubbed process.env. The goal is to verify that:
 * - New optional fields pass through parser (not stripped)
 * - New `rejected_sensitive` outcome is accepted
 * - Invalid variants of new fields are ignored (parser is defensive)
 * - Existing required-field validation still works (back-compat)
 * - Extra unknown keys still get stripped
 */

import { summarizeCallLog } from '../../lib/ai-proxy';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

function stubAnthropic(jsonObject: unknown): jest.Mock {
  return jest.fn(async () => ({
    ok: true,
    json: async () => ({
      content: [{ type: 'text', text: JSON.stringify(jsonObject) }],
      usage: { input_tokens: 1, output_tokens: 1 },
    }),
  })) as unknown as jest.Mock;
}

describe('summarizeCallLog schema', () => {
  const originalFetch = global.fetch;
  const originalKey = process.env.ANTHROPIC_API_KEY;

  beforeEach(() => {
    process.env.ANTHROPIC_API_KEY = 'sk-test';
  });

  afterEach(() => {
    global.fetch = originalFetch;
    if (originalKey !== undefined) process.env.ANTHROPIC_API_KEY = originalKey;
    else delete process.env.ANTHROPIC_API_KEY;
  });

  // ── Backward compat ────────────────────────────────────────────────

  it('accepts the old minimal shape unchanged', async () => {
    global.fetch = stubAnthropic({
      outcome: 'interested',
      note: 'Client agreed to meeting.',
      confidence: 0.9,
    }) as unknown as typeof fetch;
    const out = await summarizeCallLog('Иванов согласен');
    expect(out?.outcome).toBe('interested');
    expect(out?.note).toBe('Client agreed to meeting.');
    expect(out?.confidence).toBeCloseTo(0.9);
    // New fields are undefined when not emitted.
    expect(out?.scheduled_at_iso).toBeUndefined();
    expect(out?.time_ambiguous).toBeUndefined();
    expect(out?.rejected_reason).toBeUndefined();
  });

  it('still rejects output missing required keys', async () => {
    global.fetch = stubAnthropic({
      outcome: 'interested',
      // note missing
      confidence: 0.9,
    }) as unknown as typeof fetch;
    expect(await summarizeCallLog('x')).toBeNull();
  });

  it('still strips completely unknown keys', async () => {
    global.fetch = stubAnthropic({
      outcome: 'interested',
      note: 'ok',
      confidence: 0.8,
      bogus_field: 'should be gone',
      __evil: 42,
    }) as unknown as typeof fetch;
    const out = await summarizeCallLog('x');
    expect(out).not.toBeNull();
    expect(out as unknown as Record<string, unknown>).not.toHaveProperty('bogus_field');
    expect(out as unknown as Record<string, unknown>).not.toHaveProperty('__evil');
  });

  // ── rejected_sensitive outcome ─────────────────────────────────────

  it('accepts the new rejected_sensitive outcome', async () => {
    global.fetch = stubAnthropic({
      outcome: 'rejected_sensitive',
      note: 'Sensitive data detected.',
      confidence: 0,
      rejected_reason: 'passport',
    }) as unknown as typeof fetch;
    const out = await summarizeCallLog('x');
    expect(out?.outcome).toBe('rejected_sensitive');
    expect(out?.rejected_reason).toBe('passport');
  });

  // ── scheduled_at_iso ───────────────────────────────────────────────

  it('passes through valid ISO date-only', async () => {
    global.fetch = stubAnthropic({
      outcome: 'interested',
      note: 'ok',
      confidence: 0.9,
      scheduled_at_iso: '2026-05-30',
    }) as unknown as typeof fetch;
    const out = await summarizeCallLog('x');
    expect(out?.scheduled_at_iso).toBe('2026-05-30');
  });

  it('passes through valid ISO date-time', async () => {
    global.fetch = stubAnthropic({
      outcome: 'interested',
      note: 'ok',
      confidence: 0.9,
      scheduled_at_iso: '2026-05-30T15:00:00+01:00',
    }) as unknown as typeof fetch;
    const out = await summarizeCallLog('x');
    expect(out?.scheduled_at_iso).toBe('2026-05-30T15:00:00+01:00');
  });

  it('strips invalid scheduled_at_iso format', async () => {
    global.fetch = stubAnthropic({
      outcome: 'interested',
      note: 'ok',
      confidence: 0.9,
      scheduled_at_iso: 'tomorrow at 3pm', // not ISO
    }) as unknown as typeof fetch;
    const out = await summarizeCallLog('x');
    expect(out?.scheduled_at_iso).toBeUndefined();
  });

  // ── scheduled_at_fuzzy ─────────────────────────────────────────────

  it('passes through scheduled_at_fuzzy=true', async () => {
    global.fetch = stubAnthropic({
      outcome: 'interested',
      note: 'Meeting in the evening',
      confidence: 0.7,
      scheduled_at_fuzzy: true,
    }) as unknown as typeof fetch;
    const out = await summarizeCallLog('x');
    expect(out?.scheduled_at_fuzzy).toBe(true);
  });

  it('ignores scheduled_at_fuzzy: "true" (string, not boolean)', async () => {
    global.fetch = stubAnthropic({
      outcome: 'interested',
      note: 'ok',
      confidence: 0.9,
      scheduled_at_fuzzy: 'true',
    }) as unknown as typeof fetch;
    const out = await summarizeCallLog('x');
    expect(out?.scheduled_at_fuzzy).toBeUndefined();
  });

  // ── time_ambiguous ────────────────────────────────────────────────

  it('passes through time_ambiguous', async () => {
    global.fetch = stubAnthropic({
      outcome: 'interested',
      note: 'Bare hour 9 — needs AM/PM',
      confidence: 0.6,
      time_ambiguous: true,
    }) as unknown as typeof fetch;
    const out = await summarizeCallLog('x');
    expect(out?.time_ambiguous).toBe(true);
  });

  // ── timezone ──────────────────────────────────────────────────────

  it('passes through valid IANA timezone', async () => {
    global.fetch = stubAnthropic({
      outcome: 'interested',
      note: 'NY time',
      confidence: 0.9,
      timezone: 'America/New_York',
    }) as unknown as typeof fetch;
    const out = await summarizeCallLog('x');
    expect(out?.timezone).toBe('America/New_York');
  });

  it('passes through "UTC" as a zone', async () => {
    global.fetch = stubAnthropic({
      outcome: 'interested',
      note: 'ok',
      confidence: 0.9,
      timezone: 'UTC',
    }) as unknown as typeof fetch;
    const out = await summarizeCallLog('x');
    expect(out?.timezone).toBe('UTC');
  });

  it('strips obviously-bogus timezone strings', async () => {
    global.fetch = stubAnthropic({
      outcome: 'interested',
      note: 'ok',
      confidence: 0.9,
      timezone: '9:00 am NYC baseball stadium',
    }) as unknown as typeof fetch;
    const out = await summarizeCallLog('x');
    expect(out?.timezone).toBeUndefined();
  });

  // ── detected_silence ──────────────────────────────────────────────

  it('passes through detected_silence flag', async () => {
    global.fetch = stubAnthropic({
      outcome: 'no_answer',
      note: '',
      confidence: 0.1,
      detected_silence: true,
    }) as unknown as typeof fetch;
    const out = await summarizeCallLog('');
    expect(out?.detected_silence).toBe(true);
    expect(out?.outcome).toBe('no_answer');
  });

  // ── rejected_reason ───────────────────────────────────────────────

  it('passes through rejected_reason (short)', async () => {
    global.fetch = stubAnthropic({
      outcome: 'rejected_sensitive',
      note: 'rejected',
      confidence: 0,
      rejected_reason: 'card',
    }) as unknown as typeof fetch;
    const out = await summarizeCallLog('x');
    expect(out?.rejected_reason).toBe('card');
  });

  it('clips rejected_reason to 80 chars', async () => {
    const longReason = 'a'.repeat(200);
    global.fetch = stubAnthropic({
      outcome: 'rejected_sensitive',
      note: 'rejected',
      confidence: 0,
      rejected_reason: longReason,
    }) as unknown as typeof fetch;
    const out = await summarizeCallLog('x');
    expect(out?.rejected_reason?.length).toBe(80);
  });

  // ── Combination: old + new fields together ────────────────────────

  it('preserves existing stage_change + new scheduled_at_iso together', async () => {
    global.fetch = stubAnthropic({
      outcome: 'interested',
      note: 'Client loved property.',
      todo: 'Send contract',
      stage_change: 'interested',
      confidence: 0.95,
      scheduled_at_iso: '2026-05-01',
      scheduled_at_fuzzy: false,
    }) as unknown as typeof fetch;
    const out = await summarizeCallLog('x');
    expect(out).toMatchObject({
      outcome: 'interested',
      todo: 'Send contract',
      stage_change: 'interested',
      scheduled_at_iso: '2026-05-01',
    });
    // scheduled_at_fuzzy: false should NOT be coerced to undefined-or-true
    // It's only true-true that gets passed through.
    expect(out?.scheduled_at_fuzzy).toBeUndefined();
  });

  // ── Anthropic fetch verification ──────────────────────────────────

  it('calls Anthropic with the CallLogSummary system prompt', async () => {
    const stub = stubAnthropic({ outcome: 'interested', note: 'ok', confidence: 0.8 });
    global.fetch = stub as unknown as typeof fetch;
    await summarizeCallLog('hello world');
    expect(stub).toHaveBeenCalledTimes(1);
    const [url, init] = stub.mock.calls[0] as unknown as [string, { body: string }];
    expect(url).toBe(ANTHROPIC_URL);
    const body = JSON.parse(init.body);
    expect(body.system[0].text).toContain('rejected_sensitive');
    expect(body.system[0].text).toContain('scheduled_at_iso');
    expect(body.system[0].text).toContain('time_ambiguous');
  });
});
