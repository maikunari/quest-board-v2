'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { getRank } from '@/lib/utils'

const PointsChart = dynamic(() => import('@/components/Charts').then(mod => mod.PointsChart), { ssr: false })
const DayOfWeekChart = dynamic(() => import('@/components/Charts').then(mod => mod.DayOfWeekChart), { ssr: false })

interface StatsData {
  todayPoints: number
  weekPoints: number
  streak: number
  bestStreak: number
  totalPoints: number
  completionRate: number
  mostProductiveDay: string
  last30Days: Array<{ date: string; points: number; completed: number; total: number }>
  dayOfWeekStats: Array<{ day: string; avgPoints: number }>
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats({
          totalPoints: 0, completionRate: 0, streak: 0, bestStreak: 0,
          weekPoints: 0, mostProductiveDay: 'N/A', last30Days: [], dayOfWeekStats: [],
          ...data,
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-float">📊</div>
          <div className="text-slate-400 text-sm">Loading stats...</div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center text-slate-500 py-20">
        Failed to load stats. Make sure the database is connected.
      </div>
    )
  }

  const rank = getRank(stats.weekPoints)

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📊 Quest Stats</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Points', value: stats.totalPoints.toLocaleString(), icon: '⭐', color: 'text-quest-gold' },
          { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: '🎯', color: 'text-quest-green' },
          { label: 'Current Streak', value: stats.streak.toString(), icon: '🔥', color: 'text-red-400' },
          { label: 'Best Streak', value: stats.bestStreak.toString(), icon: '🏆', color: 'text-amber-400' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="quest-card p-5 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className={`font-pixel text-lg ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="quest-card p-5 text-center">
          <div className="text-3xl mb-1">{rank.emoji}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Rank: <span className="text-slate-900 dark:text-white font-medium">{rank.label}</span>
          </div>
          {rank.next && (
            <div className="text-xs text-slate-500 dark:text-slate-600 mt-1">
              {rank.next - stats.weekPoints} pts to next rank
            </div>
          )}
        </div>
        <div className="quest-card p-5 text-center">
          <div className="text-2xl mb-1">📅</div>
          <div className="font-pixel text-sm text-violet-400">{stats.mostProductiveDay}</div>
          <div className="text-xs text-slate-500 mt-1">Most Productive Day</div>
        </div>
        <div className="quest-card p-5 text-center">
          <div className="text-2xl mb-1">📈</div>
          <div className="font-pixel text-sm text-quest-gold">{stats.weekPoints}</div>
          <div className="text-xs text-slate-500 mt-1">This Week</div>
        </div>
      </div>

      {/* Points Over Time Chart */}
      <div className="quest-card p-6 mb-8">
        <h2 className="text-sm font-semibold text-slate-400 mb-4">📈 Points Over Time (Last 30 Days)</h2>
        {stats.last30Days.length === 0 ? (
          <div className="text-center text-slate-600 py-12">No data yet — start completing quests!</div>
        ) : (
          <div className="h-64">
            <PointsChart data={stats.last30Days} />
          </div>
        )}
      </div>

      {/* Day of Week Chart */}
      <div className="quest-card p-6">
        <h2 className="text-sm font-semibold text-slate-400 mb-4">📊 Average Points by Day of Week</h2>
        <div className="h-48">
          <DayOfWeekChart data={stats.dayOfWeekStats} />
        </div>
      </div>
    </div>
  )
}
