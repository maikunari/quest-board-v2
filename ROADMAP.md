# Quest Board v2 — Productization Roadmap

*From personal tool to SaaS product. Turn boring tasks into epic quests.* 🏰⚔️

## Vision
Gamified task management that actually sticks. Like Habitica but modern, clean, and integrated with the tools people already use. Free tier hooks them, Pro tier keeps them, Teams tier scales revenue.

## Current State (v2 — Live on Vercel)
- ✅ Task management with XP/levels
- ✅ Asana integration
- ✅ Daily templates (auto-populate each day)
- ✅ Dark/light/system theme toggle
- ✅ Stats + history calendar + admin editor
- ✅ Next.js 14 + Tailwind + Prisma + Framer Motion
- ✅ Neon PostgreSQL on Vercel

---

## Sprint 1: Foundation (Auth + Billing + Landing)

### 1.1 Authentication (Clerk)
- Sign up / login pages
- Protect all routes except landing page
- User model in Prisma linked to Clerk user ID
- Social logins (Google, GitHub)
- Free tier: 10K MAU on Clerk free plan

### 1.2 Stripe Billing
- **Free tier:** Solo, 1 integration, basic themes
- **Pro ($5/mo):** Unlimited integrations, custom themes, advanced stats
- **Teams ($8/user/mo):** Shared boards, team analytics
- Stripe Checkout for subscription flow
- Customer Portal for self-service billing (upgrade/downgrade/cancel)
- Webhook handler for subscription events
- Grace period on failed payments

### 1.3 Landing Page (RPG Themed)
- Hero: "Turn your boring tasks into epic quests" with animated demo
- Feature cards styled like RPG item cards / spell books
- Pricing table (Free / Pro / Teams) styled as difficulty tiers
- Social proof: "X quests completed by adventurers"
- CTA: "Begin Your Adventure" (free signup)
- Testimonials section (add later when we have users)
- Keep existing gamey aesthetic, make it marketing-ready
- Mobile responsive, fast load (<2s LCP)

---

## Sprint 2: Engagement Loop

### 2.1 Streaks System
- Daily login streaks
- Task completion streaks
- XP multipliers for maintained streaks (2x at 7 days, 3x at 30 days)
- Visual streak counter in header/sidebar
- Streak freeze (Pro feature — skip a day without breaking streak)

### 2.2 Achievements / Badges
- **Starter:** "First Quest", "Level 5", "First Integration"
- **Consistency:** "7-Day Streak", "30-Day Streak", "100-Day Streak"
- **Volume:** "100 Tasks Slain", "1000 Tasks Slain"
- **Special:** "Night Owl" (complete task after midnight), "Early Bird" (before 6am)
- Badge display on profile
- Achievement unlock notifications with animation

### 2.3 Sound Effects + Polish
- Task completion SFX
- Level up fanfare
- Streak milestone sounds
- Toggle on/off in settings
- Subtle UI animations (Framer Motion)

---

## Sprint 3: Character + Social

### 3.1 Character / Avatar System
- Choose character class (Warrior, Mage, Rogue, etc.)
- Level progression changes character sprite or gear
- Character displayed in sidebar/header
- Optional: pixel art style to match RPG theme

### 3.2 PWA Support
- Service worker for offline capability
- Install prompt (iOS + Android)
- Push notifications for streak reminders (Pro)
- App icon + splash screen

### 3.3 More Integrations
- Todoist
- Linear
- GitHub Issues
- Google Tasks
- Generic webhook / Zapier

---

## Sprint 4: Teams + Scale

### 4.1 Guilds / Parties
- Create/join guilds
- Shared quest boards
- Guild XP leaderboard
- Guild challenges ("Complete 100 tasks as a guild this week")

### 4.2 Team Analytics
- Team completion rates
- Individual contribution graphs
- Manager dashboard
- Export reports

### 4.3 Admin Controls
- Team member management
- Role-based permissions
- Billing management (Teams plan)

---

## Monetization Strategy

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | Solo, 1 integration, basic theme, streaks |
| Pro | $5/mo | Unlimited integrations, custom themes, advanced stats, streak freeze, PWA notifications |
| Teams | $8/user/mo | Everything in Pro + guilds, shared boards, team analytics, admin controls |

**Revenue targets:**
- 1,000 free users → 50 Pro ($250/mo) + 5 teams of 5 ($200/mo) = $450/mo
- 5,000 free users → 250 Pro ($1,250/mo) + 20 teams of 5 ($800/mo) = $2,050/mo
- 10,000 free users → 500 Pro ($2,500/mo) + 50 teams of 5 ($2,000/mo) = $4,500/mo

## Competitive Positioning
**vs Habitica:** Modern UI, native project tool integrations, simplicity. Habitica is bloated with pets/potions/classes. Quest Board is clean — tasks in, dopamine out.

**vs Todoist/Linear:** They're productivity tools. We're a game that makes you productive. Different value prop entirely.

**Tagline:** *Your tasks are boring. Make them legendary.*

---

## Tech Stack
- **Frontend:** Next.js 14, Tailwind CSS, Framer Motion
- **Auth:** Clerk
- **Payments:** Stripe
- **Database:** Prisma + Neon PostgreSQL
- **Hosting:** Vercel (free tier for now, Coolify later if needed)
- **Analytics:** PostHog (when ready)

## Branch Convention
- `owsley/quest-board-auth` — Sprint 1.1
- `owsley/quest-board-stripe` — Sprint 1.2
- `owsley/quest-board-landing` — Sprint 1.3
- `owsley/quest-board-streaks` — Sprint 2.1
- etc.

---

*"Every day above ground is a good day to complete a quest."* 🎸
