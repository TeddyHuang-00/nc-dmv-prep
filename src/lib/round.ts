// One in-flight round per kind, kept in sessionStorage so a remount (handbook link,
// browser back, reload) resumes it instead of resampling. Same defensive style as stats.ts.

export const ROUND_KEYS = {
  practice: "ncdmv-round-v1",
  exam: "ncdmv-exam-v1",
} as const;

export type RoundKind = keyof typeof ROUND_KEYS;

export type PracticeRound = {
  ids: string[];
  choiceOrders?: number[][];
  i: number;
  picked: number | null;
  wrongIds: [string, number][];
  score: number;
  done: boolean;
  updatedAt: number;
};

export type ExamRound = {
  ids: string[];
  choiceOrders?: number[][];
  i: number;
  answers: Record<number, number>;
  submitted: boolean;
  updatedAt: number;
};

export type Round = PracticeRound | ExamRound;

/** ponytail: tests pass a Map-backed fake; production callers use the tab's sessionStorage. */
export type RoundStore = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function store(s?: RoundStore): RoundStore | null {
  if (s) return s;
  return typeof window === "undefined" ? null : window.sessionStorage;
}

/** A choice/question index: finite integer >= 0, else the fallback. */
function index(v: unknown, fallback: number): number {
  return typeof v === "number" && Number.isInteger(v) && v >= 0 ? v : fallback;
}

/** Finite number, else the fallback. */
function num(v: unknown, fallback: number): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

export function loadRound<T extends Round>(kind: RoundKind, s?: RoundStore): T | null {
  try {
    const raw = store(s)?.getItem(ROUND_KEYS[kind]);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    // sessionStorage is untrusted input (hand-edited, stale payloads): validate/coerce every
    // field here, at the single entry point, so no consumer can crash on a corrupt shape.
    if (!parsed || typeof parsed !== "object") return null;
    const p = parsed as Record<string, unknown>;
    if (!Array.isArray(p.ids)) return null;
    const ids = p.ids.filter((x): x is string => typeof x === "string");
    if (ids.length === 0) return null;
    const i = index(p.i, 0);
    const updatedAt = num(p.updatedAt, 0);
    const choiceOrders = Array.isArray(p.choiceOrders)
      ? p.choiceOrders.map((order) => Array.isArray(order)
          ? order.filter((choice): choice is number => typeof choice === "number" && Number.isInteger(choice) && choice >= 0)
          : [])
      : undefined;

    if (kind === "exam") {
      const answers: Record<number, number> = {};
      if (p.answers && typeof p.answers === "object" && !Array.isArray(p.answers))
        for (const [k, v] of Object.entries(p.answers))
          if (/^\d+$/.test(k) && typeof v === "number" && Number.isInteger(v) && v >= 0) answers[Number(k)] = v;
      return { ids, ...(choiceOrders ? { choiceOrders } : {}), i, answers, submitted: typeof p.submitted === "boolean" ? p.submitted : false, updatedAt } as T;
    }

    return {
      ids,
      ...(choiceOrders ? { choiceOrders } : {}),
      i,
      picked: typeof p.picked === "number" && Number.isInteger(p.picked) && p.picked >= 0 ? p.picked : null,
      wrongIds: Array.isArray(p.wrongIds)
        ? p.wrongIds.flatMap((e) =>
            Array.isArray(e) && typeof e[0] === "string" && typeof e[1] === "number" && Number.isInteger(e[1]) && e[1] >= 0
              ? [[e[0], e[1]] as [string, number]]
              : [],
          )
        : [],
      score: num(p.score, 0),
      done: typeof p.done === "boolean" ? p.done : false,
      updatedAt,
    } as T;
  } catch {
    return null;
  }
}

export function saveRound(kind: RoundKind, data: Round, s?: RoundStore) {
  try {
    store(s)?.setItem(ROUND_KEYS[kind], JSON.stringify(data));
  } catch {
    // storage unavailable (private mode / quota) — the round just won't survive a remount
  }
}

export function clearRound(kind: RoundKind, s?: RoundStore) {
  try {
    store(s)?.removeItem(ROUND_KEYS[kind]);
  } catch {
    // ignore
  }
}
