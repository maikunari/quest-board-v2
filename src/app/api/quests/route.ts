import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/quests?date=2024-01-15
export async function GET(request: NextRequest) {
  try {
    const user = await requireUser()
    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get('date')
    const type = searchParams.get('type')

    const where: any = {
      // Scope to user's quests OR legacy (no userId) for migration
      OR: [{ userId: user.id }, { userId: null }],
    }

    if (dateStr) {
      where.date = new Date(dateStr)
      
      // Auto-create dailies from templates - sync any missing ones
      const templates = await prisma.dailyTemplate.findMany({
        where: {
          active: true,
          OR: [{ userId: user.id }, { userId: null }],
        },
        orderBy: { order: 'asc' },
      })
      
      if (templates.length > 0) {
        // Get existing daily titles for this date for this user
        const existingDailies = await prisma.quest.findMany({
          where: {
            date: new Date(dateStr),
            type: 'daily',
            OR: [{ userId: user.id }, { userId: null }],
          },
          select: { title: true }
        })
        const existingTitles = new Set(existingDailies.map(d => d.title))
        
        // Create any missing dailies
        const missingTemplates = templates.filter(t => !existingTitles.has(t.title))
        
        if (missingTemplates.length > 0) {
          await prisma.quest.createMany({
            data: missingTemplates.map(t => ({
              userId: user.id,
              date: new Date(dateStr),
              type: 'daily' as const,
              title: t.title,
              subtitle: t.subtitle,
              description: t.description,
              icon: t.icon,
              points: t.points,
              order: t.order,
            })),
          })
        }
      }
    }

    if (type) {
      where.type = type
    }

    const quests = await prisma.quest.findMany({
      where,
      include: {
        completions: {
          where: { OR: [{ userId: user.id }, { userId: null }] },
        },
      },
      orderBy: [
        { type: 'asc' },
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
    })

    return NextResponse.json(quests)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching quests:', error)
    return NextResponse.json({ error: 'Failed to fetch quests' }, { status: 500 })
  }
}

// POST /api/quests - Create or update a quest
export async function POST(request: NextRequest) {
  try {
    const user = await requireUser()
    const body = await request.json()
    const { id, date, type, title, subtitle, description, icon, points, asanaTaskId, order } = body

    if (id) {
      // Verify ownership before update
      const existing = await prisma.quest.findUnique({ where: { id } })
      if (!existing || (existing.userId && existing.userId !== user.id)) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }

      const quest = await prisma.quest.update({
        where: { id },
        data: {
          userId: user.id, // Claim legacy quests on edit
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
          userId: user.id,
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
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error creating/updating quest:', error)
    return NextResponse.json({ error: 'Failed to save quest' }, { status: 500 })
  }
}

// DELETE /api/quests?id=xxx
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireUser()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Quest ID required' }, { status: 400 })
    }

    // Verify ownership
    const existing = await prisma.quest.findUnique({ where: { id } })
    if (!existing || (existing.userId && existing.userId !== user.id)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.quest.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error deleting quest:', error)
    return NextResponse.json({ error: 'Failed to delete quest' }, { status: 500 })
  }
}
