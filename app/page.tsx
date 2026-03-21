'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useAuth } from '@/app/context/auth-context'
import { UserType } from '@/app/enums/user-type'
import BuilderDashboard from '@/components/quiz-builder/builder-dashboard'
import PlayerDashboard from '@/components/quiz-player/player-dashboard'

export default function Home() {
  const { userType, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !userType) {
      router.push('/login')
    }
  }, [userType, isLoading, router])

  if (isLoading || !userType) {
    return null
  }

  const isQuizBuilder = userType === UserType.QUIZ_BUILDER
  const bgClass = isQuizBuilder
    ? 'bg-[linear-gradient(180deg,#f0e6ff_0%,#fff_60%)] dark:bg-[linear-gradient(180deg,#1a0f2e_0%,#07102a_60%)]'
    : 'bg-[linear-gradient(180deg,#e0f0ff_0%,#fff_60%)] dark:bg-[linear-gradient(180deg,#0a1628_0%,#07102a_60%)]'

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <main className="p-4 md:p-12">
        {isQuizBuilder ? <BuilderDashboard /> : <PlayerDashboard />}
      </main>
    </div>
  )
}
