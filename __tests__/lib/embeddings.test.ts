/**
 * Unit tests for `lib/embeddings.ts` — OpenAI batcher with zero-vector
 * fallback for empty inputs. We stub `fetch` so no network IO happens.
 */

import {
  embedBatch,
  embedOne,
  isEmbeddingsConfigured,
  EMBEDDING_DIMS,
} from '../../lib/embeddings';

describe('embedBatch', () => {
  const originalFetch = global.fetch;
  const originalKey = process.env.OPENAI_API_KEY;

  afterEach(() => {
    global.fetch = originalFetch;
    if (originalKey !== undefined) process.env.OPENAI_API_KEY = originalKey;
    else delete process.env.OPENAI_API_KEY;
  });

  it('returns [] for empty input without calling OpenAI', async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    const out = await embedBatch([]);
    expect(out).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('preserves order and dimensions of returned vectors', async () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    const fetchMock = jest.fn(async () => ({
      ok: true,
      text: async () => '',
      json: async () => ({
        data: [
          { index: 0, embedding: new Array(EMBEDDING_DIMS).fill(0.11) },
          { index: 1, embedding: new Array(EMBEDDING_DIMS).fill(0.22) },
        ],
        model: 'text-embedding-3-small',
        usage: { prompt_tokens: 4, total_tokens: 4 },
      }),
    }));
    global.fetch = fetchMock as unknown as typeof fetch;
    const out = await embedBatch(['hello', 'world']);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(out).toHaveLength(2);
    expect(out[0][0]).toBeCloseTo(0.11);
    expect(out[1][0]).toBeCloseTo(0.22);
    expect(out[0]).toHaveLength(EMBEDDING_DIMS);
  });

  it('resorts out-of-order OpenAI responses by index', async () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        data: [
          { index: 1, embedding: new Array(EMBEDDING_DIMS).fill(0.9) },
          { index: 0, embedding: new Array(EMBEDDING_DIMS).fill(0.1) },
        ],
      }),
    })) as unknown as typeof fetch;
    const out = await embedBatch(['a', 'b']);
    expect(out[0][0]).toBeCloseTo(0.1);
    expect(out[1][0]).toBeCloseTo(0.9);
  });

  it('produces zero-vectors for empty-string inputs without calling OpenAI', async () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    const out = await embedBatch(['', '   ', '']);
    expect(out).toHaveLength(3);
    for (const v of out) {
      expect(v).toHaveLength(EMBEDDING_DIMS);
      expect(v.every((x) => x === 0)).toBe(true);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('mixes zero-vector placeholders with real vectors when batch contains empties', async () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        data: [
          { index: 0, embedding: new Array(EMBEDDING_DIMS).fill(0.5) },
          { index: 1, embedding: new Array(EMBEDDING_DIMS).fill(0.7) },
        ],
      }),
    })) as unknown as typeof fetch;
    const out = await embedBatch(['hello', '', 'world', '']);
    expect(out).toHaveLength(4);
    expect(out[0][0]).toBeCloseTo(0.5);
    expect(out[1].every((x) => x === 0)).toBe(true);
    expect(out[2][0]).toBeCloseTo(0.7);
    expect(out[3].every((x) => x === 0)).toBe(true);
  });

  it('trims inputs beyond 8000 chars', async () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    const capturedBodies: string[] = [];
    global.fetch = jest.fn(async (_url, init) => {
      capturedBodies.push(init?.body as string);
      return {
        ok: true,
        json: async () => ({
          data: [{ index: 0, embedding: new Array(EMBEDDING_DIMS).fill(0.1) }],
        }),
      };
    }) as unknown as typeof fetch;
    await embedBatch(['x'.repeat(20_000)]);
    const parsed = JSON.parse(capturedBodies[0]);
    expect(parsed.input[0].length).toBe(8000);
  });

  it('throws when OPENAI_API_KEY missing', async () => {
    delete process.env.OPENAI_API_KEY;
    await expect(embedBatch(['hello'])).rejects.toThrow(/OPENAI_API_KEY/);
  });

  it('throws with status code on OpenAI non-2xx', async () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    global.fetch = jest.fn(async () => ({
      ok: false,
      status: 429,
      text: async () => '{"error":"rate_limit"}',
    })) as unknown as typeof fetch;
    await expect(embedBatch(['hello'])).rejects.toThrow(/OpenAI embeddings 429/);
  });

  it('batches inputs at 96 per request', async () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    const calls: { count: number; total: number }[] = [];
    global.fetch = jest.fn(async (_url, init) => {
      const body = JSON.parse(init?.body as string);
      calls.push({ count: body.input.length, total: calls.length });
      return {
        ok: true,
        json: async () => ({
          data: body.input.map((_: string, i: number) => ({
            index: i,
            embedding: new Array(EMBEDDING_DIMS).fill(0),
          })),
        }),
      };
    }) as unknown as typeof fetch;
    const inputs = Array.from({ length: 150 }, (_, i) => `text ${i}`);
    const out = await embedBatch(inputs);
    expect(out).toHaveLength(150);
    expect(calls).toHaveLength(2);
    expect(calls[0].count).toBe(96);
    expect(calls[1].count).toBe(54);
  });
});

describe('embedOne', () => {
  const originalFetch = global.fetch;
  const originalKey = process.env.OPENAI_API_KEY;

  afterEach(() => {
    global.fetch = originalFetch;
    if (originalKey !== undefined) process.env.OPENAI_API_KEY = originalKey;
    else delete process.env.OPENAI_API_KEY;
  });

  it('returns a single vector', async () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        data: [{ index: 0, embedding: new Array(EMBEDDING_DIMS).fill(0.3) }],
      }),
    })) as unknown as typeof fetch;
    const out = await embedOne('question');
    expect(out).toHaveLength(EMBEDDING_DIMS);
    expect(out[0]).toBeCloseTo(0.3);
  });
});

describe('isEmbeddingsConfigured', () => {
  const originalKey = process.env.OPENAI_API_KEY;
  afterEach(() => {
    if (originalKey !== undefined) process.env.OPENAI_API_KEY = originalKey;
    else delete process.env.OPENAI_API_KEY;
  });

  it('true when key present', () => {
    process.env.OPENAI_API_KEY = 'sk-abc';
    expect(isEmbeddingsConfigured()).toBe(true);
  });

  it('false when key missing', () => {
    delete process.env.OPENAI_API_KEY;
    expect(isEmbeddingsConfigured()).toBe(false);
  });
});
