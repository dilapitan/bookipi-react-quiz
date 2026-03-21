import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query'

import type {
  Quiz,
  QuizWithQuestions,
  CreateQuiz,
  UpdateQuiz,
} from '@/schema/quizSchema'

import { api } from './api'

// Query Keys
export const quizKeys = {
  all: ['quizzes'] as const,
  lists: () => [...quizKeys.all, 'list'] as const,
  list: (filters?: unknown) => [...quizKeys.lists(), { filters }] as const,
  details: () => [...quizKeys.all, 'detail'] as const,
  detail: (id: number) => [...quizKeys.details(), id] as const,
  withQuestions: (id: number) => [...quizKeys.detail(id), 'questions'] as const,
}

// Queries
export function useQuizzes(
  options?: Omit<UseQueryOptions<Quiz[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: quizKeys.lists(),
    queryFn: () => api.get<Quiz[]>('/quizzes'),
    ...options,
  })
}

export function useQuizWithQuestions(
  id: number,
  options?: Omit<UseQueryOptions<QuizWithQuestions>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: quizKeys.withQuestions(id),
    queryFn: () => api.get<QuizWithQuestions>(`/quizzes/${id}`),
    enabled: !!id,
    ...options,
  })
}

// Mutations
export function useCreateQuiz(
  options?: UseMutationOptions<Quiz, Error, CreateQuiz>
) {
  return useMutation({
    mutationFn: (quiz: CreateQuiz) => api.post<Quiz>('/quizzes', quiz),
    ...options,
  })
}

export function useUpdateQuiz(
  options?: UseMutationOptions<
    Quiz,
    Error,
    { quizId: number; quiz: UpdateQuiz }
  >
) {
  return useMutation({
    mutationFn: ({ quizId, quiz }: { quizId: number; quiz: UpdateQuiz }) =>
      api.put<Quiz>(`/quizzes/${quizId}`, quiz),
    ...options,
  })
}
