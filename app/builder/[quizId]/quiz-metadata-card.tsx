import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { Clock, FileText, Pencil, Check, X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { Quiz } from '@/schema'
import type { UpdateQuiz } from '@/schema/quizSchema'
import { quizKeys, useUpdateQuiz } from '@/services/quizQueries'

export default function QuizMetadataCard({ quiz }: { quiz: Quiz }) {
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<UpdateQuiz>({
    title: quiz.title,
    description: quiz.description,
    isPublished: quiz.isPublished,
  })

  const updateQuizMutation = useUpdateQuiz({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.detail(quiz.id) })
      toast.success('Quiz updated successfully')
      setIsEditing(false)
    },
    onError: error => {
      toast.error(error.message || 'Failed to update quiz')
    },
  })

  const handleSaveEdit = () => {
    updateQuizMutation.mutate({
      quizId: quiz.id,
      quiz: editForm,
    })
  }

  const handleCancelEdit = () => {
    setEditForm({
      title: quiz.title,
      description: quiz.description,
      isPublished: quiz.isPublished,
    })
    setIsEditing(false)
  }

  return (
    <Card className="border-violet-200 dark:border-violet-900 shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            {isEditing ? (
              <>
                <Input
                  value={editForm.title}
                  onChange={e =>
                    setEditForm(prev => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="text-3xl font-bold"
                  placeholder="Quiz title"
                />
                <Textarea
                  value={editForm.description}
                  onChange={e =>
                    setEditForm(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="text-base"
                  placeholder="Quiz description"
                  rows={2}
                />
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editForm.isPublished}
                    onCheckedChange={checked =>
                      setEditForm(prev => ({
                        ...prev,
                        isPublished: checked,
                      }))
                    }
                  />
                  <label className="text-sm">Published</label>
                </div>
              </>
            ) : (
              <>
                <CardTitle className="text-3xl text-violet-900 dark:text-violet-100">
                  {quiz.title}
                </CardTitle>
                <CardDescription className="mt-2 text-base">
                  {quiz.description}
                </CardDescription>
              </>
            )}
          </div>
          <div className="flex items-start gap-2">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSaveEdit}
                  disabled={updateQuizMutation.isPending}
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  disabled={updateQuizMutation.isPending}
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                {quiz.isPublished ? (
                  <span className="text-sm px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">
                    Published
                  </span>
                ) : (
                  <span className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 font-medium">
                    Unpublished
                  </span>
                )}
              </>
            )}
          </div>
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
  )
}
