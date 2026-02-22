import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOnboardingEmail } from '@/lib/onboarding-email-service'

export const dynamic = 'force-dynamic'

/**
 * POST /api/cron/onboarding
 *
 * Runs daily at 09:00 UTC.
 * Finds users at each gate in the trial sequence and sends the appropriate email
 * if it hasn't been sent already.
 *
 * Gate windows (centred on Nth day post-signup, ±12h):
 *   day2  → signed up 1.5 – 2.5 days ago
 *   day5  → signed up 4.5 – 5.5 days ago
 *   day7  → signed up 6.5 – 7.5 days ago
 *
 * Protected by CRON_SECRET header (set as Vercel env var).
 */

const GATES = [
  { emailType: 'day2' as const, minDays: 1.5, maxDays: 2.5 },
  { emailType: 'day5' as const, minDays: 4.5, maxDays: 5.5 },
  { emailType: 'day7' as const, minDays: 6.5, maxDays: 7.5 },
]

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000)
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get('authorization')?.replace('Bearer ', '')

  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: Record<string, { processed: number; sent: number; skipped: number; errors: number }> = {}

  for (const gate of GATES) {
    const windowStart = daysAgo(gate.maxDays)   // earlier boundary (further in the past)
    const windowEnd   = daysAgo(gate.minDays)   // later boundary  (more recent)

    // Find users in this signup window who haven't received this email yet
    const users = await prisma.user.findMany({
      where: {
        email: { not: null },
        createdAt: {
          gte: windowStart,
          lte: windowEnd,
        },
        // Exclude users who already received this email
        onboardingEmails: {
          none: { emailType: gate.emailType },
        },
      },
      select: { id: true, email: true },
    })

    console.log(`[onboarding-cron] ${gate.emailType}: ${users.length} eligible users`)

    let sent = 0
    let skipped = 0
    let errors = 0

    for (const user of users) {
      try {
        const result = await sendOnboardingEmail(user.id, gate.emailType)
        if (result.sent) {
          sent++
        } else {
          skipped++
          console.log(`[onboarding-cron] ${gate.emailType} skipped for ${user.email}: ${result.reason}`)
        }
      } catch (err) {
        errors++
        console.error(`[onboarding-cron] ${gate.emailType} error for ${user.email}:`, err)
      }
    }

    results[gate.emailType] = { processed: users.length, sent, skipped, errors }
  }

  console.log('[onboarding-cron] Complete:', results)

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    results,
  })
}
