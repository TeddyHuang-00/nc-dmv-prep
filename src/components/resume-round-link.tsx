"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { loadRound, type ExamRound, type PracticeRound } from "@/lib/round";

type Candidate = { href: string; label: string; updatedAt: number };

/** Renders nothing until mounted (no SSR/hydration mismatch) and nothing when no round is in flight. */
export function ResumeRoundLink() {
  const [candidate, setCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    const practice = loadRound<PracticeRound>("practice");
    const exam = loadRound<ExamRound>("exam");
    const all: Candidate[] = [];
    if (practice)
      all.push({
        href: "/practice",
        label: `Resume practice (${practice.done ? "round complete" : `Q${practice.i + 1}/${practice.ids.length}`})`,
        updatedAt: practice.updatedAt,
      });
    if (exam)
      all.push({
        href: "/exam",
        label: `Resume exam (${exam.submitted ? "result" : `Q${exam.i + 1}/${exam.ids.length}`})`,
        updatedAt: exam.updatedAt,
      });
    all.sort((a, b) => b.updatedAt - a.updatedAt); // ponytail: newest round wins; two at once is rare
    setCandidate(all[0] ?? null);
  }, []);

  if (!candidate) return null;
  return (
    <Link href={candidate.href} className={buttonVariants({ variant: "outline" })}>
      {candidate.label}
    </Link>
  );
}
