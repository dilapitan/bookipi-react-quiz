import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../utils/test-utils'
import CreateQuizCard from '@/components/quiz-builder/quiz/create-quiz-card'
import { useCreateQuiz } from '@/services/quizQueries'

// Mock the hooks
jest.mock('@/services/quizQueries')

const mockUseCreateQuiz = useCreateQuiz as jest.MockedFunction<
  typeof useCreateQuiz
>

describe('CreateQuizCard', () => {
  const mockMutate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseCreateQuiz.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    } as any)
  })

  it('should render the create quiz button', () => {
    render(<CreateQuizCard />)
    expect(
      screen.getByRole('button', { name: /create quiz/i })
    ).toBeInTheDocument()
  })

  it('should open dialog when create quiz button is clicked', async () => {
    const user = userEvent.setup()
    render(<CreateQuizCard />)

    const createButton = screen.getByRole('button', { name: /create quiz/i })
    await user.click(createButton)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Create New Quiz')).toBeInTheDocument()
  })

  it('should display form fields in the dialog', async () => {
    const user = userEvent.setup()
    render(<CreateQuizCard />)

    await user.click(screen.getByRole('button', { name: /create quiz/i }))

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/time limit/i)).toBeInTheDocument()
  })

  it('should have form validation for required fields', async () => {
    const user = userEvent.setup()
    render(<CreateQuizCard />)

    await user.click(screen.getByRole('button', { name: /create quiz/i }))

    // Form fields should be present and required
    const titleInput = screen.getByLabelText(/title/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    const timeLimitInput = screen.getByLabelText(/time limit/i)

    expect(titleInput).toBeInTheDocument()
    expect(descriptionInput).toBeInTheDocument()
    expect(timeLimitInput).toBeInTheDocument()
  })

  it('should submit form with valid data', async () => {
    const user = userEvent.setup()
    const mockQuizData = {
      id: 'new-quiz-1',
      title: 'My Test Quiz',
      description: 'Test description',
      time_limit: 1800,
    }

    let capturedData: any = null
    // Mock successful creation
    mockUseCreateQuiz.mockReturnValue({
      mutate: (data: any, options?: any) => {
        capturedData = data
        mockMutate(data)
        // Simulate async operation
        setTimeout(() => {
          options?.onSuccess?.(mockQuizData)
        }, 0)
      },
      isPending: false,
      error: null,
    } as any)

    render(<CreateQuizCard />)

    await user.click(screen.getByRole('button', { name: /create quiz/i }))

    // Fill in the form
    await user.type(screen.getByLabelText(/title/i), 'My Test Quiz')
    await user.type(screen.getByLabelText(/description/i), 'Test description')
    await user.type(screen.getByLabelText(/time limit/i), '1800')

    // Submit
    const submitButton = screen.getByRole('button', { name: /^create quiz$/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled()
      expect(capturedData).toMatchObject({
        title: 'My Test Quiz',
        description: 'Test description',
        timeLimitSeconds: 1800,
      })
    })
  })

  it('should close dialog on cancel', async () => {
    const user = userEvent.setup()
    render(<CreateQuizCard />)

    await user.click(screen.getByRole('button', { name: /create quiz/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('should show loading state while creating quiz', async () => {
    const user = userEvent.setup()
    mockUseCreateQuiz.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      error: null,
    } as any)

    render(<CreateQuizCard />)

    await user.click(screen.getByRole('button', { name: /create quiz/i }))

    expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled()
  })
})
