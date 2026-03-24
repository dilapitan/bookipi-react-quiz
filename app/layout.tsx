import { Inter } from 'next/font/google'

import { AuthProvider } from '@/app/context/auth-context'
import { QueryProvider } from '@/app/context/query-context'
import { ThemeProvider } from '@/app/context/theme-context'
import { Navbar } from '@/components/navbar'
import { Toaster } from '@/components/ui/sonner'

import type { Metadata } from 'next'

import './globals.css'
import 'highlight.js/styles/github-dark.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Quizizy',
  description: 'Make or Test a Quiz!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              <Navbar />
              {children}
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
