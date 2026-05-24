/**
 * Unit tests for `extractDailyPlan` — S7-03 / B-064.
 *
 * Verifies multi-event extraction schema + sanitiser bail-out.
 */

import { extractDailyPlan } from '../../lib/ai-proxy';

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

describe('extractDailyPlan', () => {
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

  it('parses 3 events from a daily plan transcription', async () => {
    global.fetch = stubAnthropic({
      events: [
        { title: 'Планёрка', scheduled_at_iso: '2026-04-22T08:00', confidence: 0.9 },
        {
          title: 'Показ квартиры',
          type: 'showing',
          scheduled_at_iso: '2026-04-22T09:00',
          client_name: 'Петров',
          location: 'Арбат 12',
          confidence: 0.95,
        },
        { title: 'Банк', scheduled_at_iso: '2026-04-22T11:00', confidence: 0.8 },
      ],
      overall_confidence: 0.88,
    }) as unknown as typeof fetch;

    const out = await extractDailyPlan(
      'В 8 утра планёрка, в 9 показ Петрову на Арбате, в 11 банк',
    );
    expect(out).not.toBeNull();
    expect(out?.events.length).toBe(3);
    expect(out?.events[1].type).toBe('showing');
    expect(out?.events[1].client_name).toBe('Петров');
    expect(out?.events[1].location).toBe('Арбат 12');
    expect(out?.overall_confidence).toBeCloseTo(0.88);
  });

  it('returns empty events when input is gibberish', async () => {
    global.fetch = stubAnthropic({ events: [], overall_confidence: 0 }) as unknown as typeof fetch;
    const out = await extractDailyPlan('asdjklasd');
    expect(out?.events).toEqual([]);
    expect(out?.overall_confidence).toBe(0);
  });

  it('drops malformed events (no title)', async () => {
    global.fetch = stubAnthropic({
      events: [
        { title: 'Real event', confidence: 0.8 },
        { confidence: 0.5 }, // missing title
        { title: '', confidence: 0.5 }, // empty title
      ],
      overall_confidence: 0.7,
    }) as unknown as typeof fetch;
    const out = await extractDailyPlan('x');
    expect(out?.events.length).toBe(1);
    expect(out?.events[0].title).toBe('Real event');
  });

  it('clamps confidence to [0, 1]', async () => {
    global.fetch = stubAnthropic({
      events: [
        { title: 'A', confidence: 1.5 },
        { title: 'B', confidence: -0.2 },
      ],
      overall_confidence: 2.0,
    }) as unknown as typeof fetch;
    const out = await extractDailyPlan('x');
    expect(out?.events[0].confidence).toBe(1);
    expect(out?.events[1].confidence).toBe(0);
    expect(out?.overall_confidence).toBe(1);
  });

  it('validates scheduled_at_iso format', async () => {
    global.fetch = stubAnthropic({
      events: [
        { title: 'A', scheduled_at_iso: '2026-04-22T15:00', confidence: 0.9 },
        { title: 'B', scheduled_at_iso: 'tomorrow at 3pm', confidence: 0.7 },
      ],
      overall_confidence: 0.8,
    }) as unknown as typeof fetch;
    const out = await extractDailyPlan('x');
    expect(out?.events[0].scheduled_at_iso).toBe('2026-04-22T15:00');
    expect(out?.events[1].scheduled_at_iso).toBeUndefined();
  });

  it('accepts date-only scheduled_at_iso', async () => {
    global.fetch = stubAnthropic({
      events: [{ title: 'A', scheduled_at_iso: '2026-05-30', confidence: 0.9 }],
      overall_confidence: 0.9,
    }) as unknown as typeof fetch;
    const out = await extractDailyPlan('x');
    expect(out?.events[0].scheduled_at_iso).toBe('2026-05-30');
  });

  it('validates event type against enum', async () => {
    global.fetch = stubAnthropic({
      events: [
        { title: 'A', type: 'showing', confidence: 0.9 },
        { title: 'B', type: 'party', confidence: 0.8 }, // invalid
        { title: 'C', type: 'todo', confidence: 0.7 },
      ],
      overall_confidence: 0.8,
    }) as unknown as typeof fetch;
    const out = await extractDailyPlan('x');
    expect(out?.events[0].type).toBe('showing');
    expect(out?.events[1].type).toBeUndefined(); // stripped
    expect(out?.events[2].type).toBe('todo');
  });

  it('rejects sensitive data pre-LLM (sanitiser)', async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    const out = await extractDailyPlan('Запиши паспорт Иванова 4532 789012');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(out?.events).toEqual([]);
    expect(out?.leftover_note).toContain('rejected_sensitive');
  });

  it('returns null when Claude returns non-JSON', async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: 'no json here, just prose.' }],
        usage: { input_tokens: 1, output_tokens: 1 },
      }),
    })) as unknown as typeof fetch;
    const out = await extractDailyPlan('x');
    expect(out).toBeNull();
  });

  it('passes through leftover_note', async () => {
    global.fetch = stubAnthropic({
      events: [{ title: 'Planning', confidence: 0.9 }],
      overall_confidence: 0.9,
      leftover_note: 'Agent mentioned lunch plans not included.',
    }) as unknown as typeof fetch;
    const out = await extractDailyPlan('x');
    expect(out?.leftover_note).toContain('lunch');
  });

  it('calls Anthropic with DAILY_PLAN system prompt', async () => {
    const stub = stubAnthropic({ events: [], overall_confidence: 0 });
    global.fetch = stub as unknown as typeof fetch;
    await extractDailyPlan('x');
    expect(stub).toHaveBeenCalledTimes(1);
    const [url, init] = stub.mock.calls[0] as unknown as [string, { body: string }];
    expect(url).toBe(ANTHROPIC_URL);
    const body = JSON.parse(init.body);
    expect(body.system[0].text).toContain('You parse a real-estate agent');
    expect(body.system[0].text).toContain('events');
  });
});
