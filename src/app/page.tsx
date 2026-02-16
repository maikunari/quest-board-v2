'use client'

import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import FloatingParticles from '@/components/FloatingParticles'

const features = [
  {
    icon: '⚔️',
    title: 'Quest System',
    description: 'Transform every task into a quest. Main quests, side quests, dailies — just like your favorite RPG.',
    rarity: 'Common',
  },
  {
    icon: '📈',
    title: 'XP & Levels',
    description: 'Earn experience with every completed quest. Level up and watch your character grow stronger.',
    rarity: 'Uncommon',
  },
  {
    icon: '🔥',
    title: 'Streaks',
    description: 'Build daily streaks for XP multipliers. 7 days = 2x, 30 days = 3x. Don\'t break the chain.',
    rarity: 'Rare',
  },
  {
    icon: '🔗',
    title: 'Asana Integration',
    description: 'Pull tasks from Asana automatically. Your project management tool meets gamification.',
    rarity: 'Rare',
  },
  {
    icon: '🎨',
    title: 'Custom Themes',
    description: 'Dark mode, light mode, and custom color themes. Make your quest board truly yours.',
    rarity: 'Epic',
  },
  {
    icon: '🏰',
    title: 'Guild Mode',
    description: 'Create teams. Share quest boards. Compete on leaderboards. Conquer tasks together.',
    rarity: 'Legendary',
  },
]

const rarityColors: Record<string, string> = {
  Common: 'text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600',
  Uncommon: 'text-green-600 dark:text-green-400 border-green-300 dark:border-green-600',
  Rare: 'text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-600',
  Epic: 'text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-600',
  Legendary: 'text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-600',
}

const stats = [
  { label: 'Quests Completed', value: '12,847' },
  { label: 'Active Adventurers', value: '342' },
  { label: 'Levels Gained', value: '1,205' },
]

const pricingTiers = [
  {
    plan: 'FREE',
    name: '🗡️ Adventurer',
    price: 0,
    difficulty: 'Easy',
    features: ['Solo quest board', '1 integration', 'Basic themes', 'Streaks & XP'],
    cta: 'Start Free',
  },
  {
    plan: 'PRO',
    name: '⚔️ Champion',
    price: 5,
    difficulty: 'Normal',
    features: ['Unlimited integrations', 'Custom themes', 'Advanced stats', 'Streak freeze'],
    cta: 'Level Up',
    highlighted: true,
  },
  {
    plan: 'TEAMS',
    name: '🏰 Guild Master',
    price: 8,
    difficulty: 'Legendary',
    features: ['Shared boards', 'Team analytics', 'Guild challenges', 'Admin controls'],
    cta: 'Form Guild',
    perUser: true,
  },
]

