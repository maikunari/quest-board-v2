import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// POST /api/settings/asana - Save user's Asana token
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { token } = body

  if (!token || typeof token !== 'string' || !token.trim()) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 })
  }

  // Validate token against Asana API before saving
  const meRes = await fetch('https://app.asana.com/api/1.0/users/me', {
    headers: { Authorization: `Bearer ${token.trim()}` },
    cache: 'no-store',
  })

  if (!meRes.ok) {
    return NextResponse.json({ error: 'Invalid Asana token — could not verify with Asana API' }, { status: 400 })
  }

  const meData = await meRes.json()
  const asanaUser = meData.data

  // Save token to user record
  await prisma.user.update({
    where: { id: session.user.id },
    data: { asanaToken: token.trim() },
  })

  return NextResponse.json({
    ok: true,
    email: asanaUser.email,
    name: asanaUser.name,
  })
}

// DELETE /api/settings/asana - Disconnect (clear token)
export async function DELETE() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { asanaToken: null },
  })

  return NextResponse.json({ ok: true })
}

// GET /api/settings/asana - Check if user has a token saved (no token exposure)
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { asanaToken: true },
  })

  return NextResponse.json({ hasToken: !!user?.asanaToken })
}
