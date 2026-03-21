import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckCircle2, GripVertical } from 'lucide-react'

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
          <div className="flex items-start justify-between gap-4">
            <div
              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2"></div>
              <CardTitle className="text-lg text-violet-900 dark:text-violet-100">
                {question.prompt}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* MCQ Options */}
          {question.type === 'mcq' && question.options && (
            <div className="space-y-2">
              <CardDescription className="text-xs font-medium">
                Options:
              </CardDescription>
              <div className="space-y-1">
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className={`text-sm p-2 rounded border ${
                      question.correctAnswer === index.toString()
                        ? 'border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        {index + 1}. {option}
                      </span>
                      {question.correctAnswer === index.toString() && (
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Short Answer */}
          {question.type === 'short' && question.correctAnswer && (
            <div className="space-y-1">
              <CardDescription className="text-xs font-medium">
                Correct Answer:
              </CardDescription>
              <div className="text-sm p-2 rounded border border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                {question.correctAnswer}
              </div>
            </div>
          )}

          {/* Code Question */}
          {question.type === 'code' && (
            <div className="space-y-1">
              {question.correctAnswer ? (
                <>
                  <CardDescription className="text-xs font-medium">
                    Expected Answer:
                  </CardDescription>
                  <div className="text-sm p-2 rounded border border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-mono">
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
