'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import ThemeToggle from './ThemeToggle'

const links = [
  { href: '/quests', label: '⚔️ Quests', key: 'quests' },
  { href: '/admin', label: '🛠️ Admin', key: 'admin' },
  { href: '/history', label: '📜 History', key: 'history' },
  { href: '/stats', label: '📊 Stats', key: 'stats' },
  { href: '/achievements', label: '🏆 Badges', key: 'achievements' },
  { href: '/leaderboard', label: '🥇 Leaderboard', key: 'leaderboard' },
  { href: '/settings', label: '⚙️ Settings', key: 'settings' },
]

export default function Navigation() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  return (
    <nav className="border-b border-slate-200 dark:border-white/5 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* ── Brand / Logo ────────────────────────────────────────────── */}
          <Link
            href={status === 'authenticated' ? '/quests' : '/'}
            className="flex items-center gap-2 group"
          >
            <Image
              src="/mascot/sage-default.png"
              alt="Quest Board Sage"
              width={28}
              height={28}
              className="rounded-full object-cover opacity-90 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_6px_rgba(139,92,246,0.6)]"
              style={{ width: 28, height: 28 }}
            />
            <span
              className="font-pixel text-sm text-violet-600 dark:text-violet-300 hover:text-violet-700 dark:hover:text-violet-200 transition-colors"
              style={{ textShadow: '0 0 16px rgba(139,92,246,0.35)' }}
            >
              Quest Board
            </span>
          </Link>

          {/* ── Nav links ───────────────────────────────────────────────── */}
          <div className="flex items-center gap-1">
            {status === 'authenticated' && (
              <>
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
                <div className="ml-2 pl-2 border-l border-slate-200 dark:border-white/10 flex items-center gap-2">
                  <ThemeToggle />
                  <div className="flex items-center gap-2">
                    {session?.user?.image && (
                       <img 
                         src={session.user.image} 
                         alt={session.user.name || 'User'} 
                         className="w-8 h-8 rounded-full border border-white/10"
                       />
                    )}
                    <button 
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
            {status !== 'authenticated' && (
              <Link href="/login" className="nav-link">
                🔑 Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
