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
    icon: '/mascot/sage-default.png',
    shortcut: '/mascot/sage-default.png',
    apple: '/mascot/sage-default.png',
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
