import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Seed historical data from v1 quest board
async function main() {
  // Create some historical day stats based on v1 data
  // Week total was 123 pts, streak was 2 days
  
  const historicalDays = [
    { date: '2026-02-02', totalPoints: 48, questsCompleted: 6, questsTotal: 8 },
    { date: '2026-02-03', totalPoints: 54, questsCompleted: 7, questsTotal: 9 },
    { date: '2026-02-04', totalPoints: 21, questsCompleted: 3, questsTotal: 7 },
  ]
  
  for (const day of historicalDays) {
    await prisma.dayStats.upsert({
      where: { date: day.date },
      update: day,
      create: day,
    })
    console.log(`Seeded ${day.date}: ${day.totalPoints} pts`)
  }
  
  console.log('Historical data seeded!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
