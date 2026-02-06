import { NextRequest, NextResponse } from 'next/server'

// GET /api/asana/tasks - Fetch tasks from Asana
// Fetches all incomplete tasks assigned to the user in the workspace
export async function GET(request: NextRequest) {
  try {
    const token = process.env.ASANA_TOKEN
    const workspaceGid = process.env.ASANA_WORKSPACE_GID || '1211778541088357'

    if (!token) {
      return NextResponse.json({ error: 'ASANA_TOKEN not configured' }, { status: 400 })
    }

    // Get current user info
    const meRes = await fetch(
      'https://app.asana.com/api/1.0/users/me',
      { 
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store' // Prevent caching
      }
    )
    
    if (!meRes.ok) {
      console.error('Failed to get user info')
      return NextResponse.json({ error: 'Failed to get user info' }, { status: 502 })
    }
    
    const meData = await meRes.json()
    const userGid = meData.data.gid
    console.log('[Asana] Fetching tasks for user:', meData.data.email)

    // Fetch ALL incomplete tasks assigned to this user in the workspace
    // This is more reliable than user_task_list which can have sync issues
    const response = await fetch(
      `https://app.asana.com/api/1.0/tasks?workspace=${workspaceGid}&assignee=${userGid}&completed_since=now&opt_fields=name,due_on,completed,notes,projects.name&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store' // Prevent caching
      }
    )

    if (!response.ok) {
      const err = await response.text()
      console.error('Asana API error:', err)
      return NextResponse.json({ error: 'Failed to fetch from Asana' }, { status: 502 })
    }

    const data = await response.json()
    console.log('[Asana] Found', data.data.length, 'tasks')

    // Map to quest-friendly format
    const tasks = data.data
      .filter((task: any) => !task.completed)
      .map((task: any) => ({
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

    console.log('[Asana] Returning', tasks.length, 'incomplete tasks')
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching Asana tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch Asana tasks' }, { status: 500 })
  }
}
