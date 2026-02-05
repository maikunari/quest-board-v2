# Quest Board v2 ⚔️

Gamified task management dashboard for solo developers. Track quests, earn points, maintain streaks.

## Features

- **Main Quest Board** — Big hero card for your main quest, side quests and dailies
- **Points System** — Main = 20pts, Side = 5-10pts, Daily = 3-5pts
- **Completion Animations** — Satisfying celebration when you finish a quest
- **Stats & Streaks** — Track your productivity over time
- **History** — Calendar view of past days with completion data
- **Admin Panel** — Add/edit/delete quests, duplicate dailies, import from Asana
- **Asana Integration** — Pull tasks and sync completions

## Stack

- Next.js 14 (App Router)
- Tailwind CSS (dark gaming aesthetic)
- Prisma + PostgreSQL
- Framer Motion animations
- Recharts for stats visualization

## Getting Started

```bash
# Install
npm install

# Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# Push schema to database
npx prisma db push

# (Optional) Seed sample data
npm run db:seed

# Dev
npm run dev

# Build
npm run build
```

## Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables:
   - `DATABASE_URL` — Vercel Postgres connection string
   - `ASANA_TOKEN` — (optional) Asana personal access token
4. Deploy!

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/quests` | GET/POST/DELETE | CRUD for quests |
| `/api/completions` | GET/POST | Toggle quest completion |
| `/api/stats` | GET | Points, streaks, history |
| `/api/asana/tasks` | GET | Fetch tasks from Asana |
| `/api/asana/complete` | POST | Mark Asana task done |

## Database Schema

- **Quest** — id, date, type, title, subtitle, description, icon, points, asanaTaskId, order
- **Completion** — id, visitorId, questId, date, completedAt
- **DayStats** — id, date, totalPoints, questsCompleted, questsTotal (cached)
