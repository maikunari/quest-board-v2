'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import FloatingParticles from '@/components/FloatingParticles'

// ─── Rank progression data ────────────────────────────────────────────────────
const ranks = [
  { emoji: '🌱', name: 'Seedling',   xp: '0',      color: 'text-green-500 dark:text-green-400',  border: 'border-green-500/40' },
  { emoji: '🗡️', name: 'Adventurer', xp: '500',    color: 'text-blue-500 dark:text-blue-400',   border: 'border-blue-500/40' },
  { emoji: '⚔️',  name: 'Warrior',   xp: '1,500',  color: 'text-violet-600 dark:text-violet-400', border: 'border-violet-500/40' },
  { emoji: '🧝',  name: 'Ranger',    xp: '3,000',  color: 'text-amber-500 dark:text-amber-400',  border: 'border-amber-500/40' },
  { emoji: '🏆',  name: 'Champion',  xp: '6,000',  color: 'text-yellow-500 dark:text-yellow-300', border: 'border-yellow-400/60' },
]

// ─── Animation helpers ────────────────────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { status } = useSession()

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f7f3ef] dark:bg-[#0a0612] text-slate-800 dark:text-white">
      <FloatingParticles />

      {/* ── Scanline overlay — dark mode only ────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0 scanlines opacity-0 dark:opacity-[0.03]" aria-hidden />

      {/* ════════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pb-16 pt-20 text-center">
        {/* Radial backdrop — dark mode deep violet, light mode soft violet */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_60%,rgba(109,40,217,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_60%,rgba(109,40,217,0.18)_0%,transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_50%_30%,rgba(139,92,246,0.06)_0%,transparent_60%)] dark:bg-[radial-gradient(ellipse_40%_40%_at_50%_30%,rgba(139,92,246,0.12)_0%,transparent_60%)]" />
        </div>

        {/* Sage — floats and glows */}
        <motion.div
          className="relative z-10 mb-6"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative inline-block"
          >
            {/* Glow ring behind sage */}
            <div className="sage-aura absolute inset-0 rounded-full" />
            <Image
              src="/mascot/sage-default.png"
              alt="The Hooded Sage"
              width={220}
              height={220}
              priority
              className="sage-eyes relative z-10 drop-shadow-[0_0_32px_rgba(139,92,246,0.7)] sm:w-[260px] md:w-[300px]"
              style={{ width: 'auto', height: 'auto', maxWidth: '300px' }}
            />
          </motion.div>
        </motion.div>

        {/* Speech bubble */}
        <motion.div
          className="relative z-10 mb-8 max-w-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="speech-bubble mx-auto inline-block rounded-2xl border border-violet-400/40 dark:border-violet-500/30 bg-violet-100/80 dark:bg-violet-950/60 px-6 py-4 backdrop-blur-sm">
            {/* Arrow pointing up */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-violet-400/40 dark:border-b-violet-500/30" />
            <p className="font-pixel text-[11px] leading-loose text-violet-700 dark:text-violet-200 sm:text-[13px]">
              &ldquo;Every great adventure begins<br className="hidden sm:block" /> with a single quest...&rdquo;
            </p>
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          className="relative z-10 mb-3 font-pixel text-3xl leading-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl"
          style={{ textShadow: '0 0 40px rgba(139,92,246,0.4)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Quest Board
        </motion.h1>

        <motion.p
          className="relative z-10 mb-2 font-pixel text-xs text-violet-600 dark:text-violet-400 sm:text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          Turn your boring tasks into epic adventures
        </motion.p>

        <motion.p
          className="relative z-10 mb-10 max-w-lg text-base leading-relaxed text-slate-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          Earn XP, build streaks, rise through the ranks. The gamified productivity
          tool built for people who actually want to get things done.
        </motion.p>

        {/* CTA — skeuomorphic (toggle to btn-flat / btn-flat-outline to revert) */}
        <motion.div
          className="relative z-10 flex flex-col items-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          {status === 'authenticated' ? (
            <Link
              href="/quests"
              className="btn-skeuomorphic rounded-xl px-10 py-4 font-pixel text-[11px] text-white"
            >
              Enter Quest Board →
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="btn-skeuomorphic rounded-xl px-10 py-4 font-pixel text-[11px] text-white"
              >
                Begin Your Quest ✦
              </Link>
              <Link
                href="/login"
                className="btn-skeuomorphic-outline rounded-xl px-8 py-4 font-pixel text-[11px] text-violet-700 dark:text-violet-300"
              >
                Sign In
              </Link>
            </>
          )}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-1 text-violet-500/60 dark:text-violet-500/50">
            <span className="font-pixel text-[8px]">scroll</span>
            <span className="text-lg">↓</span>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          STATS BAR
      ════════════════════════════════════════════════════════════════════ */}
      <motion.section
        className="border-y border-violet-200 dark:border-violet-900/40 bg-violet-50/80 dark:bg-[#0d0920]/80 backdrop-blur"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="mx-auto flex max-w-4xl justify-center gap-10 px-4 py-8 md:gap-20">
          {[
            { value: '12,847', label: 'Quests Completed' },
            { value: '342',    label: 'Active Adventurers' },
            { value: '1,205',  label: 'Levels Gained' },
          ].map((s) => (
            <motion.div key={s.label} className="text-center" variants={fadeInUp}>
              <div className="font-pixel text-xl text-violet-600 dark:text-violet-300 md:text-2xl" style={{ textShadow: '0 0 16px rgba(139,92,246,0.4)' }}>
                {s.value}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-gray-500">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 1 — Track Your Daily Quests
      ════════════════════════════════════════════════════════════════════ */}
      <SageSection
        image="/mascot/sage-default.png"
        imageAlt="Sage — daily quests"
        imageLeft
        title="Track Your Daily Quests"
        quote="&ldquo;Even the mightiest hero needs a quest log. Write it. Do it. Conquer it.&rdquo;"
      >
        <p className="mb-6 text-slate-600 dark:text-gray-400 leading-relaxed">
          Transform every task into a quest. Main quests, side quests, and daily
          challenges — structured just like your favourite RPG. Complete them to earn
          XP and unlock your next level.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '⚔️', label: 'Main Quest', desc: 'High‑impact objectives' },
            { icon: '📜', label: 'Side Quest', desc: 'Useful extras' },
            { icon: '🔁', label: 'Daily Quest', desc: 'Repeatable habits' },
            { icon: '⭐', label: 'XP Rewards', desc: 'Visible progress' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-violet-200 dark:border-violet-900/40 bg-white dark:bg-[#110d24] p-4 shadow-sm dark:shadow-none">
              <span className="text-2xl">{item.icon}</span>
              <div className="mt-2 font-semibold text-sm text-slate-800 dark:text-white">{item.label}</div>
              <div className="text-xs text-slate-500 dark:text-gray-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </SageSection>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 2 — Build Unbreakable Streaks
      ════════════════════════════════════════════════════════════════════ */}
      <SageSection
        image="/mascot/sage-triumph.png"
        imageAlt="Sage — triumphant"
        title="Build Unbreakable Streaks"
        quote="&ldquo;Seven days of fire forges a warrior. Thirty days forges a legend.&rdquo;"
        accent="amber"
      >
        <p className="mb-6 text-slate-600 dark:text-gray-400 leading-relaxed">
          Daily streaks multiply your XP. Miss a day and the chain breaks. The longer
          your streak, the greater the multiplier — and the greater the glory.
        </p>
        <div className="space-y-3">
          {[
            { days: '3',  mult: '1.5×', label: 'Ember',    color: 'text-orange-500 dark:text-orange-400', bar: 'bg-orange-500' },
            { days: '7',  mult: '2×',   label: 'Inferno',  color: 'text-red-500 dark:text-red-400',    bar: 'bg-red-500' },
            { days: '30', mult: '3×',   label: 'Eternal',  color: 'text-violet-600 dark:text-violet-300', bar: 'bg-violet-500' },
          ].map((tier) => (
            <div key={tier.days} className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#110d24] px-4 py-3 shadow-sm dark:shadow-none">
              <span className="font-pixel text-xs text-slate-500 dark:text-gray-400 w-10">{tier.days}d</span>
              <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-white/5">
                <div className={`h-full rounded-full ${tier.bar}`} style={{ width: `${(parseInt(tier.days)/30)*100}%` }} />
              </div>
              <span className={`font-pixel text-xs ${tier.color}`}>{tier.mult}</span>
              <span className="text-xs text-slate-500 dark:text-gray-500 w-14">{tier.label}</span>
            </div>
          ))}
        </div>
      </SageSection>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 3 — Rise Through the Ranks
      ════════════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-24 border-t border-slate-200 dark:border-white/[0.03]">
        <div className="mx-auto max-w-4xl">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <p className="mb-3 font-pixel text-[10px] text-violet-600 dark:text-violet-400 uppercase tracking-widest">Chapter III</p>
            <h2 className="font-pixel text-2xl text-slate-900 dark:text-white mb-4" style={{ textShadow: '0 0 20px rgba(139,92,246,0.3)' }}>
              Rise Through the Ranks
            </h2>
            <p className="text-slate-600 dark:text-gray-400 italic text-sm max-w-lg mx-auto">
              &ldquo;The path from seedling to champion is paved with completed quests and unbroken will.&rdquo;
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {ranks.map((rank, i) => (
              <motion.div
                key={rank.name}
                variants={fadeInUp}
                className={`flex flex-col items-center gap-2 rounded-2xl border ${rank.border} bg-white dark:bg-[#0d0920] px-5 py-6 w-36 shadow-sm dark:shadow-none`}
              >
                <span className="text-4xl">{rank.emoji}</span>
                <span className={`font-pixel text-[10px] ${rank.color}`}>{rank.name}</span>
                <span className="font-mono text-xs text-slate-500 dark:text-gray-500">{rank.xp} XP</span>
                {i === ranks.length - 1 && (
                  <span className="mt-1 rounded-full bg-yellow-400/10 px-2 py-0.5 text-[9px] font-pixel text-yellow-600 dark:text-yellow-300 border border-yellow-400/30">
                    LEGENDARY
                  </span>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Arrow connector */}
          <div className="mt-6 text-center text-2xl text-violet-400 dark:text-violet-700 select-none tracking-[12px]">
            → → → → →
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 4 — Connect Your Tools
      ════════════════════════════════════════════════════════════════════ */}
      <SageSection
        image="/mascot/sage-default.png"
        imageAlt="Sage — integrations"
        imageLeft
        title="Connect Your Tools"
        quote="&ldquo;A wise adventurer uses every tool at their disposal. Your quests await, wherever they live.&rdquo;"
      >
        <p className="mb-6 text-slate-600 dark:text-gray-400 leading-relaxed">
          Connect the tools you already use and watch your tasks become quests
          automatically. No manual entry. No friction. Just progress.
        </p>
        <div className="space-y-3">
          {[
            { name: 'Asana',    icon: '🗂️', status: 'Connected', live: true  },
            { name: 'Jira',     icon: '🐛', status: 'Coming Soon', live: false },
            { name: 'Notion',   icon: '📓', status: 'Coming Soon', live: false },
            { name: 'Linear',   icon: '📐', status: 'Coming Soon', live: false },
          ].map((tool) => (
            <div key={tool.name} className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#110d24] px-4 py-3 shadow-sm dark:shadow-none">
              <span className="text-2xl">{tool.icon}</span>
              <span className="flex-1 font-medium text-sm text-slate-800 dark:text-white">{tool.name}</span>
              <span className={`rounded-full px-3 py-1 text-[10px] font-pixel ${
                tool.live
                  ? 'bg-green-50 text-green-600 border border-green-500/30 dark:bg-green-500/10 dark:text-green-400'
                  : 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-white/5 dark:text-gray-500 dark:border-white/10'
              }`}>
                {tool.status}
              </span>
            </div>
          ))}
        </div>
      </SageSection>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 5 — Join the Guild
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative px-4 py-32 text-center overflow-hidden border-t border-slate-200 dark:border-white/[0.03]">
        {/* Light: soft parchment gradient; Dark: violet glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(139,92,246,0.06)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(109,40,217,0.2)_0%,transparent_70%)]" />
        </div>

        <motion.div
          className="relative z-10 mx-auto max-w-2xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInUp}
        >
          {/* Sage triumphant */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-8 inline-block"
          >
            <Image
              src="/mascot/sage-triumph.png"
              alt="Triumphant Sage"
              width={160}
              height={160}
              className="sage-eyes mx-auto drop-shadow-[0_0_40px_rgba(139,92,246,0.8)]"
              style={{ width: 'auto', height: 'auto', maxWidth: '160px' }}
            />
          </motion.div>

          <p className="mb-2 font-pixel text-[10px] uppercase tracking-widest text-violet-600 dark:text-violet-400">
            The Guild Awaits
          </p>
          <h2 className="mb-4 font-pixel text-2xl text-slate-900 dark:text-white md:text-3xl" style={{ textShadow: '0 0 30px rgba(139,92,246,0.4)' }}>
            Join the Guild
          </h2>
          <p className="mb-4 text-sm italic text-violet-600 dark:text-violet-200">
            &ldquo;No hero conquers alone. Join a guild, share your board, rise together.&rdquo;
          </p>
          <p className="mb-10 text-slate-600 dark:text-gray-400 leading-relaxed">
            Free forever for solo adventurers. Upgrade to unlock unlimited integrations,
            streak freezes, and guild mode for teams.
          </p>

          {/* Section CTAs — skeuomorphic (swap to btn-flat / btn-flat-outline to revert) */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href={status === 'authenticated' ? '/quests' : '/login'}
              className="btn-skeuomorphic rounded-xl px-10 py-4 font-pixel text-[11px] text-white"
            >
              {status === 'authenticated' ? 'Enter Quest Board →' : 'Begin Your Quest ✦'}
            </Link>
            <Link
              href="/pricing"
              className="btn-skeuomorphic-outline rounded-xl px-8 py-4 font-pixel text-[11px] text-violet-700 dark:text-violet-300"
            >
              View Pricing
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-400 dark:text-gray-600">Free forever · No credit card required · 342 adventurers active</p>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-violet-200 dark:border-violet-900/30 px-4 py-10 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 font-pixel text-[10px] text-violet-500 dark:text-violet-500">⚔️ QUEST BOARD ⚔️</div>
          <p className="mb-6 text-xs text-slate-500 dark:text-gray-600 italic">Built by adventurers, for adventurers.</p>
          <div className="flex justify-center gap-8 text-xs text-slate-500 dark:text-gray-600">
            <Link href="/pricing" className="hover:text-slate-700 dark:hover:text-gray-400 transition-colors">Pricing</Link>
            <Link href="/docs"    className="hover:text-slate-700 dark:hover:text-gray-400 transition-colors">Docs</Link>
            <Link href="/contact" className="hover:text-slate-700 dark:hover:text-gray-400 transition-colors">Contact</Link>
            <Link href="/login"   className="hover:text-slate-700 dark:hover:text-gray-400 transition-colors">Login</Link>
          </div>
          <p className="mt-8 text-[10px] text-slate-400 dark:text-gray-700">© 2025 Quest Board. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

// ─── Reusable sage narrator section ──────────────────────────────────────────
interface SageSectionProps {
  image: string
  imageAlt: string
  imageLeft?: boolean
  title: string
  quote: string
  accent?: 'violet' | 'amber'
  children: React.ReactNode
}

function SageSection({ image, imageAlt, imageLeft, title, quote, accent = 'violet', children }: SageSectionProps) {
  const accentColor = accent === 'amber'
    ? 'text-amber-500 dark:text-amber-400'
    : 'text-violet-600 dark:text-violet-400'

  const chapterIndex = { 'Track Your Daily Quests': 'I', 'Build Unbreakable Streaks': 'II', 'Connect Your Tools': 'IV' }

  return (
    <section className="px-4 py-24 border-t border-slate-200 dark:border-white/[0.03]">
      <motion.div
        className={`mx-auto max-w-5xl flex flex-col gap-12 ${imageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={staggerContainer}
      >
        {/* Sage image */}
        <motion.div className="flex-shrink-0 text-center" variants={fadeInUp}>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block"
          >
            <Image
              src={image}
              alt={imageAlt}
              width={180}
              height={180}
              className={`sage-eyes drop-shadow-[0_0_28px_rgba(139,92,246,0.6)] ${accent === 'amber' ? 'drop-shadow-[0_0_28px_rgba(251,191,36,0.5)]' : ''}`}
              style={{ width: 'auto', height: 'auto', maxWidth: '180px' }}
            />
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.div className="flex-1" variants={fadeInUp}>
          <p className={`mb-2 font-pixel text-[10px] uppercase tracking-widest ${accentColor}`}>
            Chapter {(chapterIndex as Record<string, string>)[title] ?? '?'}
          </p>
          <h2 className="mb-4 font-pixel text-xl text-slate-900 dark:text-white md:text-2xl" style={{ textShadow: '0 0 20px rgba(139,92,246,0.3)' }}>
            {title}
          </h2>
          <p className={`mb-6 text-sm italic ${accentColor} opacity-80`} dangerouslySetInnerHTML={{ __html: quote }} />
          {children}
        </motion.div>
      </motion.div>
    </section>
  )
}
