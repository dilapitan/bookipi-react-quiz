import { screen } from '@testing-library/react'
import { render, mockQuestion } from '../utils/test-utils'
import ResultsDashboard from '@/components/quiz-player/results/results-dashboard'

describe('ResultsDashboard', () => {
  const mockQuestions = [
    {
      ...mockQuestion,
      id: 1,
      type: 'mcq' as const,
      prompt: 'Question 1',
      position: 0,
    },
    {
      ...mockQuestion,
      id: 2,
      type: 'mcq' as const,
      prompt: 'Question 2',
      position: 1,
    },
    {
      ...mockQuestion,
      id: 3,
      type: 'short' as const,
      prompt: 'Question 3',
      position: 2,
    },
  ]

  const mockDetails = [
    { questionId: 1, correct: true, expected: 'Answer 1' },
    { questionId: 2, correct: false, expected: 'Answer 2' },
    { questionId: 3, correct: true, expected: 'Answer 3' },
  ]

  it('should render quiz results with score', () => {
    render(
      <ResultsDashboard
        score={2}
        details={mockDetails}
        questions={mockQuestions}
        totalQuestions={3}
      />
    )

    expect(screen.getByText('Quiz Results')).toBeInTheDocument()
    expect(screen.getByText('2/3')).toBeInTheDocument()
    expect(screen.getByText(/67% correct/i)).toBeInTheDocument()
  })

  it('should render question breakdown', () => {
    render(
      <ResultsDashboard
        score={2}
        details={mockDetails}
        questions={mockQuestions}
        totalQuestions={3}
      />
    )

    expect(screen.getByText('Question Breakdown')).toBeInTheDocument()
    // Questions appear both as labels and prompts, so use getAllByText
    expect(screen.getAllByText(/Question 1/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Question 2/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Question 3/).length).toBeGreaterThan(0)
  })

  it('should display correct and incorrect indicators', () => {
    render(
      <ResultsDashboard
        score={2}
        details={mockDetails}
        questions={mockQuestions}
        totalQuestions={3}
      />
    )

    // Check for expected answers
    expect(screen.getByText('Answer 1')).toBeInTheDocument()
    expect(screen.getByText('Answer 2')).toBeInTheDocument()
    expect(screen.getByText('Answer 3')).toBeInTheDocument()
  })

  it('should show anti-cheat summary when violations exist', () => {
    const antiCheatEvents = {
      tabSwitches: 3,
      pastes: 2,
    }

    render(
      <ResultsDashboard
        score={2}
        details={mockDetails}
        questions={mockQuestions}
        totalQuestions={3}
        antiCheatEvents={antiCheatEvents}
      />
    )

    expect(screen.getByText(/anti-cheat summary/i)).toBeInTheDocument()
    expect(screen.getByText(/3 tab switch/i)).toBeInTheDocument()
    expect(screen.getByText(/2 paste/i)).toBeInTheDocument()
  })

  it('should not show anti-cheat summary when no violations', () => {
    const antiCheatEvents = {
      tabSwitches: 0,
      pastes: 0,
    }

    render(
      <ResultsDashboard
        score={2}
        details={mockDetails}
        questions={mockQuestions}
        totalQuestions={3}
        antiCheatEvents={antiCheatEvents}
      />
    )

    expect(screen.queryByText(/anti-cheat/i)).not.toBeInTheDocument()
  })

  it('should show time up banner when time expired', () => {
    render(
      <ResultsDashboard
        score={2}
        details={mockDetails}
        questions={mockQuestions}
        totalQuestions={3}
        isTimeUp={true}
      />
    )

    expect(screen.getByText(/time's up/i)).toBeInTheDocument()
    expect(screen.getByText(/automatically submitted/i)).toBeInTheDocument()
  })

  it('should not show time up banner when time was not expired', () => {
    render(
      <ResultsDashboard
        score={2}
        details={mockDetails}
        questions={mockQuestions}
        totalQuestions={3}
        isTimeUp={false}
      />
    )

    expect(screen.queryByText(/time's up/i)).not.toBeInTheDocument()
  })

  it('should exclude code questions from grading', () => {
    const questionsWithCode = [
      ...mockQuestions,
      {
        ...mockQuestion,
        id: 4,
        type: 'code' as const,
        prompt: 'Code Question',
        position: 3,
      },
    ]

    const detailsWithCode = [
      ...mockDetails,
      { questionId: 4, correct: false, expected: 'Code Answer' },
    ]

    render(
      <ResultsDashboard
        score={2}
        details={detailsWithCode}
        questions={questionsWithCode}
        totalQuestions={4}
      />
    )

    // Score should only count gradable questions (not code)
    expect(screen.getByText('2/3')).toBeInTheDocument()
    expect(screen.getByText(/1 code question.*not graded/i)).toBeInTheDocument()

    // Code question should not appear in breakdown
    expect(screen.queryByText('Code Question')).not.toBeInTheDocument()
  })

  it('should calculate percentage correctly', () => {
    render(
      <ResultsDashboard
        score={1}
        details={mockDetails}
        questions={mockQuestions}
        totalQuestions={3}
      />
    )

    expect(screen.getByText(/33% correct/i)).toBeInTheDocument()
  })

  it('should handle perfect score', () => {
    const allCorrectDetails = mockDetails.map(d => ({ ...d, correct: true }))

    render(
      <ResultsDashboard
        score={3}
        details={allCorrectDetails}
        questions={mockQuestions}
        totalQuestions={3}
      />
    )

    expect(screen.getByText('3/3')).toBeInTheDocument()
    expect(screen.getByText(/100% correct/i)).toBeInTheDocument()
  })

  it('should handle zero score', () => {
    const allWrongDetails = mockDetails.map(d => ({ ...d, correct: false }))

    render(
      <ResultsDashboard
        score={0}
        details={allWrongDetails}
        questions={mockQuestions}
        totalQuestions={3}
      />
    )

    expect(screen.getByText('0/3')).toBeInTheDocument()
    expect(screen.getByText(/0% correct/i)).toBeInTheDocument()
  })
})
