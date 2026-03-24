import React, { ReactElement } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, RenderOptions } from '@testing-library/react'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

interface AllTheProvidersProps {
  children: React.ReactNode
}

function AllTheProviders({ children }: AllTheProvidersProps) {
  const queryClient = createTestQueryClient()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock data helpers
export const mockQuiz = {
  id: 'test-quiz-1',
  title: 'Test Quiz',
  description: 'A test quiz description',
  time_limit: 30,
  is_published: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

export const mockQuestion = {
  id: 1,
  quizId: 1,
  type: 'mcq' as const,
  prompt: 'What is 2 + 2?',
  options: ['3', '4', '5'],
  correctAnswer: '4',
  position: 0,
}

export const mockAttempt = {
  id: 'test-attempt-1',
  quiz_id: 'test-quiz-1',
  user_id: 'test-user-1',
  started_at: '2024-01-01T00:00:00Z',
  completed_at: null,
  score: null,
  total_points: 100,
  answers: [],
}
