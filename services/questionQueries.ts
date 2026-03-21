import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { api } from './api'
import type { Question, CreateQuestion } from '@/schema/questionSchema'

// Query Keys
export const questionKeys = {
  all: ['questions'] as const,
  lists: () => [...questionKeys.all, 'list'] as const,
  list: (quizId: number) => [...questionKeys.lists(), { quizId }] as const,
  details: () => [...questionKeys.all, 'detail'] as const,
  detail: (id: number) => [...questionKeys.details(), id] as const,
}

// Mutations
export function useCreateQuestion(
  options?: UseMutationOptions<Question, Error, CreateQuestion>
) {
  return useMutation({
    mutationFn: (question: CreateQuestion) =>
      api.post<Question>(`/quizzes/${question.quizId}/questions`, question),
    ...options,
  })
}

export function useUpdateQuestionPosition(
  options?: UseMutationOptions<
    Question,
    Error,
    { questionId: number; position: number }
  >
) {
  return useMutation({
    mutationFn: ({
      questionId,
      position,
    }: {
      questionId: number
      position: number
    }) => api.put<Question>(`/questions/${questionId}`, { position }),
    ...options,
  })
}

export function useDeleteQuestion(
  options?: UseMutationOptions<void, Error, number>
) {
  return useMutation({
    mutationFn: (questionId: number) =>
      api.delete<void>(`/questions/${questionId}`),
    ...options,
  })
}
