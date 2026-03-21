import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function ErrorQuizCard({
  errorMessage,
}: {
  errorMessage: string
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-violet-50 to-purple-50 dark:from-gray-950 dark:to-violet-950/20 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">
              Error Loading Quizzes
            </CardTitle>
            <CardDescription>{errorMessage}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
