import test from "node:test";
import assert from "node:assert/strict";
import { posteriorError, sampleWeighted, update, weight, type Question, type Stat } from "./srs.ts";

const NOW = 1_700_000_000_000;

const q = (id: string): Question => ({
  id,
  topic: "signs",
  chapter: "Signs and Signals",
  page: 1,
  question: "?",
  choices: ["a", "b", "c"],
  answer: 0,
  explanation: "",
  image: null,
  imageAlt: null,
});

test("unseen question weighs base 24", () => {
  assert.equal(weight(q("a"), {}, NOW), 24);
  const fresh: Stat = { attempts: 0, errors: 0, lastSeen: NOW, intervalHours: 1 };
  assert.equal(weight(q("a"), { a: fresh }, NOW), 24);
});

test("posteriorError is the Beta(1,1) posterior mean of the error probability", () => {
  // (attempts, errors): 4/6 pins the remaining example value, from (attempts=4, errors=3).
  assert.equal(posteriorError(0, 0), 0.5);
  assert.equal(posteriorError(1, 0), 1 / 3);
  assert.equal(posteriorError(1, 1), 2 / 3);
  assert.equal(posteriorError(2, 0), 1 / 4);
  assert.equal(posteriorError(4, 3), 4 / 6);
  assert.equal(posteriorError(3, 1), 2 / 5);
});

test("weight is 12 × the posterior error probability when not overdue", () => {
  const s: Stat = { attempts: 4, errors: 1, lastSeen: NOW, intervalHours: 5 };
  assert.equal(weight(q("a"), { a: s }, NOW), 12 * (2 / 6));
});

test("weight grows with errors and shrinks as errors give way to correct answers", () => {
  const at = (attempts: number, errors: number): Stat => ({ attempts, errors, lastSeen: NOW, intervalHours: 5 });
  const w = (errors: number) => weight(q("a"), { a: at(5, errors) }, NOW);
  assert.ok(w(0) < w(1));
  assert.ok(w(1) < w(2));
  assert.ok(w(2) < w(3)); // same attempts: more errors = more weight, i.e. more correct = less weight
});

test("a never-seen question weighs more than a 5-correct one", () => {
  const fiveCorrect: Stat = { attempts: 5, errors: 0, lastSeen: NOW, intervalHours: 5 };
  assert.ok(weight(q("a"), {}, NOW) > weight(q("a"), { a: fiveCorrect }, NOW));
});

test("overdue hours increase weight, capped at 12 hours overdue", () => {
  const oneMiss: Stat = { attempts: 1, errors: 1, lastSeen: NOW - 3 * 3.6e6, intervalHours: 1 };
  assert.equal(weight(q("a"), { a: oneMiss }, NOW), 3 ** 1.3 * (12 * (2 / 3))); // overdue = 2h
  const veryOverdue: Stat = { ...oneMiss, lastSeen: NOW - 100 * 3.6e6 };
  const cap: Stat = { ...oneMiss, lastSeen: NOW - 13 * 3.6e6 };
  assert.equal(weight(q("a"), { a: veryOverdue }, NOW), weight(q("a"), { a: cap }, NOW)); // clamped to 12h
  assert.ok(weight(q("a"), { a: oneMiss }, NOW) > weight(q("a"), { a: { ...oneMiss, lastSeen: NOW } }, NOW));
});

test("wrong answer resets interval to 0.2 and increments errors", () => {
  const s: Stat = { attempts: 1, errors: 0, lastSeen: 0, intervalHours: 10 };
  assert.deepEqual(update(s, false, NOW), { attempts: 2, errors: 1, lastSeen: NOW, intervalHours: 0.2 });
});

test("correct answer doubles interval and decays errors by 0.5 (floor 0)", () => {
  const s: Stat = { attempts: 1, errors: 2, lastSeen: 0, intervalHours: 1 };
  assert.deepEqual(update(s, true, NOW), { attempts: 2, errors: 1.5, lastSeen: NOW, intervalHours: 2.2 });
  const clean: Stat = { attempts: 1, errors: 0, lastSeen: 0, intervalHours: 0.25 };
  assert.equal(update(clean, true, NOW).errors, 0);
  assert.equal(update(undefined, true, NOW).intervalHours, 0.2 * 2.2); // default 0.2 for a fresh stat
});

test("interval caps at 48 hours", () => {
  const s: Stat = { attempts: 1, errors: 0, lastSeen: 0, intervalHours: 40 };
  assert.equal(update(s, true, NOW).intervalHours, 48);
});

test("sampleWeighted returns count distinct questions, never more than exist", () => {
  const qs = Array.from({ length: 30 }, (_, i) => q(`q${i}`));
  const out = sampleWeighted(qs, {}, 20, NOW);
  assert.equal(out.length, 20);
  assert.equal(new Set(out.map((x) => x.id)).size, 20);
  assert.equal(sampleWeighted(qs.slice(0, 5), {}, 20, NOW).length, 5);
});

test("a question only ever answered correctly weighs exactly 0.5 / attempts", () => {
  // The refresher branch, pinned by value: deleting the branch (or `errors <= 0` -> `< 0`) falls
  // through to the overdue formula, and both 0.5 × attempts and a 0.4 numerator move these numbers.
  const refresher = (attempts: number): Stat => ({ attempts, errors: 0, lastSeen: NOW, intervalHours: 1 });
  assert.equal(weight(q("a"), { a: refresher(5) }, NOW), 0.5 / 5);
  assert.equal(weight(q("a"), { a: refresher(2) }, NOW), 0.5 / 2);
});

test("overdue clamps at exactly 12 hours: the capped weight is 13^1.3 × 12 × posterior", () => {
  // 13h since last seen with a 1h interval is 12h overdue, at the cap; 100h overdue clamps to the
  // same value, so both must equal (1 + 12)^1.3 × (12 × 2/3), not e.g. (1 + 6)^1.3 × (12 × 2/3).
  const oneMiss: Stat = { attempts: 1, errors: 1, lastSeen: NOW - 13 * 3.6e6, intervalHours: 1 };
  assert.equal(weight(q("a"), { a: oneMiss }, NOW), 13 ** 1.3 * (12 * (2 / 3)));
  const farPast: Stat = { ...oneMiss, lastSeen: NOW - 100 * 3.6e6 };
  assert.equal(weight(q("a"), { a: farPast }, NOW), 13 ** 1.3 * (12 * (2 / 3)));
});
