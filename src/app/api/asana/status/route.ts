import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  // Try to get per-user token first, fall back to env var
  let token: string | null | undefined = process.env.ASANA_TOKEN
  const workspaceGid = process.env.ASANA_WORKSPACE_GID

  const session = await auth()
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { asanaToken: true },
    })
    if (user?.asanaToken) {
      token = user.asanaToken
    }
  }

  if (!token) {
    return NextResponse.json({ connected: false, reason: 'no_token' })
  }

  try {
    // Verify token by fetching user info
    const meRes = await fetch('https://app.asana.com/api/1.0/users/me', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })

    if (!meRes.ok) {
      return NextResponse.json({ connected: false, reason: 'invalid_token' })
    }

    const meData = await meRes.json()
    const user = meData.data

    // Get workspace name if GID is set
    let workspaceName: string | null = null
    if (workspaceGid) {
      const wsRes = await fetch(
        `https://app.asana.com/api/1.0/workspaces/${workspaceGid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        }
      )
      if (wsRes.ok) {
        const wsData = await wsRes.json()
        workspaceName = wsData.data.name
      }
    }

    // Get task count
    let taskCount: number | null = null
    if (workspaceGid) {
      const tasksRes = await fetch(
        `https://app.asana.com/api/1.0/tasks?workspace=${workspaceGid}&assignee=${user.gid}&completed_since=now&limit=100&opt_fields=gid`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        }
      )
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json()
        taskCount = tasksData.data.length
      }
    }

    return NextResponse.json({
      connected: true,
      email: user.email,
      name: user.name,
      workspace: workspaceName,
      workspaceGid: workspaceGid || null,
      taskCount,
    })
  } catch (error) {
    console.error('Asana status check error:', error)
    return NextResponse.json({ connected: false, reason: 'error' }, { status: 500 })
  }
}
