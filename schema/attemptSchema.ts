import { z } from 'zod'

export const answerSchema = z.object({
  questionId: z.number(),
  value: z.string(),
})

export const attemptSchema = z.object({
  id: z.number(),
  quizId: z.number(),
  startedAt: z.string(),
  submittedAt: z.string().optional(),
  answers: answerSchema.array(),
  score: z.number().optional(),
})

export type Answer = z.infer<typeof answerSchema>
export type Attempt = z.infer<typeof attemptSchema>
