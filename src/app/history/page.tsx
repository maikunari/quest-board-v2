'use client'

import { useEffect, useState } from 'react'
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isToday, isFuture } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'

interface Quest {
  id: string
  type: string
  title: string
  subtitle?: string | null
  icon: string
  points: number
  completions: Array<{ id: string }>
}

interface DayData {
  date: string
  quests: Quest[]
  totalPoints: number
  completed: number
  total: number
}

export default function HistoryPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null)
  const [dayCache, setDayCache] = useState<Record<string, DayData>>({})
  const [loading, setLoading] = useState(false)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startPadding = getDay(monthStart) === 0 ? 6 : getDay(monthStart) - 1

  useEffect(() => {
    loadMonthData()
  }, [currentMonth])

  const loadMonthData = async () => {
    setLoading(true)
    const cache: Record<string, DayData> = {}

    // Load each day of the month that has data
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    await Promise.all(
      days.map(async (day) => {
        if (isFuture(day)) return
        const dateStr = format(day, 'yyyy-MM-dd')
        try {
          const res = await fetch(`/api/quests?date=${dateStr}`)
          const quests = await res.json()
          if (quests.length > 0) {
            const completed = quests.filter((q: Quest) => q.completions?.length > 0)
            cache[dateStr] = {
              date: dateStr,
              quests,
              totalPoints: completed.reduce((sum: number, q: Quest) => sum + q.points, 0),
              completed: completed.length,
              total: quests.length,
            }
          }
        } catch (e) {
          // ignore
        }
      })
    )

    setDayCache(prev => ({ ...prev, ...cache }))
    setLoading(false)
  }

  const selectDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const data = dayCache[dateStr]
    if (data) {
      setSelectedDay(data)
    } else {
      setSelectedDay({
        date: dateStr,
        quests: [],
        totalPoints: 0,
        completed: 0,
        total: 0,
      })
    }
  }

  const prevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
    setSelectedDay(null)
  }

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
    setSelectedDay(null)
  }

  const getIntensity = (points: number) => {
    if (points === 0) return 'bg-quest-dark'
    if (points < 10) return 'bg-violet-900/40'
    if (points < 20) return 'bg-violet-800/50'
    if (points < 30) return 'bg-violet-700/60'
    return 'bg-violet-600/70'
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📜 Quest History</h1>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="btn-secondary px-3">←</button>
        <h2 className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <button onClick={nextMonth} className="btn-secondary px-3">→</button>
      </div>

      {/* Calendar Grid */}
      <div className="quest-card p-4 mb-6">
        {loading && (
          <div className="text-center text-slate-500 text-sm py-2 mb-2">Loading...</div>
        )}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center text-xs text-slate-500 font-medium py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {/* Padding for start of month */}
          {Array.from({ length: startPadding }).map((_, i) => (
            <div key={`pad-${i}`} className="aspect-square" />
          ))}

          {calendarDays.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd')
            const data = dayCache[dateStr]
            const points = data?.totalPoints || 0
            const isSelected = selectedDay?.date === dateStr
            const future = isFuture(day)
            const today = isToday(day)

            return (
              <button
                key={dateStr}
                onClick={() => !future && selectDay(day)}
                disabled={future}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-all relative ${
                  future ? 'opacity-20 cursor-default' : 'cursor-pointer hover:ring-1 hover:ring-violet-500/50'
                } ${isSelected ? 'ring-2 ring-violet-500' : ''} ${getIntensity(points)}`}
              >
                <span className={`${today ? 'text-quest-gold font-bold' : 'text-slate-400'}`}>
                  {format(day, 'd')}
                </span>
                {points > 0 && (
                  <span className="text-[9px] text-quest-gold font-pixel mt-0.5">{points}</span>
                )}
                {data && data.completed === data.total && data.total > 0 && (
                  <span className="absolute top-0.5 right-0.5 text-[8px]">✨</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Day Details */}
      <AnimatePresence mode="wait">
        {selectedDay && (
          <motion.div
            key={selectedDay.date}
            className="quest-card p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                {format(new Date(selectedDay.date), 'EEEE, MMMM d, yyyy')}
              </h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-quest-gold font-pixel">{selectedDay.totalPoints} pts</span>
                <span className="text-slate-500">
                  {selectedDay.completed}/{selectedDay.total} completed
                </span>
              </div>
            </div>

            {selectedDay.quests.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No quests on this day</p>
            ) : (
              <div className="space-y-2">
                {selectedDay.quests.map(quest => {
                  const isComplete = quest.completions?.length > 0
                  return (
                    <div
                      key={quest.id}
                      className={`flex items-center gap-3 p-3 rounded-lg bg-quest-dark ${
                        isComplete ? 'opacity-100' : 'opacity-50'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
                        isComplete ? 'bg-quest-green text-white' : 'border border-slate-600'
                      }`}>
                        {isComplete ? '✓' : ''}
                      </span>
                      <span className="text-lg">{quest.icon}</span>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${isComplete ? '' : 'text-slate-500'}`}>
                          {quest.title}
                        </div>
                        {quest.subtitle && (
                          <div className="text-xs text-slate-600">{quest.subtitle}</div>
                        )}
                      </div>
                      <span className={`font-pixel text-xs ${
                        isComplete ? 'text-quest-gold' : 'text-slate-600'
                      }`}>
                        {isComplete ? '+' : ''}{quest.points}
                      </span>
                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded ${
                        quest.type === 'main' ? 'bg-amber-500/20 text-amber-400' :
                        quest.type === 'side' ? 'bg-violet-500/20 text-violet-400' :
                        'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        {quest.type}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
