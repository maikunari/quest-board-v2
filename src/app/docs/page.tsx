'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const sections = [
  {
    title: 'Getting Started',
    content: [
      {
        heading: 'Start with 3 Side Quests',
        text: "Don't try to plan your entire life on day one. Seriously. Start with just 3 side quests — small, achievable tasks you can knock out today. The goal isn't to be perfect. It's to feel that dopamine hit of checking something off.",
      },
      {
        heading: 'Feel the Momentum',
        text: "Here's the secret: completing tasks creates energy. Each quest you finish gives you XP and a little rush. That momentum builds. Before you know it, you're tackling your main quest too. Start small, build momentum, ride the wave.",
      },
    ],
  },
  {
    title: 'How XP & Levels Work',
    content: [
      {
        heading: 'Earning XP',
        text: 'Every quest has a point value. Main quests give the most XP (10-20 points), side quests are moderate (3-8 points), and dailies keep your routine rewarded (3-5 points). Complete quests to earn XP and level up your character.',
      },
      {
        heading: 'Streaks & Multipliers',
        text: "Complete at least one quest every day to build a streak. Here's where it gets fun: 7-day streak = 2x XP multiplier. 30-day streak = 3x multiplier. That's not a typo — your XP triples. Streaks are the single most powerful mechanic in Quest Board. Protect your streak like it's a rare drop.",
      },
      {
        heading: 'Leveling Up',
        text: 'XP accumulates into levels. Each level takes a bit more XP than the last. Your level is your overall progress indicator — it represents every task you\'ve conquered, every streak you\'ve maintained, every day you showed up.',
      },
    ],
  },
  {
    title: 'Quest Types',
    content: [
      {
        heading: '⚔️ Main Quests',
        text: "Your big, important tasks. The stuff that actually moves the needle. You should have 1-2 main quests per day max. These are your boss battles — they take focus and energy, but they're worth the most XP.",
      },
      {
        heading: '🗡️ Side Quests',
        text: "Everything else that needs doing. Emails, errands, small tasks. These are your bread and butter. They're quick to complete and they keep the XP flowing. Start your day with 2-3 of these to build momentum before tackling your main quest.",
      },
      {
        heading: '📋 Daily Quests',
        text: 'Recurring tasks that auto-generate each day. Exercise, journaling, checking email — whatever you do daily. Set them up once in Settings and they appear automatically. Perfect for building routines.',
      },
    ],
  },
  {
    title: 'Tips for Building the Habit',
    content: [
      {
        heading: 'The 2-Minute Rule',
        text: "If a quest takes less than 2 minutes, do it NOW. Don't plan it, don't think about it, just knock it out. The quick completion gives you instant momentum and frees up mental space for bigger tasks.",
      },
      {
        heading: "Don't Break the Chain",
        text: "Your streak is sacred. Even on bad days, complete ONE quest. Just one. It keeps your streak alive, maintains your multiplier, and reminds your brain that you're someone who gets things done. Bad days count double for building discipline.",
      },
      {
        heading: 'Front-Load the Easy Wins',
        text: "Start your day with your easiest side quests. Not because they're important, but because each completion fires off dopamine and builds momentum. By the time you get to your main quest, you're already in flow state.",
      },
      {
        heading: "Be Kind to Yourself",
        text: "Missed a day? Lost your streak? It happens to everyone. The reset button exists for a reason — what matters isn't perfection, it's that you come back. Every new streak started after a broken one is proof of resilience. That's more legendary than any multiplier.",
      },
    ],
  },
  {
    title: 'Pro Tips',
    content: [
      {
        heading: 'Use Descriptive Quest Names',
        text: 'Instead of "Work on project," try "Draft the intro section for the proposal." Specific quests are easier to start because your brain knows exactly what to do. Vague tasks create resistance.',
      },
      {
        heading: 'Break Down Boss Battles',
        text: "If a main quest feels overwhelming, break it into side quests. \"Build website\" becomes \"Pick a template,\" \"Write the hero section,\" \"Add contact page.\" Each piece is completable and gives you XP along the way.",
      },
      {
        heading: 'Check Your Stats',
        text: "Visit the Stats page weekly. Seeing your completion patterns, XP graph, and streak history is incredibly motivating. Data doesn't lie — and watching those numbers climb is its own reward.",
      },
    ],
  },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-slate-800 dark:text-white">
      <div className="mx-auto max-w-3xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-extrabold mb-4 text-center">
            How Quest Board Works
          </h1>
          <p className="text-center text-slate-500 dark:text-gray-400 mb-4 max-w-xl mx-auto">
            A guide to turning your chaotic task list into an RPG adventure. Built for people whose brains
            need a little extra motivation to get moving.
          </p>
          <p className="text-center text-amber-600 dark:text-quest-gold text-sm mb-16">
            ✨ You&apos;ve got this. Let&apos;s make productivity feel like a game.
          </p>
        </motion.div>

        <div className="space-y-16">
          {sections.map((section, si) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.05 }}
              viewport={{ once: true }}
            >
              <h2 className="font-pixel text-lg text-amber-600 dark:text-quest-gold mb-8"
                  style={{ textShadow: '0 0 15px rgba(246, 201, 14, 0.2)' }}>
                {section.title}
              </h2>
              <div className="space-y-8">
                {section.content.map((item) => (
                  <div key={item.heading} className="rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-gray-900/50 p-6">
                    <h3 className="text-lg font-bold mb-3">{item.heading}</h3>
                    <p className="text-slate-600 dark:text-gray-400 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        <div className="text-center mt-16 pt-8 border-t border-slate-200 dark:border-gray-800">
          <p className="text-slate-500 dark:text-gray-400 mb-6">Ready to start your adventure?</p>
          <Link
            href="/sign-up"
            className="inline-block px-8 py-3 bg-quest-gold text-black font-semibold rounded-lg hover:bg-amber-300 transition-all hover:scale-105"
          >
            Create Your Quest Board
          </Link>
          <div className="mt-6">
            <Link href="/" className="text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
