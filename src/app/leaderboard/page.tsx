'use client'

import { useEffect, useState } from 'react'

interface LeaderboardEntry {
  rank: number
  name: string
  weeklyXp: number
  isCurrentUser: boolean
  zone: 'ascension' | 'danger' | null
}

interface CurrentUserData {
  rank: number
  weeklyXp: number
}

interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[]
  currentUser: CurrentUserData | null
  resetsIn: string
}

function getRankEmoji(rank: number) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `#${rank}`
}

function getNudge(
  currentUser: CurrentUserData | null,
  leaderboard: LeaderboardEntry[]
): string | null {
  if (!currentUser) return null

  // Find the entry just above the current user's rank
  const nextRankEntry = leaderboard.find((e) => e.rank === currentUser.rank - 1)
  if (!nextRankEntry) return null

  const gap = nextRankEntry.weeklyXp - currentUser.weeklyXp
  if (gap <= 0) return null
  if (gap <= 20) {
    return `🔥 You're only ${gap} XP behind rank #${nextRankEntry.rank}!`
  }
  return null
}

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error)
        setData(d)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4">🏆</div>
          <div className="text-slate-400 text-sm">Loading leaderboard...</div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="text-4xl mb-4">⚠️</div>
        <p className="text-slate-400">{error || 'Failed to load leaderboard'}</p>
      </div>
    )
  }

  const { leaderboard, currentUser, resetsIn } = data
  const isCurrentUserInTop20 = leaderboard.some((e) => e.isCurrentUser)
  const nudge = !isCurrentUserInTop20 ? getNudge(currentUser, leaderboard) : null
  // Also check nudge within top 20
  const nudgeInTop20 = isCurrentUserInTop20
    ? (() => {
        const myEntry = leaderboard.find((e) => e.isCurrentUser)
        if (!myEntry || myEntry.rank === 1) return null
        const aboveEntry = leaderboard.find((e) => e.rank === myEntry.rank - 1)
        if (!aboveEntry) return null
        const gap = aboveEntry.weeklyXp - myEntry.weeklyXp
        if (gap > 0 && gap <= 20) {
          return `🔥 You're only ${gap} XP behind rank #${aboveEntry.rank}!`
        }
        return null
      })()
    : null

  const activeNudge = nudge || nudgeInTop20

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-1">🏆 Weekly Leaderboard</h1>
        <p className="text-sm text-slate-400">
          Resets in{' '}
          <span className="text-quest-gold font-semibold">{resetsIn}</span>
        </p>
      </div>

      {/* Nudge */}
      {activeNudge && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-sm font-medium text-center">
          {activeNudge}
        </div>
      )}

      {/* Top 20 list */}
      <div className="quest-card overflow-hidden">
        <div className="divide-y divide-slate-200 dark:divide-white/5">
          {leaderboard.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No XP earned this week yet. Be the first! ⚔️
            </div>
          ) : (
            (() => {
              // Build render items: inject zone section headers before first entry of each zone
              type RenderItem =
                | { type: 'entry'; entry: LeaderboardEntry }
                | { type: 'zone-header'; zone: 'ascension' | 'danger' }

              const items: RenderItem[] = []
              let ascensionHeaderInserted = false
              let dangerHeaderInserted = false

              for (const entry of leaderboard) {
                if (entry.zone === 'ascension' && !ascensionHeaderInserted) {
                  items.push({ type: 'zone-header', zone: 'ascension' })
                  ascensionHeaderInserted = true
                }
                if (entry.zone === 'danger' && !dangerHeaderInserted) {
                  items.push({ type: 'zone-header', zone: 'danger' })
                  dangerHeaderInserted = true
                }
                items.push({ type: 'entry', entry })
              }

              return items.map((item, i) => {
                if (item.type === 'zone-header') {
                  return item.zone === 'ascension' ? (
                    <div
                      key={`zone-header-ascension-${i}`}
                      className="flex items-center gap-2 px-5 py-1.5 bg-emerald-500/5"
                    >
                      <span className="text-xs font-bold tracking-widest text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.7)]">
                        🔥 ASCENSION ZONE
                      </span>
                      <span
                        title="Top 3 earn a bonus next week. Bottom 3 risk demotion when leagues launch."
                        className="text-slate-500 dark:text-slate-400 cursor-help text-xs select-none"
                      >
                        ⓘ
                      </span>
                    </div>
                  ) : (
                    <div
                      key={`zone-header-danger-${i}`}
                      className="flex items-center gap-2 px-5 py-1.5 bg-red-500/5"
                    >
                      <span className="text-xs font-bold tracking-widest text-red-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.7)]">
                        ☠️ DANGER ZONE
                      </span>
                      <span
                        title="Top 3 earn a bonus next week. Bottom 3 risk demotion when leagues launch."
                        className="text-slate-500 dark:text-slate-400 cursor-help text-xs select-none"
                      >
                        ⓘ
                      </span>
                    </div>
                  )
                }

                const entry = item.entry
                // Determine left border: violet (current user) takes priority, then zone colors
                const borderClass = entry.isCurrentUser
                  ? 'border-l-4 border-violet-500'
                  : entry.zone === 'ascension'
                  ? 'border-l-4 border-emerald-500/60'
                  : entry.zone === 'danger'
                  ? 'border-l-4 border-red-500/60'
                  : ''

                const bgClass = entry.isCurrentUser
                  ? 'bg-violet-500/10'
                  : entry.zone === 'ascension'
                  ? 'bg-emerald-500/5 hover:bg-emerald-500/10'
                  : entry.zone === 'danger'
                  ? 'bg-red-500/5 hover:bg-red-500/10'
                  : 'hover:bg-slate-50 dark:hover:bg-white/5'

                return (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-4 px-5 py-3.5 transition-colors ${bgClass} ${borderClass}`}
                  >
                    {/* Rank */}
                    <div className="w-10 text-center font-pixel text-sm shrink-0">
                      {entry.rank <= 3 ? (
                        <span className="text-lg">{getRankEmoji(entry.rank)}</span>
                      ) : (
                        <span className="text-slate-500 dark:text-slate-400 text-xs">
                          #{entry.rank}
                        </span>
                      )}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <span
                        className={`font-medium text-sm truncate ${
                          entry.isCurrentUser
                            ? 'text-violet-400'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {entry.name}
                        {entry.isCurrentUser && (
                          <span className="ml-2 text-xs text-violet-500 dark:text-violet-400 font-normal">
                            (you)
                          </span>
                        )}
                      </span>
                    </div>

                    {/* XP */}
                    <div className="text-right shrink-0">
                      <span
                        className={`font-semibold text-sm ${
                          entry.isCurrentUser ? 'text-violet-300' : 'text-quest-gold'
                        }`}
                      >
                        {entry.weeklyXp.toLocaleString()}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-xs ml-1">XP</span>
                    </div>
                  </div>
                )
              })
            })()
          )}
        </div>
      </div>

      {/* Current user outside top 20 */}
      {!isCurrentUserInTop20 && currentUser && (
        <>
          {/* Divider */}
          <div className="flex items-center gap-3 my-3 px-2">
            <div className="flex-1 border-t border-dashed border-slate-300 dark:border-white/10" />
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              rank #{currentUser.rank}
            </span>
            <div className="flex-1 border-t border-dashed border-slate-300 dark:border-white/10" />
          </div>

          {/* Pinned user row */}
          <div className="quest-card overflow-hidden">
            <div className="flex items-center gap-4 px-5 py-3.5 bg-violet-500/10 border-l-4 border-violet-500">
              <div className="w-10 text-center font-pixel text-xs shrink-0 text-slate-500 dark:text-slate-400">
                #{currentUser.rank}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-medium text-sm text-violet-400">
                  You
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-semibold text-sm text-violet-300">
                  {currentUser.weeklyXp.toLocaleString()}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-xs ml-1">XP</span>
              </div>
            </div>
          </div>

          {/* Nudge for out-of-top-20 user */}
          {nudge && (
            <div className="mt-4 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-sm font-medium text-center">
              {nudge}
            </div>
          )}
        </>
      )}

      {/* Footer info */}
      <p className="text-center text-xs text-slate-500 dark:text-slate-500 mt-8">
        Weekly XP resets every Sunday at midnight UTC
      </p>
    </div>
  )
}
