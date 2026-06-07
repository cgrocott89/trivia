# 20 Questions

A static GitHub Pages trivia site with 20-question multiple-choice quizzes.

The question bank contains 2,000 pub-trivia style questions: 500 sport, 500 music, 500 culture, and 500 general interest.

## Quiz modes

- Mixed: 2 sport, 2 music, 4 culture, 12 general interest.
- Sport only: 20 sport questions.
- Music only: 20 music questions.
- Culture only: 20 culture questions.
- General interest only: 20 general-interest questions.

Each mode supports Easy, Normal, and Hard difficulty.

## Local checks

```powershell
node scripts/validate-questions.mjs
node scripts/smoke-test.mjs
```

The site is dependency-free. Open `index.html` directly in a browser, or serve the folder with any static server.

## GitHub Pages

Use GitHub Pages with the repository root as the publishing source.
