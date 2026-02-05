import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/quests?date=2024-01-15
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get('date')
    const type = searchParams.get('type')

    const where: any = {}

    if (dateStr) {
      where.date = new Date(dateStr)
    }

    if (type) {
      where.type = type
    }

    const quests = await prisma.quest.findMany({
      where,
      include: {
        completions: true,
      },
      orderBy: [
        { type: 'asc' },
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
    })

    return NextResponse.json(quests)
  } catch (error) {
    console.error('Error fetching quests:', error)
    return NextResponse.json({ error: 'Failed to fetch quests' }, { status: 500 })
  }
}

// POST /api/quests - Create or update a quest
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, date, type, title, subtitle, description, icon, points, asanaTaskId, order } = body

    if (id) {
      // Update existing
      const quest = await prisma.quest.update({
        where: { id },
        data: {
          date: date ? new Date(date) : undefined,
          type,
          title,
          subtitle,
          description,
          icon,
          points,
          asanaTaskId,
          order,
        },
      })
      return NextResponse.json(quest)
    } else {
      // Create new
      const quest = await prisma.quest.create({
        data: {
          date: new Date(date),
          type,
          title,
          subtitle: subtitle || null,
          description: description || null,
          icon: icon || '⚔️',
          points: points || 5,
          asanaTaskId: asanaTaskId || null,
          order: order || 0,
        },
      })
      return NextResponse.json(quest, { status: 201 })
    }
  } catch (error) {
    console.error('Error creating/updating quest:', error)
    return NextResponse.json({ error: 'Failed to save quest' }, { status: 500 })
  }
}

// DELETE /api/quests?id=xxx
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Quest ID required' }, { status: 400 })
    }

    await prisma.quest.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting quest:', error)
    return NextResponse.json({ error: 'Failed to delete quest' }, { status: 500 })
  }
}
