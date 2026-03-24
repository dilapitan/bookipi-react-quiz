import { z } from 'zod'

export const questionType = z.enum(['mcq', 'short', 'code'])

export const questionSchema = z.object({
  id: z.number(),
  quizId: z.number(),
  type: questionType,
  prompt: z.string().min(1, 'Prompt is required'),
  options: z.string().array().optional(),
  correctAnswer: z.string().optional(),
  position: z.number(),
})

export const createQuestionSchema = questionSchema
  .omit({
    id: true,
  })
  .refine(
    data => {
      if (data.type === questionType.enum.mcq) {
        return (
          data.options &&
          data.options.length >= 2 &&
          data.options.every(opt => opt.trim().length > 0)
        )
      }
      return true
    },
    {
      message: 'MCQ questions require at least 2 non-empty options',
      path: ['options'],
    }
  )
  .refine(
    data => {
      if (data.type === questionType.enum.mcq) {
        return data.correctAnswer && data.correctAnswer.trim().length > 0
      }
      return true
    },
    {
      message: 'Correct answer is required for MCQ questions',
      path: ['correctAnswer'],
    }
  )

export type Question = z.infer<typeof questionSchema>
export type QuestionType = z.infer<typeof questionType>
export type CreateQuestion = z.infer<typeof createQuestionSchema>
