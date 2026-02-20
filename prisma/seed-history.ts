import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Seed historical data from v1 quest board
async function main() {
  // Create some historical day stats based on v1 data
  
  const historicalDays = [
    { date: new Date('2026-02-02'), totalPoints: 48, questsCompleted: 6, questsTotal: 8 },
    { date: new Date('2026-02-03'), totalPoints: 54, questsCompleted: 7, questsTotal: 9 },
    { date: new Date('2026-02-04'), totalPoints: 21, questsCompleted: 3, questsTotal: 7 },
    { date: new Date('2026-02-05'), totalPoints: 43, questsCompleted: 8, questsTotal: 10 },
  ]
  
  for (const day of historicalDays) {
    // Legacy seed data (no userId)
    const existing = await prisma.dayStats.findFirst({
      where: { date: day.date, userId: null },
    })
    if (existing) {
      await prisma.dayStats.update({
        where: { id: existing.id },
        data: { totalPoints: day.totalPoints, questsCompleted: day.questsCompleted, questsTotal: day.questsTotal },
      })
    } else {
      await prisma.dayStats.create({ data: day })
    }
    console.log(`Seeded ${day.date.toISOString().split('T')[0]}: ${day.totalPoints} pts`)
  }
  
  console.log('Historical data seeded!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
