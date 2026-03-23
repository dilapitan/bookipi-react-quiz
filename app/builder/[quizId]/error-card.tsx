import Link from 'next/link'

import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function ErrorCard({ errorMessage }: { errorMessage: string }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f0e6ff_0%,#fff_60%)] dark:bg-[linear-gradient(180deg,#1a0f2e_0%,#07102a_60%)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">
              Error Loading Quiz
            </CardTitle>
            <CardDescription>
              {errorMessage || 'Failed to load quiz details'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
