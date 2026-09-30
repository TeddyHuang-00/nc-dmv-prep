import test from "node:test";
import assert from "node:assert/strict";
import { shuffleChoiceOrder, withChoiceOrder } from "./choices.ts";
import type { Question } from "./srs.ts";

const q = (choices: string[], answer: number): Question => ({
  id: "a",
  topic: "signs",
  chapter: "",
  page: 1,
  question: "?",
  choices,
  answer,
  explanation: "",
  image: null,
  imageAlt: null,
});

const CHOICES = ["right turn only", "no U-turn", "lane ends", "keep right"];

test("shuffling keeps the correct answer attached to its original choice", () => {
  const original = q(CHOICES, 2);
  for (let i = 0; i < 200; i++) {
    const shuffled = withChoiceOrder(original, shuffleChoiceOrder(original.choices.length));
    assert.equal(shuffled.choices[shuffled.answer], original.choices[original.answer]);
  }
});

test("shuffling preserves the choice multiset", () => {
  const original = q(CHOICES, 1);
  for (let i = 0; i < 200; i++) {
    const shuffled = withChoiceOrder(original, shuffleChoiceOrder(original.choices.length));
    assert.deepEqual([...shuffled.choices].sort(), [...CHOICES].sort());
  }
});

test("applying a saved order moves each choice and the answer index with it", () => {
  // New position i shows original choice order[i], so the answer moves to order.indexOf(answer).
  const shuffled = withChoiceOrder(q(CHOICES, 2), [2, 0, 3, 1]);
  assert.deepEqual(shuffled.choices, [CHOICES[2], CHOICES[0], CHOICES[3], CHOICES[1]]);
  assert.equal(shuffled.answer, 0);
  assert.equal(shuffled.choices[shuffled.answer], CHOICES[2]);

  const identity = withChoiceOrder(q(CHOICES, 3), [0, 1, 2, 3]);
  assert.deepEqual(identity.choices, CHOICES);
  assert.equal(identity.answer, 3);
});

test("null/one-choice questions return unchanged", () => {
  const single = q(["only"], 0);
  assert.deepEqual(withChoiceOrder(single, shuffleChoiceOrder(1)), single);
  const noChoices = q(undefined as unknown as string[], 0);
  assert.deepEqual(withChoiceOrder(noChoices, []).choices, []);
});

test("an invalid order falls back to the original question", () => {
  const original = q(CHOICES, 2);
  for (const bad of [
    [0, 1, 2], // too short
    [0, 1, 2, 3, 4], // too long
    [0, 0, 2, 3], // duplicate index
    [0, 1, 2, 1.5], // non-integer
    [0, 1, 2, -1], // negative
    [0, 1, 2, 4], // out of range
    [0, 1, 2, NaN], // not a number
    [], // empty
  ]) {
    assert.deepEqual(withChoiceOrder(original, bad), original, `expected the original question for ${JSON.stringify(bad)}`);
  }
});
