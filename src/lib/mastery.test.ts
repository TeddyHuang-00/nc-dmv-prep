import test from "node:test";
import assert from "node:assert/strict";
import { masteryBand, masteryDisplay, summarize, topicLabel, topicMastery } from "./mastery.ts";
import type { Question, Stat } from "./srs.ts";

const NOW = 1_700_000_000_000;
const HOUR = 3.6e6;

const q = (id: string, topic: string): Question => ({
  id,
  topic,
  chapter: "",
  page: 1,
  question: "?",
  choices: ["a"],
  answer: 0,
  explanation: "",
  image: null,
  imageAlt: null,
});

const stat = (attempts: number, errors: number, lastSeen = NOW, intervalHours = 5): Stat => ({
  attempts,
  errors,
  lastSeen,
  intervalHours,
});

test("coverage × posterior accuracy; an untouched bank is mastery 0 and accuracy null", () => {
  const qs = [q("a", "signs"), q("b", "signs"), q("c", "signs"), q("d", "signs")];
  const m = summarize(qs, { a: stat(10, 0), b: stat(10, 1) }, NOW);
  assert.equal(m.total, 4);
  assert.equal(m.attempted, 2);
  assert.equal(m.attempts, 20);
  assert.equal(m.errors, 1);
  assert.equal(m.coverage, 0.5);
  assert.equal(m.accuracy, 1 - 2 / 22);
  assert.equal(m.mastery, 0.5 * (1 - 2 / 22));
  assert.equal(m.unseen, 2);

  const empty = summarize(qs, {}, NOW);
  assert.equal(empty.coverage, 0);
  assert.equal(empty.accuracy, null);
  assert.equal(empty.mastery, 0);
  assert.equal(empty.unseen, 4);
  assert.equal(empty.dueForReview, 0);
});

test("unseen and due-for-review counts", () => {
  const qs = [q("a", "signs"), q("b", "signs"), q("c", "signs"), q("d", "signs")];
  const stats = {
    b: stat(1, 0, NOW - 4 * HOUR, 5), // inside its interval
    c: stat(1, 0, NOW - 6 * HOUR, 5), // past its interval
    d: stat(1, 0, NOW - 5 * HOUR, 5), // exactly at the interval: not due (strict >)
  };
  const m = summarize(qs, stats, NOW);
  assert.equal(m.unseen, 1); // a has no stats entry
  assert.equal(m.dueForReview, 1); // c
  assert.equal(m.attempted, 3);
});

test("masteryBand bands the exact value: 0.90 green, 0.80 amber, below red", () => {
  assert.equal(masteryBand(1), "green");
  assert.equal(masteryBand(0.9), "green");
  assert.equal(masteryBand(0.899), "amber");
  assert.equal(masteryBand(0.8), "amber");
  assert.equal(masteryBand(0.799), "red");
  assert.equal(masteryBand(0), "red");
});

test("masteryDisplay bands the rounded percent, so digit and color always agree", () => {
  assert.deepEqual(masteryDisplay(0.899), { percent: 90, band: "green" }); // 89.9 -> 90 shows green, not amber
  assert.deepEqual(masteryDisplay(0.8949), { percent: 89, band: "amber" });
  assert.deepEqual(masteryDisplay(0.9), { percent: 90, band: "green" });
  assert.deepEqual(masteryDisplay(0.799), { percent: 80, band: "amber" }); // 79.9 -> 80 shows amber, not red
  assert.deepEqual(masteryDisplay(0.7949), { percent: 79, band: "red" });
  assert.deepEqual(masteryDisplay(0), { percent: 0, band: "red" });
});

test("topicMastery lists every topic weakest first, with display labels", () => {
  const qs = [q("s1", "signs"), q("s2", "signs"), q("d1", "dmv"), q("r1", "rightofway"), q("r2", "rightofway")];
  const rows = topicMastery(qs, { s1: stat(10, 0), s2: stat(10, 0), d1: stat(3, 1) }, NOW);
  assert.deepEqual(
    rows.map((r) => r.topic),
    ["rightofway", "dmv", "signs"]
  );
  assert.deepEqual(
    rows.map((r) => r.label),
    ["Right of way", "DMV services", "Signs"]
  );
  assert.equal(rows[0].mastery, 0);
  assert.equal(rows[0].unseen, 2);
  assert.equal(rows[1].mastery, 1 - 2 / 5);
  assert.equal(rows[2].mastery, 1 - 1 / 22);
});

test("equal mastery ties fall back to the display name", () => {
  const rows = topicMastery([q("s1", "signs"), q("d1", "dmv")], {}, NOW);
  assert.deepEqual(
    rows.map((r) => r.topic),
    ["dmv", "signs"] // both 0: 'DMV services' < 'Signs'
  );
  assert.equal(topicLabel("mystery"), "mystery");
});
