import { prisma } from './prisma'

/**
 * Get the XP multiplier based on current streak length.
 */
export function getStreakMultiplier(streak: number): number {
  if (streak >= 30) return 3
  if (streak >= 7) return 2
  return 1
}

/**
 * Update streak for a user after a quest completion.
 * Called from the completions API.
 */
export async function updateStreak(userId: string): Promise<{
  currentStreak: number
  longestStreak: number
  multiplier: number
  newMilestone: number | null // streak milestone just hit
}> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  let streak = await prisma.streak.findUnique({ where: { userId } })

  if (!streak) {
    streak = await prisma.streak.create({
      data: { userId, currentStreak: 1, longestStreak: 1, lastActiveDate: today },
    })
    return { currentStreak: 1, longestStreak: 1, multiplier: 1, newMilestone: null }
  }

  const lastActive = streak.lastActiveDate
    ? new Date(streak.lastActiveDate).getTime()
    : 0
  const todayMs = today.getTime()
  const yesterdayMs = yesterday.getTime()

  // Already counted today
  if (lastActive === todayMs) {
    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      multiplier: getStreakMultiplier(streak.currentStreak),
      newMilestone: null,
    }
  }

  let newStreak: number
  let newMilestone: number | null = null

  if (lastActive === yesterdayMs) {
    // Consecutive day — increment
    newStreak = streak.currentStreak + 1
  } else if (lastActive < yesterdayMs) {
    // Missed a day — check for streak freeze
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user && user.plan !== 'FREE' && user.streakFreezes > 0 && !streak.frozenToday) {
      // Use a streak freeze
      await prisma.user.update({
        where: { id: userId },
        data: { streakFreezes: { decrement: 1 } },
      })
      newStreak = streak.currentStreak + 1
    } else {
      // Streak broken
      newStreak = 1
    }
  } else {
    newStreak = 1
  }

  const newLongest = Math.max(streak.longestStreak, newStreak)

  // Check for milestone
  const milestones = [100, 30, 14, 7, 3]
  for (const m of milestones) {
    if (newStreak >= m && streak.currentStreak < m) {
      newMilestone = m
      break
    }
  }

  await prisma.streak.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastActiveDate: today,
      frozenToday: false,
    },
  })

  return {
    currentStreak: newStreak,
    longestStreak: newLongest,
    multiplier: getStreakMultiplier(newStreak),
    newMilestone,
  }
}

/**
 * Use a streak freeze for today (Pro feature).
 */
export async function useStreakFreeze(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || user.plan === 'FREE' || user.streakFreezes <= 0) return false

  const streak = await prisma.streak.findUnique({ where: { userId } })
  if (!streak || streak.frozenToday) return false

  await prisma.streak.update({
    where: { userId },
    data: { frozenToday: true },
  })

  await prisma.user.update({
    where: { id: userId },
    data: { streakFreezes: { decrement: 1 } },
  })

  return true
}
