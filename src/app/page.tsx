"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import questions from "@/data/questions.json";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { STATS_KEY, loadStats } from "@/lib/stats";
import type { Question, Stat } from "@/lib/srs";

const ALL = questions.questions as Question[];

export default function DashboardPage() {
  const [stats, setStats] = useState<Record<string, Stat> | null>(null);

  useEffect(() => setStats(loadStats()), []);

  const s = stats ?? {};
  const attempted = ALL.filter((q) => (s[q.id]?.attempts ?? 0) > 0).length;
  const attempts = ALL.reduce((n, q) => n + (s[q.id]?.attempts ?? 0), 0);
  const errors = ALL.reduce((n, q) => n + (s[q.id]?.errors ?? 0), 0);
  // ponytail: errors decays by 0.5 per correct answer, so this is an estimate, not a raw score.
  const accuracy = attempts > 0 ? Math.max(0, (attempts - errors) / attempts) : null;

  const topics = new Map<string, { attempts: number; errors: number }>();
  for (const q of ALL) {
    const st = s[q.id];
    if (!st?.attempts) continue;
    const t = topics.get(q.topic) ?? { attempts: 0, errors: 0 };
    t.attempts += st.attempts;
    t.errors += st.errors;
    topics.set(q.topic, t);
  }
  const weak = [...topics.entries()]
    .filter(([, t]) => t.attempts >= 5)
    .map(([topic, t]) => ({ topic, accuracy: Math.max(0, (t.attempts - t.errors) / t.attempts) }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  const reset = () => {
    if (!window.confirm("Reset all practice progress?")) return;
    localStorage.removeItem(STATS_KEY);
    setStats({});
  };

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">NC DMV Permit Prep</h1>
        <p className="text-sm text-muted-foreground">
          {ALL.length} questions loaded · learner-permit practice
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Coverage</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {attempted} / {ALL.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Overall accuracy</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {accuracy === null ? "—" : `${Math.round(accuracy * 100)}%`}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weak topics</CardTitle>
          <CardDescription>Lowest accuracy, minimum 5 attempts</CardDescription>
        </CardHeader>
        <CardContent>
          {weak.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Not enough data yet — answer a few questions on a topic.
            </p>
          ) : (
            <ul className="space-y-2">
              {weak.map((w) => (
                <li key={w.topic} className="flex items-center justify-between">
                  <Badge variant="secondary">{w.topic}</Badge>
                  <span className="text-sm tabular-nums">{Math.round(w.accuracy * 100)}%</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link href="/practice" className={buttonVariants()}>
          Start Practice
        </Link>
        <Link href="/exam" className={buttonVariants({ variant: "secondary" })}>
          Start Exam
        </Link>
        <Link href="/handbook" className={buttonVariants({ variant: "outline" })}>
          Handbook
        </Link>
        <button type="button" onClick={reset} className={buttonVariants({ variant: "outline" })}>
          Reset progress
        </button>
      </div>
    </main>
  );
}
