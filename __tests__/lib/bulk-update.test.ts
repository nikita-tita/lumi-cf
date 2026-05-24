/**
 * Unit tests for `extractBulkUpdate` — S9/B-069.
 *
 * Exercises schema validation, filter/update enum discipline, and
 * sanitiser pre-gate.
 */

import { extractBulkUpdate } from '../../lib/ai-proxy';

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

describe('extractBulkUpdate', () => {
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

  it('parses shift_minutes directive', async () => {
    global.fetch = stubAnthropic({
      filter: { type: 'keyword', value: 'показ' },
      update: { shift_minutes: 60 },
      confidence: 0.9,
    }) as unknown as typeof fetch;

    const out = await extractBulkUpdate('Перенеси все показы на час позже');
    expect(out).not.toBeNull();
    expect(out?.filter.type).toBe('keyword');
    expect(out?.filter.value).toBe('показ');
    expect(out?.update.shift_minutes).toBe(60);
    expect(out?.confidence).toBe(0.9);
  });

  it('parses new_date directive', async () => {
    global.fetch = stubAnthropic({
      filter: { type: 'time_range', value: 'tomorrow 17:00-23:59' },
      update: { new_date: '2026-04-27' },
      confidence: 0.85,
    }) as unknown as typeof fetch;

    const out = await extractBulkUpdate('Move all after 17:00 tomorrow to the day after');
    expect(out?.filter.type).toBe('time_range');
    expect(out?.update.new_date).toBe('2026-04-27');
    expect(out?.update.shift_minutes).toBeUndefined();
  });

  it('parses cancel directive', async () => {
    global.fetch = stubAnthropic({
      filter: { type: 'date_range', value: 'friday' },
      update: { cancel: true },
      confidence: 0.9,
    }) as unknown as typeof fetch;

    const out = await extractBulkUpdate('Отмени все встречи в пятницу');
    expect(out?.update.cancel).toBe(true);
  });

  it('accepts "all" filter type', async () => {
    global.fetch = stubAnthropic({
      filter: { type: 'all', value: 'today' },
      update: { shift_minutes: 30 },
      confidence: 0.8,
    }) as unknown as typeof fetch;
    const out = await extractBulkUpdate('Shift everything today by half an hour');
    expect(out?.filter.type).toBe('all');
  });

  it('rejects invalid filter.type enum', async () => {
    global.fetch = stubAnthropic({
      filter: { type: 'weather', value: 'sunny' }, // not in enum
      update: { shift_minutes: 60 },
      confidence: 0.8,
    }) as unknown as typeof fetch;
    const out = await extractBulkUpdate('x');
    expect(out).toBeNull();
  });

  it('rejects when more than one update field set', async () => {
    global.fetch = stubAnthropic({
      filter: { type: 'keyword', value: 'showing' },
      update: { shift_minutes: 60, cancel: true }, // ambiguous
      confidence: 0.7,
    }) as unknown as typeof fetch;
    const out = await extractBulkUpdate('x');
    expect(out).toBeNull();
  });

  it('rejects when zero update fields set', async () => {
    global.fetch = stubAnthropic({
      filter: { type: 'keyword', value: 'showing' },
      update: {},
      confidence: 0.7,
    }) as unknown as typeof fetch;
    const out = await extractBulkUpdate('x');
    expect(out).toBeNull();
  });

  it('clamps shift_minutes to ±48h', async () => {
    global.fetch = stubAnthropic({
      filter: { type: 'all', value: '' },
      update: { shift_minutes: 999_999 },
      confidence: 0.5,
    }) as unknown as typeof fetch;
    const out = await extractBulkUpdate('x');
    expect(out?.update.shift_minutes).toBe(2880);
  });

  it('clamps confidence to [0,1]', async () => {
    global.fetch = stubAnthropic({
      filter: { type: 'all', value: '' },
      update: { cancel: true },
      confidence: 2.0,
    }) as unknown as typeof fetch;
    const out = await extractBulkUpdate('x');
    expect(out?.confidence).toBe(1);
  });

  it('validates new_date format (YYYY-MM-DD only)', async () => {
    global.fetch = stubAnthropic({
      filter: { type: 'all', value: '' },
      update: { new_date: 'tomorrow' }, // not ISO
      confidence: 0.5,
    }) as unknown as typeof fetch;
    const out = await extractBulkUpdate('x');
    // With new_date stripped and no other fields, zero-update should reject
    expect(out).toBeNull();
  });

  it('sanitiser pre-gate catches sensitive data', async () => {
    const fetchMock = jest.fn(); // should NOT be called
    global.fetch = fetchMock as unknown as typeof fetch;
    const out = await extractBulkUpdate('Перенеси встречи паспорт 4532 789012 на неделю');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(out?.confidence).toBe(0);
    expect(out?.leftover_note).toContain('rejected_sensitive');
  });

  it('returns null on non-JSON response', async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: 'sorry, cannot parse this' }],
        usage: { input_tokens: 1, output_tokens: 1 },
      }),
    })) as unknown as typeof fetch;
    const out = await extractBulkUpdate('x');
    expect(out).toBeNull();
  });

  it('calls Anthropic with BULK_UPDATE system prompt', async () => {
    const stub = stubAnthropic({
      filter: { type: 'all', value: '' },
      update: { cancel: true },
      confidence: 0.5,
    });
    global.fetch = stub as unknown as typeof fetch;
    await extractBulkUpdate('x');
    const [url, init] = stub.mock.calls[0] as unknown as [string, { body: string }];
    expect(url).toBe(ANTHROPIC_URL);
    const body = JSON.parse(init.body);
    expect(body.system[0].text).toContain('voice command to update multiple');
  });
});
