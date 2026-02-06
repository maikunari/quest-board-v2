import { NextRequest, NextResponse } from 'next/server'

// POST /api/asana/webhook/setup - Register webhook with Asana
export async function POST(request: NextRequest) {
  try {
    const token = process.env.ASANA_TOKEN
    const workspaceGid = process.env.ASANA_WORKSPACE_GID || '1211778541088357'
    const webhookUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL

    if (!token) {
      return NextResponse.json({ error: 'ASANA_TOKEN not configured' }, { status: 400 })
    }

    if (!webhookUrl) {
      return NextResponse.json({ error: 'App URL not configured' }, { status: 400 })
    }

    // Get user's task list
    const taskListRes = await fetch(
      `https://app.asana.com/api/1.0/users/me/user_task_list?workspace=${workspaceGid}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    if (!taskListRes.ok) {
      return NextResponse.json({ error: 'Failed to get user task list' }, { status: 502 })
    }

    const taskListData = await taskListRes.json()
    const resourceGid = taskListData.data.gid

    // Register webhook - ensure clean URL without trailing slashes
    const baseUrl = webhookUrl.replace(/\/$/, '')
    const targetUrl = baseUrl.startsWith('http') 
      ? `${baseUrl}/api/asana/webhook`
      : `https://${baseUrl}/api/asana/webhook`
    
    console.log('Registering webhook to:', targetUrl)

    const webhookRes = await fetch('https://app.asana.com/api/1.0/webhooks', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          resource: resourceGid,
          target: targetUrl,
          filters: [
            { resource_type: 'task', action: 'changed', fields: ['completed'] }
          ],
        },
      }),
    })

    const webhookData = await webhookRes.json()

    if (!webhookRes.ok) {
      console.error('Webhook registration failed:', webhookData)
      return NextResponse.json({ 
        error: 'Failed to register webhook', 
        details: webhookData 
      }, { status: 502 })
    }

    console.log('Webhook registered:', webhookData)
    return NextResponse.json({ 
      success: true, 
      webhook: webhookData.data,
      targetUrl,
    })
  } catch (error) {
    console.error('Webhook setup error:', error)
    return NextResponse.json({ error: 'Failed to setup webhook' }, { status: 500 })
  }
}

// GET - List existing webhooks
export async function GET() {
  try {
    const token = process.env.ASANA_TOKEN
    const workspaceGid = process.env.ASANA_WORKSPACE_GID || '1211778541088357'

    if (!token) {
      return NextResponse.json({ error: 'ASANA_TOKEN not configured' }, { status: 400 })
    }

    const res = await fetch(
      `https://app.asana.com/api/1.0/webhooks?workspace=${workspaceGid}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error listing webhooks:', error)
    return NextResponse.json({ error: 'Failed to list webhooks' }, { status: 500 })
  }
}

// DELETE - Remove a webhook
export async function DELETE(request: NextRequest) {
  try {
    const token = process.env.ASANA_TOKEN
    const { searchParams } = new URL(request.url)
    const webhookGid = searchParams.get('gid')

    if (!token) {
      return NextResponse.json({ error: 'ASANA_TOKEN not configured' }, { status: 400 })
    }

    if (!webhookGid) {
      return NextResponse.json({ error: 'gid required' }, { status: 400 })
    }

    const res = await fetch(
      `https://app.asana.com/api/1.0/webhooks/${webhookGid}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: 'Failed to delete', details: err }, { status: 502 })
    }

    return NextResponse.json({ success: true, deleted: webhookGid })
  } catch (error) {
    console.error('Error deleting webhook:', error)
    return NextResponse.json({ error: 'Failed to delete webhook' }, { status: 500 })
  }
}
