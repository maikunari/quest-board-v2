import { NextRequest, NextResponse } from 'next/server'

// GET /api/asana/tasks - Fetch tasks from Asana
export async function GET(request: NextRequest) {
  try {
    const token = process.env.ASANA_TOKEN
    const workspaceGid = process.env.ASANA_WORKSPACE_GID || '1211778541088357'

    if (!token) {
      return NextResponse.json({ error: 'ASANA_TOKEN not configured' }, { status: 400 })
    }

    // First, get the user's task list for this workspace
    const meRes = await fetch(
      `https://app.asana.com/api/1.0/users/me/user_task_list?workspace=${workspaceGid}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    
    if (!meRes.ok) {
      console.error('Failed to get user task list')
      return NextResponse.json({ error: 'Failed to get user task list' }, { status: 502 })
    }
    
    const meData = await meRes.json()
    const userTaskListGid = meData.data.gid

    // Fetch tasks from user's task list
    const response = await fetch(
      `https://app.asana.com/api/1.0/user_task_lists/${userTaskListGid}/tasks?opt_fields=name,due_on,completed,notes,projects.name&limit=100`,
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

    // Map to quest-friendly format, filter out completed tasks
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

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching Asana tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch Asana tasks' }, { status: 500 })
  }
}
