import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-01-27.acacia' as any,
      typescript: true,
    })
  }
  return _stripe
}

// Legacy export — lazy initialized for build compatibility
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as any)[prop]
  },
})

// Price IDs — set these in env after creating products in Stripe Dashboard
export const PRICE_IDS = {
  PRO: process.env.STRIPE_PRO_PRICE_ID!,
  TEAMS: process.env.STRIPE_TEAMS_PRICE_ID!,
} as const

export type PlanType = 'FREE' | 'PRO' | 'TEAMS'

export const PLAN_DETAILS: Record<PlanType, {
  name: string
  price: number
  features: string[]
}> = {
  FREE: {
    name: 'Adventurer',
    price: 0,
    features: [
      'Solo quest board',
      '1 integration (Asana)',
      'Basic themes',
      'Daily streaks',
      'XP & leveling',
    ],
  },
  PRO: {
    name: 'Champion',
    price: 5,
    features: [
      'Everything in Adventurer',
      'Unlimited integrations',
      'Custom themes & sounds',
      'Advanced stats & insights',
      'Streak freeze (1/week)',
      'Priority support',
    ],
  },
  TEAMS: {
    name: 'Guild Master',
    price: 8,
    features: [
      'Everything in Champion',
      'Shared quest boards',
      'Team analytics',
      'Guild challenges',
      'Admin controls',
      'Per-user pricing',
    ],
  },
}
