import { QUESTION_BANK } from "./questions.js";
import { CATEGORY_LABELS, DIFFICULTY_LEVELS, QUIZ_MODES, createQuiz, scoreQuiz } from "./quiz.js";

const QUIZ_SIZE = 20;

const setupView = document.querySelector("#setup-view");
const quizView = document.querySelector("#quiz-view");
const resultsView = document.querySelector("#results-view");
const modeForm = document.querySelector("#mode-form");
const modeOptions = document.querySelector("#mode-options");
const difficultyOptions = document.querySelector("#difficulty-options");
const quizForm = document.querySelector("#quiz-form");
const quizModeLabel = document.querySelector("#quiz-mode-label");
const quizTitle = document.querySelector("#quiz-title");
const answeredCount = document.querySelector("#answered-count");
const progressFill = document.querySelector("#progress-fill");
const submitMessage = document.querySelector("#submit-message");
const scoreHeading = document.querySelector("#score-heading");
const scoreCopy = document.querySelector("#score-copy");
const reviewList = document.querySelector("#review-list");

let currentMode = "mixed";
let currentDifficulty = "normal";
let currentQuiz = [];
let answers = {};

renderSetupOptions();

modeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(modeForm);
  startQuiz(data.get("mode") || "mixed", data.get("difficulty") || "normal");
});

document.querySelector("#submit-quiz-button").addEventListener("click", submitQuiz);
document.querySelector("#change-mode-button").addEventListener("click", showSetup);
document.querySelector("#results-change-mode-button").addEventListener("click", showSetup);
document.querySelector("#restart-button").addEventListener("click", () => startQuiz(currentMode, currentDifficulty));

function renderSetupOptions() {
  modeOptions.innerHTML = QUIZ_MODES.map((mode) => `
    <label class="mode-option">
      <input type="radio" name="mode" value="${mode.id}" ${mode.id === currentMode ? "checked" : ""}>
      <span>
        <span class="mode-name">${mode.label}</span>
        <span class="mode-detail">${mode.detail}</span>
      </span>
    </label>
  `).join("");

  difficultyOptions.innerHTML = DIFFICULTY_LEVELS.map((difficulty) => `
    <label class="difficulty-option">
      <input type="radio" name="difficulty" value="${difficulty.id}" ${difficulty.id === currentDifficulty ? "checked" : ""}>
      <span>
        <span class="mode-name">${difficulty.label}</span>
        <span class="mode-detail">${difficulty.detail}</span>
      </span>
    </label>
  `).join("");
}

function startQuiz(modeId, difficulty) {
  currentMode = modeId;
  currentDifficulty = difficulty;
  answers = {};
  submitMessage.textContent = "";
  currentQuiz = createQuiz(QUESTION_BANK, modeId, difficulty);

  const mode = QUIZ_MODES.find((item) => item.id === modeId);
  const level = DIFFICULTY_LEVELS.find((item) => item.id === difficulty);
  quizModeLabel.textContent = `${mode.label} - ${level.label}`;
  quizTitle.textContent = `${QUIZ_SIZE} questions`;
  renderQuiz();
  showView(quizView);
}

function renderQuiz() {
  quizForm.innerHTML = currentQuiz.map((question) => `
    <article class="question-card">
      <div class="question-meta">
        <span>Question ${question.quizNumber}</span>
        <span>${CATEGORY_LABELS[question.category]} - ${difficultyLabel(question.difficulty)}</span>
      </div>
      <h3>${escapeHtml(question.question)}</h3>
      <div class="answer-options">
        ${question.options.map((option) => `
          <label class="answer-option">
            <input type="radio" name="${question.id}" value="${escapeAttribute(option)}">
            <span>${escapeHtml(option)}</span>
          </label>
        `).join("")}
      </div>
    </article>
  `).join("");

  quizForm.addEventListener("change", handleAnswerChange, { once: false });
  updateProgress();
}

function handleAnswerChange(event) {
  if (event.target.matches("input[type='radio']")) {
    answers[event.target.name] = event.target.value;
    submitMessage.textContent = "";
    updateProgress();
  }
}

function updateProgress() {
  const count = Object.keys(answers).length;
  answeredCount.textContent = String(count);
  progressFill.style.width = `${(count / QUIZ_SIZE) * 100}%`;
}

function submitQuiz() {
  const answered = Object.keys(answers).length;
  if (answered < QUIZ_SIZE) {
    submitMessage.textContent = `Answer ${QUIZ_SIZE - answered} more question${QUIZ_SIZE - answered === 1 ? "" : "s"} before submitting.`;
    return;
  }

  const score = scoreQuiz(currentQuiz, answers);
  scoreHeading.textContent = `${score} / ${QUIZ_SIZE}`;
  scoreCopy.textContent = resultCopy(score);
  renderReview();
  showView(resultsView);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderReview() {
  reviewList.innerHTML = currentQuiz.map((question) => {
    const userAnswer = answers[question.id];
    const isCorrect = userAnswer === question.answer;
    return `
      <article class="review-card ${isCorrect ? "correct" : "incorrect"}">
        <div class="question-meta">
          <span>Question ${question.quizNumber}</span>
          <span>${CATEGORY_LABELS[question.category]} - ${difficultyLabel(question.difficulty)} - ${isCorrect ? "Correct" : "Incorrect"}</span>
        </div>
        <h3>${escapeHtml(question.question)}</h3>
        <p class="review-answer"><strong>Your answer:</strong> ${escapeHtml(userAnswer)}</p>
        ${isCorrect ? "" : `<p class="review-answer"><strong>Correct answer:</strong> ${escapeHtml(question.answer)}</p>`}
      </article>
    `;
  }).join("");
}

function resultCopy(score) {
  if (score === QUIZ_SIZE) return "Perfect round. That is a serious pub-trivia table.";
  if (score >= 16) return "Strong result. You would be in the prize conversation.";
  if (score >= 11) return "Respectable middle-table finish.";
  return "Plenty of room for a comeback in the next round.";
}

function showSetup() {
  renderSetupOptions();
  showView(setupView);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function difficultyLabel(difficultyId) {
  return DIFFICULTY_LEVELS.find((item) => item.id === difficultyId)?.label || difficultyId;
}

function showView(view) {
  [setupView, quizView, resultsView].forEach((item) => item.classList.add("hidden"));
  view.classList.remove("hidden");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
