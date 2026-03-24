'use client'

import { useState, useEffect } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQuizzes } from '@/services/quizQueries'

import QuizPlayer from './player/quiz-player'

export default function PlayerDashboard() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const quizIdFromUrl = searchParams.get('quizId')

  const [quizId, setQuizId] = useState<string>('')
  const [startedQuizId, setStartedQuizId] = useState<number | null>(null)

  // Reset quiz when URL changes (no quizId param means user clicked navbar)
  useEffect(() => {
    if (!quizIdFromUrl) {
      setStartedQuizId(null)
      setQuizId('')
    }
  }, [quizIdFromUrl])

  const { data: quizzes, isLoading } = useQuizzes()

  const handleStartQuiz = () => {
    const id = parseInt(quizId)
    if (!isNaN(id) && id > 0) {
      setStartedQuizId(id)
      router.push(`/?quizId=${id}`)
    }
  }

  const handleBackToDashboard = () => {
    setStartedQuizId(null)
    setQuizId('')
    router.push('/')
  }

  if (startedQuizId) {
    return <QuizPlayer quizId={startedQuizId} onBack={handleBackToDashboard} />
  }

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Take a Quiz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quizId">Select a Quiz</Label>
            <Select value={quizId} onValueChange={setQuizId}>
              <SelectTrigger id="quizId" className="w-full">
                <SelectValue placeholder="Choose a quiz..." />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading quizzes...
                  </SelectItem>
                ) : quizzes && quizzes.length > 0 ? (
                  quizzes.map(quiz => {
                    if (quiz.isPublished) {
                      return (
                        <SelectItem key={quiz.id} value={quiz.id.toString()}>
                          {quiz.id} - {quiz.title}
                        </SelectItem>
                      )
                    }
                  })
                ) : (
                  <SelectItem value="empty" disabled>
                    No quizzes available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleStartQuiz}
            disabled={!quizId}
            className="w-full"
          >
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
