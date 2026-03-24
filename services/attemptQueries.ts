import { useMutation, type UseMutationOptions } from '@tanstack/react-query'

import type { Attempt } from '@/schema/attemptSchema'

import { api } from './api'

// Query Keys
export const attemptKeys = {
  all: ['attempts'] as const,
  lists: () => [...attemptKeys.all, 'list'] as const,
  list: (filters?: unknown) => [...attemptKeys.lists(), { filters }] as const,
  details: () => [...attemptKeys.all, 'detail'] as const,
  detail: (id: number) => [...attemptKeys.details(), id] as const,
}

// Mutations
export function useStartAttempt(
  options?: UseMutationOptions<Attempt, Error, { quizId: number }>
) {
  return useMutation({
    mutationFn: (input: { quizId: number }) =>
      api.post<Attempt>('/attempts', { quizId: input.quizId }),
    ...options,
  })
}

export function useAnswerQuestion(
  options?: UseMutationOptions<
    void,
    Error,
    { attemptId: number; questionId: number; value: string }
  >
) {
  return useMutation({
    mutationFn: ({
      attemptId,
      questionId,
      value,
    }: {
      attemptId: number
      questionId: number
      value: string
    }) =>
      api.post<void>(`/attempts/${attemptId}/answer`, { questionId, value }),
    ...options,
  })
}

interface SubmitAttemptResponse {
  score: number
  details: Array<{
    questionId: number
    correct: boolean
    expected?: string
  }>
}

export function useSubmitAttempt(
  options?: UseMutationOptions<SubmitAttemptResponse, Error, number>
) {
  return useMutation({
    mutationFn: (attemptId: number) =>
      api.post<SubmitAttemptResponse>(`/attempts/${attemptId}/submit`),
    ...options,
  })
}

export function useRecordEvent(
  options?: UseMutationOptions<
    void,
    Error,
    { attemptId: number; event: string }
  >
) {
  return useMutation({
    mutationFn: ({ attemptId, event }: { attemptId: number; event: string }) =>
      api.post<void>(`/attempts/${attemptId}/events`, { event }),
    ...options,
  })
}
