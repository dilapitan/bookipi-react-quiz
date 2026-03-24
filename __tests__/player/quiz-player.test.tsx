import { screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, mockQuiz, mockQuestion } from '../utils/test-utils'
import QuizPlayer from '@/components/quiz-player/player/quiz-player'
import {
  useStartAttempt,
  useAnswerQuestion,
  useSubmitAttempt,
} from '@/services/attemptQueries'
import { useQuizWithQuestions } from '@/services/quizQueries'

jest.mock('@/services/attemptQueries')
jest.mock('@/services/quizQueries')
jest.mock('@/hooks/useAntiCheat', () => ({
  useAntiCheat: () => ({
    logPasteEvent: jest.fn(),
  }),
}))

const mockUseQuizWithQuestions = useQuizWithQuestions as jest.MockedFunction<
  typeof useQuizWithQuestions
>
const mockUseStartAttempt = useStartAttempt as jest.MockedFunction<
  typeof useStartAttempt
>
const mockUseAnswerQuestion = useAnswerQuestion as jest.MockedFunction<
  typeof useAnswerQuestion
>
const mockUseSubmitAttempt = useSubmitAttempt as jest.MockedFunction<
  typeof useSubmitAttempt
>

describe('QuizPlayer', () => {
  const mockOnBack = jest.fn()
  const mockMutateStart = jest.fn()
  const mockMutateAnswer = jest.fn()
  const mockMutateSubmit = jest.fn()

  const mockQuizData = {
    ...mockQuiz,
    timeLimitSeconds: 300,
    questions: [
      { ...mockQuestion, id: 1, prompt: 'Question 1', position: 0 },
      { ...mockQuestion, id: 2, prompt: 'Question 2', position: 1 },
    ],
  }

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseQuizWithQuestions.mockReturnValue({
      data: mockQuizData,
      isLoading: false,
      error: null,
    } as any)

    mockUseStartAttempt.mockReturnValue({
      mutate: mockMutateStart,
      isPending: false,
    } as any)

    mockUseAnswerQuestion.mockReturnValue({
      mutate: mockMutateAnswer,
    } as any)

    mockUseSubmitAttempt.mockReturnValue({
      mutate: mockMutateSubmit,
    } as any)
  })

  it('should render loading state', () => {
    mockUseQuizWithQuestions.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any)

    render(<QuizPlayer quizId={1} onBack={mockOnBack} />)

    expect(screen.getByTestId('loading-question-card')).toBeInTheDocument()
  })

  it('should render error state', () => {
    mockUseQuizWithQuestions.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load quiz'),
    } as any)

    render(<QuizPlayer quizId={1} onBack={mockOnBack} />)

    expect(screen.getByText(/failed to load quiz/i)).toBeInTheDocument()
  })

  it('should show anti-cheat warning dialog on mount', () => {
    render(<QuizPlayer quizId={1} onBack={mockOnBack} />)

    expect(screen.getByText(/anti-cheat policy/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /start quiz/i })
    ).toBeInTheDocument()
  })

  it('should start quiz attempt after accepting warning', async () => {
    const user = userEvent.setup({ delay: null })

    mockUseStartAttempt.mockReturnValue({
      mutate: (data: any, options: any) => {
        mockMutateStart(data)
        options?.onSuccess?.({ id: 123 })
      },
      isPending: false,
    } as any)

    render(<QuizPlayer quizId={1} onBack={mockOnBack} />)

    const acceptButton = screen.getByRole('button', { name: /start quiz/i })
    await user.click(acceptButton)

    await waitFor(() => {
      expect(mockMutateStart).toHaveBeenCalledWith({ quizId: 1 })
    })
  })

  it('should display quiz title and first question after accepting', async () => {
    const user = userEvent.setup({ delay: null })

    mockUseStartAttempt.mockReturnValue({
      mutate: (data: any, options: any) => {
        mockMutateStart(data)
        options?.onSuccess?.({ id: 123 })
      },
      isPending: false,
    } as any)

    render(<QuizPlayer quizId={1} onBack={mockOnBack} />)

    await user.click(screen.getByRole('button', { name: /start quiz/i }))

    await waitFor(() => {
      expect(screen.getByText(mockQuizData.title)).toBeInTheDocument()
      expect(screen.getByText('Question 1')).toBeInTheDocument()
      expect(screen.getByText(/question 1 of 2/i)).toBeInTheDocument()
    })
  })

  it('should navigate between questions', async () => {
    const user = userEvent.setup({ delay: null })

    mockUseStartAttempt.mockReturnValue({
      mutate: (data: any, options: any) => {
        options?.onSuccess?.({ id: 123 })
      },
      isPending: false,
    } as any)

    render(<QuizPlayer quizId={1} onBack={mockOnBack} />)

    await user.click(screen.getByRole('button', { name: /start quiz/i }))

    await waitFor(() => {
      expect(screen.getByText('Question 1')).toBeInTheDocument()
    })

    // Click next button
    const nextButton = screen.getByRole('button', { name: /next/i })
    await user.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText('Question 2')).toBeInTheDocument()
    })

    // Click previous button
    const prevButton = screen.getByRole('button', { name: /previous/i })
    await user.click(prevButton)

    await waitFor(() => {
      expect(screen.getByText('Question 1')).toBeInTheDocument()
    })
  })

  it('should save answer when selecting an option', async () => {
    const user = userEvent.setup({ delay: null })

    mockUseStartAttempt.mockReturnValue({
      mutate: (data: any, options: any) => {
        options?.onSuccess?.({ id: 123 })
      },
      isPending: false,
    } as any)

    render(<QuizPlayer quizId={1} onBack={mockOnBack} />)

    await user.click(screen.getByRole('button', { name: /start quiz/i }))

    await waitFor(() => {
      expect(screen.getByText('Question 1')).toBeInTheDocument()
    })

    // Find and click an answer option
    const option = screen.getByText('4')
    await user.click(option)

    await waitFor(() => {
      expect(mockMutateAnswer).toHaveBeenCalledWith(
        expect.objectContaining({
          attemptId: 123,
          questionId: 1,
        }),
        expect.any(Object)
      )
    })
  })

  it('should show submit button on last question', async () => {
    const user = userEvent.setup({ delay: null })

    mockUseStartAttempt.mockReturnValue({
      mutate: (data: any, options: any) => {
        options?.onSuccess?.({ id: 123 })
      },
      isPending: false,
    } as any)

    render(<QuizPlayer quizId={1} onBack={mockOnBack} />)

    await user.click(screen.getByRole('button', { name: /start quiz/i }))

    await waitFor(() => {
      expect(screen.getByText('Question 1')).toBeInTheDocument()
    })

    // Navigate to last question
    const nextButton = screen.getByRole('button', { name: /next/i })
    await user.click(nextButton)

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /submit quiz/i })
      ).toBeInTheDocument()
    })
  })

  it('should submit quiz when submit button is clicked', async () => {
    const user = userEvent.setup({ delay: null })

    mockUseStartAttempt.mockReturnValue({
      mutate: (data: any, options: any) => {
        options?.onSuccess?.({ id: 123 })
      },
      isPending: false,
    } as any)

    mockUseSubmitAttempt.mockReturnValue({
      mutate: (attemptId: any, options: any) => {
        mockMutateSubmit(attemptId, options)
        options?.onSuccess?.({
          score: 10,
          details: [
            { questionId: 1, correct: true },
            { questionId: 2, correct: false },
          ],
        })
      },
    } as any)

    render(<QuizPlayer quizId={1} onBack={mockOnBack} />)

    await user.click(screen.getByRole('button', { name: /start quiz/i }))

    await waitFor(() => {
      expect(screen.getByText('Question 1')).toBeInTheDocument()
    })

    // Navigate to last question
    const nextButton = screen.getByRole('button', { name: /next/i })
    await user.click(nextButton)

    // Click submit
    const submitButton = screen.getByRole('button', { name: /submit quiz/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockMutateSubmit).toHaveBeenCalledWith(123, expect.any(Object))
    })
  })

  it('should display countdown timer', async () => {
    const user = userEvent.setup({ delay: null })

    mockUseStartAttempt.mockReturnValue({
      mutate: (data: any, options: any) => {
        options?.onSuccess?.({ id: 123 })
      },
      isPending: false,
    } as any)

    render(<QuizPlayer quizId={1} onBack={mockOnBack} />)

    await user.click(screen.getByRole('button', { name: /start quiz/i }))

    await waitFor(() => {
      expect(screen.getByText(/05:00/)).toBeInTheDocument()
    })
  })
})
