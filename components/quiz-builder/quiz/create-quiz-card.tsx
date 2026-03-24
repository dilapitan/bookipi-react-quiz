'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createQuizSchema } from '@/schema/quizSchema'
import { useCreateQuiz } from '@/services/quizQueries'

export default function CreateQuizCard() {
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)

  const form = useForm({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      title: '',
      description: '',
      timeLimitSeconds: 0,
    },
  })

  const createQuiz = useCreateQuiz({
    onSuccess: data => {
      setOpen(false)
      form.reset()
      toast.success('Quiz created successfully', {
        position: 'top-center',
      })
      router.push(`/builder/${data.id}`)
    },
  })

  function onSubmit(data: z.infer<typeof createQuizSchema>) {
    createQuiz.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Create Quiz Button */}
        <Button
          size="lg"
          className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-600 text-white shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Quiz
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form id="create-quiz-form" onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New Quiz</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new quiz
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <FieldGroup>
              {/* Title */}
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-quiz-title">Title</FieldLabel>
                    <Input
                      {...field}
                      id="create-quiz-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter quiz title"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Description */}
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-quiz-description">
                      Description
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="create-quiz-description"
                      placeholder="Enter quiz description"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Time Limit in Seconds */}
              <Controller
                name="timeLimitSeconds"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-quiz-time-limit">
                      Time Limit (seconds)
                    </FieldLabel>
                    <Input
                      {...field}
                      id="create-quiz-time-limit"
                      type="number"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter time limit in seconds"
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                    <FieldDescription>
                      The time limit for completing the quiz in seconds.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {createQuiz.error && (
              <p className="mt-4 text-sm text-destructive">
                Error creating quiz: {createQuiz.error.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
                form.reset()
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="create-quiz-form"
              disabled={createQuiz.isPending}
            >
              {createQuiz.isPending ? 'Creating...' : 'Create Quiz'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
