'use client'

import { useRouter } from 'next/navigation'

import { LucideUserPen, ShieldUser } from 'lucide-react'

import { useAuth } from '@/app/context/auth-context'
import { UserType } from '@/app/enums/user-type'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

const UserCard = ({ userType }: { userType: UserType }) => {
  const { login } = useAuth()
  const router = useRouter()
  const isQuizBuilder = userType === UserType.QUIZ_BUILDER
  const cardColour = isQuizBuilder ? 'purple' : 'blue'

  const handleLogin = () => {
    login(userType)
    router.push('/')
  }

  return (
    <Card
      className={`group hover:shadow-xl transition-all duration-300  border-2 hover:border-${cardColour}-500 dark:hover:border-${cardColour}-400`}
    >
      <CardContent className="pt-12 pb-8 flex flex-col items-center text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          {isQuizBuilder ? (
            <ShieldUser className="w-10 h-10 text-purple-600 dark:text-purple-400" />
          ) : (
            <LucideUserPen className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          )}
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {isQuizBuilder ? UserType.QUIZ_BUILDER : UserType.QUIZ_PLAYER}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {isQuizBuilder
              ? 'Create and build questionnaires'
              : 'Take quizzes and test your skills'}
          </p>
        </div>
      </CardContent>
      <CardFooter className="pb-6">
        <Button
          onClick={handleLogin}
          className={`w-full cursor-pointer bg-${cardColour}-600 hover:bg-${cardColour}-700 dark:bg-${cardColour}-500 dark:hover:bg-${cardColour}-600`}
          size="lg"
        >
          Continue as {isQuizBuilder ? 'Builder' : 'Player'}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          {/* Headers */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
            Welcome to Quizizy
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Choose your role to continue
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Login as Quiz Player */}
          <UserCard userType={UserType.QUIZ_PLAYER} />

          {/* Login as Quiz Builder */}
          <UserCard userType={UserType.QUIZ_BUILDER} />
        </div>
      </div>
    </div>
  )
}
