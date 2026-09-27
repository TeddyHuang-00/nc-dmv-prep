import { update, type Stat } from "@/lib/srs";

export const STATS_KEY = "ncdmv-stats-v1";

export function loadStats(): Record<string, Stat> {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(localStorage.getItem(STATS_KEY) ?? "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveStats(stats: Record<string, Stat>) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

/** Pure: returns new stats with one answer applied. Caller saves. */
export function record(
  stats: Record<string, Stat>,
  id: string,
  correct: boolean,
  now: number
): Record<string, Stat> {
  return { ...stats, [id]: update(stats[id], correct, now) };
}
