import { NextRequest, NextResponse } from 'next/server'

// GET /api/asana/tasks - Fetch tasks from Asana
export async function GET(request: NextRequest) {
  try {
    const token = process.env.ASANA_TOKEN
    const workspaceGid = process.env.ASANA_WORKSPACE_GID || '1211778541088357'
    const userGid = process.env.ASANA_USER_GID || '1213014189296449'

    if (!token) {
      return NextResponse.json({ error: 'ASANA_TOKEN not configured' }, { status: 400 })
    }

    // Fetch more tasks with limit
    const response = await fetch(
      `https://app.asana.com/api/1.0/tasks?assignee=${userGid}&workspace=${workspaceGid}&opt_fields=name,due_on,completed,notes,projects.name&completed_since=now&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      const err = await response.text()
      console.error('Asana API error:', err)
      return NextResponse.json({ error: 'Failed to fetch from Asana' }, { status: 502 })
    }

    const data = await response.json()

    // Map to quest-friendly format
    const tasks = data.data.map((task: any) => ({
      gid: task.gid,
      name: task.name,
      notes: task.notes || '',
      dueOn: task.due_on,
      completed: task.completed,
      project: task.projects?.[0]?.name || 'No Project',
    }))

    // Sort by: tasks with due dates first (closest first), then tasks without due dates
    tasks.sort((a: any, b: any) => {
      if (!a.dueOn && !b.dueOn) return 0
      if (!a.dueOn) return 1
      if (!b.dueOn) return -1
      return new Date(a.dueOn).getTime() - new Date(b.dueOn).getTime()
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching Asana tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch Asana tasks' }, { status: 500 })
  }
}
