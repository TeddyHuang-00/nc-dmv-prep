"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import questions from "@/data/questions.json";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EXAM_SIZE, examPassMark } from "@/lib/config";
import { loadRound, saveRound, type ExamRound } from "@/lib/round";
import type { Question } from "@/lib/srs";
import { loadStats, record, saveStats } from "@/lib/stats";

const ALL = questions.questions as Question[];
const BY_ID = new Map(ALL.map((q) => [q.id, q]));
const LETTERS = "ABCD";

function sampleUniform(items: Question[], count: number): Question[] {
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

export default function ExamPage() {
  const [queue, setQueue] = useState<Question[]>();
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const start = () => {
    const ids = sampleUniform(ALL, Math.min(EXAM_SIZE, ALL.length)).map((x) => x.id);
    saveRound("exam", { ids, i: 0, answers: {}, submitted: false, updatedAt: Date.now() });
    setQueue(ids.map((id) => BY_ID.get(id)!));
    setI(0);
    setAnswers([]);
    setSubmitted(false);
  };

  // Resume an in-flight exam after a remount (nav, back, reload) — including the result view.
  useEffect(() => {
    const saved = loadRound<ExamRound>("exam");
    const ids = saved?.ids.filter((id) => BY_ID.has(id)) ?? [];
    if (ids.length === 0) {
      start();
      return;
    }
    const restored: number[] = [];
    for (const [idx, choice] of Object.entries(saved?.answers ?? {})) restored[Number(idx)] = choice;
    // Rehydrate only: submitting already recorded stats, and a reload must not re-record them.
    setQueue(ids.map((id) => BY_ID.get(id)!));
    setI(Math.min(Math.max(0, saved?.i ?? 0), ids.length - 1));
    setAnswers(restored);
    setSubmitted(Boolean(saved?.submitted));
  }, []);

  // Mirror every exam change to sessionStorage so a remount lands on the same state.
  useEffect(() => {
    if (!queue) return;
    const sparse: Record<number, number> = {};
    answers.forEach((choice, idx) => {
      if (choice !== undefined) sparse[idx] = choice;
    });
    saveRound("exam", { ids: queue.map((x) => x.id), i, answers: sparse, submitted, updatedAt: Date.now() });
  }, [queue, i, answers, submitted]);

  const q = queue?.[i];
  const score = queue && submitted ? queue.filter((item, idx) => answers[idx] === item.answer).length : 0;

  const pick = (idx: number) =>
    setAnswers((prev) => {
      const next = [...prev];
      next[i] = idx;
      return next;
    });

  const submit = () => {
    if (!queue) return;
    const now = Date.now();
    let stats = loadStats();
    for (const [idx, item] of queue.entries()) {
      stats = record(stats, item.id, answers[idx] === item.answer, now);
    }
    saveStats(stats);
    setSubmitted(true);
  };

  if (!queue) {
    return <main className="mx-auto max-w-2xl p-6 text-sm text-muted-foreground">Loading exam…</main>;
  }

  const total = queue.length;

  if (total === 0) {
    return <main className="mx-auto max-w-2xl p-6 text-sm text-muted-foreground">No questions in src/data/questions.json.</main>;
  }

  if (submitted) {
    const needed = examPassMark(total);
    const passed = score >= needed;
    const missed = queue
      .map((item, idx) => ({ item, given: answers[idx] }))
      .filter(({ item, given }) => given !== item.answer);
    return (
      <main className="mx-auto max-w-2xl space-y-6 p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Exam result</CardTitle>
              <Badge variant={passed ? "default" : "destructive"}>{passed ? "PASS" : "FAIL"}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              Score:{" "}
              <span className="font-semibold tabular-nums">
                {score} / {total}
              </span>{" "}
              — {needed} needed to pass
            </p>
            {missed.length === 0 ? (
              <p className="text-sm text-muted-foreground">No missed questions.</p>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium">Missed questions</p>
                {missed.map(({ item, given }) => (
                  <div key={item.id} className="space-y-1 rounded-md border p-3 text-sm">
                    <p className="font-medium">{item.question}</p>
                    <p className="text-destructive">Your answer: {item.choices?.[given] ?? "—"}</p>
                    <p className="text-emerald-700">
                      Correct: {LETTERS[item.answer] ?? item.answer + 1}. {item.choices?.[item.answer] ?? "—"}
                    </p>
                    <p className="text-muted-foreground">{item.explanation}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <Button onClick={start}>Retake exam</Button>
              <Link href="/" className={buttonVariants({ variant: "outline" })}>
                Dashboard
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!q) return null;
  const picked = answers[i];

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Question {i + 1} of {total}
          </span>
          <Badge variant="secondary">Exam</Badge>
        </div>
        <Progress value={((i + (picked !== undefined ? 1 : 0)) / total) * 100} />
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <p className="text-lg font-medium">{q.question}</p>
          {q.image && <img src={q.image} alt={q.imageAlt ?? ""} className="max-h-48" />}
          <div className="space-y-2">
            {(q.choices ?? []).map((choice, idx) => (
              <Button
                key={idx}
                variant={picked === idx ? "default" : "outline"}
                onClick={() => pick(idx)}
                className="h-auto w-full justify-start py-2 text-left whitespace-normal"
              >
                <span className="font-semibold">{LETTERS[idx] ?? idx + 1}.</span> {choice}
              </Button>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">No feedback during the exam — graded at the end.</p>
            <div className="flex gap-2">
              <Button variant="outline" disabled={i === 0} onClick={() => setI(i - 1)}>
                Back
              </Button>
              {i + 1 < total ? (
                <Button disabled={picked === undefined} onClick={() => setI(i + 1)}>
                  Next
                </Button>
              ) : (
                <Button disabled={picked === undefined} onClick={submit}>
                  Submit exam
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
