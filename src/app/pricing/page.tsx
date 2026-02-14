'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import Link from 'next/link'

const tiers = [
  {
    plan: 'FREE',
    name: '🗡️ Adventurer',
    price: 0,
    description: 'Begin your quest',
    difficulty: 'Easy Mode',
    features: [
      'Solo quest board',
      '1 integration (Asana)',
      'Basic themes',
      'Daily streaks',
      'XP & leveling system',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    plan: 'PRO',
    name: '⚔️ Champion',
    price: 5,
    description: 'Unlock your full power',
    difficulty: 'Normal Mode',
    features: [
      'Everything in Adventurer',
      'Unlimited integrations',
      'Custom themes & sounds',
      'Advanced stats & insights',
      'Streak freeze (1/week)',
      'Priority support',
    ],
    cta: 'Level Up',
    highlighted: true,
  },
  {
    plan: 'TEAMS',
    name: '🏰 Guild Master',
    price: 8,
    description: 'Lead your party',
    difficulty: 'Legendary',
    features: [
      'Everything in Champion',
      'Shared quest boards',
      'Team analytics dashboard',
      'Guild challenges',
      'Admin controls',
      'Per-user pricing',
    ],
    cta: 'Form Guild',
    highlighted: false,
  },
]

export default function PricingPage() {
  const { isSignedIn } = useUser()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleUpgrade(plan: string) {
    if (!isSignedIn) {
      window.location.href = '/sign-up'
      return
    }
    if (plan === 'FREE') return

    setLoading(plan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center mb-16">
          <motion.h1
            className="text-5xl font-extrabold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Choose Your Difficulty
          </motion.h1>
          <p className="text-xl text-gray-400">
            Every hero starts somewhere. Pick the tier that matches your ambition.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.plan}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                tier.highlighted
                  ? 'border-yellow-500/50 bg-gray-900/80 shadow-lg shadow-yellow-500/10'
                  : 'border-gray-700/50 bg-gray-900/50'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                  {tier.difficulty}
                </p>
                <h2 className="text-2xl font-bold mb-1">{tier.name}</h2>
                <p className="text-sm text-gray-400">{tier.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-extrabold">
                  ${tier.price}
                </span>
                {tier.price > 0 && (
                  <span className="text-gray-400 ml-1">/mo{tier.plan === 'TEAMS' ? '/user' : ''}</span>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-green-400 mt-0.5">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(tier.plan)}
                disabled={loading === tier.plan}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-sm transition-all ${
                  tier.highlighted
                    ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                    : tier.plan === 'FREE'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                } disabled:opacity-50`}
              >
                {loading === tier.plan ? 'Loading...' : tier.plan === 'FREE' && isSignedIn ? 'Current Plan' : tier.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href={isSignedIn ? '/quests' : '/'} className="text-gray-500 hover:text-gray-300 text-sm">
            ← Back to {isSignedIn ? 'Quest Board' : 'Home'}
          </Link>
        </div>
      </div>
    </div>
  )
}
