'use client'

import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'

export default function LandingPage() {
  const { isSignedIn } = useAuth()

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="font-pixel text-4xl md:text-5xl text-quest-gold mb-6" style={{ textShadow: '0 0 30px rgba(246, 201, 14, 0.5)' }}>
        Quest Board
      </h1>
      <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-xl">
        Turn your boring tasks into epic quests
      </p>
      <p className="text-sm text-slate-400 mb-12 max-w-md">
        Gamified task management with Asana integration, daily streaks, and RPG-style progression.
      </p>

      {isSignedIn ? (
        <Link
          href="/quests"
          className="px-8 py-4 bg-quest-gold text-black font-pixel text-sm rounded-lg hover:bg-amber-300 transition-colors"
          style={{ textShadow: 'none' }}
        >
          Enter Quest Board →
        </Link>
      ) : (
        <div className="flex gap-4">
          <Link
            href="/sign-up"
            className="px-8 py-4 bg-quest-gold text-black font-pixel text-sm rounded-lg hover:bg-amber-300 transition-colors"
            style={{ textShadow: 'none' }}
          >
            Begin Your Adventure
          </Link>
          <Link
            href="/sign-in"
            className="px-8 py-4 border border-quest-gold text-quest-gold font-pixel text-sm rounded-lg hover:bg-quest-gold/10 transition-colors"
          >
            Sign In
          </Link>
        </div>
      )}
    </div>
  )
}
