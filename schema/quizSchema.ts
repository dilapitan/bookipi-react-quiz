import { z } from 'zod'

import { questionSchema } from '@/schema'

export const quizSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  timeLimitSeconds: z.number(),
  isPublished: z.boolean().default(true),
  createdAt: z.string(),
})

export const createQuizSchema = quizSchema.omit({
  id: true,
  createdAt: true,
})

export const updateQuizSchema = quizSchema
  .pick({
    title: true,
    description: true,
    isPublished: true,
  })
  .partial()

export const quizWithQuestionsSchema = quizSchema.extend(questionSchema.array())

export type Quiz = z.infer<typeof quizSchema>
export type CreateQuiz = z.infer<typeof createQuizSchema>
export type UpdateQuiz = z.infer<typeof updateQuizSchema>
export type QuizWithQuestions = z.infer<typeof quizWithQuestionsSchema>
