import { CheckCircle2, XCircle } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { questionType, type Question } from '@/schema'

interface QuestionResult {
  questionId: number
  correct: boolean
  expected?: string
}

interface ResultsDashboardProps {
  score: number
  details: QuestionResult[]
  questions: Question[]
  totalQuestions: number
}

export default function ResultsDashboard({
  score,
  details,
  questions,
  totalQuestions,
}: ResultsDashboardProps) {
  // Count only gradable questions (mcq and short, exclude code)
  const gradableQuestions = questions.filter(
    q => q.type === questionType.enum.mcq || q.type === questionType.enum.short
  )
  /**
   * Dev note: Auto-grading covers MCQ and short;
   * code prompts are not auto-graded and do
   * not affect score.
   */
  const gradableCount = gradableQuestions.length
  const percentage = gradableCount > 0 ? (score / gradableCount) * 100 : 0

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Overall Score */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-2">
          <div className="text-6xl font-bold text-primary">
            {score}/{gradableCount}
          </div>
          <p className="text-xl text-muted-foreground">
            {percentage.toFixed(0)}% Correct
          </p>
          {gradableCount < totalQuestions && (
            <p className="text-sm text-muted-foreground">
              ({totalQuestions - gradableCount} code question
              {totalQuestions - gradableCount !== 1 ? 's' : ''} not graded)
            </p>
          )}
        </CardContent>
      </Card>

      {/* Per-Question Results */}
      <Card>
        <CardHeader>
          <CardTitle>Question Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {details.map((result, index) => {
            const question = questions.find(q => q.id === result.questionId)

            // Skipping 'code' questions as they're not auto-graded
            if (!question || question.type === questionType.enum.code)
              return null

            return (
              <div
                key={result.questionId}
                className={`p-4 rounded-lg border ${
                  result.correct
                    ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900'
                    : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.correct ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm mb-1">
                      Question {index + 1}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {question.prompt}
                    </p>

                    <p className="text-sm mt-2 text-muted-foreground">
                      <span className="font-medium">Expected: </span>
                      {result.expected}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
