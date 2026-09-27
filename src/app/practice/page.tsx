"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import handbook from "@/data/handbook.json";
import questions from "@/data/questions.json";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PRACTICE_ROUND } from "@/lib/config";
import { loadRound, saveRound, type PracticeRound } from "@/lib/round";
import { sampleWeighted, type Question } from "@/lib/srs";
import { loadStats, record, saveStats } from "@/lib/stats";

const ALL = questions.questions as Question[];
const BY_ID = new Map(ALL.map((q) => [q.id, q]));
const CHAPTERS = handbook as { slug: string; title: string }[];
const LETTERS = "ABCD";

function handbookHref(q: Question): string | null {
  if (typeof q.chapter !== "string") return null;
  const chapter = CHAPTERS.find((c) => c.title.toLowerCase() === q.chapter.toLowerCase());
  return chapter ? `/handbook/${chapter.slug}#p${q.page}` : null;
}

export default function PracticePage() {
  const [queue, setQueue] = useState<Question[]>();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState<{ q: Question; picked: number }[]>([]);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const start = () => {
    const ids = sampleWeighted(ALL, loadStats(), Math.min(PRACTICE_ROUND, ALL.length), Date.now()).map((x) => x.id);
    saveRound("practice", { ids, i: 0, picked: null, wrongIds: [], score: 0, done: false, updatedAt: Date.now() });
    setQueue(ids.map((id) => BY_ID.get(id)!));
    setI(0);
    setPicked(null);
    setWrong([]);
    setScore(0);
    setDone(false);
  };

  // Resume an in-flight round after a remount (handbook link, back, reload); otherwise start one.
  useEffect(() => {
    const saved = loadRound<PracticeRound>("practice");
    const ids = saved?.ids.filter((id) => BY_ID.has(id)) ?? [];
    if (ids.length === 0) {
      start();
      return;
    }
    // Rehydrate only: stats were already recorded when each answer was clicked.
    setQueue(ids.map((id) => BY_ID.get(id)!));
    setI(Math.min(Math.max(0, saved?.i ?? 0), ids.length - 1));
    setPicked(saved?.picked ?? null);
    setWrong(saved?.wrongIds.flatMap(([id, picked]) => (BY_ID.has(id) ? [{ q: BY_ID.get(id)!, picked }] : [])) ?? []);
    setScore(saved?.score ?? 0);
    setDone(Boolean(saved?.done));
  }, []);

  // Mirror every round change to sessionStorage so a remount lands on the same state.
  useEffect(() => {
    if (!queue) return;
    saveRound("practice", {
      ids: queue.map((x) => x.id),
      i,
      picked,
      wrongIds: wrong.map(({ q, picked }) => [q.id, picked] as [string, number]),
      score,
      done,
      updatedAt: Date.now(),
    });
  }, [queue, i, picked, wrong, score, done]);

  const q = queue?.[i];

  const answer = (idx: number) => {
    if (!q || picked !== null) return;
    const correct = idx === q.answer;
    saveStats(record(loadStats(), q.id, correct, Date.now()));
    setPicked(idx);
    if (correct) setScore((n) => n + 1);
    else setWrong((w) => [...w, { q, picked: idx }]);
  };

  const next = () => {
    if (!queue) return;
    if (i + 1 >= queue.length) setDone(true);
    else {
      setI(i + 1);
      setPicked(null);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!q || done) return;
      if (picked === null) {
        const key = e.key.toLowerCase();
        const idx = /^[1-9]$/.test(key) ? Number(key) - 1 : LETTERS.toLowerCase().indexOf(key);
        if (idx >= 0 && idx < (q.choices ?? []).length) {
          e.preventDefault();
          answer(idx);
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!queue) {
    return <main className="mx-auto max-w-2xl p-6 text-sm text-muted-foreground">Loading round…</main>;
  }

  const total = queue.length;

  if (total === 0) {
    return <main className="mx-auto max-w-2xl p-6 text-sm text-muted-foreground">No questions in src/data/questions.json.</main>;
  }

  if (done) {
    return (
      <main className="mx-auto max-w-2xl space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Round complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              Score: <span className="font-semibold tabular-nums">{score} / {total}</span>
            </p>
            {wrong.length === 0 ? (
              <p className="text-sm text-muted-foreground">No mistakes this round.</p>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium">Missed questions</p>
                {wrong.map(({ q, picked }) => (
                  <div key={q.id} className="space-y-1 rounded-md border p-3 text-sm">
                    <p className="font-medium">{q.question}</p>
                    <p className="text-destructive">Your answer: {q.choices?.[picked] ?? "—"}</p>
                    <p className="text-emerald-700">
                      Correct: {LETTERS[q.answer] ?? q.answer + 1}. {q.choices?.[q.answer] ?? "—"}
                    </p>
                    <p className="text-muted-foreground">{q.explanation}</p>
                    <p className="text-muted-foreground">
                      Handbook p.{q.page}
                      {handbookHref(q) && (
                        <>
                          {" · "}
                          <Link className="underline underline-offset-4" href={handbookHref(q)!}>
                            Read {q.chapter}
                          </Link>
                        </>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <Button onClick={start}>Next round</Button>
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
  const feedback = picked !== null;
  const correct = picked === q.answer;

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Question {i + 1} of {total}
          </span>
          <Badge variant="secondary">{q.topic}</Badge>
        </div>
        <Progress value={((i + (feedback ? 1 : 0)) / total) * 100} />
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <p className="text-lg font-medium">{q.question}</p>
          {q.image && <img src={q.image} alt={q.imageAlt ?? ""} className="max-h-48" />}
          <div className="space-y-2">
            {(q.choices ?? []).map((choice, idx) => {
              let variant: "outline" | "default" | "destructive" = "outline";
              if (feedback) {
                if (idx === q.answer) variant = "default";
                else if (idx === picked) variant = "destructive";
              }
              return (
                <Button
                  key={idx}
                  variant={variant}
                  disabled={feedback}
                  onClick={() => answer(idx)}
                  className="h-auto w-full justify-start py-2 text-left whitespace-normal"
                >
                  <span className="font-semibold">{LETTERS[idx] ?? idx + 1}.</span> {choice}
                </Button>
              );
            })}
          </div>

          {feedback && (
            <Alert variant={correct ? "default" : "destructive"}>
              <AlertTitle>
                {correct ? "Correct" : `Incorrect — correct answer: ${LETTERS[q.answer] ?? q.answer + 1}`}
              </AlertTitle>
              <AlertDescription>
                <p>{q.explanation}</p>
                <p>
                  Handbook p.{q.page}
                  {handbookHref(q) && (
                    <>
                      {" · "}
                      <Link className="underline underline-offset-4" href={handbookHref(q)!}>
                        Read {q.chapter}
                      </Link>
                    </>
                  )}
                </p>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">Keys: 1-4 / A-D answer · Enter next</p>
            <Button onClick={next} disabled={!feedback}>
              {i + 1 >= total ? "Finish round" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
