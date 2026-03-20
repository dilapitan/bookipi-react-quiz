We're gonna build a Quiz Maker application in React using NextJS, ShadCN and Tanstack Query v5.
There's already a backend application (Node.js + SQLite) so we're just gonna focus on the frontend side.

# The application should allow users to:

- Create a quiz with coding-related questions.
- Take a quiz and view a result summary.
- Implement lightweight anti-cheat signals (e.g., focus tracking, paste detection).

# Technical Constraints

- Authentication: Include the header `Authorization: Bearer dev-token` with each request (or configure your own token in `.env`).

# Contract:

Do not make major changes to the backend endpoints or data structures. Minor tweaks are acceptable.

# Core User Flows & Requirements

## 2.1 Quiz Builder

### Create a quiz with:

- Title and description.
- At least two question types: Multiple Choice (single correct answer) or Short Answer (string match; case-insensitive).

### For each question:

Prompt text.

- Optional code snippet (display only).
- Choices (for Multiple Choice questions).
- Correct answer(s).
- Save the quiz to the provided API.

## 2.2 Quiz Player

- Load a quiz by ID.
- Answer questions with navigation between them.
- Submit answers and display a result summary: Overall score and Per-question correctness.

## 2.3 Anti-Cheat

- Log and report simple anti-cheat events:
  Focus events: tab/window blur and focus with timestamps.
  Paste events: paste actions inside answer inputs with timestamps.

- Display a compact anti-cheat summary on the results page (e.g., "2 tab switches, 3 pastes").

# API (Provided)

Refer to the provided postman collection and the backend code.

# UX Outline (minimum)

- Builder: create quiz → add questions → save → show generated `quizId`.
- Player: input `quizId` → load → answer → submit → results page with score and anti-cheat summary.

# Notes

- Gracefuilly handle loading states and API errors.
