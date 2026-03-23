'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useQuizWithQuestions } from '@/services/quizQueries'

import ErrorCard from './error-card'
import LoadingCard from './loading-card'
import QuestionsSection from './questions-section'
import QuizMetadataCard from './quiz-metadata-card'

export default function QuizDetailPage() {
  const params = useParams()
  const quizId = Number(params.quizId)

  const { data: quiz, isLoading, error } = useQuizWithQuestions(quizId)

  if (isLoading) {
    return <LoadingCard />
  }

  if (error) {
    return <ErrorCard errorMessage={error.message ?? 'Something went wrong.'} />
  }

  if (!quiz) {
    return null
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f0e6ff_0%,#fff_60%)] dark:bg-[linear-gradient(180deg,#1a0f2e_0%,#07102a_60%)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Quiz Metadata Card */}
        <QuizMetadataCard quiz={quiz} />

        {/* Questions Section */}
        <QuestionsSection quizId={quizId} quiz={quiz} />
      </div>
    </div>
  )
}
