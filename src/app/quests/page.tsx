'use client'

import { useEffect, useState, useCallback } from 'react'
import StatsBar from '@/components/StatsBar'
import MainQuestCard from '@/components/MainQuestCard'
import QuestCard from '@/components/QuestCard'
import CompletionAnimation from '@/components/CompletionAnimation'
import { AchievementToast } from '@/components/AchievementToast'
import { useSound } from '@/lib/use-sound'
import { formatDisplayDate, getToday } from '@/lib/utils'
import type { Achievement } from '@/lib/achievements'

interface Quest {
  id: string
  date: string
  type: 'main' | 'side' | 'daily'
  title: string
  subtitle?: string | null
  description?: string | null
  icon: string
  points: number
  asanaTaskId?: string | null
  order: number
  completions: Array<{ id: string }>
}

interface Stats {
  todayPoints: number
  weekPoints: number
  streak: number
}

export default function QuestBoard() {
  const [quests, setQuests] = useState<Quest[]>([])
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [stats, setStats] = useState<Stats>({ todayPoints: 0, weekPoints: 0, streak: 0 })
  const [celebration, setCelebration] = useState<{ show: boolean; points: number }>({ show: false, points: 0 })
  const [achievementToast, setAchievementToast] = useState<Achievement | null>(null)
  const [loading, setLoading] = useState(true)
  const sound = useSound()

  const today = getToday()

  const fetchData = useCallback(async () => {
    try {
      const [questsRes, statsRes] = await Promise.all([
        fetch(`/api/quests?date=${today}`),
        fetch('/api/stats'),
      ])

      const questsData = await questsRes.json()
      const statsData = await statsRes.json()
      const questsList = Array.isArray(questsData) ? questsData : []

      setQuests(questsList)
      setCompletedIds(new Set(
        questsList
          .filter((q: Quest) => q.completions.length > 0)
          .map((q: Quest) => q.id)
      ))
      setStats({
        todayPoints: statsData.todayPoints,
        weekPoints: statsData.weekPoints,
        streak: statsData.streak,
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [today])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const toggleQuest = async (questId: string) => {
    const quest = quests.find(q => q.id === questId)
    if (!quest) return

    const wasCompleted = completedIds.has(questId)

    // Optimistic update
    const newCompleted = new Set(completedIds)
    if (wasCompleted) {
      newCompleted.delete(questId)
      setStats(prev => ({
        ...prev,
        todayPoints: prev.todayPoints - quest.points,
        weekPoints: prev.weekPoints - quest.points,
      }))
    } else {
      newCompleted.add(questId)
      setStats(prev => ({
        ...prev,
        todayPoints: prev.todayPoints + quest.points,
        weekPoints: prev.weekPoints + quest.points,
      }))
      setCelebration({ show: true, points: quest.points })
    }
    setCompletedIds(newCompleted)

    // Play sound
    if (!wasCompleted) {
      sound.complete()
    } else {
      sound.undo()
    }

    // Persist
    try {
      const res = await fetch('/api/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questId,
          date: today,
          completed: !wasCompleted,
        }),
      })
      const data = await res.json()

      // Handle streak milestones
      if (data.streak?.newMilestone) {
        sound.streak()
      }

      // Handle new achievements
      if (data.newAchievements?.length > 0) {
        sound.achievement()
        // Show achievements one at a time
        for (let i = 0; i < data.newAchievements.length; i++) {
          setTimeout(() => {
            setAchievementToast(data.newAchievements[i])
            setTimeout(() => setAchievementToast(null), 4000)
          }, i * 5000)
        }
      }

      // Update streak in stats if returned
      if (data.streak) {
        setStats(prev => ({ ...prev, streak: data.streak.currentStreak }))
      }
    } catch (error) {
      console.error('Error toggling quest:', error)
      // Revert on error
      fetchData()
    }
  }

  const mainQuest = quests.find(q => q.type === 'main')
  const sideQuests = quests.filter(q => q.type === 'side')
  const dailyQuests = quests.filter(q => q.type === 'daily')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-float">⚔️</div>
          <div className="text-slate-400 text-sm">Loading quests...</div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Date */}
      <div className="text-center mb-6">
        <h2 className="text-slate-400 text-sm font-medium">{formatDisplayDate(today)}</h2>
      </div>

      {/* Stats */}
      <StatsBar
        todayPoints={stats.todayPoints}
        weekPoints={stats.weekPoints}
        streak={stats.streak}
      />

      {/* Quest Board Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Main Quest */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <MainQuestCard
            quest={mainQuest || null}
            isCompleted={mainQuest ? completedIds.has(mainQuest.id) : false}
            onToggle={toggleQuest}
          />
        </div>

        {/* Right Column - Side & Daily */}
        <div className="space-y-6">
          {/* Side Quests */}
          <div className="quest-card p-4 border-l-4 border-l-violet-500">
            <h2 className="text-violet-400 font-semibold text-sm mb-3 flex items-center gap-2">
              <span>⚔️</span> Side Quests
              <span className="text-slate-500 dark:text-slate-400 text-xs">
                ({sideQuests.filter(q => completedIds.has(q.id)).length}/{sideQuests.length})
              </span>
            </h2>
            <div className="space-y-2">
              {sideQuests.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-sm border border-dashed border-violet-500/30 rounded-lg">
                  No side quests today
                </div>
              ) : (
                sideQuests.map((quest, i) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    isCompleted={completedIds.has(quest.id)}
                    onToggle={toggleQuest}
                    index={i}
                  />
                ))
              )}
            </div>
          </div>

          {/* Daily Quests */}
          <div className="quest-card p-4 border-l-4 border-l-cyan-500">
            <h2 className="text-cyan-400 font-semibold text-sm mb-3 flex items-center gap-2">
              <span>📋</span> Daily Quests
              <span className="text-slate-500 dark:text-slate-400 text-xs">
                ({dailyQuests.filter(q => completedIds.has(q.id)).length}/{dailyQuests.length})
              </span>
            </h2>
            <div className="space-y-2">
              {dailyQuests.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-sm border border-dashed border-cyan-500/30 rounded-lg">
                  No daily quests today
                </div>
              ) : (
                dailyQuests.map((quest, i) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    isCompleted={completedIds.has(quest.id)}
                    onToggle={toggleQuest}
                    index={i}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rank Guide Footer */}
      <div className="mt-12 text-center">
        <div className="flex justify-center gap-6 text-sm text-slate-600">
          <span>🌱 Start</span>
          <span>🥉 50</span>
          <span>🥈 100</span>
          <span>🥇 150</span>
          <span>💎 200+</span>
        </div>
      </div>

      {/* Celebration */}
      <CompletionAnimation
        show={celebration.show}
        points={celebration.points}
        onComplete={() => setCelebration({ show: false, points: 0 })}
      />
      <AchievementToast
        achievement={achievementToast}
        onDismiss={() => setAchievementToast(null)}
      />
    </>
  )
}
