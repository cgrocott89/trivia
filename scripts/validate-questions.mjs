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
const missingSemanticKeys = [];
const KNOWN_FEMALE_SPORT_NAMES = new Set([
  "Diana Taurasi",
  "Lisa Leslie",
  "Sue Bird",
  "Lauren Jackson",
  "Serena Williams",
  "Margaret Court",
  "Steffi Graf",
  "Martina Navratilova",
  "Billie Jean King",
  "Iga Swiatek",
  "Florence Griffith-Joyner",
  "Shelly-Ann Fraser-Pryce",
  "Allyson Felix",
  "Jackie Joyner-Kersee",
  "Fanny Blankers-Koen",
  "Katie Ledecky",
  "Simone Biles",
  "Nadia Comaneci",
  "Marta",
  "Mia Hamm",
  "Megan Rapinoe",
  "Alex Morgan",
  "Christine Sinclair",
  "Annika Sorenstam",
  "Erin Phillips",
  "Liz Ellis",
  "Caitlin Bassett",
  "Irene van Dyk",
  "Sharelle McMahon",
  "Laura Geitz",
  "Gretel Bueta",
  "Cathy Freeman",
  "Emma McKeon",
  "Dawn Fraser",
  "Betty Cuthbert",
  "Ariarne Titmus",
  "Jessica Fox",
  "Anna Meares",
  "Sally Pearson"
]);
const KNOWN_MALE_SPORT_NAMES = new Set([
  "LeBron James",
  "Kareem Abdul-Jabbar",
  "Michael Jordan",
  "Stephen Curry",
  "Kobe Bryant",
  "Wilt Chamberlain",
  "Bill Russell",
  "Magic Johnson",
  "Larry Bird",
  "Shaquille O'Neal",
  "Tim Duncan",
  "Dirk Nowitzki",
  "Hakeem Olajuwon",
  "Giannis Antetokounmpo",
  "Nikola Jokic",
  "Russell Westbrook",
  "Oscar Robertson",
  "Roger Federer",
  "Rafael Nadal",
  "Novak Djokovic",
  "Usain Bolt",
  "Eliud Kipchoge",
  "Michael Phelps",
  "Mark Spitz",
  "Tom Brady",
  "Jerry Rice",
  "Peyton Manning",
  "Patrick Mahomes",
  "Barry Bonds",
  "Hank Aaron",
  "Cal Ripken Jr.",
  "Shohei Ohtani",
  "Babe Ruth",
  "Wayne Gretzky",
  "Alexander Ovechkin",
  "Miroslav Klose",
  "Pele",
  "Lionel Messi",
  "Cristiano Ronaldo",
  "Sachin Tendulkar",
  "Brian Lara",
  "Muttiah Muralitharan",
  "Shane Warne",
  "Don Bradman",
  "Lewis Hamilton",
  "Michael Schumacher",
  "Max Verstappen",
  "Ayrton Senna",
  "Sebastian Vettel",
  "Fernando Alonso",
  "Alain Prost",
  "Niki Lauda",
  "Valentino Rossi",
  "Tiger Woods",
  "Jack Nicklaus",
  "Rory McIlroy",
  "Kelly Slater",
  "Lance Franklin",
  "Gary Ablett Jr.",
  "Brent Harvey",
  "Tony Lockett",
  "Dustin Martin",
  "Patrick Dangerfield",
  "Michael Tuck",
  "Joel Selwood",
  "Nat Fyfe",
  "Adam Goodes",
  "Robert Harvey",
  "Simon Black",
  "Jason Dunstall",
  "Cameron Smith",
  "Johnathan Thurston",
  "Billy Slater",
  "Cooper Cronk",
  "Andrew Johns",
  "Darren Lockyer",
  "Nathan Cleary",
  "James Tedesco",
  "Ben Barba",
  "Roger Tuivasa-Sheck",
  "Kalyn Ponga",
  "Brad Fittler",
  "Richie McCaw",
  "Jonah Lomu",
  "Andrew Gaze",
  "Bryce Cotton",
  "Leroy Loggins",
  "Chris Anstey",
  "Chris Lynn",
  "Aaron Finch",
  "Rashid Khan",
  "Dan Christian",
  "Ian Thorpe",
  "Kieren Perkins",
  "Steven Bradbury",
  "Mack Horton"
]);
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
  if (!question.semanticKey) missingSemanticKeys.push(label);
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
      if (option !== question.answer && containsWholePhrase(question.question, option)) {
        errors.push(`${label} has a wrong option already named in the question text: ${option}`);
      }
      if (option !== question.answer && hasOppositeGenderOption(question, option)) {
        errors.push(`${label} has an opposite-gender sport option: ${option}`);
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

if (missingSemanticKeys.length > 0) {
  errors.push(`Questions missing semantic keys: ${missingSemanticKeys.slice(0, 20).join(", ")}`);
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

function hasOppositeGenderOption(question, option) {
  if (question.sportGender === "female") {
    return KNOWN_MALE_SPORT_NAMES.has(option) || /\b(men|mens|male|nba|nfl|mlb|nhl|nrl)\b/.test(normalizeText(option));
  }
  if (question.sportGender === "male") {
    return KNOWN_FEMALE_SPORT_NAMES.has(option) || /\b(women|woman|female|wnba|aflw|netball)\b/.test(normalizeText(option));
  }
  return false;
}

function containsWholePhrase(value, term) {
  const needle = normalizeText(term);
  if (needle.length < 3) return false;
  return ` ${normalizeText(value)} `.includes(` ${needle} `);
}

function normalizeText(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
