# Quizizy: Quiz Maker

A React-based quiz application that allows users to create coding-related quizzes and take them with built-in anti-cheat features.

## Live Demo

The application is currently deployed on Vercel, with the backend running on a personal Render's free tier. Some updates were made to the backend repository, including CORS adjustments and the addition of a health check endpoint. The deployment will be taken down after the technical review, and the repository will be changed from public to private.

Access it here: [Quizizy](https://bookipi-react-quiz.vercel.app/)

## Description

Quiz Maker is a full-stack application for creating and taking coding quizzes. Users can build quizzes with multiple question types, including multiple choice and short answer questions with optional code snippets. The player interface includes lightweight anti-cheat monitoring to track focus events and paste actions.

## Features

### Builder Mode

- Create quizzes with title and description
- Add multiple question types (Multiple Choice, Short Answer)
- Include optional code snippets in questions
- Edit and manage questions with drag-and-drop reordering
- Set time limits for quizzes

### Player Mode

- Load quizzes by ID
- Navigate between questions
- Submit answers and view results
- Anti-cheat monitoring (tab switches, paste detection)
- Timer display with warnings
- Results summary with score and anti-cheat report

## Tech Stack

- **Framework**: Next.js 16 (React 19)
- **UI Components**: ShadCN UI with Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query v5
- **Forms**: React Hook Form with Zod validation
- **Backend**: Node.js + SQLite (included in `/backend`)
- **Icons**: Lucide React
- **Drag & Drop**: dnd-kit
- **Theme**: next-themes (dark/light mode)

## Directory Structure

```
bookipi-react-quiz/
├── app/                    # Next.js app directory
│   ├── builder/           # Quiz builder pages
│   ├── login/             # Login page
│   ├── context/           # React context providers
│   └── enums/             # TypeScript enums
├── components/            # React components
│   ├── quiz-builder/      # Builder-specific components
│   ├── quiz-player/       # Player-specific components
│   └── ui/                # ShadCN UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── services/              # API service layer
├── schema/                # Zod schemas
├── backend/               # Backend API (Node.js + SQLite)
└── public/                # Static assets
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp env-example .env
```

Edit `.env` and configure your API URL and token if needed.

4. Start the backend server (in a separate terminal):

```bash
cd backend
npm install
npm start
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## Usage

1. **Create a Quiz**: Navigate to the builder, add questions with answers, and save
2. **Take a Quiz**: Enter a quiz ID on the home page to start
3. **View Results**: Submit answers to see your score and anti-cheat summary

## Authentication

Include the header `Authorization: Bearer dev-token` with API requests (or configure your own token in `.env`).

For the UI, authentication is currently handled on the client side. The app uses
React `Context API` and stores the user type in `localStorage`. Since the backend
is minimal and does not implement authentication logic yet, this behavior is
temporarily managed in the UI.
