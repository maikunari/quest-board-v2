import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/completions?date=2024-01-15
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get('date')
    const visitorId = searchParams.get('visitorId') || 'default'

    const where: any = { visitorId }

    if (dateStr) {
      where.date = new Date(dateStr)
    }

    const completions = await prisma.completion.findMany({
      where,
      include: {
        quest: true,
      },
    })

    return NextResponse.json(completions)
  } catch (error) {
    console.error('Error fetching completions:', error)
    return NextResponse.json({ error: 'Failed to fetch completions' }, { status: 500 })
  }
}

// POST /api/completions - Toggle quest completion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { questId, date, visitorId = 'default', completed } = body

    const dateObj = new Date(date)

    if (completed === false) {
      // Remove completion
      await prisma.completion.deleteMany({
        where: {
          questId,
          date: dateObj,
          visitorId,
        },
      })

      // Update day stats
      await updateDayStats(dateObj)

      return NextResponse.json({ completed: false })
    }

    // Check if already completed
    const existing = await prisma.completion.findFirst({
      where: {
        questId,
        date: dateObj,
        visitorId,
      },
    })

    if (existing) {
      // Toggle off
      await prisma.completion.delete({ where: { id: existing.id } })
      await updateDayStats(dateObj)
      return NextResponse.json({ completed: false })
    }

    // Create completion
    const completion = await prisma.completion.create({
      data: {
        questId,
        date: dateObj,
        visitorId,
      },
      include: {
        quest: true,
      },
    })

    // Also complete in Asana if linked
    const quest = await prisma.quest.findUnique({ where: { id: questId } })
    if (quest?.asanaTaskId && process.env.ASANA_TOKEN) {
      // Call Asana API directly (fire and forget)
      fetch(`https://app.asana.com/api/1.0/tasks/${quest.asanaTaskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.ASANA_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: { completed: true } }),
      }).catch((err) => console.error('Asana complete failed:', err))
    }

    await updateDayStats(dateObj)

    return NextResponse.json({ completed: true, completion })
  } catch (error) {
    console.error('Error toggling completion:', error)
    return NextResponse.json({ error: 'Failed to toggle completion' }, { status: 500 })
  }
}

async function updateDayStats(date: Date) {
  const quests = await prisma.quest.findMany({
    where: { date },
    include: { completions: { where: { date } } },
  })

  const questsTotal = quests.length
  const questsCompleted = quests.filter(q => q.completions.length > 0).length
  const totalPoints = quests
    .filter(q => q.completions.length > 0)
    .reduce((sum, q) => sum + q.points, 0)

  await prisma.dayStats.upsert({
    where: { date },
    create: {
      date,
      totalPoints,
      questsCompleted,
      questsTotal,
    },
    update: {
      totalPoints,
      questsCompleted,
      questsTotal,
    },
  })
}
