import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Question } from '@/schema'

export default function QuestionCard({ question }: { question: Question }) {
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
              <CardTitle className="text-sm md:text-lg text-violet-900 dark:text-violet-100">
                {question.position}.) {question.prompt}
              </CardTitle>
            </div>
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
              <div className="text-sm md:text-md font-medium">
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
    </div>
  )
}
