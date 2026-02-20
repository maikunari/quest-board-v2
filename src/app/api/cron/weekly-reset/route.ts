import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// POST /api/cron/weekly-reset
// Called every Sunday at midnight UTC (configure in vercel.json or external scheduler)
// Protected by CRON_SECRET env var
export async function POST(request: NextRequest) {
  const secret = request.headers.get('authorization')?.replace('Bearer ', '')

  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await prisma.user.updateMany({
      data: { weeklyXp: 0 },
    })

    console.log(`[weekly-reset] Reset weeklyXp for ${result.count} users`)

    return NextResponse.json({
      success: true,
      usersReset: result.count,
      resetAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[weekly-reset] Error:', error)
    return NextResponse.json({ error: 'Failed to reset weekly XP' }, { status: 500 })
  }
}
