import type { Metadata } from 'next'
import { Press_Start_2P } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Providers from '@/components/Providers'

const pressStart = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
})

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
    <html lang="en" suppressHydrationWarning className={pressStart.variable}>
      <body className="min-h-screen bg-quest-light-bg dark:bg-quest-dark text-slate-800 dark:text-white">
        <Providers>
          <Navigation />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
