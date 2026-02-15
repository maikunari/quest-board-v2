'use client'

// Sound effects using Web Audio API — no external files needed

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.3,
  delay = 0
) {
  const ctx = getAudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = type
  osc.frequency.value = frequency
  gain.gain.value = volume

  osc.connect(gain)
  gain.connect(ctx.destination)

  const startTime = ctx.currentTime + delay
  osc.start(startTime)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
  osc.stop(startTime + duration)
}

/** Short satisfying completion chime */
export function playCompleteSound() {
  playTone(523, 0.1, 'sine', 0.2)       // C5
  playTone(659, 0.1, 'sine', 0.2, 0.08) // E5
  playTone(784, 0.15, 'sine', 0.25, 0.16) // G5
}

/** Level up fanfare */
export function playLevelUpSound() {
  playTone(523, 0.12, 'square', 0.15)        // C5
  playTone(659, 0.12, 'square', 0.15, 0.1)   // E5
  playTone(784, 0.12, 'square', 0.15, 0.2)   // G5
  playTone(1047, 0.3, 'square', 0.2, 0.3)    // C6
  playTone(1047, 0.1, 'sine', 0.1, 0.35)     // shimmer
}

/** Streak milestone celebration */
export function playStreakSound() {
  playTone(440, 0.08, 'sine', 0.2)           // A4
  playTone(554, 0.08, 'sine', 0.2, 0.06)     // C#5
  playTone(659, 0.08, 'sine', 0.2, 0.12)     // E5
  playTone(880, 0.2, 'triangle', 0.25, 0.18) // A5
}

/** Achievement unlocked — triumphant */
export function playAchievementSound() {
  playTone(392, 0.15, 'square', 0.12)        // G4
  playTone(523, 0.15, 'square', 0.12, 0.12)  // C5
  playTone(659, 0.15, 'square', 0.12, 0.24)  // E5
  playTone(784, 0.15, 'square', 0.15, 0.36)  // G5
  playTone(1047, 0.4, 'sine', 0.2, 0.48)     // C6 sustained
}

/** Undo / uncomplete */
export function playUndoSound() {
  playTone(400, 0.1, 'sine', 0.15)
  playTone(300, 0.15, 'sine', 0.1, 0.08)
}
