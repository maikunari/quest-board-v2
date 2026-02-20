import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'

export const dynamic = 'force-dynamic'

function buildStreakReminderEmail(streak: number): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your streak is at risk!</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f;min-height:100vh;">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">

          <!-- Sad Sage Image -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <img
                src="https://questboard.sh/images/quest-sage-sad.png"
                alt="Quest Sage is sad"
                width="160"
                style="display:block;width:160px;height:auto;"
              />
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td align="center" style="padding-bottom:16px;">
              <h1 style="margin:0;color:#f8f8ff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">
                Don&rsquo;t break your streak!
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td align="center" style="padding-bottom:40px;">
              <p style="margin:0;color:#a0a0b8;font-size:16px;line-height:1.6;text-align:center;">
                You&rsquo;re <strong style="color:#c4b5fd;">${streak} day${streak === 1 ? '' : 's'}</strong> in.
                Complete a quest today to keep it alive.
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding-bottom:48px;">
              <a
                href="https://questboard.sh"
                style="display:inline-block;background-color:#6366f1;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:8px;letter-spacing:0.3px;"
              >
                Complete a Quest &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center">
              <p style="margin:0;color:#4a4a6a;font-size:12px;">
                You&rsquo;re receiving this because you have an active streak on
                <a href="https://questboard.sh" style="color:#6366f1;text-decoration:none;">questboard.sh</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// POST /api/cron/streak-reminder
// Runs daily at 20:00 UTC (8pm UTC = 5am JST next day — morning nudge)
// Protected by CRON_SECRET env var
export async function POST(request: NextRequest) {
  const secret = request.headers.get('authorization')?.replace('Bearer ', '')

  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Today's midnight UTC
    const todayMidnight = new Date()
    todayMidnight.setUTCHours(0, 0, 0, 0)

    // Find all streaks > 0 with user email, where user hasn't completed a quest today
    const atRiskStreaks = await prisma.streak.findMany({
      where: {
        currentStreak: { gt: 0 },
        user: {
          email: { not: null },
          // Exclude users who already completed something today
          completions: {
            none: {
              completedAt: { gte: todayMidnight },
            },
          },
        },
      },
      select: {
        currentStreak: true,
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
          },
        },
      },
    })

    console.log(`[streak-reminder] ${atRiskStreaks.length} users at risk of losing their streak`)

    let emailsSent = 0

    for (const { currentStreak, user } of atRiskStreaks) {
      if (!user.email) continue

      try {
        await resend.emails.send({
          from: 'Quest Board <noreply@questboard.sh>',
          to: user.email,
          subject: `⚠️ Your ${currentStreak}-day streak is at risk!`,
          html: buildStreakReminderEmail(currentStreak),
        })
        emailsSent++
        console.log(`[streak-reminder] Sent to ${user.email} (streak: ${currentStreak})`)
      } catch (emailError) {
        console.error(`[streak-reminder] Failed to send to ${user.email}:`, emailError)
      }
    }

    return NextResponse.json({
      success: true,
      emailsSent,
      usersChecked: atRiskStreaks.length,
    })
  } catch (error) {
    console.error('[streak-reminder] Error:', error)
    return NextResponse.json({ error: 'Failed to send streak reminders' }, { status: 500 })
  }
}
