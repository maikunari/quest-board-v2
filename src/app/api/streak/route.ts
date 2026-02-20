import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth'
import { getStreakMultiplier } from '@/lib/streaks'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await requireUser()

    const streak = await prisma.streak.findUnique({ where: { userId: user.id } })

    return NextResponse.json({
      currentStreak: streak?.currentStreak || 0,
      longestStreak: streak?.longestStreak || 0,
      lastActiveDate: streak?.lastActiveDate || null,
      multiplier: getStreakMultiplier(streak?.currentStreak || 0),
      frozenToday: streak?.frozenToday || false,
      freezesAvailable: user.streakFreezes,
      canFreeze: user.plan !== 'FREE' && user.streakFreezes > 0,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch streak' }, { status: 500 })
  }
}
