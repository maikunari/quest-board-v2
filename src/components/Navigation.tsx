'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignedIn, SignedOut, UserButton, useAuth } from '@clerk/nextjs'
import ThemeToggle from './ThemeToggle'

const links = [
  { href: '/quests', label: '⚔️ Quests', key: 'quests' },
  { href: '/admin', label: '🛠️ Admin', key: 'admin' },
  { href: '/history', label: '📜 History', key: 'history' },
  { href: '/stats', label: '📊 Stats', key: 'stats' },
  { href: '/achievements', label: '🏆 Badges', key: 'achievements' },
  { href: '/settings', label: '⚙️ Settings', key: 'settings' },
]

export default function Navigation() {
  const pathname = usePathname()
  const { isSignedIn } = useAuth()

  return (
    <nav className="border-b border-slate-200 dark:border-white/5 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href={isSignedIn ? '/quests' : '/'} className="font-pixel text-sm text-quest-gold hover:text-amber-300 transition-colors" style={{ textShadow: '0 0 20px rgba(246, 201, 14, 0.5)' }}>
            Quest Board
          </Link>
          <div className="flex items-center gap-1">
            <SignedIn>
              {links.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`nav-link ${
                    pathname === link.href ? 'active' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="ml-2 pl-2 border-l border-white/10 dark:border-white/10 flex items-center gap-2">
                <ThemeToggle />
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in" className="nav-link">
                🔑 Sign In
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  )
}
