'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import * as z from 'zod'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  createQuestionSchema,
  type QuestionType,
  CreateQuestion,
} from '@/schema/questionSchema'
import { useCreateQuestion } from '@/services/questionQueries'
import { quizKeys } from '@/services/quizQueries'

interface AddQuestionButtonProps {
  quizId: number
  lastPosition: number
}

export default function AddQuestionButton({
  quizId,
  lastPosition,
}: AddQuestionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof createQuestionSchema>>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      quizId,
      type: 'mcq',
      prompt: '',
      options: ['', ''],
      correctAnswer: '',
      position: lastPosition + 1,
    },
  })

  const questionType = useWatch({
    control: form.control,
    name: 'type',
  })

  const options = useWatch({
    control: form.control,
    name: 'options',
  })

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
    form.reset({
      quizId,
      type: 'mcq',
      prompt: '',
      options: ['', ''],
      correctAnswer: '',
      position: lastPosition + 1,
    })
  }

  const handleAddOption = () => {
    const currentOptions = form.getValues('options') || []
    form.setValue('options', [...currentOptions, ''])
  }

  const handleRemoveOption = (index: number) => {
    const currentOptions = form.getValues('options') || []
    const MAX_OPTIONS = 2
    if (currentOptions.length > MAX_OPTIONS) {
      form.setValue(
        'options',
        currentOptions.filter((_, i) => i !== index)
      )
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    const currentOptions = form.getValues('options') || []
    const newOptions = [...currentOptions]
    newOptions[index] = value
    form.setValue('options', newOptions)
  }

  function onSubmit(data: CreateQuestion) {
    const validOptions =
      data.type === 'mcq' ? data.options?.filter(opt => opt.trim()) : undefined

    createQuestion.mutate({
      ...data,
      prompt: data.prompt.trim(),
      options: validOptions,
      correctAnswer:
        data.type === 'mcq'
          ? data.correctAnswer?.trim()
          : data.correctAnswer || undefined,
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
          <form id="add-question-form" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add New Question</DialogTitle>
              <DialogDescription>
                Create a new question for this quiz
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <FieldGroup>
                {/* Question Type */}
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="questionType">
                        Question Type
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={value => {
                          field.onChange(value as QuestionType)
                          // Reset options and correctAnswer when changing type
                          if (value !== 'mcq') {
                            form.setValue('options', undefined)
                            form.setValue('correctAnswer', '')
                            form.clearErrors('options')
                            form.clearErrors('correctAnswer')
                          } else {
                            form.setValue('options', ['', ''])
                            form.setValue('correctAnswer', '')
                          }
                        }}
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
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Prompt */}
                <Controller
                  name="prompt"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="prompt">Question Prompt</FieldLabel>
                      <Textarea
                        {...field}
                        id="prompt"
                        placeholder="Enter your question here..."
                        aria-invalid={fieldState.invalid}
                        rows={3}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* MCQ Options */}
                {questionType === 'mcq' && (
                  <Controller
                    name="options"
                    control={form.control}
                    render={({ fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <div className="flex items-center justify-between">
                          <FieldLabel>Options (minimum 2)</FieldLabel>
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
                          {(options || []).map((option, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <Input
                                placeholder={`Option ${index + 1}`}
                                value={option}
                                onChange={e =>
                                  handleOptionChange(index, e.target.value)
                                }
                              />
                              {(options || []).length > 2 && (
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
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                )}

                {/* Correct Answer */}
                <Controller
                  name="correctAnswer"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="correctAnswer">
                        Correct Answer{' '}
                        {questionType === 'mcq' ? '(required)' : '(optional)'}
                      </FieldLabel>
                      {questionType === 'mcq' ? (
                        <Select
                          value={field.value || ''}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="correctAnswer">
                            <SelectValue placeholder="Select correct answer" />
                          </SelectTrigger>
                          <SelectContent>
                            {(options || [])
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
                          {...field}
                          id="correctAnswer"
                          placeholder="Enter expected answer (optional for short/code questions)"
                          aria-invalid={fieldState.invalid}
                        />
                      )}
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              {createQuestion.error && (
                <p className="mt-4 text-sm text-destructive">
                  Error creating question: {createQuestion.error.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                form="add-question-form"
                disabled={createQuestion.isPending}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {createQuestion.isPending ? 'Adding...' : 'Add Question'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
