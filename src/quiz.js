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
    return selectQuestions(candidates, count, category, random);
  });

  return shuffle(selected, random).map((question, index) => ({
    ...question,
    quizNumber: index + 1
  }));
}

function selectQuestions(candidates, count, category, random) {
  if (category !== "sport") {
    return selectDiverseQuestions(shuffle(candidates, random), count);
  }

  const weighted = shuffle(candidates, random).sort((a, b) => sportWeight(b) - sportWeight(a));
  return selectDiverseQuestions(weighted, count, {
    getGroup: (question) => question.sportContext || "other",
    maxPerGroup: (group) => {
      if (group === "netball") return 1;
      if (group === "NBL basketball" || group === "Big Bash cricket") return 2;
      if (group === "Australian rules football" || group === "rugby league") return 5;
      return 3;
    }
  });
}

function selectDiverseQuestions(candidates, count, grouping = null) {
  const selected = [];
  const usedSubjects = new Set();
  const groupCounts = {};

  for (const question of candidates) {
    const subject = question.subject || question.answer;
    if (usedSubjects.has(subject)) continue;

    if (grouping) {
      const group = grouping.getGroup(question);
      const max = grouping.maxPerGroup(group);
      if ((groupCounts[group] || 0) >= max) continue;
      groupCounts[group] = (groupCounts[group] || 0) + 1;
    }

    selected.push(question);
    usedSubjects.add(subject);
    if (selected.length === count) return selected;
  }

  for (const question of candidates) {
    if (selected.some((item) => item.id === question.id)) continue;
    const subject = question.subject || question.answer;
    if (usedSubjects.has(subject)) continue;
    selected.push(question);
    usedSubjects.add(subject);
    if (selected.length === count) return selected;
  }

  return selected;
}

function sportWeight(question) {
  const weights = {
    "Australian rules football": 9,
    "rugby league": 9,
    "Big Bash cricket": 6,
    "NBL basketball": 6,
    cricket: 5,
    netball: 3
  };
  return weights[question.sportContext] || 2;
}

export function scoreQuiz(quizQuestions, answersById) {
  return quizQuestions.reduce((score, question) => {
    return score + (answersById[question.id] === question.answer ? 1 : 0);
  }, 0);
}
