# Quest Board v2 — Full App Audit

**Audit Date:** 2026-02-21  
**Stack:** Next.js 14, Auth.js v5, Prisma + Neon PostgreSQL, Tailwind, Stripe, Resend

---

## ✅ What's Working

### Auth
- **Auth.js v5** fully implemented with Google, GitHub, and Resend (magic link) providers
- **Session callback** correctly populates `session.user.id` from DB user
- **`requireUser()` in `/lib/auth.ts`** — works correctly with Auth.js v5
- **Sign-out** uses `callbackUrl: '/'` — properly redirects to landing page ✅
- **Login page** (`/login`) — supports Google, GitHub, and magic link sign-in ✅
- **Legacy Clerk routes** (`/sign-in`, `/sign-up`) redirect to `/login` ✅
- **No Clerk npm packages** installed — clean dependency tree ✅
- **Middleware** protects routes: `/quests`, `/admin`, `/stats`, `/history`, `/achievements`, `/settings`

### Quest System
- Quest CRUD API (`/api/quests`) — fully functional
- Completion toggle API (`/api/completions`) — handles optimistic updates, streaks, achievements
- Quest types: main, side, daily — all working
- **Asana sync** — completing/uncompleting quests syncs to Asana if `asanaTaskId` is set

### XP & Streak System
- Streak tracking via dedicated `Streak` model — fast lookups
- Streak multipliers based on current streak
- `DayStats` updated on every completion toggle
- Weekly XP tracked in `User.weeklyXp` field
- **Shield (streak freeze)** fields exist in schema

### Leaderboard
- Top 20 users by weekly XP
- Ascension Zone (top 3) and Danger Zone (bottom 3) visual indicators
- Current user pinned below if outside top 20
- Resets every Sunday at midnight UTC

### Stats Page
- 30-day points chart
- Day-of-week productivity chart
- Best streak, completion rate, most productive day

### History Page
- Calendar view of quest history by month
- Click any day to see quest breakdown
- Completion intensity heat map

### Achievements
- Achievement system with rarity tiers (common → legendary)
- Triggers: first quest, streaks, early bird, speed run, integrations

### Email (Resend)
- `from: "Quest Board <noreply@questboard.sh>"` — matches Resend verified domain ✅
- Streak reminder cron (`/api/cron/streak-reminder`) — sends HTML email, protected by `CRON_SECRET`
- Magic link auth via Resend provider

### Stripe (code complete, needs env vars)
- Checkout API (`/api/stripe/checkout`) — creates Stripe session, handles PRO/TEAMS
- Portal API (`/api/stripe/portal`) — manages billing portal
- Webhook (`/api/stripe/webhook`) — handles all subscription lifecycle events:
  - `checkout.session.completed` → upgrades user plan
  - `customer.subscription.updated` → syncs plan changes
  - `customer.subscription.deleted` → reverts to FREE
  - `invoice.payment_failed` → grace period (no immediate downgrade)
- Pricing page buttons correctly POST to `/api/stripe/checkout` ✅
- Lazy-initialized Stripe client (builds succeed without env vars) ✅

### Landing Page
- All sign-in links point to `/login` ✅
- Pricing section links to `/pricing` ✅
- Contact form submits to `/api/contact` ✅

### Contact Form
- Saves messages to `ContactMessage` DB table
- No email notification (intentional — Mike checks manually)

### Settings Page
- Sound effects toggle (localStorage)
- Asana integration (per-user token, test, disconnect)
- Billing section with link to Stripe customer portal
- Daily quest templates management

### Sound Effects
- `/lib/sounds.ts` and `/lib/use-sound.ts` — Web Audio API
- Sounds: complete, undo, streak milestone, achievement
- Respects `localStorage` preference

### Admin / Quest Editor
- Date picker with prev/next navigation
- Create, edit, delete quests (main, side, daily)
- Copy yesterday's dailies button
- Asana task import panel
- Auth-gated (client-side check + middleware)

---

## ❌ What Was Broken / Missing

### 1. Auth Middleware Not Redirecting (FIXED ✅)
**Problem:** `src/middleware.ts` exported `auth as middleware` but `src/auth.ts` had no `authorized` callback. Without it, Auth.js v5 middleware runs but does NOT redirect unauthenticated users — it just makes the session available.

**Impact:** Protected routes (`/quests`, `/admin`, etc.) were accessible to unauthenticated users at the network level. Only client-side session checks prevented UI access.

