/**
 * Unit tests for `lib/chunk.ts` — recursive character splitter.
 */

import { chunkText } from '../../lib/chunk';

describe('chunkText', () => {
  it('returns [] for empty input', () => {
    expect(chunkText('')).toEqual([]);
    expect(chunkText('   \n  ')).toEqual([]);
    expect(chunkText(undefined as unknown as string)).toEqual([]);
  });

  it('keeps short input as a single chunk', () => {
    const out = chunkText('Hello world');
    expect(out).toEqual(['Hello world']);
  });

  it('splits on paragraph breaks when below maxChars budget', () => {
    const paragraphs = Array.from({ length: 3 }, (_, i) => `Paragraph ${i + 1} body text here.`);
    const input = paragraphs.join('\n\n');
    // Total < 500 tokens = 2000 chars, should come back as one chunk.
    const out = chunkText(input);
    expect(out).toHaveLength(1);
    expect(out[0]).toContain('Paragraph 1');
    expect(out[0]).toContain('Paragraph 3');
  });

  it('breaks a long paragraph into sentence-sized chunks', () => {
    // 10 sentences, each ~150 chars — total ~1500 chars. With
    // maxTokens=100 (400 chars) we expect at least 3 chunks.
    const sentences = Array.from(
      { length: 10 },
      (_, i) => `Sentence ${i + 1}: ${'x'.repeat(140)}.`,
    );
    const input = sentences.join(' ');
    const out = chunkText(input, { maxTokens: 100, overlapTokens: 5 });
    expect(out.length).toBeGreaterThan(1);
    // Each chunk is under ~2x the target (overhead from overlap + sentence boundaries)
    for (const c of out) expect(c.length).toBeLessThan(1000);
  });

  it('preserves overlap between consecutive chunks', () => {
    // Force overlap by packing paragraphs at the budget edge.
    const paragraphs = Array.from({ length: 6 }, (_, i) => `Para ${i} ${'y'.repeat(180)}.`);
    const input = paragraphs.join('\n\n');
    const out = chunkText(input, { maxTokens: 100, overlapTokens: 20 });
    expect(out.length).toBeGreaterThan(1);
    // Some chunks should contain the overlap from previous (last ~80 chars)
    let overlapFound = false;
    for (let i = 1; i < out.length; i++) {
      const prevTail = out[i - 1].slice(-60);
      if (out[i].includes(prevTail.slice(0, 30))) {
        overlapFound = true;
        break;
      }
    }
    expect(overlapFound).toBe(true);
  });

  it('hard-slices a single monstrous word', () => {
    const blob = 'A'.repeat(5000);
    const out = chunkText(blob, { maxTokens: 100, overlapTokens: 0 });
    expect(out.length).toBeGreaterThan(1);
    for (const c of out) expect(c.length).toBeLessThanOrEqual(400);
  });

  it('splits on . ! ? sentence boundaries', () => {
    const input = [
      'First sentence ends here.',
      'Second ends with exclamation!',
      'And a question?',
      'Final one.',
    ].join(' ');
    const out = chunkText(input, { maxTokens: 15, overlapTokens: 0 });
    // Every chunk should end in a terminal punctuator OR be the last fragment.
    for (const c of out) {
      const last = c.trim().slice(-1);
      expect(['.', '!', '?']).toContain(last);
    }
  });

  it('is stable — idempotent re-chunking of the same text', () => {
    const input = 'Paragraph A.\n\nParagraph B with some words here.\n\nParagraph C final.';
    const first = chunkText(input);
    const second = chunkText(input);
    expect(first).toEqual(second);
  });

  it('handles empty paragraphs without dropping content', () => {
    const input = 'A.\n\n\n\n\nB.';
    const out = chunkText(input);
    expect(out.join(' ')).toContain('A');
    expect(out.join(' ')).toContain('B');
  });

  it('respects custom maxTokens option', () => {
    const input = 'one two three four five six seven eight nine ten eleven twelve.';
    const tight = chunkText(input, { maxTokens: 3, overlapTokens: 0 });
    const wide = chunkText(input, { maxTokens: 50, overlapTokens: 0 });
    expect(tight.length).toBeGreaterThan(wide.length);
  });
});
