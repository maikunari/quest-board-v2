'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const tiers = [
  {
    plan: 'PRO',
    name: '⚔️ Champion',
    price: 5,
    description: 'Unlock your full power',
    difficulty: 'Normal Mode',
    trial: true,
    features: [
      'Solo quest board',
      'Unlimited integrations',
      'Custom themes & sounds',
      'Advanced stats & insights',
      'Streak freeze (1/week)',
      'XP & leveling system',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    plan: 'TEAMS',
    name: '🏰 Guild Master',
    price: 8,
    description: 'Lead your party',
    difficulty: 'Legendary',
    trial: true,
    features: [
      'Everything in Champion',
      'Shared quest boards',
      'Team analytics dashboard',
      'Guild challenges',
      'Admin controls',
      'Per-user pricing',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export default function PricingPage() {
  const { status } = useSession()
  const [loading, setLoading] = useState<string | null>(null)
  const isSignedIn = status === 'authenticated'

  async function handleUpgrade(plan: string) {
    if (!isSignedIn) {
      window.location.href = '/login'
      return
    }

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
    <div className="min-h-screen bg-[#f7f3ef] dark:bg-[#0a0612] text-slate-800 dark:text-white">
      <div className="mx-auto max-w-5xl px-4 py-20">

        {/* Header */}
        <motion.div
          className="text-center mb-4"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p variants={fadeInUp} className="mb-3 font-pixel text-[10px] text-violet-600 dark:text-violet-400 uppercase tracking-widest">
            Pricing
          </motion.p>
          <motion.h1
            variants={fadeInUp}
            className="font-pixel text-3xl md:text-4xl text-slate-900 dark:text-white mb-4"
            style={{ textShadow: '0 0 30px rgba(139,92,246,0.3)' }}
          >
            Choose Your Difficulty
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-base text-slate-500 dark:text-gray-400 max-w-lg mx-auto">
            7 days free on every plan — no restrictions, no watered-down version.
            Try the whole thing, then decide.
          </motion.p>
        </motion.div>

        {/* Trial callout banner */}
        <motion.div
          className="mx-auto max-w-xl mb-12 rounded-2xl border border-violet-300/50 dark:border-violet-700/40 bg-violet-50/80 dark:bg-violet-950/40 px-6 py-4 text-center backdrop-blur-sm"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="font-pixel text-[10px] text-violet-700 dark:text-violet-300 leading-relaxed">
            ✦ No free tier. No limited demo. Just 7 real days to decide. ✦
          </p>
          <p className="mt-1 text-xs text-violet-600/70 dark:text-violet-400/70">
            No credit card required to start.
          </p>
        </motion.div>

        {/* Tier cards */}
        <motion.div
          className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.plan}
              variants={fadeInUp}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                tier.highlighted
                  ? 'border-violet-400/50 dark:border-violet-500/50 bg-white dark:bg-[#0d0920] shadow-lg shadow-violet-500/10'
                  : 'border-slate-200 dark:border-white/[0.06] bg-white/60 dark:bg-[#0d0920]/60'
              }`}
            >
              {/* Trial badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-violet-600 text-white text-[9px] font-pixel px-3 py-1 rounded-full shadow-md">
                  7-DAY FREE TRIAL
                </span>
              </div>

              {tier.highlighted && (
                <div className="absolute -top-3 right-6">
                  <span className="bg-amber-400 text-black text-[9px] font-pixel px-3 py-1 rounded-full">
                    POPULAR
                  </span>
                </div>
              )}

              <div className="mb-6 mt-2">
                <p className="text-xs uppercase tracking-wider text-slate-400 dark:text-gray-500 mb-2">
                  {tier.difficulty}
                </p>
                <h2 className="font-pixel text-lg text-slate-900 dark:text-white mb-1">{tier.name}</h2>
                <p className="text-sm text-slate-500 dark:text-gray-400">{tier.description}</p>
              </div>

              <div className="mb-2">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-white">
                  ${tier.price}
                </span>
                <span className="text-slate-400 dark:text-gray-400 ml-1 text-sm">
                  /mo{tier.plan === 'TEAMS' ? '/user' : ''}
                </span>
              </div>
              <p className="mb-8 text-xs text-slate-400 dark:text-gray-500">
                after 7-day free trial
              </p>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-600 dark:text-gray-300">
                    <span className="text-violet-500 dark:text-violet-400 mt-0.5 flex-shrink-0">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(tier.plan)}
                disabled={loading === tier.plan}
                className={`w-full py-3 px-6 rounded-xl font-pixel text-[11px] transition-all disabled:opacity-50 ${
                  tier.highlighted
                    ? 'bg-violet-600 text-white hover:bg-violet-500 shadow-md shadow-violet-500/20'
                    : 'bg-slate-800 dark:bg-white/10 text-white hover:bg-slate-700 dark:hover:bg-white/20'
                }`}
              >
                {loading === tier.plan ? 'Loading...' : tier.cta}
              </button>

              <p className="mt-3 text-center text-[10px] text-slate-400 dark:text-gray-600">
                No credit card required
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ / reassurance */}
        <motion.div
          className="mt-16 mx-auto max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-pixel text-[11px] text-center text-slate-500 dark:text-gray-500 uppercase tracking-widest mb-8">
            How the trial works
          </h3>
          <div className="grid gap-4 sm:grid-cols-3 text-center">
            {[
              { step: '01', title: 'Sign up', desc: 'No credit card. Pick a plan. Start your 7-day trial immediately.' },
              { step: '02', title: 'Try everything', desc: 'Full access — all features, all integrations, no limits during the trial.' },
              { step: '03', title: 'Decide', desc: "If it clicks, you'll know. Pick a plan and keep going. If not, no charge." },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white/50 dark:bg-[#0d0920]/50 p-5">
                <div className="font-pixel text-[10px] text-violet-500 dark:text-violet-400 mb-2">{item.step}</div>
                <div className="font-semibold text-sm text-slate-800 dark:text-white mb-1">{item.title}</div>
                <p className="text-xs text-slate-500 dark:text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="text-center mt-12">
          <Link href={isSignedIn ? '/quests' : '/'} className="text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 text-sm">
            ← Back to {isSignedIn ? 'Quest Board' : 'Home'}
          </Link>
        </div>
      </div>
    </div>
  )
}
