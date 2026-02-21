'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 w-9 h-9" aria-label="Toggle theme">
        <span className="opacity-0">🌙</span>
      </button>
    )
  }

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light')
    else if (theme === 'light') setTheme('system')
    else setTheme('dark')
  }

  const getIcon = () => {
    if (theme === 'dark') return '🌙'
    if (theme === 'light') return '☀️'
    return '💻'
  }

  const getLabel = () => {
    if (theme === 'dark') return 'Dark mode'
    if (theme === 'light') return 'Light mode'
    return 'System'
  }

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 transition-colors text-sm border border-slate-200 dark:border-white/5"
      aria-label={`Theme: ${getLabel()}. Click to change.`}
      title={`${getLabel()} - Click to cycle`}
    >
      {getIcon()}
    </button>
  )
}
