import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth'

// GET /api/daily-templates - Get all active templates
export async function GET() {
  try {
    const user = await requireUser()
    const templates = await prisma.dailyTemplate.findMany({
      where: {
        active: true,
        OR: [{ userId: user.id }, { userId: null }],
      },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(templates)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching daily templates:', error)
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
  }
}

// POST /api/daily-templates - Create or update a template
export async function POST(request: NextRequest) {
  try {
    const user = await requireUser()
    const body = await request.json()
    const { id, title, subtitle, description, icon, points, order, active } = body

    if (id) {
      const existing = await prisma.dailyTemplate.findUnique({ where: { id } })
      if (!existing || (existing.userId && existing.userId !== user.id)) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }
      const template = await prisma.dailyTemplate.update({
        where: { id },
        data: { userId: user.id, title, subtitle, description, icon, points, order, active },
      })
      return NextResponse.json(template)
    } else {
      const template = await prisma.dailyTemplate.create({
        data: { userId: user.id, title, subtitle, description, icon, points: points || 3, order: order || 0 },
      })
      return NextResponse.json(template)
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error saving daily template:', error)
    return NextResponse.json({ error: 'Failed to save template' }, { status: 500 })
  }
}

// DELETE /api/daily-templates?id=xxx - Delete a template
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireUser()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const existing = await prisma.dailyTemplate.findUnique({ where: { id } })
    if (!existing || (existing.userId && existing.userId !== user.id)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.dailyTemplate.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error deleting daily template:', error)
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 })
  }
}
