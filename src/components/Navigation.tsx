'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: '⚔️ Quests', key: 'quests' },
  { href: '/admin', label: '🛠️ Admin', key: 'admin' },
  { href: '/history', label: '📜 History', key: 'history' },
  { href: '/stats', label: '📊 Stats', key: 'stats' },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-white/5 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-pixel text-sm text-quest-gold hover:text-amber-300 transition-colors" style={{ textShadow: '0 0 20px rgba(246, 201, 14, 0.5)' }}>
            Quest Board
          </Link>
          <div className="flex gap-1">
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
          </div>
        </div>
      </div>
    </nav>
  )
}
