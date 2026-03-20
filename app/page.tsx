'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useAuth } from '@/app/context/auth-context'
import { UserType } from '@/app/enums/user-type'

export default function Home() {
  const { userType } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!userType) {
      router.push('/login')
    }
  }, [userType, router])

  if (!userType) {
    return null
  }

  const bgClass =
    userType === UserType.QUIZ_BUILDER
      ? 'bg-[linear-gradient(180deg,#f0e6ff_0%,#fff_60%)] dark:bg-[linear-gradient(180deg,#1a0f2e_0%,#07102a_60%)]'
      : 'bg-[linear-gradient(180deg,#e0f0ff_0%,#fff_60%)] dark:bg-[linear-gradient(180deg,#0a1628_0%,#07102a_60%)]'

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <main className="p-4 md:p-12">Home</main>
    </div>
  )
}
