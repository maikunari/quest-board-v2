import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  console.log('🌱 Seeding quest board...')

  // Clear existing data for today
  await prisma.completion.deleteMany({ where: { date: today } })
  await prisma.quest.deleteMany({ where: { date: today } })

  // Main Quest
  await prisma.quest.create({
    data: {
      date: today,
      type: 'main',
      title: 'Build Jozu Onboarding Flow',
      subtitle: 'Post-signup user experience',
      description: 'Design and build the onboarding flow for new Jozu users after sign-up. First impressions matter!',
      icon: '🚀',
      points: 20,
      order: 0,
    },
  })

  // Side Quests
  const sideQuests = [
    { title: 'Publish Chrome Extension', subtitle: 'Screenshots + upload to Chrome Web Store', icon: '🌐', points: 10 },
    { title: 'Record Sync Video', subtitle: 'Loom walkthrough for team', icon: '🎥', points: 5 },
    { title: 'Review & Finalize Tax Prep', subtitle: 'Get tax docs in order', icon: '📊', points: 5 },
    { title: 'Deploy Quest Board v2', subtitle: 'Push to Vercel, test all features', icon: '⚔️', points: 10 },
  ]

  for (let i = 0; i < sideQuests.length; i++) {
    await prisma.quest.create({
      data: {
        date: today,
        type: 'side',
        ...sideQuests[i],
        order: i,
      },
    })
  }

  // Daily Quests
  const dailyQuests = [
    { title: 'Clear inbox', subtitle: 'Emails, tickets, messages', icon: '📧', points: 3 },
    { title: 'Code review', subtitle: 'Review open PRs', icon: '💻', points: 3 },
    { title: 'End-of-day checkin', subtitle: 'Report progress, plan tomorrow', icon: '📝', points: 5 },
  ]

  for (let i = 0; i < dailyQuests.length; i++) {
    await prisma.quest.create({
      data: {
        date: today,
        type: 'daily',
        ...dailyQuests[i],
        order: i,
      },
    })
  }

  console.log('✅ Seed complete! Created quests for today.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
