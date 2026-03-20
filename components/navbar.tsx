'use client'

import { useState } from 'react'

import { useRouter, usePathname } from 'next/navigation'

import { Menu, X, LogOut, LucideUserPen, ShieldUser } from 'lucide-react'

import { useAuth } from '@/app/context/auth-context'
import { UserType } from '@/app/enums/user-type'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const router = useRouter()
  const pathname = usePathname()
  const { userType, logout, isLoading } = useAuth()

  // Don't show navbar on login page
  if (pathname === '/login') {
    return null
  }

  // Show placeholder while loading to avoid hydration mismatch
  if (isLoading) {
    return <div className="h-16 border-b bg-blue-600 dark:bg-blue-500" />
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const isQuizBuilder = userType === UserType.QUIZ_BUILDER

  const bgColor = isQuizBuilder
    ? 'bg-purple-600 dark:bg-purple-500'
    : 'bg-blue-600 dark:bg-blue-500'

  return (
    <>
      <nav className={`border-b ${bgColor}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              {userType && (
                <div className="flex items-center gap-2">
                  {isQuizBuilder ? (
                    <ShieldUser className={`w-5 h-5 text-white`} />
                  ) : (
                    <LucideUserPen className={`w-5 h-5 text-white`} />
                  )}
                  <span className={`text-sm md:text-xl font-bold text-white`}>
                    {userType}
                  </span>
                </div>
              )}
            </div>

            {/* Desktop logout button */}
            <div className="hidden md:block">
              <ThemeSwitcher />
              <Button variant="outline" onClick={handleLogout} className="ml-4">
                <LogOut />
                Logout
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile side nav */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Side nav */}
          <div className="fixed right-0 top-0 z-50 h-full w-64 bg-background shadow-lg md:hidden">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-4 mb-10">
                Set theme:
                <ThemeSwitcher />
              </div>
              <Button
                variant="outline"
                className={`w-full`}
                onClick={handleLogout}
              >
                <LogOut />
                Logout
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
