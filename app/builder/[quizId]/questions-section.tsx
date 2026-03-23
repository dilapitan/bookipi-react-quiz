import { useState, useCallback } from 'react'

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
import { toast } from 'sonner'

import AddQuestionButton from '@/components/quiz-builder/question/add-question-button'
import QuestionCard from '@/components/quiz-builder/question/question-card'
import type { Question, QuizWithQuestions } from '@/schema'
import { useUpdateQuestionPosition } from '@/services/questionQueries'
import { quizKeys } from '@/services/quizQueries'

import EmptyCard from './empty-card'

export default function QuestionsSection({
  quizId,
  quiz,
}: {
  quizId: number
  quiz: QuizWithQuestions
}) {
  const [localQuestions, setLocalQuestions] = useState<Question[]>(
    quiz?.questions ?? []
  )
  const [activeId, setActiveId] = useState<number | null>(null)
  const queryClient = useQueryClient()

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

      // Update positions for all affected questions in the backend
      /**
       * This is for updating positions for all affected questions in the backend.
       * For example, question A has position 0, question B has position 1,
       * question C has position 2. Moving question C on top of question
       * A should update all positions accordingly so things persist.
       * Question C will now have the position of 0 from position 2.
       * Question A will now have position 1 from 0. And so on.
       */
      const updates = newQuestions
        .map((question, index) => {
          if (question.position !== index) {
            return updatePositionMutation.mutateAsync({
              questionId: question.id,
              position: index,
            })
          }
          return null
        })
        .filter(Boolean)

      // Wait for all updates to complete, then reload the data
      Promise.all(updates).then(() => {
        queryClient.invalidateQueries({ queryKey: quizKeys.detail(quizId) })
      })
    },
    [quiz, localQuestions, updatePositionMutation, queryClient, quizId]
  )

  const activeQuestion = activeId
    ? localQuestions.find(q => q.id === activeId)
    : null
  const activeIndex = activeQuestion
    ? localQuestions.findIndex(q => q.id === activeId)
    : -1

  // Sync localQuestions with quiz data when it changes
  if (quiz && localQuestions.length !== quiz.questions.length) {
    setLocalQuestions(quiz.questions)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-violet-900 dark:text-violet-100">
          Questions ({localQuestions.length})
        </h2>
        <AddQuestionButton
          quizId={quizId}
          lastPosition={
            localQuestions.length > 0
              ? Math.max(...localQuestions.map(q => q.position))
              : -1
          }
        />
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
              {localQuestions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  displayPosition={index}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeQuestion ? (
              <div className="max-w-6xl mx-auto opacity-90 shadow-2xl rotate-3">
                <QuestionCard
                  question={activeQuestion}
                  displayPosition={activeIndex}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <EmptyCard />
      )}
    </div>
  )
}
