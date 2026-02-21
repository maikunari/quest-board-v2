'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RARITY_COLORS, RARITY_BG, type Achievement } from '@/lib/achievements'

interface AchievementWithStatus extends Achievement {
  unlocked: boolean
  unlockedAt: string | null
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([])
  const [streak, setStreak] = useState({ current: 0, longest: 0 })
  const [stats, setStats] = useState({ totalUnlocked: 0, totalAchievements: 0 })
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetch('/api/achievements')
      .then((r) => r.json())
      .then((data) => {
        setAchievements(data.achievements || [])
        setStreak(data.streak || { current: 0, longest: 0 })
        setStats(data.stats || { totalUnlocked: 0, totalAchievements: 0 })
      })
  }, [])

  const filtered =
    filter === 'all'
      ? achievements
      : filter === 'unlocked'
      ? achievements.filter((a) => a.unlocked)
      : achievements.filter((a) => a.category === filter)

  const categories = ['all', 'unlocked', 'starter', 'consistency', 'volume', 'special']

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">🏆 Achievements</h1>
      <p className="text-sm text-slate-500 mb-6">
        {stats.totalUnlocked} / {stats.totalAchievements} unlocked
      </p>

      {/* Streak summary */}
      <div className="flex gap-4 mb-8">
        <div className="quest-card px-6 py-4 text-center flex-1">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Current Streak</div>
          <div className="font-pixel text-2xl text-red-400">{streak.current}</div>
          <div className="text-xs text-slate-500">🔥 days</div>
        </div>
        <div className="quest-card px-6 py-4 text-center flex-1">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Best Streak</div>
          <div className="font-pixel text-2xl text-quest-gold">{streak.longest}</div>
          <div className="text-xs text-slate-500">⭐ days</div>
        </div>
        <div className="quest-card px-6 py-4 text-center flex-1">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Completion</div>
          <div className="font-pixel text-2xl text-quest-green">
            {stats.totalAchievements > 0
              ? Math.round((stats.totalUnlocked / stats.totalAchievements) * 100)
              : 0}%
          </div>
          <div className="text-xs text-slate-500">unlocked</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              filter === cat
                ? 'bg-quest-gold text-black'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Achievement grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((a, i) => (
          <motion.div
            key={a.id}
            className={`rounded-xl border p-4 flex items-center gap-4 transition-all ${
              a.unlocked
                ? `${RARITY_COLORS[a.rarity]} ${RARITY_BG[a.rarity]}`
                : 'border-slate-300 bg-slate-100 dark:border-gray-700/30 dark:bg-gray-900/30 opacity-40'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: a.unlocked ? 1 : 0.4, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <div className={`text-3xl ${a.unlocked ? '' : 'grayscale'}`}>{a.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm">{a.name}</div>
              <div className="text-xs text-slate-400">{a.description}</div>
              {a.unlocked && a.unlockedAt && (
                <div className="text-[10px] text-slate-500 mt-1">
                  Unlocked {new Date(a.unlockedAt).toLocaleDateString()}
                </div>
              )}
            </div>
            <div className={`text-[9px] uppercase tracking-wider ${a.unlocked ? RARITY_COLORS[a.rarity] : 'text-slate-400 dark:text-gray-600'}`}>
              {a.rarity}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
