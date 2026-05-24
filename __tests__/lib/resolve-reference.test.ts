/**
 * Unit tests for landing/lib/resolve-reference — S10 multi-turn.
 */

import { resolveReference, type RecentAction } from '../../lib/resolve-reference';

const ra = (
  override: Partial<RecentAction> & { entity_id: string; timestamp: string | number },
): RecentAction => ({
  type: 'event_create',
  ...override,
});

describe('resolveReference', () => {
  const t0 = 1_700_000_000_000;
  const minutes = (n: number) => t0 + n * 60_000;

  it('empty phrase → no resolution', () => {
    expect(resolveReference('', [ra({ entity_id: 'a', timestamp: t0 })])).toEqual({
      resolved_id: null,
      resolved_type: null,
      confidence: 0,
    });
  });

  it('empty history → no resolution', () => {
    expect(resolveReference('move it to 11', [])).toEqual({
      resolved_id: null,
      resolved_type: null,
      confidence: 0,
    });
  });

  it('"move it to 11" → resolves to most recent non-delete', () => {
    const out = resolveReference('move it to 11', [
      ra({ entity_id: 'evt_1', title: 'Showing Petrov', timestamp: minutes(0) }),
    ]);
    expect(out.resolved_id).toBe('evt_1');
    expect(out.confidence).toBeGreaterThanOrEqual(0.8);
  });

  it('"that" → most recent', () => {
    const out = resolveReference('delete that', [
      ra({ entity_id: 'a', title: 'A', timestamp: minutes(0) }),
      ra({ entity_id: 'b', title: 'B', timestamp: minutes(-1) }),
    ]);
    expect(out.resolved_id).toBe('a');
  });

  it('Russian "эту встречу" → most recent event', () => {
    const out = resolveReference('переделай эту встречу', [
      ra({ entity_id: 'evt_1', title: 'Встреча с Петровым', timestamp: minutes(0) }),
    ]);
    expect(out.resolved_id).toBe('evt_1');
  });

  it('"last task" → most recent todo', () => {
    const out = resolveReference('mark the last task as done', [
      ra({ type: 'event_create', entity_id: 'evt_1', timestamp: minutes(0) }),
      ra({ type: 'todo_create', entity_id: 'todo_2', timestamp: minutes(-1) }),
    ]);
    expect(out.resolved_id).toBe('todo_2');
    expect(out.resolved_type).toBe('todo');
  });

  it('"last meeting" → most recent event', () => {
    const out = resolveReference('move the last meeting to 3pm', [
      ra({ type: 'todo_create', entity_id: 'todo_1', timestamp: minutes(0) }),
      ra({ type: 'event_create', entity_id: 'evt_2', title: 'Meeting Petrov', timestamp: minutes(-2) }),
    ]);
    expect(out.resolved_id).toBe('evt_2');
    expect(out.resolved_type).toBe('event');
  });

  it('named entity "Anna\'s meeting" → matches Anna event', () => {
    const out = resolveReference("move Anna's meeting to 11", [
      ra({ entity_id: 'evt_bob', title: 'Meeting Bob', timestamp: minutes(0) }),
      ra({ entity_id: 'evt_anna', title: 'Meeting Anna Smith', timestamp: minutes(-5) }),
    ]);
    expect(out.resolved_id).toBe('evt_anna');
    expect(out.confidence).toBeGreaterThanOrEqual(0.85);
  });

  it('delete-entry is skipped when resolving "it"', () => {
    const out = resolveReference('restore it', [
      ra({ type: 'event_delete', entity_id: 'just_deleted', timestamp: minutes(0) }),
      ra({ entity_id: 'evt_prev', title: 'Prev', timestamp: minutes(-1) }),
    ]);
    // "it" with the most-recent being a delete skips to the prior event.
    expect(out.resolved_id).toBe('evt_prev');
  });

  it('ambiguous recent entries → confidence drops + alternatives', () => {
    const out = resolveReference('update it', [
      ra({ entity_id: 'a', title: 'A', timestamp: minutes(0) }),
      ra({ entity_id: 'b', title: 'B', timestamp: minutes(-1) }),
      ra({ entity_id: 'c', title: 'C', timestamp: minutes(-2) }),
    ]);
    expect(out.resolved_id).toBe('a');
    expect(out.confidence).toBeLessThan(0.8);
    expect(out.alternatives?.length).toBeGreaterThanOrEqual(2);
  });

  it('no coreference phrase → confidence 0', () => {
    const out = resolveReference('create a new event', [
      ra({ entity_id: 'a', timestamp: minutes(0) }),
    ]);
    expect(out.confidence).toBe(0);
  });

  it('timestamps as ISO string sorted correctly', () => {
    const out = resolveReference('delete it', [
      ra({ entity_id: 'old', timestamp: '2026-04-25T10:00:00Z' }),
      ra({ entity_id: 'new', timestamp: '2026-04-26T10:00:00Z' }),
    ]);
    expect(out.resolved_id).toBe('new');
  });
});
