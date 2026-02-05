import { format, startOfWeek, endOfWeek, eachDayOfInterval, subDays, parseISO } from 'date-fns'

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'yyyy-MM-dd')
}

export function formatDisplayDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'EEEE, MMMM d, yyyy')
}

export function getToday(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function getTodayDate(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export function getWeekRange(date: Date = new Date()) {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  const end = endOfWeek(date, { weekStartsOn: 1 })
  return { start, end }
}

export function getWeekDays(date: Date = new Date()): Date[] {
  const { start, end } = getWeekRange(date)
  return eachDayOfInterval({ start, end })
}

export function getLast30Days(): Date[] {
  const today = new Date()
  return eachDayOfInterval({
    start: subDays(today, 29),
    end: today,
  })
}

export function getRank(weekPoints: number): { emoji: string; label: string; next: number | null } {
  if (weekPoints >= 200) return { emoji: '💎', label: 'Diamond', next: null }
  if (weekPoints >= 150) return { emoji: '🥇', label: 'Gold', next: 200 }
  if (weekPoints >= 100) return { emoji: '🥈', label: 'Silver', next: 150 }
  if (weekPoints >= 50) return { emoji: '🥉', label: 'Bronze', next: 100 }
  return { emoji: '🌱', label: 'Seedling', next: 50 }
}

export function getQuestTypeColor(type: string): string {
  switch (type) {
    case 'main': return 'text-amber-400'
    case 'side': return 'text-violet-400'
    case 'daily': return 'text-cyan-400'
    default: return 'text-slate-400'
  }
}

export function getQuestTypeBorder(type: string): string {
  switch (type) {
    case 'main': return 'border-amber-500'
    case 'side': return 'border-violet-500'
    case 'daily': return 'border-cyan-500'
    default: return 'border-slate-500'
  }
}

export function getQuestTypeBg(type: string): string {
  switch (type) {
    case 'main': return 'from-amber-500/10 to-amber-500/5'
    case 'side': return 'from-violet-500/10 to-violet-500/5'
    case 'daily': return 'from-cyan-500/10 to-cyan-500/5'
    default: return 'from-slate-500/10 to-slate-500/5'
  }
}
