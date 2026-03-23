import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function EmptyCard() {
  return (
    <Card className="border-violet-200 dark:border-violet-900">
      <CardHeader>
        <CardTitle className="text-center text-violet-900 dark:text-violet-100">
          No Questions Yet
        </CardTitle>
        <CardDescription className="text-center">
          This quiz does not have any questions yet. Add some to get started!
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
