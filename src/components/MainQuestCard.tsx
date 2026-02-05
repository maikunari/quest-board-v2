'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Quest {
  id: string
  title: string
  subtitle?: string | null
  description?: string | null
  icon: string
  points: number
  type: string
  asanaTaskId?: string | null
}

interface MainQuestCardProps {
  quest: Quest | null
  isCompleted: boolean
  onToggle: (questId: string) => void
}

export default function MainQuestCard({ quest, isCompleted, onToggle }: MainQuestCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  if (!quest) {
    return (
      <div className="quest-card border-2 border-dashed border-amber-500/20 min-h-[400px] flex items-center justify-center">
        <div className="text-center text-slate-500">
          <div className="text-5xl mb-4">🏰</div>
          <div className="font-medium">No main quest today</div>
          <div className="text-sm mt-1">Add one from the admin panel</div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className={`quest-card border-2 cursor-pointer relative overflow-hidden min-h-[400px] flex flex-col ${
        isCompleted
          ? 'border-quest-green/40 opacity-80'
          : 'border-amber-500/30 hover:border-amber-500/60'
      }`}
      style={{
        background: isCompleted
          ? 'linear-gradient(135deg, #1a1333 0%, rgba(34, 197, 94, 0.08) 100%)'
          : 'linear-gradient(135deg, #1a1333 0%, rgba(245, 158, 11, 0.08) 100%)',
      }}
      onClick={() => onToggle(quest.id)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Particles */}
      {!isCompleted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="particle" />
          ))}
        </div>
      )}

      {/* Completed overlay */}
      {isCompleted && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="font-pixel text-2xl text-quest-green -rotate-12" style={{ textShadow: '0 0 30px rgba(34, 197, 94, 0.5)' }}>
            ✓ COMPLETE
          </div>
        </motion.div>
      )}

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 relative z-0">
        <div className="text-center mb-2">
          <span className="text-xs uppercase tracking-widest text-amber-400/80 font-semibold">🏰 Main Quest</span>
        </div>

        {/* Icon */}
        <div className="flex items-center justify-center h-28 mb-4 relative">
          <motion.div
            className="text-6xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            style={{ filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.4))' }}
          >
            {quest.icon}
          </motion.div>
        </div>

        {/* Title */}
        <div className="text-center flex-1">
          <h3 className={`text-xl font-bold mb-2 ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
            {quest.title}
          </h3>
          {quest.subtitle && (
            <p className="text-slate-400 mb-3 text-sm">{quest.subtitle}</p>
          )}
          {quest.description && (
            <p className="text-slate-500 text-sm leading-relaxed">{quest.description}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
          <span className="font-pixel text-sm text-quest-gold bg-amber-500/10 px-3 py-1.5 rounded-lg">
            +{quest.points} pts
          </span>
          <span className={`text-sm ${isCompleted ? 'text-quest-green' : 'text-slate-500'}`}>
            {isCompleted ? '✅ Complete' : '🎯 In Progress'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
