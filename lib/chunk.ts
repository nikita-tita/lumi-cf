/**
 * Simple recursive character splitter for RAG indexing.
 *
 * Targets ~500 tokens / chunk with 50-token overlap. Approximates
 * tokens as chars / 4 (English + Romance languages; for CJK or Arabic
 * it's closer to chars / 2 — still safe because we cap at 2000 chars).
 *
 * Splits on paragraph → sentence → word → char boundary, in that
 * order, to keep semantic coherence.
 */

export interface ChunkOptions {
  /** Target chunk length in tokens. Default 500. */
  maxTokens?: number;
  /** Overlap between adjacent chunks in tokens. Default 50. */
  overlapTokens?: number;
}

const CHARS_PER_TOKEN = 4;

const PARAGRAPH_SPLIT = /\n\s*\n/;
const SENTENCE_SPLIT = /(?<=[.!?])\s+/;
const WORD_SPLIT = /\s+/;

export function chunkText(input: string, opts: ChunkOptions = {}): string[] {
  const text = (input ?? "").trim();
  if (!text) return [];
  const maxChars = (opts.maxTokens ?? 500) * CHARS_PER_TOKEN;
  const overlapChars = (opts.overlapTokens ?? 50) * CHARS_PER_TOKEN;

  // Step 1 — split on paragraph breaks. If a paragraph exceeds maxChars
  // we keep going down the hierarchy (sentence → word → hard slice).
  const paragraphs = text.split(PARAGRAPH_SPLIT).map((s) => s.trim()).filter(Boolean);

  const splitByHierarchy = (piece: string): string[] => {
    if (piece.length <= maxChars) return [piece];
    const sentences = piece.split(SENTENCE_SPLIT).map((s) => s.trim()).filter(Boolean);
    if (sentences.length > 1) {
      const out: string[] = [];
      for (const s of sentences) out.push(...splitByHierarchy(s));
      return out;
    }
    // One long sentence — fall back to words.
    const words = piece.split(WORD_SPLIT);
    if (words.length > 1) {
      const out: string[] = [];
      let buf = "";
      for (const w of words) {
        const next = buf ? `${buf} ${w}` : w;
        if (next.length > maxChars) {
          if (buf) out.push(buf);
          buf = w;
        } else {
          buf = next;
        }
      }
      if (buf) out.push(buf);
      return out;
    }
    // Single monstrous word (rare — base64 blobs, URLs). Hard slice.
    const out: string[] = [];
    for (let i = 0; i < piece.length; i += maxChars) out.push(piece.slice(i, i + maxChars));
    return out;
  };

  const atomic: string[] = [];
  for (const p of paragraphs) atomic.push(...splitByHierarchy(p));

  // Step 2 — pack atomic pieces into chunks with overlap.
  const chunks: string[] = [];
  let buf = "";
  for (const piece of atomic) {
    const candidate = buf ? `${buf}\n\n${piece}` : piece;
    if (candidate.length <= maxChars) {
      buf = candidate;
      continue;
    }
    if (buf) chunks.push(buf);
    // Start new chunk with tail of previous for context (overlap).
    if (overlapChars > 0 && buf.length > overlapChars) {
      buf = `${buf.slice(-overlapChars)}\n\n${piece}`;
      if (buf.length > maxChars) {
        // Piece itself bigger than budget — just use piece alone.
        buf = piece;
      }
    } else {
      buf = piece;
    }
  }
  if (buf) chunks.push(buf);

  return chunks;
}
