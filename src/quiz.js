export const CATEGORY_LABELS = {
  sport: "Sport",
  music: "Music",
  culture: "Culture",
  general: "General interest"
};

export const DIFFICULTY_LEVELS = [
  {
    id: "easy",
    label: "Easy",
    detail: "More familiar pub-trivia clues"
  },
  {
    id: "normal",
    label: "Normal",
    detail: "Balanced pub-trivia difficulty"
  },
  {
    id: "hard",
    label: "Hard",
    detail: "More specific names, places, and dates"
  }
];

export const QUIZ_MODES = [
  {
    id: "mixed",
    label: "Mixed",
    detail: "2 sport, 2 music, 4 culture, 12 general interest",
    composition: { sport: 2, music: 2, culture: 4, general: 12 }
  },
  {
    id: "sport",
    label: "Sport only",
    detail: "20 questions from Australian and international sport",
    composition: { sport: 20 }
  },
  {
    id: "music",
    label: "Music only",
    detail: "20 questions from Australian and global music",
    composition: { music: 20 }
  },
  {
    id: "culture",
    label: "Culture only",
    detail: "20 questions from film, TV, books, places, and language",
    composition: { culture: 20 }
  },
  {
    id: "general",
    label: "General interest only",
    detail: "20 questions from geography, history, science, food, and public life",
    composition: { general: 20 }
  }
];

export function shuffle(items, random = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function groupByCategory(questions) {
  return questions.reduce((groups, question) => {
    groups[question.category] = groups[question.category] || [];
    groups[question.category].push(question);
    return groups;
  }, {});
}

export function createQuiz(questions, modeId, difficulty = "normal", random = Math.random) {
  const mode = QUIZ_MODES.find((item) => item.id === modeId);
  if (!mode) {
    throw new Error(`Unknown quiz mode: ${modeId}`);
  }

  const level = DIFFICULTY_LEVELS.find((item) => item.id === difficulty);
  if (!level) {
    throw new Error(`Unknown difficulty: ${difficulty}`);
  }

  const grouped = groupByCategory(questions.filter((question) => question.difficulty === difficulty));
  const selected = Object.entries(mode.composition).flatMap(([category, count]) => {
    const candidates = grouped[category] || [];
    if (candidates.length < count) {
      throw new Error(`Mode ${modeId} at ${difficulty} needs ${count} ${category} questions, but only ${candidates.length} exist.`);
    }
    return shuffle(candidates, random).slice(0, count);
  });

  return shuffle(selected, random).map((question, index) => ({
    ...question,
    quizNumber: index + 1
  }));
}

export function scoreQuiz(quizQuestions, answersById) {
  return quizQuestions.reduce((score, question) => {
    return score + (answersById[question.id] === question.answer ? 1 : 0);
  }, 0);
}
