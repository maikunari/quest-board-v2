'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CompletionAnimationProps {
  show: boolean
  points: number
  onComplete: () => void
}

export default function CompletionAnimation({ show, points, onComplete }: CompletionAnimationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onComplete, 1500)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="celebration-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onComplete}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          >
            <motion.div
              className="text-7xl mb-4"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }}
            >
              🎉
            </motion.div>
            <div className="font-pixel text-xl text-quest-gold mb-3" style={{ textShadow: '0 0 30px rgba(246, 201, 14, 0.5)' }}>
              Quest Complete!
            </div>
            <motion.div
              className="font-pixel text-3xl text-quest-green"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              +{points} pts
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
