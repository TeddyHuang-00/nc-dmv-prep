export type Stat = {
  attempts: number;
  errors: number;
  lastSeen: number;
  intervalHours: number;
};

export type Question = {
  id: string;
  topic: string;
  chapter: string;
  page: number;
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
  image: string | null;
  imageAlt: string | null;
};

const HOUR_MS = 3.6e6;

/** Beta(1,1) posterior mean of the error probability. Unseen questions share the same prior, so they sit at 0.5. */
export function posteriorError(attempts: number, errors: number): number {
  return (1 + errors) / (2 + attempts);
}

/** Higher weight = more likely to be sampled. Unseen questions sit at the base weight 6 (12 × 0.5). */
export function weight(question: Question, stats: Record<string, Stat>, now: number): number {
  const stat = stats[question.id];
  const overdue = stat ? Math.max(0, (now - stat.lastSeen) / HOUR_MS - stat.intervalHours) : 0;
  return (1 + Math.min(overdue, 12)) ** 1.3 * (12 * posteriorError(stat?.attempts ?? 0, stat?.errors ?? 0));
}

export function update(stat: Stat | undefined, correct: boolean, now: number): Stat {
  const prev = stat ?? { attempts: 0, errors: 0, lastSeen: now, intervalHours: 0.2 };
  const next: Stat = {
    attempts: prev.attempts + 1,
    errors: prev.errors,
    lastSeen: now,
    intervalHours: prev.intervalHours,
  };
  if (correct) {
    next.intervalHours = Math.min(48, Math.max(0.2, (prev.intervalHours || 0.2) * 2.2));
    next.errors = Math.max(0, prev.errors - 0.5);
  } else {
    next.intervalHours = 0.2;
    next.errors = prev.errors + 1;
  }
  return next;
}

/** Weighted draw without replacement; caps at the number of questions available. */
export function sampleWeighted(
  questions: Question[],
  stats: Record<string, Stat>,
  count: number,
  now: number
): Question[] {
  const pool = questions.map((q) => ({ q, w: weight(q, stats, now) }));
  const out: Question[] = [];
  const n = Math.min(count, pool.length);
  for (let k = 0; k < n; k++) {
    const total = pool.reduce((sum, p) => sum + p.w, 0);
    let r = Math.random() * total;
    let idx = pool.length - 1;
    for (let j = 0; j < pool.length; j++) {
      r -= pool[j].w;
      if (r < 0) {
        idx = j;
        break;
      }
    }
    out.push(pool[idx].q);
    pool.splice(idx, 1);
  }
  return out;
}
