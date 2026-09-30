import type { Question } from "./srs";

/** Return a shuffled original-index order for a question's answer choices. */
export function shuffleChoiceOrder(length: number): number[] {
  const order = Array.from({ length }, (_, index) => index);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/** Apply a saved choice order and move the answer index with its original choice. */
export function withChoiceOrder(question: Question, order: number[]): Question {
  const choices = question.choices ?? [];
  const isPermutation = order.length === choices.length && new Set(order).size === choices.length &&
    order.every((index) => Number.isInteger(index) && index >= 0 && index < choices.length);
  const safeOrder = isPermutation ? order : choices.map((_, index) => index);
  return {
    ...question,
    choices: safeOrder.map((index) => choices[index]),
    answer: safeOrder.indexOf(question.answer),
  };
}
