'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { RARITY_COLORS, RARITY_BG, type Achievement } from '@/lib/achievements'

interface AchievementToastProps {
  achievement: Achievement | null
  onDismiss: () => void
}

export function AchievementToast({ achievement, onDismiss }: AchievementToastProps) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          className="fixed top-6 left-1/2 z-50 -translate-x-1/2"
          initial={{ opacity: 0, y: -40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        >
          <div
            className={`flex items-center gap-4 rounded-xl border-2 px-6 py-4 shadow-2xl backdrop-blur-md ${
              RARITY_COLORS[achievement.rarity]
            } ${RARITY_BG[achievement.rarity]}`}
            onClick={onDismiss}
            role="button"
          >
            <motion.div
              className="text-4xl"
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            >
              {achievement.icon}
            </motion.div>
            <div>
              <div className="text-[10px] uppercase tracking-wider opacity-60">
                Achievement Unlocked!
              </div>
              <div className="font-bold text-slate-900 dark:text-white">{achievement.name}</div>
              <div className="text-xs opacity-70 text-slate-700 dark:text-slate-300">{achievement.description}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
