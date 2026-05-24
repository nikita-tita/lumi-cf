/**
 * OpenAI text-embedding-3-small wrapper.
 *
 * 1536 dimensions — matches the VECTOR(1536) column in
 * `document_chunks`. Multilingual, $0.02 / 1M tokens.
 *
 * Batches by 96 inputs per request (under OpenAI's 100 limit, leaves
 * headroom for the query embedding on the same request flow). Silent
 * throw on missing API key so callers can 503.
 */

export const EMBEDDING_MODEL = "text-embedding-3-small";
export const EMBEDDING_DIMS = 1536;

const OPENAI_URL = "https://api.openai.com/v1/embeddings";
const BATCH = 96;
const MAX_INPUT_CHARS = 8000; // OpenAI hard cap ≈ 8192 tokens; 8000 chars ≈ 2000 tokens. Safe.

export function isEmbeddingsConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

interface EmbeddingsResponse {
  data: { embedding: number[]; index: number }[];
  model: string;
  usage: { prompt_tokens: number; total_tokens: number };
}

async function callOpenAI(inputs: string[]): Promise<number[][]> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not set");
  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: inputs,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI embeddings ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as EmbeddingsResponse;
  // OpenAI preserves request order in `index`. Sort defensively.
  return data.data
    .slice()
    .sort((a, b) => a.index - b.index)
    .map((d) => d.embedding);
}

/**
 * Embed a batch of strings. Handles OpenAI's batch size limit
 * transparently. Each input is trimmed to MAX_INPUT_CHARS.
 */
export async function embedBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const trimmed = texts.map((t) => (t ?? "").trim().slice(0, MAX_INPUT_CHARS));
  const out: number[][] = [];
  for (let i = 0; i < trimmed.length; i += BATCH) {
    const slice = trimmed.slice(i, i + BATCH);
    // Filter empty inputs — OpenAI rejects ''  with 400.
    const nonEmpty = slice.map((s, idx) => ({ s, idx })).filter((x) => x.s.length > 0);
    if (nonEmpty.length === 0) {
      // All empty in this batch — push zero-vectors as placeholders.
      for (let k = 0; k < slice.length; k++) out.push(new Array(EMBEDDING_DIMS).fill(0));
      continue;
    }
    const vectors = await callOpenAI(nonEmpty.map((x) => x.s));
    const vectorByIdx = new Map(nonEmpty.map((x, k) => [x.idx, vectors[k]]));
    for (let k = 0; k < slice.length; k++) {
      out.push(vectorByIdx.get(k) ?? new Array(EMBEDDING_DIMS).fill(0));
    }
  }
  return out;
}

/** Convenience for single-string embed (the user's question). */
export async function embedOne(text: string): Promise<number[]> {
  const vectors = await embedBatch([text]);
  return vectors[0] ?? new Array(EMBEDDING_DIMS).fill(0);
}
