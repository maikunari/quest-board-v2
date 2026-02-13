import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth'
import { startOfWeek, endOfWeek, subDays, format } from 'date-fns'

export const dynamic = 'force-dynamic'

// GET /api/stats
export async function GET(request: NextRequest) {
  try {
    const user = await requireUser()
    const userScope = { OR: [{ userId: user.id }, { userId: null }] }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 })

    // Today's quests and completions
    const todayQuests = await prisma.quest.findMany({
      where: { date: today, ...userScope },
      include: { completions: { where: { date: today, OR: [{ userId: user.id }, { userId: null }] } } },
    })

    const todayPoints = todayQuests
      .filter(q => q.completions.length > 0)
      .reduce((sum, q) => sum + q.points, 0)

    // Week points
    const weekStats = await prisma.dayStats.findMany({
      where: {
        date: { gte: weekStart, lte: weekEnd },
        ...userScope,
      },
    })
    const weekPoints = weekStats.reduce((sum, s) => sum + s.totalPoints, 0) + todayPoints

    // Streak calculation
    let streak = 0
    let checkDate = subDays(today, 1)

    const todayHasCompletions = todayQuests.some(q => q.completions.length > 0)
    if (todayHasCompletions) {
      streak = 1
    }

    for (let i = 0; i < 365; i++) {
      const dayStats = await prisma.dayStats.findFirst({
        where: { date: checkDate, ...userScope },
      })

      if (dayStats && dayStats.questsCompleted > 0) {
        streak++
        checkDate = subDays(checkDate, 1)
      } else {
        break
      }
    }

    // Total points all time
    const allStats = await prisma.dayStats.aggregate({
      where: userScope,
      _sum: { totalPoints: true },
    })
    const totalPoints = (allStats._sum?.totalPoints || 0) + todayPoints

    // Last 30 days for chart
    const thirtyDaysAgo = subDays(today, 29)
    const last30 = await prisma.dayStats.findMany({
      where: {
        date: { gte: thirtyDaysAgo, lte: today },
        ...userScope,
      },
      orderBy: { date: 'asc' },
    })

    // Best streak
    const allDayStats = await prisma.dayStats.findMany({
      where: userScope,
      orderBy: { date: 'asc' },
    })

    let bestStreak = streak
    let currentStreak = 0
    let lastDate: Date | null = null

    for (const ds of allDayStats) {
      if (ds.questsCompleted > 0) {
        if (lastDate) {
          const diff = (ds.date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          if (diff === 1) {
            currentStreak++
          } else {
            currentStreak = 1
          }
        } else {
          currentStreak = 1
        }
        bestStreak = Math.max(bestStreak, currentStreak)
        lastDate = ds.date
      } else {
        currentStreak = 0
        lastDate = ds.date
      }
    }

    // Completion rate
    const totalQuests = allDayStats.reduce((sum, s) => sum + s.questsTotal, 0) + todayQuests.length
    const totalCompleted = allDayStats.reduce((sum, s) => sum + s.questsCompleted, 0) +
      todayQuests.filter(q => q.completions.length > 0).length
    const completionRate = totalQuests > 0 ? Math.round((totalCompleted / totalQuests) * 100) : 0

    // Day of week productivity
    const dayOfWeekStats: Record<string, { points: number; count: number }> = {}
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    
    for (const ds of allDayStats) {
      const dayName = dayNames[ds.date.getDay()]
      if (!dayOfWeekStats[dayName]) {
        dayOfWeekStats[dayName] = { points: 0, count: 0 }
      }
      dayOfWeekStats[dayName].points += ds.totalPoints
      dayOfWeekStats[dayName].count++
    }

    const mostProductiveDay = Object.entries(dayOfWeekStats)
      .map(([day, data]) => ({
        day,
        avgPoints: data.count > 0 ? Math.round(data.points / data.count) : 0,
      }))
      .sort((a, b) => b.avgPoints - a.avgPoints)[0]

    return NextResponse.json({
      todayPoints,
      weekPoints,
      streak,
      bestStreak,
      totalPoints,
      completionRate,
      mostProductiveDay: mostProductiveDay?.day || 'N/A',
      last30Days: last30.map(s => ({
        date: format(s.date, 'MMM d'),
        points: s.totalPoints,
        completed: s.questsCompleted,
        total: s.questsTotal,
      })),
      dayOfWeekStats: dayNames.map(day => ({
        day,
        avgPoints: dayOfWeekStats[day]
          ? Math.round(dayOfWeekStats[day].points / dayOfWeekStats[day].count)
          : 0,
      })),
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
