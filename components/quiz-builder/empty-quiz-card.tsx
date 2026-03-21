import { FileText } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

export default function EmptyQuizCard() {
  return (
    <Card className="border-violet-200 dark:border-violet-900">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <FileText className="w-16 h-16 text-violet-300 dark:text-violet-700 mb-4" />
        <h3 className="text-xl font-semibold text-violet-900 dark:text-violet-100 mb-2">
          No quizzes yet
        </h3>
        <p className="text-violet-600 dark:text-violet-400 text-center mb-6">
          Get started by creating your first quiz
        </p>
      </CardContent>
    </Card>
  )
}
