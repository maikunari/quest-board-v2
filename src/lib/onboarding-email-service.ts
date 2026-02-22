/**
 * Onboarding email service.
 * Handles idempotent send + DB logging for the 4-email trial sequence.
 */

import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'
import {
  buildWelcomeEmail,
  buildDay2Email,
  buildDay5Email,
  buildDay7Email,
  FROM,
  type TrialStats,
} from '@/lib/emails/onboarding'

export type OnboardingEmailType = 'welcome' | 'day2' | 'day5' | 'day7'

interface SendResult {
  sent: boolean
  reason?: string
}

/**
 * Fetches current XP, quests completed, and streak for a user.
 * Used in day5 and day7 emails.
 */
async function getUserStats(userId: string): Promise<TrialStats> {
  const [completionCount, streak] = await Promise.all([
    prisma.completion.count({ where: { userId } }),
    prisma.streak.findUnique({
      where: { userId },
      select: { currentStreak: true },
    }),
  ])

  // Approximate XP from completions (average 5 XP per quest — good enough for email display)
  const dayStats = await prisma.dayStats.findMany({
    where: { userId },
    select: { totalPoints: true },
  })
  const xp = dayStats.reduce((sum, d) => sum + d.totalPoints, 0)

  return {
    xp,
    questsCompleted: completionCount,
    currentStreak: streak?.currentStreak ?? 0,
  }
}

/**
 * Sends an onboarding email to a user if it hasn't been sent already.
 * Safe to call multiple times — idempotent via OnboardingEmail dedup table.
 */
export async function sendOnboardingEmail(
  userId: string,
  emailType: OnboardingEmailType
): Promise<SendResult> {
  // ── 1. Dedup check ──────────────────────────────────────────────────────
  const alreadySent = await prisma.onboardingEmail.findUnique({
    where: { userId_emailType: { userId, emailType } },
  })
  if (alreadySent) {
    return { sent: false, reason: 'already_sent' }
  }

  // ── 2. Fetch user ───────────────────────────────────────────────────────
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, displayName: true },
  })
  if (!user?.email) {
    return { sent: false, reason: 'no_email' }
  }

  const name = user.displayName || user.name || 'Adventurer'

  // ── 3. Build email ──────────────────────────────────────────────────────
  let subject: string
  let html: string

  if (emailType === 'welcome') {
    ;({ subject, html } = buildWelcomeEmail(name))
  } else if (emailType === 'day2') {
    ;({ subject, html } = buildDay2Email(name))
  } else if (emailType === 'day5') {
    const stats = await getUserStats(userId)
    ;({ subject, html } = buildDay5Email(name, stats))
  } else {
    // day7
    const stats = await getUserStats(userId)
    ;({ subject, html } = buildDay7Email(name, stats))
  }

  // ── 4. Send ─────────────────────────────────────────────────────────────
  try {
    await resend.emails.send({
      from: FROM,
      to: user.email,
      subject,
      html,
    })
  } catch (err) {
    console.error(`[onboarding-email] Failed to send ${emailType} to ${user.email}:`, err)
    return { sent: false, reason: 'send_failed' }
  }

  // ── 5. Log send ─────────────────────────────────────────────────────────
  await prisma.onboardingEmail.create({
    data: { userId, emailType },
  })

  console.log(`[onboarding-email] Sent ${emailType} to ${user.email}`)
  return { sent: true }
}
