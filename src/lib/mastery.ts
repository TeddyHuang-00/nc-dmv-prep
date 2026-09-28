// ponytail: pure, storage-free helpers — stats/questions/now in, numbers out, so tests need no DOM.
import { posteriorError, type Question, type Stat } from "./srs.ts";

const HOUR_MS = 3.6e6;

export type Mastery = {
  total: number;
  attempted: number;
  attempts: number;
  errors: number;
  coverage: number;
  /** Posterior accuracy, null until the first answer (shown as '—'). */
  accuracy: number | null;
  mastery: number;
  unseen: number;
  dueForReview: number;
};

/** Display names only; keys stay as they appear in questions.json. */
export const TOPIC_LABELS: Record<string, string> = {
  alcohol: "Alcohol and the law",
  dmv: "DMV services",
  emergencies: "Emergencies",
  license: "License",
  markings: "Pavement markings",
  parking: "Parking",
  rightofway: "Right of way",
  rules: "Driving rules",
  safety: "Safe driving",
  sharing: "Sharing the road",
  signals: "Signals",
  signs: "Signs",
  special: "Special situations",
  speed: "Speed",
};

export const topicLabel = (topic: string): string => TOPIC_LABELS[topic] ?? topic;

export function summarize(questions: Question[], stats: Record<string, Stat>, now: number): Mastery {
  const m: Mastery = {
    total: questions.length,
    attempted: 0,
    attempts: 0,
    errors: 0,
    coverage: 0,
    accuracy: null,
    mastery: 0,
    unseen: 0,
    dueForReview: 0,
  };
  for (const q of questions) {
    const st = stats[q.id];
    if (!st) {
      m.unseen++;
      continue;
    }
    if (st.attempts >= 1) m.attempted++;
    m.attempts += st.attempts;
    m.errors += st.errors;
    if ((now - st.lastSeen) / HOUR_MS > st.intervalHours) m.dueForReview++;
  }
  m.coverage = m.total > 0 ? m.attempted / m.total : 0;
  m.accuracy = m.attempts > 0 ? 1 - posteriorError(m.attempts, m.errors) : null;
  m.mastery = m.coverage * (m.accuracy ?? 0);
  return m;
}

export type TopicMastery = Mastery & { topic: string; label: string };

/** Every topic seen in the bank, weakest first; ties by display name. */
export function topicMastery(questions: Question[], stats: Record<string, Stat>, now: number): TopicMastery[] {
  return [...new Set(questions.map((q) => q.topic))]
    .map((topic) => ({
      topic,
      label: topicLabel(topic),
      ...summarize(
        questions.filter((q) => q.topic === topic),
        stats,
        now
      ),
    }))
    .sort((a, b) => a.mastery - b.mastery || a.label.localeCompare(b.label));
}

export function masteryBand(m: number): "green" | "amber" | "red" {
  return m >= 0.9 ? "green" : m >= 0.8 ? "amber" : "red";
}

/** The rounded integer percent actually shown, and the band for that value, so digit and color always agree. */
export function masteryDisplay(mastery: number): { percent: number; band: "green" | "amber" | "red" } {
  const percent = Math.round(mastery * 100);
  return { percent, band: masteryBand(percent / 100) };
}
