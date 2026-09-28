"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import questions from "@/data/questions.json";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeRoundLink } from "@/components/resume-round-link";
import { masteryDisplay, summarize, topicMastery } from "@/lib/mastery";
import { clearRound } from "@/lib/round";
import { STATS_KEY, loadStats } from "@/lib/stats";
import type { Question, Stat } from "@/lib/srs";

const ALL = questions.questions as Question[];

const BAND_BAR = { green: "bg-green-600", amber: "bg-amber-500", red: "bg-red-600" } as const;
const BAND_TEXT = { green: "text-green-600", amber: "text-amber-500", red: "text-red-600" } as const;
const pct = (x: number) => `${(x * 100).toFixed(1)}%`;

export default function DashboardPage() {
  const [stats, setStats] = useState<Record<string, Stat> | null>(null);

  useEffect(() => setStats(loadStats()), []);

  const s = stats ?? {};
  const overall = summarize(ALL, s, Date.now());
  const topics = topicMastery(ALL, s, Date.now());
  const overallDisplay = masteryDisplay(overall.mastery);

  const reset = () => {
    if (!window.confirm("Reset all practice progress?")) return;
    localStorage.removeItem(STATS_KEY);
    clearRound("practice");
    clearRound("exam");
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

      <Card>
        <CardHeader>
          <CardTitle>Overall</CardTitle>
          <CardDescription>Coverage × posterior accuracy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className={`text-3xl font-semibold tabular-nums ${BAND_TEXT[overallDisplay.band]}`}>
            {overallDisplay.percent}%
          </p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className={`h-full ${BAND_BAR[overallDisplay.band]}`} style={{ width: pct(overall.mastery) }} />
          </div>
          <p className="text-sm text-muted-foreground">
            Coverage {overall.attempted}/{overall.total} · Accuracy{" "}
            {overall.accuracy === null ? "—" : `${Math.round(overall.accuracy * 100)}%`} · Unseen {overall.unseen} · Due
            for review {overall.dueForReview}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Topic mastery</CardTitle>
          <CardDescription>Weakest first</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {topics.map((t) => {
            const d = masteryDisplay(t.mastery);
            return (
              <div key={t.topic} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{t.label}</span>
                  <span className="tabular-nums">{d.percent}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className={`h-full ${BAND_BAR[d.band]}`} style={{ width: pct(t.mastery) }} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {t.accuracy === null
                    ? "not started"
                    : `coverage ${t.attempted}/${t.total} · accuracy ${Math.round(t.accuracy * 100)}%`}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link href="/practice" onClick={() => clearRound("practice")} className={buttonVariants()}>
          Start Practice
        </Link>
        <Link href="/exam" onClick={() => clearRound("exam")} className={buttonVariants({ variant: "secondary" })}>
          Start Exam
        </Link>
        <ResumeRoundLink />
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
