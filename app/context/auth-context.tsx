'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

import { UserType } from '@/app/enums/user-type'

interface AuthContextType {
  userType: UserType | null
  login: (type: UserType) => void
  logout: () => void
  isLoading: boolean
}

/**
 * Dev note: we're using ContextAPI for simulating a login/logout with
 * a role-based access control for a user that is a builder or
 * a player. This is to make things light, not putting much
 * changes in the backend but sticking to the goal of the
 * application.
 */

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'quiz-app-user-type'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Only runs on client after mount - initializing from localStorage is valid here
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && Object.values(UserType).includes(stored as UserType)) {
      setUserType(stored as UserType)
    }
    setIsLoading(false)
  }, [])

  const login = (type: UserType) => {
    setUserType(type)
    localStorage.setItem(STORAGE_KEY, type)
  }

  const logout = () => {
    setUserType(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ userType, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
