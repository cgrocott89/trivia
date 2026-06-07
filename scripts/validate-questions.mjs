import { QUESTION_BANK } from "../src/questions.js";
import { QUIZ_MODES } from "../src/quiz.js";

const EXPECTED_CATEGORIES = ["sport", "music", "culture", "general"];
const EXPECTED_PER_CATEGORY = 50;

const errors = [];
const ids = new Set();
const counts = Object.fromEntries(EXPECTED_CATEGORIES.map((category) => [category, 0]));

QUESTION_BANK.forEach((question, index) => {
  const label = question.id || `index ${index}`;

  if (!question.id) errors.push(`Question at index ${index} is missing id.`);
  if (ids.has(question.id)) errors.push(`Duplicate id: ${question.id}`);
  ids.add(question.id);

  if (!EXPECTED_CATEGORIES.includes(question.category)) {
    errors.push(`${label} has invalid category: ${question.category}`);
  } else {
    counts[question.category] += 1;
  }

  if (!question.question || typeof question.question !== "string") {
    errors.push(`${label} is missing question text.`);
  }

  if (!Array.isArray(question.options) || question.options.length !== 4) {
    errors.push(`${label} must have exactly 4 options.`);
  } else {
    const optionSet = new Set(question.options);
    if (optionSet.size !== 4) errors.push(`${label} has duplicate options.`);
    if (!optionSet.has(question.answer)) errors.push(`${label} answer is not present in options.`);
  }
});

for (const category of EXPECTED_CATEGORIES) {
  if (counts[category] !== EXPECTED_PER_CATEGORY) {
    errors.push(`${category} has ${counts[category]} questions; expected ${EXPECTED_PER_CATEGORY}.`);
  }
}

for (const mode of QUIZ_MODES) {
  for (const [category, needed] of Object.entries(mode.composition)) {
    if ((counts[category] || 0) < needed) {
      errors.push(`${mode.id} mode needs ${needed} ${category} questions, but only ${counts[category] || 0} exist.`);
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
