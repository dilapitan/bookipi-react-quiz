import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function ErrorQuestionCard({
  errorMessage,
  onBack,
}: {
  errorMessage: string
  onBack: () => void
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle className="text-red-500">Error Loading Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{errorMessage}</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
