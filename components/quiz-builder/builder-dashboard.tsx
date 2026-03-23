'use client'

import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useQuizzes } from '@/services/quizQueries'

import CreateQuizCard from './quiz/create-quiz-card'
import EmptyQuizCard from './quiz/empty-quiz-card'
import ErrorQuizCard from './quiz/error-quiz-card'
import LoaderQuizCard from './quiz/loader-quiz-card'
import QuizCard from './quiz/quiz-card'

export default function BuilderDashboard() {
  const { data: quizzes, isLoading, error } = useQuizzes()

  if (error) {
    return (
      <ErrorQuizCard errorMessage={error.message ?? 'Something went wrong.'} />
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-violet-50 to-purple-50 dark:from-gray-950 dark:to-violet-950/20 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Header */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-violet-900 dark:text-violet-100">
              Builder Dashboard
            </h1>
            <p className="text-violet-600 dark:text-violet-400 mt-1">
              Create and manage your quizzes
            </p>
          </div>

          {/* Add Quiz Button */}
          <CreateQuizCard />
        </div>

        {/* Quiz List */}
        {isLoading ? (
          <LoaderQuizCard />
        ) : quizzes && quizzes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map(quiz => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <EmptyQuizCard />
        )}
      </div>
    </div>
  )
}
