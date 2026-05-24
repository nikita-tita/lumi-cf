/**
 * Reference resolution (S10 multi-turn).
 *
 * Agent says "move it to 11" after just creating an event. "it" must
 * resolve to the event. Caller (mobile) sends the last N actions as
 * context; this helper picks the best match WITHOUT a Claude call in
 * the common case — pattern-match "it" / "that" / "the last X" /
 * "Anna's meeting" against the most recent matching entry.
 *
 * Pure function, exhaustively unit-tested. No I/O.
 */

export type RecentActionType =
  | 'event_create'
  | 'event_update'
  | 'event_delete'
  | 'todo_create'
  | 'todo_update'
  | 'todo_delete'
  | 'client_move_stage';

export interface RecentAction {
  type: RecentActionType;
  entity_id: string;
  title?: string;
  timestamp: string | number;
  kind?: 'event' | 'todo' | 'client';
}

export interface ReferenceResolution {
  resolved_id: string | null;
  resolved_type: 'event' | 'todo' | 'client' | null;
  confidence: number;
  reasoning?: string;
  alternatives?: Array<{ id: string; title: string; type: string }>;
}

// Note: `\b` in JS regex is ASCII-only — it won't anchor around
// Cyrillic. We use `\b` for English + explicit non-cyrillic lookaround
// for Russian pronouns.
const NOT_RU = '(?<![а-яА-Я])';
const NOT_RU_END = '(?![а-яА-Я])';

const MOST_RECENT_PATTERNS: RegExp[] = [
  /\b(it|that|this)\b/i,
  new RegExp(`${NOT_RU}(её|его|это|эту|этот)${NOT_RU_END}`, 'i'),
  /\blast (event|meeting|showing|task|todo)\b/i,
  /\b(the )?just[- ]?created\b/i,
  new RegExp(`${NOT_RU}(последн|предыдущ)\\w*${NOT_RU_END}`, 'i'),
];

const LAST_KIND_PATTERNS: Array<{ re: RegExp; kind: 'event' | 'todo' }> = [
  { re: /\blast (event|meeting|showing|appointment)\b/i, kind: 'event' },
  { re: /\blast (task|todo|to-?do)\b/i, kind: 'todo' },
  { re: new RegExp(`${NOT_RU}(последн|предыдущ)\\w* (событи|встреч|показ)\\w*${NOT_RU_END}`, 'i'), kind: 'event' },
  { re: new RegExp(`${NOT_RU}(последн|предыдущ)\\w* (задач|задан)\\w*${NOT_RU_END}`, 'i'), kind: 'todo' },
];

const NAMED_ENTITY_RE = /(?:'s |у |от )?(?<name>[А-ЯA-Z][А-Яа-яA-Za-z-]{2,})['’]?s?\s+(?<kind>meeting|event|showing|встреч|показ|задач|todo)/i;

function kindFromType(t: RecentActionType): 'event' | 'todo' | 'client' {
  if (t.startsWith('event_')) return 'event';
  if (t.startsWith('todo_')) return 'todo';
  return 'client';
}

export function resolveReference(
  phrase: string,
  recentActions: RecentAction[],
): ReferenceResolution {
  if (!phrase || recentActions.length === 0) {
    return { resolved_id: null, resolved_type: null, confidence: 0 };
  }
  const sorted = [...recentActions].sort((a, b) => {
    const ta = typeof a.timestamp === 'number' ? a.timestamp : Date.parse(String(a.timestamp));
    const tb = typeof b.timestamp === 'number' ? b.timestamp : Date.parse(String(b.timestamp));
    return tb - ta;
  });
  const candidates = sorted.filter((a) => !a.type.endsWith('_delete'));

  // 1) Named entity.
  const namedMatch = phrase.match(NAMED_ENTITY_RE);
  if (namedMatch && namedMatch.groups?.name) {
    const nameLc = namedMatch.groups.name.toLowerCase();
    const match = candidates.find(
      (a) => a.title && a.title.toLowerCase().includes(nameLc),
    );
    if (match) {
      return {
        resolved_id: match.entity_id,
        resolved_type: match.kind ?? kindFromType(match.type),
        confidence: 0.9,
        reasoning: `Named-entity match on "${nameLc}"`,
      };
    }
  }

  // 2) "Last X" kind-constrained.
  for (const p of LAST_KIND_PATTERNS) {
    if (p.re.test(phrase)) {
      const match = candidates.find(
        (a) => (a.kind ?? kindFromType(a.type)) === p.kind,
      );
      if (match) {
        return {
          resolved_id: match.entity_id,
          resolved_type: p.kind,
          confidence: 0.85,
          reasoning: `"Last ${p.kind}" → most recent matching entry`,
        };
      }
    }
  }

  // 3) Generic "it" / "that".
  const generic = MOST_RECENT_PATTERNS.some((p) => p.test(phrase));
  if (generic && candidates.length > 0) {
    const top = candidates[0];
    const topT = typeof top.timestamp === 'number' ? top.timestamp : Date.parse(String(top.timestamp));
    const close = candidates.filter((a) => {
      const t = typeof a.timestamp === 'number' ? a.timestamp : Date.parse(String(a.timestamp));
      return topT - t < 5 * 60 * 1000;
    });
    if (close.length > 1) {
      return {
        resolved_id: top.entity_id,
        resolved_type: top.kind ?? kindFromType(top.type),
        confidence: 0.65,
        reasoning: `Multiple recent entries — picking most recent, but alternatives exist`,
        alternatives: close.slice(1, 4).map((a) => ({
          id: a.entity_id,
          title: a.title ?? a.entity_id,
          type: a.kind ?? kindFromType(a.type),
        })),
      };
    }
    return {
      resolved_id: top.entity_id,
      resolved_type: top.kind ?? kindFromType(top.type),
      confidence: 0.85,
      reasoning: 'Most recent non-delete entry',
    };
  }

  return {
    resolved_id: null,
    resolved_type: null,
    confidence: 0,
    reasoning: 'No coreference phrase detected',
  };
}
