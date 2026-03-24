import { useState } from 'react'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQueryClient } from '@tanstack/react-query'
import { GripVertical, Trash2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Question } from '@/schema'
import { useDeleteQuestion } from '@/services/questionQueries'
import { quizKeys } from '@/services/quizQueries'

export default function QuestionCard({
  question,
  displayPosition,
}: {
  question: Question
  displayPosition?: number
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const deleteQuestion = useDeleteQuestion({
    onSuccess: () => {
      setIsDeleteDialogOpen(false)
      queryClient.invalidateQueries({
        queryKey: quizKeys.detail(question.quizId),
      })
      toast.success('Question deleted successfully', {
        position: 'top-center',
        classNames: {
          toast:
            'bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-100 border-green-200 dark:border-green-800',
        },
      })
    },
    onError: error => {
      toast.error(error.message || 'Failed to delete question', {
        position: 'top-center',
        classNames: {
          toast:
            'bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-100 border-red-200 dark:border-red-800',
        },
      })
    },
  })
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="touch-none">
      <Card
        className={`border-violet-200 dark:border-violet-900 hover:shadow-md transition-shadow ${
          isDragging ? 'opacity-30 shadow-2xl rotate-2 scale-105' : ''
        }`}
      >
        <CardHeader>
          <div className="flex items-center justify-center gap-4">
            {/* Drag icon button */}
            <div
              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="w-5 h-5" />
            </div>

            {/* Question Prompt */}
            <div className="flex-1">
              <CardTitle className="text-sm md:text-lg text-violet-900 dark:text-violet-100 mb-2">
                {displayPosition !== undefined
                  ? displayPosition + 1
                  : question.position}
                .)
              </CardTitle>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {question.prompt}
                </ReactMarkdown>
              </div>
            </div>

            {/* Delete button */}
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* MCQ Options */}
          {question.type === 'mcq' && question.options && (
            <div className="space-y-2">
              <CardDescription className="text-xs font-medium">
                Choices:
              </CardDescription>
              <div className="space-y-1">
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className={
                      'text-sm p-2 rounded border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        {index + 1}. {option}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* No catch for missing correct answer because this field is required for MCQ questions */}
              <div className="text-sm md:text-md font-medium text-green-600">
                Correct answer: {question.correctAnswer}
              </div>
            </div>
          )}

          {/* Code Question */}
          {question.type !== 'mcq' && (
            <div className="space-y-1">
              {question.correctAnswer ? (
                <>
                  <CardDescription className="text-xs font-medium">
                    Expected Answer:
                  </CardDescription>
                  <div className="text-sm md:text-md font-medium">
                    {question.correctAnswer}
                  </div>
                </>
              ) : (
                <CardDescription className="text-xs italic text-gray-500 dark:text-gray-400">
                  No correct answer specified
                </CardDescription>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Question</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this question? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteQuestion.mutate(question.id)}
              disabled={deleteQuestion.isPending}
            >
              {deleteQuestion.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
