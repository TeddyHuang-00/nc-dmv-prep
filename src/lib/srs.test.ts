import test from "node:test";
import assert from "node:assert/strict";
import { sampleWeighted, update, weight, type Question, type Stat } from "./srs.ts";

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

test("unseen question weighs base 6", () => {
  assert.equal(weight(q("a"), {}, NOW), 6);
  const zeroAttempts: Stat = { attempts: 0, errors: 3, lastSeen: NOW, intervalHours: 1 };
  assert.equal(weight(q("a"), { a: zeroAttempts }, NOW), 6);
});

test("seen question that is not overdue has weight 1 (plus errors)", () => {
  const s: Stat = { attempts: 1, errors: 0, lastSeen: NOW, intervalHours: 5 };
  assert.equal(weight(q("a"), { a: s }, NOW), 1);
});

test("errors multiply weight", () => {
  const s: Stat = { attempts: 1, errors: 2, lastSeen: NOW, intervalHours: 5 };
  assert.equal(weight(q("a"), { a: s }, NOW), 1 + 2.5 * 2);
});

test("overdue hours increase weight, capped at 12 hours overdue", () => {
  const overdue: Stat = { attempts: 1, errors: 0, lastSeen: NOW - 3 * 3.6e6, intervalHours: 1 };
  assert.equal(weight(q("a"), { a: overdue }, NOW), 3 ** 1.3); // overdue = 2h
  const veryOverdue: Stat = { attempts: 1, errors: 0, lastSeen: NOW - 100 * 3.6e6, intervalHours: 1 };
  assert.equal(weight(q("a"), { a: veryOverdue }, NOW), 13 ** 1.3); // clamped to 12h
  assert.ok(weight(q("a"), { a: overdue }, NOW) > weight(q("a"), { a: { ...overdue, lastSeen: NOW } }, NOW));
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