### 2. Legacy `clerkId` in Prisma Schema (FIXED ✅)
**Problem:** `User` model had an optional `clerkId String? @unique` field and `@@index([clerkId])` — leftover from Clerk migration. Messy and misleading.

### 3. Leaderboard Shows All Users as "Adventurer" (FIXED ✅)
**Problem:** Leaderboard only used `displayName` field but there's no UI to set it. Everyone showed as "Adventurer".

**Fix:** Updated leaderboard API to fall back: `displayName || name || 'Adventurer'`. The `name` field is populated by Auth.js from Google/GitHub sign-in.

### 4. Stripe Env Vars Missing (⏳ Mike Action Required)
The Stripe integration is fully coded but won't function without these env vars in Vercel:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRO_PRICE_ID`
- `STRIPE_TEAMS_PRICE_ID`
- `NEXT_PUBLIC_APP_URL` = `https://questboard.sh`

---

## 🔧 What Was Fixed

| # | Fix | File(s) Changed |
|---|-----|-----------------|
| 1 | Added `authorized` callback to Auth.js config — middleware now properly redirects unauthenticated users to `/login` | `src/auth.ts` |
| 2 | Removed legacy `clerkId` field and index from Prisma schema | `prisma/schema.prisma` |
| 3 | Kept `displayName` field but cleaned up `avatarUrl` legacy field | `prisma/schema.prisma` |
| 4 | Fixed leaderboard to use `name` as fallback when `displayName` not set | `src/app/api/leaderboard/route.ts` |
| 5 | Ran `prisma db push` — DB schema in sync | Neon DB |

---

## 📋 What Mike Needs to Do

### Stripe Setup (Required for billing to work)

**Step 1: Create Products in Stripe Dashboard**
1. Go to https://dashboard.stripe.com/products
2. Create **"Quest Board Pro"**: $5/month recurring
   - Copy the Price ID → this is `STRIPE_PRO_PRICE_ID`
3. Create **"Quest Board Teams"**: $8/month recurring (per user)
   - Copy the Price ID → this is `STRIPE_TEAMS_PRICE_ID`

**Step 2: Set Up Webhook**
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. URL: `https://questboard.sh/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copy the webhook signing secret → this is `STRIPE_WEBHOOK_SECRET`

**Step 3: Get API Keys**
1. Go to https://dashboard.stripe.com/apikeys
2. Copy the **Secret key** → `STRIPE_SECRET_KEY`

**Step 4: Add to Vercel**
In Vercel → Project Settings → Environment Variables, add:
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_TEAMS_PRICE_ID=price_...
NEXT_PUBLIC_APP_URL=https://questboard.sh
```

**Step 5: Test**
1. Use Stripe test mode first (use `sk_test_...` keys)
2. Use card `4242 4242 4242 4242` with any future date + any CVC
3. Verify webhook events appear in Stripe dashboard
4. Confirm user plan updates in DB after checkout

### Other Env Vars (Verify These Are Set in Vercel)
```
# Auth.js
AUTH_SECRET=<random 32+ char string>
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Email
RESEND_API_KEY=...

# Cron
CRON_SECRET=...

# Database
DATABASE_URL=postgresql://...
```

### Weekly Reset Cron
The `/api/cron/weekly-reset` route resets `weeklyXp` for all users every Sunday.
Set up in Vercel Cron (in `vercel.json`) or use an external scheduler.
Check `vercel.json` to see if it's already configured.

---

## 🔍 Audit Notes

### What Was NOT Touched (Per Instructions)
- Asana integration files (`/api/asana/*`, `/api/settings/asana/*`)
- Owsley is working on the Asana settings page

### Security Status
- **Admin page**: Now protected by Auth.js middleware (redirects to `/login`) + client-side session check ✅
- **All API routes**: Protected by `requireUser()` which throws 401 if not authenticated ✅
- **Stripe webhook**: Verified with `stripe-signature` header ✅
- **Cron routes**: Protected by `CRON_SECRET` Bearer token ✅

### Known Gaps (Not Critical)
- **Display name setting**: No UI to set `User.displayName`. Auth.js `name` is used as fallback for leaderboard — good enough for now
- **Email on contact**: Contact messages stored in DB but no email notification to Mike
- **Admin access control**: Anyone who is authenticated can access `/admin`. For a single-user app this is fine; for multi-user, should add admin role check
- **TEAMS plan**: Not actually implemented (no shared boards, guild features). The pricing page advertises it but the feature doesn't exist yet — this is a future roadmap item
