import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// Asana webhook endpoint
// Docs: https://developers.asana.com/docs/webhooks

export async function POST(request: NextRequest) {
  try {
    // Handle webhook handshake (Asana verification)
    const hookSecret = request.headers.get('x-hook-secret')
    if (hookSecret) {
      // Initial handshake - echo back the secret
      console.log('Asana webhook handshake received')
      return new NextResponse(null, {
        status: 200,
        headers: { 'X-Hook-Secret': hookSecret },
      })
    }

    // Verify signature
    const signature = request.headers.get('x-hook-signature')
    const body = await request.text()
    
    // For now, process without strict verification (can add later with stored secret)
    const payload = JSON.parse(body)
    console.log('Asana webhook event:', JSON.stringify(payload, null, 2))

    // Process events
    const events = payload.events || []
    
    for (const event of events) {
      // We care about task completion changes
      if (event.resource?.resource_type === 'task' && event.action === 'changed') {
        const taskGid = event.resource.gid
        
        // Check if this task is linked to a quest
        const quest = await prisma.quest.findFirst({
          where: { asanaTaskId: taskGid },
        })

        if (quest) {
          // Fetch task details from Asana to get completion status
          const token = process.env.ASANA_TOKEN
          if (!token) continue

          const taskRes = await fetch(`https://app.asana.com/api/1.0/tasks/${taskGid}?opt_fields=completed`, {
            headers: { Authorization: `Bearer ${token}` },
          })

          if (!taskRes.ok) continue
          const taskData = await taskRes.json()
          const isCompleted = taskData.data?.completed

          if (isCompleted) {
            // Create completion if not exists
            const existing = await prisma.completion.findFirst({
              where: {
                questId: quest.id,
                date: quest.date,
                visitorId: 'default',
              },
            })

            if (!existing) {
              await prisma.completion.create({
                data: {
                  questId: quest.id,
                  date: quest.date,
                  visitorId: 'default',
                },
              })
              console.log(`Quest "${quest.title}" marked complete via Asana webhook`)
            }
          } else {
            // Remove completion if exists
            await prisma.completion.deleteMany({
              where: {
                questId: quest.id,
                date: quest.date,
                visitorId: 'default',
              },
            })
            console.log(`Quest "${quest.title}" marked incomplete via Asana webhook`)
          }

          // Update day stats
          await updateDayStats(quest.date)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// Also handle GET for webhook verification
export async function GET() {
  return NextResponse.json({ status: 'Asana webhook endpoint ready' })
}

async function updateDayStats(date: Date) {
  const quests = await prisma.quest.findMany({
    where: { date },
    include: { completions: { where: { date } } },
  })

  const questsTotal = quests.length
  const questsCompleted = quests.filter(q => q.completions.length > 0).length
  const totalPoints = quests
    .filter(q => q.completions.length > 0)
    .reduce((sum, q) => sum + q.points, 0)

  await prisma.dayStats.upsert({
    where: { date },
    create: { date, totalPoints, questsCompleted, questsTotal },
    update: { totalPoints, questsCompleted, questsTotal },
  })
}
