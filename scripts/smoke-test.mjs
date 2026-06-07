import assert from "node:assert/strict";
import { QUESTION_BANK } from "../src/questions.js";
import { QUIZ_MODES, createQuiz, scoreQuiz } from "../src/quiz.js";

function categoryCounts(quiz) {
  return quiz.reduce((counts, question) => {
    counts[question.category] = (counts[question.category] || 0) + 1;
    return counts;
  }, {});
}

for (const mode of QUIZ_MODES) {
  const quiz = createQuiz(QUESTION_BANK, mode.id, seededRandom(100 + mode.id.length));
  assert.equal(quiz.length, 20, `${mode.id} should create 20 questions`);
  assert.deepEqual(categoryCounts(quiz), mode.composition, `${mode.id} composition should match`);

  const correctAnswers = Object.fromEntries(quiz.map((question) => [question.id, question.answer]));
  assert.equal(scoreQuiz(quiz, correctAnswers), 20, `${mode.id} should score perfect answers correctly`);

  const wrongAnswers = Object.fromEntries(quiz.map((question) => [question.id, firstWrongOption(question)]));
  assert.equal(scoreQuiz(quiz, wrongAnswers), 0, `${mode.id} should score wrong answers correctly`);
}

const firstMixed = createQuiz(QUESTION_BANK, "mixed", seededRandom(1)).map((question) => question.id).join(",");
const secondMixed = createQuiz(QUESTION_BANK, "mixed", seededRandom(2)).map((question) => question.id).join(",");
assert.notEqual(firstMixed, secondMixed, "Mixed quiz should vary with different random seeds");

console.log("Smoke tests passed.");

function firstWrongOption(question) {
  return question.options.find((option) => option !== question.answer);
}

function seededRandom(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}
