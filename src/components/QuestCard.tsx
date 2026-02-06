'use client'

import { motion } from 'framer-motion'

interface Quest {
  id: string
  title: string
  subtitle?: string | null
  icon: string
  points: number
  type: string
  asanaTaskId?: string | null
}

interface QuestCardProps {
  quest: Quest
  isCompleted: boolean
  onToggle: (questId: string) => void
  index: number
}

export default function QuestCard({ quest, isCompleted, onToggle, index }: QuestCardProps) {
  const typeColors = {
    side: {
      border: 'border-violet-500/30',
      borderHover: 'hover:border-violet-500/60',
      checkbox: 'border-violet-500',
      checkboxBg: 'bg-violet-500',
    },
    daily: {
      border: 'border-cyan-500/30',
      borderHover: 'hover:border-cyan-500/60',
      checkbox: 'border-cyan-500',
      checkboxBg: 'bg-cyan-500',
    },
    main: {
      border: 'border-amber-500/30',
      borderHover: 'hover:border-amber-500/60',
      checkbox: 'border-amber-500',
      checkboxBg: 'bg-amber-500',
    },
  }

  const colors = typeColors[quest.type as keyof typeof typeColors] || typeColors.side

  return (
    <motion.div
      className={`bg-slate-50 dark:bg-quest-hover/50 rounded-xl border ${colors.border} ${colors.borderHover} flex items-center gap-4 p-4 cursor-pointer ${
        isCompleted ? 'opacity-60' : ''
      }`}
      onClick={() => onToggle(quest.id)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Checkbox */}
      <div
        className={`w-7 h-7 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
          isCompleted
            ? `${colors.checkboxBg} border-transparent`
            : colors.checkbox
        }`}
      >
        {isCompleted && (
          <motion.span
            className="text-slate-900 dark:text-white text-sm font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 400 }}
          >
            ✓
          </motion.span>
        )}
      </div>

      {/* Icon */}
      <span className="text-xl flex-shrink-0">{quest.icon}</span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className={`font-semibold text-sm ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
          {quest.title}
        </div>
        {quest.subtitle && (
          <div className="text-xs text-slate-500 mt-0.5 truncate">{quest.subtitle}</div>
        )}
      </div>

      {/* Points */}
      <span className="font-pixel text-xs text-quest-gold bg-amber-500/10 px-2.5 py-1 rounded-md flex-shrink-0">
        +{quest.points}
      </span>
    </motion.div>
  )
}
