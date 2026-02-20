import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth'
import { ACHIEVEMENTS, ACHIEVEMENT_MAP } from '@/lib/achievements'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await requireUser()

    const unlocked = await prisma.userAchievement.findMany({
      where: { userId: user.id },
      orderBy: { unlockedAt: 'desc' },
    })

    const unlockedIds = new Set(unlocked.map((a) => a.achievementId))

    const streak = await prisma.streak.findUnique({ where: { userId: user.id } })

    return NextResponse.json({
      achievements: ACHIEVEMENTS.map((a) => ({
        ...a,
        unlocked: unlockedIds.has(a.id),
        unlockedAt: unlocked.find((u) => u.achievementId === a.id)?.unlockedAt || null,
      })),
      streak: streak
        ? {
            current: streak.currentStreak,
            longest: streak.longestStreak,
            lastActive: streak.lastActiveDate,
          }
        : { current: 0, longest: 0, lastActive: null },
      stats: {
        totalUnlocked: unlocked.length,
        totalAchievements: ACHIEVEMENTS.length,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 })
  }
}
