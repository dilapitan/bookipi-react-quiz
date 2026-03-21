import { z } from 'zod'

export const questionType = z.enum(['mcq', 'short', 'code'])

export const questionSchema = z.object({
  id: z.number(),
  quizId: z.number(),
  type: questionType,
  prompt: z.string(),
  options: z.string().array().optional(),
  correctAnswer: z.string().optional(),
  position: z.number(),
})

export const createQuestionSchema = questionSchema.omit({
  id: true,
})

export type Question = z.infer<typeof questionSchema>
export type QuestionType = z.infer<typeof questionType>
export type CreateQuestion = z.infer<typeof createQuestionSchema>
