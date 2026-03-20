'use client'

import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/app/context/theme-context'
import { Button } from '@/components/ui/button'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const handleThemeChange = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleThemeChange}
      className="rounded-full"
    >
      {theme === 'dark' && <Sun className="h-5 w-5" />}
      {theme === 'light' && <Moon className="h-5 w-5" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
