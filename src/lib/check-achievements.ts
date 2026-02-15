import { prisma } from './prisma'
import { ACHIEVEMENTS, type Achievement } from './achievements'

/**
 * Check and award any new achievements for a user.
 * Returns newly unlocked achievements.
 */
export async function checkAchievements(
  userId: string,
  context?: {
    completionHour?: number // hour of day (0-23) for time-based achievements
    isWeekend?: boolean
    allQuestsCompleted?: boolean // all quests done today
    hasIntegration?: boolean
  }
): Promise<Achievement[]> {
  // Get user's existing achievements
  const existing = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true },
  })
  const existingIds = new Set(existing.map((a) => a.achievementId))

  // Get user stats
  const totalCompletions = await prisma.completion.count({
    where: { userId },
  })

  const allStats = await prisma.dayStats.aggregate({
    where: { userId },
    _sum: { totalPoints: true },
  })
  const totalPoints = allStats._sum?.totalPoints || 0

  const streak = await prisma.streak.findUnique({ where: { userId } })
  const currentStreak = streak?.currentStreak || 0
  const longestStreak = streak?.longestStreak || 0

  const newlyUnlocked: Achievement[] = []

  for (const achievement of ACHIEVEMENTS) {
    if (existingIds.has(achievement.id)) continue

    let earned = false

    switch (achievement.id) {
      // Starter
      case 'first_quest':
        earned = totalCompletions >= 1
        break
      case 'level_5':
        earned = totalPoints >= 250 // ~50pts per level
        break
      case 'level_10':
        earned = totalPoints >= 550
        break
      case 'level_25':
        earned = totalPoints >= 1625
        break
      case 'level_50':
        earned = totalPoints >= 3750
        break
      case 'first_integration':
        earned = context?.hasIntegration === true
        break

      // Consistency
      case 'streak_3':
        earned = longestStreak >= 3 || currentStreak >= 3
        break
      case 'streak_7':
        earned = longestStreak >= 7 || currentStreak >= 7
        break
      case 'streak_14':
        earned = longestStreak >= 14 || currentStreak >= 14
        break
      case 'streak_30':
        earned = longestStreak >= 30 || currentStreak >= 30
        break
      case 'streak_100':
        earned = longestStreak >= 100 || currentStreak >= 100
        break

      // Volume
      case 'quests_10':
        earned = totalCompletions >= 10
        break
      case 'quests_50':
        earned = totalCompletions >= 50
        break
      case 'quests_100':
        earned = totalCompletions >= 100
        break
      case 'quests_500':
        earned = totalCompletions >= 500
        break
      case 'quests_1000':
        earned = totalCompletions >= 1000
        break
      case 'points_1000':
        earned = totalPoints >= 1000
        break
      case 'points_10000':
        earned = totalPoints >= 10000
        break

      // Special
      case 'night_owl':
        earned = context?.completionHour !== undefined && context.completionHour >= 0 && context.completionHour < 4
        break
      case 'early_bird':
        earned = context?.completionHour !== undefined && context.completionHour >= 4 && context.completionHour < 6
        break
      case 'weekend_warrior':
        earned = context?.isWeekend === true
        break
      case 'clean_sweep':
        earned = context?.allQuestsCompleted === true
        break
    }

    if (earned) {
      await prisma.userAchievement.create({
        data: { userId, achievementId: achievement.id },
      })
      newlyUnlocked.push(achievement)
    }
  }

  return newlyUnlocked
}
