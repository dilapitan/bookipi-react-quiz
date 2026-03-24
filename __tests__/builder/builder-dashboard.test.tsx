import { screen } from '@testing-library/react'
import { render, mockQuiz } from '../utils/test-utils'
import BuilderDashboard from '@/components/quiz-builder/builder-dashboard'
import { useQuizzes } from '@/services/quizQueries'

jest.mock('@/services/quizQueries')
jest.mock('@/components/quiz-builder/quiz/create-quiz-card', () => {
  return function MockCreateQuizCard() {
    return <button>Create Quiz</button>
  }
})

const mockUseQuizzes = useQuizzes as jest.MockedFunction<typeof useQuizzes>

describe('BuilderDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render loading state', () => {
    mockUseQuizzes.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any)

    render(<BuilderDashboard />)

    expect(screen.getByText(/builder dashboard/i)).toBeInTheDocument()
    // Skeleton loaders should be present
    expect(screen.getByTestId('loader-quiz-card')).toBeInTheDocument()
  })

  it('should render error state', () => {
    mockUseQuizzes.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load quizzes'),
    } as any)

    render(<BuilderDashboard />)

    expect(screen.getByText(/failed to load quizzes/i)).toBeInTheDocument()
  })

  it('should render empty state when no quizzes exist', () => {
    mockUseQuizzes.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any)

    render(<BuilderDashboard />)

    expect(screen.getByText(/builder dashboard/i)).toBeInTheDocument()
    expect(screen.getByText(/no quizzes yet/i)).toBeInTheDocument()
  })

  it('should render quiz list when quizzes exist', () => {
    const mockQuizzes = [
      { ...mockQuiz, id: '1', title: 'Quiz 1' },
      { ...mockQuiz, id: '2', title: 'Quiz 2' },
      { ...mockQuiz, id: '3', title: 'Quiz 3' },
    ]

    mockUseQuizzes.mockReturnValue({
      data: mockQuizzes,
      isLoading: false,
      error: null,
    } as any)

    render(<BuilderDashboard />)

    expect(screen.getByText(/builder dashboard/i)).toBeInTheDocument()
    expect(screen.getByText('Quiz 1')).toBeInTheDocument()
    expect(screen.getByText('Quiz 2')).toBeInTheDocument()
    expect(screen.getByText('Quiz 3')).toBeInTheDocument()
  })

  it('should render create quiz button', () => {
    mockUseQuizzes.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any)

    render(<BuilderDashboard />)

    expect(
      screen.getByRole('button', { name: /create quiz/i })
    ).toBeInTheDocument()
  })
})
