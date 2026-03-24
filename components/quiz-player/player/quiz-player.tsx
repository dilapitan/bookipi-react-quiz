'use client'

import { useState, useEffect } from 'react'

import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuizWithQuestions } from '@/services/quizQueries'
import {
  useStartAttempt,
  useAnswerQuestion,
  useSubmitAttempt,
} from '@/services/attemptQueries'

import QuestionCard from '../question-card'
import ResultsDashboard from '../results/results-dashboard'
import NoQuestionsFoundCard from './no-questions-found-card'
import ErrorQuestionCard from './error-question-card'
import LoadingQuestionCard from './loading-question-card'

interface QuizPlayerProps {
  quizId: number
  onBack: () => void
}

interface SubmitResult {
  score: number
  details: Array<{
    questionId: number
    correct: boolean
    expected?: string
  }>
}

export default function QuizPlayer({ quizId, onBack }: QuizPlayerProps) {
  const { data: quiz, isLoading, error } = useQuizWithQuestions(quizId)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const startAttempt = useStartAttempt()
  const answerQuestion = useAnswerQuestion()
  const submitAttempt = useSubmitAttempt()

  // Start attempt when quiz loads
  useEffect(() => {
    if (quiz && !attemptId && !startAttempt.isPending) {
      startAttempt.mutate(
        { quizId },
        {
          onSuccess: attempt => {
            setAttemptId(attempt.id)
          },
          onError: error => {
            console.error('Failed to start attempt:', error)
          },
        }
      )
    }
  }, [quiz, quizId, attemptId])

  if (isLoading) {
    return <LoadingQuestionCard />
  }

  if (error) {
    return (
      <ErrorQuestionCard
        errorMessage={error.message ?? 'Something went wrong.'}
        onBack={onBack}
      />
    )
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <NoQuestionsFoundCard onBack={onBack} />
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const totalQuestions = quiz.questions.length

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }))

    // Save answers
    if (attemptId) {
      answerQuestion.mutate(
        { attemptId, questionId, value: answer },
        {
          onError: error => {
            console.error('Failed to save answer:', error)
          },
        }
      )
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const handleSubmit = () => {
    if (!attemptId) {
      console.error('No attempt started')
      return
    }

    setIsSubmitting(true)
    submitAttempt.mutate(attemptId, {
      onSuccess: result => {
        setSubmitResult(result)
        setIsSubmitting(false)
      },
      onError: error => {
        console.error('Failed to submit attempt:', error)
        setIsSubmitting(false)
      },
    })
  }

  // Show results if quiz has been submitted
  if (submitResult && quiz) {
    return (
      <ResultsDashboard
        score={submitResult.score}
        details={submitResult.details}
        questions={quiz.questions}
        totalQuestions={totalQuestions}
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
      </div>

      {/* Quiz Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{quiz.title}</CardTitle>
          {quiz.description && (
            <p className="text-muted-foreground">{quiz.description}</p>
          )}
        </CardHeader>
      </Card>

      {/* Current Question */}
      <QuestionCard
        question={currentQuestion}
        answer={answers[currentQuestion.id] || ''}
        onAnswerChange={answer =>
          handleAnswerChange(currentQuestion.id, answer)
        }
      />

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          variant="outline"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => handleQuestionJump(index)}
              className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                index === currentQuestionIndex
                  ? 'bg-primary text-primary-foreground'
                  : answers[quiz.questions[index].id]
                    ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={currentQuestionIndex === totalQuestions - 1}
          variant="outline"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Submit Button (shown only on last question) */}
      {currentQuestionIndex === totalQuestions - 1 && (
        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Ready to submit?</p>
                <p className="text-sm text-muted-foreground">
                  You've answered {Object.keys(answers).length} of{' '}
                  {totalQuestions} questions
                </p>
              </div>
              <Button size="lg" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
