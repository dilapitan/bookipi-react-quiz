'use client'

import { useState } from 'react'

import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuizWithQuestions } from '@/services/quizQueries'

import QuestionCard from '../question-card'
import NoQuestionsFoundCard from './no-questions-found-card'
import ErrorQuestionCard from './error-question-card'
import LoadingQuestionCard from './loading-question-card'

interface QuizPlayerProps {
  quizId: number
  onBack: () => void
}

export default function QuizPlayer({ quizId, onBack }: QuizPlayerProps) {
  const { data: quiz, isLoading, error } = useQuizWithQuestions(quizId)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})

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
              <Button size="lg">Submit Quiz</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
