import Link from 'next/link'

import { formatDistanceToNow } from 'date-fns'
import { FileText, Clock } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Quiz } from '@/schema'

export default function QuizCard({ quiz }: { quiz: Quiz }) {
  return (
    <Link href={`/builder/${quiz.id}`}>
      <Card
        key={quiz.id}
        className="border-violet-200 dark:border-violet-900 hover:shadow-lg hover:border-violet-400 dark:hover:border-violet-700 transition-all cursor-pointer group"
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="truncate w-48 md:w-52 lg:w-60  text-violet-900 dark:text-violet-100 group-hover:text-violet-700 dark:group-hover:text-violet-300 line-clamp-2">
                {quiz.title}
              </CardTitle>
              <CardDescription className="mt-2 line-clamp-2">
                {quiz.description}
              </CardDescription>
            </div>
            {quiz.isPublished ? (
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">
                Published
              </span>
            ) : (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 font-medium">
                Unpublished
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-violet-600 dark:text-violet-400">
            {/* Quiz ID */}
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>ID: {quiz.id}</span>
            </div>

            {/* Timelimit */}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{Math.floor(quiz.timeLimitSeconds / 60)} min</span>
            </div>
          </div>

          {/* Created At */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Created{' '}
            {formatDistanceToNow(new Date(quiz.createdAt), {
              addSuffix: true,
            })}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
