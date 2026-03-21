import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function LoaderQuizCard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map(i => (
        <Card key={i} className="border-violet-200 dark:border-violet-900">
          <CardHeader>
            <Skeleton className="h-6 w-3/4 bg-violet-200 dark:bg-violet-900" />
            <Skeleton className="h-4 w-full bg-violet-100 dark:bg-violet-950" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-1/2 bg-violet-100 dark:bg-violet-950" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
