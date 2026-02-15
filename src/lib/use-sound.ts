'use client'

import {
  playCompleteSound,
  playLevelUpSound,
  playStreakSound,
  playAchievementSound,
  playUndoSound,
} from './sounds'

function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('quest-sound') !== 'off'
}

export function useSound() {
  return {
    complete: () => isSoundEnabled() && playCompleteSound(),
    levelUp: () => isSoundEnabled() && playLevelUpSound(),
    streak: () => isSoundEnabled() && playStreakSound(),
    achievement: () => isSoundEnabled() && playAchievementSound(),
    undo: () => isSoundEnabled() && playUndoSound(),
  }
}
