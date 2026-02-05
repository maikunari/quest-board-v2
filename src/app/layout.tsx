import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Quest Board ⚔️',
  description: 'Gamified task management for solo developers',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚔️</text></svg>',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-quest-light-bg dark:bg-quest-dark text-slate-800 dark:text-white">
        <ThemeProvider>
          <Navigation />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
