import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

function getDaysUntilNextSunday(): number {
  const now = new Date()
  const day = now.getUTCDay() // 0 = Sunday
  const daysUntil = day === 0 ? 7 : 7 - day
  return daysUntil
}

// GET /api/leaderboard
// Returns top 20 users by weeklyXp (desc) + current user's rank if outside top 20
export async function GET() {
  try {
    const currentUser = await getUser()

    // Fetch top 20 by weeklyXp
    const top20 = await prisma.user.findMany({
      orderBy: { weeklyXp: 'desc' },
      take: 20,
      select: {
        id: true,
        displayName: true,
        weeklyXp: true,
        clerkId: true,
      },
    })

    const leaderboard = top20.map((user, index) => ({
      rank: index + 1,
      name: user.displayName || 'Adventurer',
      weeklyXp: user.weeklyXp,
      isCurrentUser: currentUser ? user.id === currentUser.id : false,
    }))

    // Determine current user info
    let currentUserData: { rank: number; weeklyXp: number } | null = null
    let isInTop20 = false

    if (currentUser) {
      isInTop20 = top20.some((u) => u.id === currentUser.id)

      if (!isInTop20) {
        // Count users with more weeklyXp to determine rank
        const higherCount = await prisma.user.count({
          where: { weeklyXp: { gt: currentUser.weeklyXp } },
        })
        currentUserData = {
          rank: higherCount + 1,
          weeklyXp: currentUser.weeklyXp,
        }
      } else {
        const entry = leaderboard.find((e) => e.isCurrentUser)!
        currentUserData = {
          rank: entry.rank,
          weeklyXp: entry.weeklyXp,
        }
      }
    }

    const resetsIn = getDaysUntilNextSunday()
    const resetsInText = resetsIn === 1 ? '1 day' : `${resetsIn} days`

    return NextResponse.json({
      leaderboard,
      currentUser: currentUserData,
      resetsIn: resetsInText,
    })
  } catch (error) {
    console.error('[leaderboard] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}
