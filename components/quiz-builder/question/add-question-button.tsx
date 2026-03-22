'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCreateQuestion } from '@/services/questionQueries'
import { quizKeys } from '@/services/quizQueries'
import type { QuestionType } from '@/schema/questionSchema'

interface AddQuestionButtonProps {
  quizId: number
  lastPosition: number
}

export default function AddQuestionButton({
  quizId,
  lastPosition,
}: AddQuestionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [questionType, setQuestionType] = useState<QuestionType>('mcq')
  const [prompt, setPrompt] = useState('')
  const [options, setOptions] = useState<string[]>(['', ''])
  const [correctAnswer, setCorrectAnswer] = useState('')

  const queryClient = useQueryClient()

  const createQuestion = useCreateQuestion({
    onSuccess: () => {
      toast.success('Question added successfully', {
        position: 'top-center',
        classNames: {
          toast:
            'bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-100 border-green-200 dark:border-green-800',
        },
      })
      queryClient.invalidateQueries({ queryKey: quizKeys.detail(quizId) })
      handleClose()
    },
    onError: error => {
      toast.error(error.message || 'Failed to add question', {
        position: 'top-center',
        classNames: {
          toast:
            'bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-100 border-red-200 dark:border-red-800',
        },
      })
    },
  })

  const handleClose = () => {
    setIsOpen(false)
    setQuestionType('mcq')
    setPrompt('')
    setOptions(['', ''])
    setCorrectAnswer('')
  }

  const handleAddOption = () => {
    setOptions([...options, ''])
  }

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = () => {
    // Validation
    if (!prompt.trim()) {
      toast.error('Prompt is required', {
        position: 'top-center',
      })
      return
    }

    if (questionType === 'mcq') {
      const validOptions = options.filter(opt => opt.trim())
      if (validOptions.length < 2) {
        toast.error('MCQ questions require at least 2 options', {
          position: 'top-center',
        })
        return
      }
      if (!correctAnswer.trim()) {
        toast.error('Correct answer is required for MCQ questions', {
          position: 'top-center',
        })
        return
      }
    }

    const validOptions =
      questionType === 'mcq' ? options.filter(opt => opt.trim()) : undefined

    createQuestion.mutate({
      quizId,
      type: questionType,
      prompt: prompt.trim(),
      options: validOptions,
      correctAnswer:
        questionType === 'mcq' ? correctAnswer.trim() : correctAnswer || undefined,
      position: lastPosition + 1,
    })
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-600 text-white shadow-lg"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Question
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Question</DialogTitle>
            <DialogDescription>
              Create a new question for this quiz
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Question Type */}
            <div className="space-y-2">
              <Label htmlFor="questionType">Question Type</Label>
              <Select
                value={questionType}
                onValueChange={value => setQuestionType(value as QuestionType)}
              >
                <SelectTrigger id="questionType">
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mcq">Multiple Choice</SelectItem>
                  <SelectItem value="short">Short Answer</SelectItem>
                  <SelectItem value="code">Code</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Prompt */}
            <div className="space-y-2">
              <Label htmlFor="prompt">Question Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Enter your question here..."
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                rows={3}
              />
            </div>

            {/* MCQ Options */}
            {questionType === 'mcq' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Options (minimum 2)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddOption}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Option
                  </Button>
                </div>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={e => handleOptionChange(index, e.target.value)}
                      />
                      {options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveOption(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Correct Answer */}
            <div className="space-y-2">
              <Label htmlFor="correctAnswer">
                Correct Answer {questionType === 'mcq' ? '(required)' : '(optional)'}
              </Label>
              {questionType === 'mcq' ? (
                <Select value={correctAnswer} onValueChange={setCorrectAnswer}>
                  <SelectTrigger id="correctAnswer">
                    <SelectValue placeholder="Select correct answer" />
                  </SelectTrigger>
                  <SelectContent>
                    {options
                      .filter(opt => opt.trim())
                      .map((option, index) => (
                        <SelectItem key={index} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="correctAnswer"
                  placeholder="Enter expected answer (optional for short/code questions)"
                  value={correctAnswer}
                  onChange={e => setCorrectAnswer(e.target.value)}
                />
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createQuestion.isPending}
              className="bg-violet-600 hover:bg-violet-700"
            >
              {createQuestion.isPending ? 'Adding...' : 'Add Question'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
