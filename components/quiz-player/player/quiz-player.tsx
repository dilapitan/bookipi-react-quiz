'use client'

import { useState, useEffect } from 'react'

import { ArrowLeft, ChevronLeft, ChevronRight, Clock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAntiCheat } from '@/hooks/useAntiCheat'
import {
  useStartAttempt,
  useAnswerQuestion,
  useSubmitAttempt,
} from '@/services/attemptQueries'
import { useQuizWithQuestions } from '@/services/quizQueries'

import QuestionCard from '../question-card'
import ErrorQuestionCard from './error-question-card'
import LoadingQuestionCard from './loading-question-card'
import NoQuestionsFoundCard from './no-questions-found-card'
import AntiCheatWarningDialog from '../anti-cheat-warning-dialog'
import ResultsDashboard from '../results/results-dashboard'

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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [showWarningDialog, setShowWarningDialog] = useState<boolean>(true)
  const [quizStarted, setQuizStarted] = useState<boolean>(false)
  const [antiCheatEvents, setAntiCheatEvents] = useState<{
    tabSwitches: number
    pastes: number
  }>({
    tabSwitches: 0,
    pastes: 0,
  })
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false)

  const startAttempt = useStartAttempt()
  const answerQuestion = useAnswerQuestion()
  const submitAttempt = useSubmitAttempt()

  // Anti-cheat tracking (disabled after submission)
  const { logPasteEvent } = useAntiCheat({
    attemptId,
    // This is for preventing the logic/400 errors after the form is submitted
    enabled: quizStarted && !submitResult,
    onTabSwitch: () => {
      setAntiCheatEvents(prev => ({
        ...prev,
        tabSwitches: prev.tabSwitches + 1,
      }))
    },
    onPaste: () => {
      setAntiCheatEvents(prev => ({ ...prev, pastes: prev.pastes + 1 }))
    },
  })

  // Start attempt when user accepts the warning
  const handleAcceptWarning = () => {
    setShowWarningDialog(false)
    setQuizStarted(true)

    // Initialize timer if quiz has time limit
    if (quiz?.timeLimitSeconds) {
      setTimeRemaining(quiz.timeLimitSeconds)
    }

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
  }

  // Countdown timer effect: 5:00, 4:59, 4:58, ... 0
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || submitResult) {
      return
    }

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          setIsTimeUp(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeRemaining, submitResult])

  // Auto-submit when time runs out
  useEffect(() => {
    if (isTimeUp && attemptId && !submitResult && !isSubmitting) {
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
  }, [isTimeUp, attemptId, submitResult, isSubmitting, submitAttempt])

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`
  }

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

  // Show warning dialog before quiz starts
  if (showWarningDialog) {
    return <AntiCheatWarningDialog open={true} onAccept={handleAcceptWarning} />
  }

  /**
   * Using an index based method for switching thru questions either by
   * prev and next buttons, or jumping to a certain question index.
   */
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
        antiCheatEvents={antiCheatEvents}
        isTimeUp={isTimeUp}
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 border-2 border-green-500 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center gap-4">
          {/* Count down timer */}
          {timeRemaining !== null && (
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-md font-medium ${
                timeRemaining <= 60
                  ? 'bg-red-500/20 text-red-700 dark:text-red-300'
                  : timeRemaining <= 300
                    ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                    : 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          )}

          {/* Question numbers */}
          <div className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
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
        onPaste={logPasteEvent}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between">
        {/* Previous Button */}
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          variant="outline"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          <span className="hidden sm:block">Previous</span>
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

        {/* Next Button */}
        <Button
          onClick={handleNext}
          disabled={currentQuestionIndex === totalQuestions - 1}
          variant="outline"
        >
          <span className="hidden sm:block">Next</span>
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
                  You have answered {Object.keys(answers).length} of{' '}
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