export default function LandingPage() {
  const { isSignedIn } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-quest-dark dark:to-gray-950 text-slate-800 dark:text-white overflow-hidden relative">
      <FloatingParticles />
      {/* Hero */}
      <section className="relative px-4 pt-20 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-quest-gold/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="font-pixel text-4xl sm:text-5xl md:text-6xl text-amber-600 dark:text-quest-gold mb-6 leading-tight"
              style={{ textShadow: '0 0 40px rgba(246, 201, 14, 0.4)' }}
            >
              Your Tasks Are Boring
            </h1>
            <p
              className="font-pixel text-lg sm:text-xl md:text-2xl text-amber-600/80 dark:text-quest-gold/80 mb-4"
              style={{ textShadow: '0 0 20px rgba(246, 201, 14, 0.2)' }}
            >
              Make Them Legendary
            </p>
          </motion.div>

          <motion.p
            className="text-lg md:text-xl text-slate-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Turn your to-do list into an RPG. Earn XP, level up, build streaks,
            and conquer your tasks like a hero. Integrates with the tools you already use.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {isSignedIn ? (
              <Link
                href="/quests"
                className="px-8 py-4 bg-quest-gold text-black font-pixel text-sm rounded-lg hover:bg-amber-300 transition-all hover:scale-105"
              >
                Enter Quest Board →
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  className="px-8 py-4 bg-quest-gold text-black font-pixel text-sm rounded-lg hover:bg-amber-300 transition-all hover:scale-105"
                >
                  Begin Your Adventure
                </Link>
                <Link
                  href="/sign-in"
                  className="px-8 py-4 border border-amber-400/50 dark:border-quest-gold/50 text-amber-600 dark:text-quest-gold font-pixel text-sm rounded-lg hover:bg-amber-50 dark:hover:bg-quest-gold/10 transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-slate-200 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-900/50 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-8 flex justify-center gap-12 md:gap-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-2xl md:text-3xl font-bold text-amber-600 dark:text-quest-gold">{stat.value}</div>
              <div className="text-xs text-slate-400 dark:text-gray-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features — RPG Item Cards */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-pixel text-2xl text-center text-amber-600 dark:text-quest-gold mb-4"
              style={{ textShadow: '0 0 20px rgba(246, 201, 14, 0.3)' }}>
            Abilities & Loot
          </h2>
          <p className="text-center text-slate-400 dark:text-gray-500 mb-16">Everything you need to turn productivity into an adventure</p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className={`relative rounded-xl border bg-white/60 dark:bg-gray-900/60 p-6 transition-all hover:-translate-y-1 hover:shadow-lg ${rarityColors[feature.rarity]}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{feature.icon}</span>
                  <span className={`text-[10px] uppercase tracking-wider ${rarityColors[feature.rarity]}`}>
                    {feature.rarity}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-800 dark:text-white">{feature.title}</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-24 bg-slate-50/50 dark:bg-gray-900/30">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-pixel text-2xl text-center text-amber-600 dark:text-quest-gold mb-16"
              style={{ textShadow: '0 0 20px rgba(246, 201, 14, 0.3)' }}>
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: '1', title: 'Add Quests', desc: 'Create tasks or import from Asana. Each becomes a quest with XP rewards.' },
              { step: '2', title: 'Complete & Level Up', desc: 'Check off quests to earn XP. Build streaks for multipliers. Watch your level grow.' },
              { step: '3', title: 'Track Progress', desc: 'Stats, history, and achievements. See how productive you really are.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-quest-gold/10 border border-amber-200 dark:border-quest-gold/30 flex items-center justify-center mx-auto mb-4">
                  <span className="font-pixel text-amber-600 dark:text-quest-gold text-sm">{item.step}</span>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-pixel text-2xl text-center text-amber-600 dark:text-quest-gold mb-4"
              style={{ textShadow: '0 0 20px rgba(246, 201, 14, 0.3)' }}>
            Choose Your Difficulty
          </h2>
          <p className="text-center text-slate-400 dark:text-gray-500 mb-16">Start free. Upgrade when you're ready for more power.</p>

          <div className="grid gap-6 md:grid-cols-3">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.plan}
                className={`relative rounded-xl border p-6 flex flex-col ${
                  tier.highlighted
                    ? 'border-amber-400/50 dark:border-quest-gold/50 bg-amber-50/50 dark:bg-gray-900/80 shadow-lg shadow-amber-500/5 dark:shadow-quest-gold/5'
                    : 'border-slate-200 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-quest-gold text-black text-[10px] font-bold px-3 py-1 rounded-full font-pixel">
                      POPULAR
                    </span>
                  </div>
                )}
                <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-gray-500 mb-1">{tier.difficulty}</p>
                <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">${tier.price}</span>
                  {tier.price > 0 && <span className="text-slate-400 dark:text-gray-500">/mo{tier.perUser ? '/user' : ''}</span>}
                </div>
                <ul className="space-y-2 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-300">
                      <span className="text-green-500 dark:text-green-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={isSignedIn ? (tier.plan === 'FREE' ? '/quests' : '/pricing') : '/sign-up'}
                  className={`block text-center py-3 rounded-lg font-semibold text-sm transition-all ${
                    tier.highlighted
                      ? 'bg-quest-gold text-black hover:bg-amber-300'
                      : 'bg-slate-200 dark:bg-gray-700 text-slate-700 dark:text-white hover:bg-slate-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-pixel text-3xl text-amber-600 dark:text-quest-gold mb-6"
              style={{ textShadow: '0 0 30px rgba(246, 201, 14, 0.4)' }}>
            Ready to Begin?
          </h2>
          <p className="text-slate-500 dark:text-gray-400 mb-8 max-w-lg mx-auto">
            Free forever. No credit card required. Start turning your tasks into quests today.
          </p>
          <Link
            href={isSignedIn ? '/quests' : '/sign-up'}
            className="inline-block px-10 py-4 bg-quest-gold text-black font-pixel text-sm rounded-lg hover:bg-amber-300 transition-all hover:scale-105"
          >
            {isSignedIn ? 'Enter Quest Board →' : 'Begin Your Adventure'}
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-gray-800 px-4 py-8 text-center text-xs text-slate-400 dark:text-gray-600">
        <p>Quest Board — Turn your boring tasks into epic quests.</p>
        <div className="flex justify-center gap-6 mt-3">
          <Link href="/pricing" className="hover:text-slate-600 dark:hover:text-gray-400">Pricing</Link>
          <Link href="/docs" className="hover:text-slate-600 dark:hover:text-gray-400">Docs</Link>
          <Link href="/contact" className="hover:text-slate-600 dark:hover:text-gray-400">Contact</Link>
        </div>
      </footer>
    </div>
  )
}
