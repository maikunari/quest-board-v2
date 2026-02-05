'use client'

import { getRank } from '@/lib/utils'

interface StatsBarProps {
  todayPoints: number
  weekPoints: number
  streak: number
}

export default function StatsBar({ todayPoints, weekPoints, streak }: StatsBarProps) {
  const rank = getRank(weekPoints)

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      <div className="quest-card px-6 py-4 text-center min-w-[100px] hover:border-quest-gold/30 group">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Today</div>
        <div className="font-pixel text-xl text-quest-gold group-hover:scale-110 transition-transform">
          {todayPoints}
        </div>
        <div className="text-xs text-slate-500">pts</div>
      </div>

      <div className="quest-card px-6 py-4 text-center min-w-[100px] hover:border-quest-gold/30 group">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Week</div>
        <div className="font-pixel text-xl text-quest-gold group-hover:scale-110 transition-transform">
          {weekPoints}
        </div>
        <div className="text-xs text-slate-500">pts</div>
      </div>

      <div className="quest-card px-6 py-4 text-center min-w-[100px] hover:border-red-500/30 group">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Streak</div>
        <div className="font-pixel text-xl text-red-400 group-hover:scale-110 transition-transform">
          {streak}
        </div>
        <div className="text-xs text-slate-500">🔥</div>
      </div>

      <div className="quest-card px-6 py-4 text-center min-w-[100px] hover:border-violet-500/30 group">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Rank</div>
        <div className="text-3xl group-hover:scale-110 transition-transform">
          {rank.emoji}
        </div>
        <div className="text-xs text-slate-500">{rank.label}</div>
      </div>
    </div>
  )
}
