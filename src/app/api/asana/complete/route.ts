import { NextRequest, NextResponse } from 'next/server'

// POST /api/asana/complete - Mark task done in Asana
export async function POST(request: NextRequest) {
  try {
    const token = process.env.ASANA_TOKEN

    if (!token) {
      return NextResponse.json({ error: 'ASANA_TOKEN not configured' }, { status: 400 })
    }

    const body = await request.json()
    const { taskGid } = body

    if (!taskGid) {
      return NextResponse.json({ error: 'taskGid required' }, { status: 400 })
    }

    const response = await fetch(
      `https://app.asana.com/api/1.0/tasks/${taskGid}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: { completed: true },
        }),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      console.error('Asana complete error:', err)
      return NextResponse.json({ error: 'Failed to complete in Asana' }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error completing Asana task:', error)
    return NextResponse.json({ error: 'Failed to complete Asana task' }, { status: 500 })
  }
}
