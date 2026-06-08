import assert from "node:assert/strict";
import { QUESTION_BANK } from "../src/questions.js";
import { DIFFICULTY_LEVELS, QUIZ_MODES, createQuiz, scoreQuiz } from "../src/quiz.js";

function categoryCounts(quiz) {
  return quiz.reduce((counts, question) => {
    counts[question.category] = (counts[question.category] || 0) + 1;
    return counts;
  }, {});
}

for (const mode of QUIZ_MODES) {
  for (const difficulty of DIFFICULTY_LEVELS) {
    const quiz = createQuiz(QUESTION_BANK, mode.id, difficulty.id, seededRandom(100 + mode.id.length + difficulty.id.length));
    assert.equal(quiz.length, 20, `${mode.id}/${difficulty.id} should create 20 questions`);
    assert.deepEqual(categoryCounts(quiz), mode.composition, `${mode.id}/${difficulty.id} composition should match`);
    assert.equal(new Set(quiz.map((question) => question.difficulty)).size, 1, `${mode.id}/${difficulty.id} should use one difficulty`);
    assert.equal(quiz[0].difficulty, difficulty.id, `${mode.id}/${difficulty.id} should use requested difficulty`);
    assertNoRepeatedSubjects(quiz, `${mode.id}/${difficulty.id}`);
    assertNoRepeatedSemanticKeys(quiz, `${mode.id}/${difficulty.id}`);
    if (mode.id === "sport") assertSportContextCaps(quiz, `${mode.id}/${difficulty.id}`);

    const correctAnswers = Object.fromEntries(quiz.map((question) => [question.id, question.answer]));
    assert.equal(scoreQuiz(quiz, correctAnswers), 20, `${mode.id}/${difficulty.id} should score perfect answers correctly`);

    const wrongAnswers = Object.fromEntries(quiz.map((question) => [question.id, firstWrongOption(question)]));
    assert.equal(scoreQuiz(quiz, wrongAnswers), 0, `${mode.id}/${difficulty.id} should score wrong answers correctly`);
  }
}

const firstMixed = createQuiz(QUESTION_BANK, "mixed", "normal", seededRandom(1)).map((question) => question.id).join(",");
const secondMixed = createQuiz(QUESTION_BANK, "mixed", "normal", seededRandom(2)).map((question) => question.id).join(",");
assert.notEqual(firstMixed, secondMixed, "Mixed quiz should vary with different random seeds");

for (const difficulty of DIFFICULTY_LEVELS) {
  for (let seed = 1; seed <= 50; seed += 1) {
    const quiz = createQuiz(QUESTION_BANK, "sport", difficulty.id, seededRandom(seed));
    assertNoRepeatedSubjects(quiz, `sport/${difficulty.id}/seed-${seed}`);
    assertNoRepeatedSemanticKeys(quiz, `sport/${difficulty.id}/seed-${seed}`);
    assertSportContextCaps(quiz, `sport/${difficulty.id}/seed-${seed}`);
  }
}

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

function assertNoRepeatedSubjects(quiz, label) {
  const subjects = quiz.map((question) => question.subject).filter(Boolean);
  assert.equal(new Set(subjects).size, subjects.length, `${label} should not repeat the same subject`);
}

function assertNoRepeatedSemanticKeys(quiz, label) {
  const keys = quiz.map((question) => question.semanticKey).filter(Boolean);
  assert.equal(new Set(keys).size, keys.length, `${label} should not repeat the same semantic question`);
}

function assertSportContextCaps(quiz, label) {
  const counts = quiz.reduce((acc, question) => {
    const context = question.sportContext || "other";
    acc[context] = (acc[context] || 0) + 1;
    return acc;
  }, {});

  assert.ok((counts.netball || 0) <= 1, `${label} should not include more than one netball question`);
  assert.ok((counts["NBL basketball"] || 0) <= 2, `${label} should not include more than two NBL questions`);
  assert.ok((counts["Big Bash cricket"] || 0) <= 2, `${label} should not include more than two Big Bash questions`);
}
