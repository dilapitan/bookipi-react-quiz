'use client'

import { useState, useCallback } from 'react'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ArrowLeft, Clock, FileText } from 'lucide-react'
import { toast } from 'sonner'

import QuestionCard from '@/components/quiz-builder/question/question-card'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useUpdateQuestionPosition } from '@/services/questionQueries'
import { quizKeys, useQuizWithQuestions } from '@/services/quizQueries'

export default function QuizDetailPage() {
  const params = useParams()
  const quizId = Number(params.quizId)
  const queryClient = useQueryClient()

  const { data: quiz, isLoading, error } = useQuizWithQuestions(quizId)
  const [localQuestions, setLocalQuestions] = useState(quiz?.questions ?? [])
  const [activeId, setActiveId] = useState<number | null>(null)

  const updatePositionMutation = useUpdateQuestionPosition({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.detail(quizId) })
    },
    onError: error => {
      toast.error(error.message || 'Failed to update question position')
    },
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(Number(event.active.id))
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      setActiveId(null)

      if (!over || active.id === over.id || !quiz) {
        return
      }

      const oldIndex = localQuestions.findIndex(q => q.id === active.id)
      const newIndex = localQuestions.findIndex(q => q.id === over.id)

      if (oldIndex === -1 || newIndex === -1) {
        return
      }

      const newQuestions = arrayMove(localQuestions, oldIndex, newIndex)
      setLocalQuestions(newQuestions)

      // Update position in the backend
      updatePositionMutation.mutate({
        questionId: Number(active.id),
        position: newIndex,
      })
    },
    [quiz, localQuestions, updatePositionMutation]
  )

  const activeQuestion = activeId
    ? localQuestions.find(q => q.id === activeId)
    : null

  // Sync localQuestions with quiz data when it changes
  if (quiz && localQuestions.length !== quiz.questions.length) {
    setLocalQuestions(quiz.questions)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f0e6ff_0%,#fff_60%)] dark:bg-[linear-gradient(180deg,#1a0f2e_0%,#07102a_60%)] p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-violet-200 dark:bg-violet-900/30 rounded w-1/4" />
            <div className="h-32 bg-violet-200 dark:bg-violet-900/30 rounded" />
            <div className="h-64 bg-violet-200 dark:bg-violet-900/30 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f0e6ff_0%,#fff_60%)] dark:bg-[linear-gradient(180deg,#1a0f2e_0%,#07102a_60%)] p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Card className="border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">
                Error Loading Quiz
              </CardTitle>
              <CardDescription>
                {error.message || 'Failed to load quiz details'}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
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
        <Card className="border-violet-200 dark:border-violet-900 shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl text-violet-900 dark:text-violet-100">
                  {quiz.title}
                </CardTitle>
                <CardDescription className="mt-2 text-base">
                  {quiz.description}
                </CardDescription>
              </div>
              {quiz.isPublished ? (
                <span className="text-sm px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">
                  Published
                </span>
              ) : (
                <span className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 font-medium">
                  Unpublished
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6 text-sm text-violet-600 dark:text-violet-400">
              {/* Quiz ID */}
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span className="font-medium">Quiz ID: {quiz.id}</span>
              </div>

              {/* Time limit */}
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-medium">
                  Time Limit: {Math.floor(quiz.timeLimitSeconds / 60)} minutes
                </span>
              </div>
            </div>

            {/* Created At */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Created{' '}
              {formatDistanceToNow(new Date(quiz.createdAt), {
                addSuffix: true,
              })}
            </p>
          </CardContent>
        </Card>

        {/* Questions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-violet-900 dark:text-violet-100">
              Questions ({localQuestions.length})
            </h2>
          </div>

          {localQuestions.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={localQuestions.map(q => q.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {localQuestions.map(question => (
                    <QuestionCard key={question.id} question={question} />
                  ))}
                </div>
              </SortableContext>
              <DragOverlay>
                {activeQuestion ? (
                  <div className="max-w-6xl mx-auto opacity-90 shadow-2xl rotate-3">
                    <QuestionCard question={activeQuestion} />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          ) : (
            <Card className="border-violet-200 dark:border-violet-900">
              <CardHeader>
                <CardTitle className="text-center text-violet-900 dark:text-violet-100">
                  No Questions Yet
                </CardTitle>
                <CardDescription className="text-center">
                  This quiz does not have any questions yet. Add some to get
                  started!
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
