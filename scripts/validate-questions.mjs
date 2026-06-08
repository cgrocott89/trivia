import { QUESTION_BANK } from "../src/questions.js";
import { DIFFICULTY_LEVELS, QUIZ_MODES } from "../src/quiz.js";

const EXPECTED_CATEGORIES = ["sport", "music", "culture", "general"];
const EXPECTED_PER_CATEGORY = 5000;
const EXPECTED_DIFFICULTY_COUNTS = {
  easy: 500,
  normal: 2250,
  hard: 2250
};

const errors = [];
const ids = new Set();
const questionTexts = new Set();
const counts = Object.fromEntries(EXPECTED_CATEGORIES.map((category) => [category, 0]));
const difficultyIds = new Set(DIFFICULTY_LEVELS.map((difficulty) => difficulty.id));
const difficultyCounts = Object.fromEntries(
  EXPECTED_CATEGORIES.map((category) => [
    category,
    Object.fromEntries(DIFFICULTY_LEVELS.map((difficulty) => [difficulty.id, 0]))
  ])
);

QUESTION_BANK.forEach((question, index) => {
  const label = question.id || `index ${index}`;

  if (!question.id) errors.push(`Question at index ${index} is missing id.`);
  if (ids.has(question.id)) errors.push(`Duplicate id: ${question.id}`);
  ids.add(question.id);
  if (questionTexts.has(question.question)) errors.push(`Duplicate question text: ${question.question}`);
  questionTexts.add(question.question);

  if (!EXPECTED_CATEGORIES.includes(question.category)) {
    errors.push(`${label} has invalid category: ${question.category}`);
  } else {
    counts[question.category] += 1;
    if (difficultyIds.has(question.difficulty)) {
      difficultyCounts[question.category][question.difficulty] += 1;
    }
  }

  if (!difficultyIds.has(question.difficulty)) {
    errors.push(`${label} has invalid difficulty: ${question.difficulty}`);
  }

  if (!question.question || typeof question.question !== "string") {
    errors.push(`${label} is missing question text.`);
  }

  if (containsText(question.question, question.answer)) {
    errors.push(`${label} includes the answer in the question text.`);
  }

  if (!Array.isArray(question.options) || question.options.length !== 4) {
    errors.push(`${label} must have exactly 4 options.`);
  } else {
    const optionSet = new Set(question.options);
    if (optionSet.size !== 4) errors.push(`${label} has duplicate options.`);
    if (!optionSet.has(question.answer)) errors.push(`${label} answer is not present in options.`);
    for (const option of question.options) {
      if (option !== question.answer && optionConflicts(option, question.answer)) {
        errors.push(`${label} has a wrong option that contains or is contained by the answer: ${option}`);
      }
    }
  }

  if (question.category === "sport" && question.difficulty === "hard" && question.sportScopedOptions !== true) {
    errors.push(`${label} is a hard sport question without same-sport answer options.`);
  }
});

for (const category of EXPECTED_CATEGORIES) {
  if (counts[category] !== EXPECTED_PER_CATEGORY) {
    errors.push(`${category} has ${counts[category]} questions; expected ${EXPECTED_PER_CATEGORY}.`);
  }
  for (const [difficulty, expected] of Object.entries(EXPECTED_DIFFICULTY_COUNTS)) {
    const actual = difficultyCounts[category][difficulty];
    if (actual !== expected) {
      errors.push(`${category}/${difficulty} has ${actual} questions; expected ${expected}.`);
    }
  }
}

for (const mode of QUIZ_MODES) {
  for (const difficulty of DIFFICULTY_LEVELS) {
    for (const [category, needed] of Object.entries(mode.composition)) {
      const available = difficultyCounts[category]?.[difficulty.id] || 0;
      if (available < needed) {
        errors.push(`${mode.id} mode at ${difficulty.id} needs ${needed} ${category} questions, but only ${available} exist.`);
      }
    }
  }
}

if (QUESTION_BANK.length !== EXPECTED_CATEGORIES.length * EXPECTED_PER_CATEGORY) {
  errors.push(`Question bank has ${QUESTION_BANK.length} questions; expected ${EXPECTED_CATEGORIES.length * EXPECTED_PER_CATEGORY}.`);
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Question bank valid.");
console.log(JSON.stringify(counts, null, 2));
console.log(JSON.stringify(difficultyCounts, null, 2));

function containsText(value, term) {
  const needle = normalizeText(term);
  if (needle.length < 2) return false;
  return normalizeText(value).includes(needle);
}

function optionConflicts(option, answer) {
  return containsText(option, answer) || containsText(answer, option);
}

function normalizeText(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
