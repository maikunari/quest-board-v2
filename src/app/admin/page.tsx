'use client'

import { useEffect, useState } from 'react'
import { format, subDays, addDays } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'

interface Quest {
  id: string
  date: string
  type: 'main' | 'side' | 'daily'
  title: string
  subtitle?: string | null
  description?: string | null
  icon: string
  points: number
  asanaTaskId?: string | null
  order: number
}

interface AsanaTask {
  gid: string
  name: string
  notes: string
  dueOn: string | null
  project: string
}

const defaultQuest = {
  type: 'side' as const,
  title: '',
  subtitle: '',
  description: '',
  icon: '⚔️',
  points: 5,
  asanaTaskId: '',
  order: 0,
}

const emojiOptions = ['⚔️', '🏰', '🎯', '🚀', '💻', '📧', '📊', '🎨', '📝', '🔧', '🌐', '📱', '🎮', '💡', '🔥', '⭐', '🎪', '🛡️', '📚', '🧹']

export default function AdminPage() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [quests, setQuests] = useState<Quest[]>([])
  const [editingQuest, setEditingQuest] = useState<Partial<Quest> | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [asanaTasks, setAsanaTasks] = useState<AsanaTask[]>([])
  const [showAsana, setShowAsana] = useState(false)
  const [asanaLoading, setAsanaLoading] = useState(false)
  const [asanaFilter, setAsanaFilter] = useState<string>('all')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetchQuests()
  }, [selectedDate])

  const fetchQuests = async () => {
    const res = await fetch(`/api/quests?date=${selectedDate}`)
    const data = await res.json()
    setQuests(data)
  }

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  const saveQuest = async () => {
    if (!editingQuest?.title) return
    setSaving(true)

    try {
      const body = {
        ...editingQuest,
        date: selectedDate,
      }

      await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      showMessage(editingQuest.id ? 'Quest updated!' : 'Quest created!', 'success')
      setEditingQuest(null)
      setIsCreating(false)
      fetchQuests()
    } catch (error) {
      showMessage('Failed to save quest', 'error')
    } finally {
      setSaving(false)
    }
  }

  const deleteQuest = async (id: string) => {
    if (!confirm('Delete this quest?')) return

    try {
      await fetch(`/api/quests?id=${id}`, { method: 'DELETE' })
      showMessage('Quest deleted', 'success')
      fetchQuests()
    } catch (error) {
      showMessage('Failed to delete quest', 'error')
    }
  }

  const duplicateYesterday = async () => {
    const yesterday = format(subDays(new Date(selectedDate), 1), 'yyyy-MM-dd')
    const res = await fetch(`/api/quests?date=${yesterday}`)
    const yesterdayQuests = await res.json()

    const dailies = yesterdayQuests.filter((q: Quest) => q.type === 'daily')
    if (dailies.length === 0) {
      showMessage('No dailies found yesterday', 'error')
      return
    }

    for (const quest of dailies) {
      await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          type: quest.type,
          title: quest.title,
          subtitle: quest.subtitle,
          description: quest.description,
          icon: quest.icon,
          points: quest.points,
          order: quest.order,
        }),
      })
    }

    showMessage(`Duplicated ${dailies.length} dailies!`, 'success')
    fetchQuests()
  }

  const fetchAsanaTasks = async () => {
    setAsanaLoading(true)
    try {
      const res = await fetch('/api/asana/tasks')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setAsanaTasks(data)
      setShowAsana(true)
    } catch (error) {
      showMessage('Failed to fetch Asana tasks. Check ASANA_TOKEN.', 'error')
    } finally {
      setAsanaLoading(false)
    }
  }

  const importAsanaTask = async (task: AsanaTask) => {
    await fetch('/api/quests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: selectedDate,
        type: 'side',
        title: task.name,
        subtitle: task.project,
        description: task.notes.slice(0, 500),
        icon: '📋',
        points: 5,
        asanaTaskId: task.gid,
        order: quests.length,
      }),
    })

    showMessage(`Imported: ${task.name}`, 'success')
    setAsanaTasks(prev => prev.filter(t => t.gid !== task.gid))
    fetchQuests()
  }

  const mainQuests = quests.filter(q => q.type === 'main')
  const sideQuests = quests.filter(q => q.type === 'side')
  const dailyQuests = quests.filter(q => q.type === 'daily')

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🛠️ Quest Editor</h1>

      {/* Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium ${
              message.type === 'success' ? 'bg-green-600/90 text-white' : 'bg-red-600/90 text-white'
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Date Picker + Actions */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDate(format(subDays(new Date(selectedDate), 1), 'yyyy-MM-dd'))}
            className="btn-secondary px-3"
          >
            ←
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field w-auto"
          />
          <button
            onClick={() => setSelectedDate(format(addDays(new Date(selectedDate), 1), 'yyyy-MM-dd'))}
            className="btn-secondary px-3"
          >
            →
          </button>
          <button
            onClick={() => setSelectedDate(format(new Date(), 'yyyy-MM-dd'))}
            className="btn-secondary text-xs"
          >
            Today
          </button>
        </div>

        <div className="flex gap-2 ml-auto">
          <button onClick={duplicateYesterday} className="btn-secondary">
            📋 Copy Yesterday&apos;s Dailies
          </button>
          <button onClick={fetchAsanaTasks} className="btn-secondary" disabled={asanaLoading}>
            {asanaLoading ? '⏳ Loading...' : '📥 Import from Asana'}
          </button>
          <button
            onClick={() => {
              setEditingQuest({ ...defaultQuest })
              setIsCreating(true)
            }}
            className="btn-primary"
          >
            + New Quest
          </button>
        </div>
      </div>

      {/* Asana Import Panel */}
      <AnimatePresence>
        {showAsana && (
          <motion.div
            className="quest-card p-4 mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">📥 Asana Tasks</h3>
              <div className="flex items-center gap-2">
                <select
                  value={asanaFilter}
                  onChange={(e) => setAsanaFilter(e.target.value)}
                  className="select-field text-xs py-1"
                >
                  <option value="all">All Projects</option>
                  {Array.from(new Set(asanaTasks.map(t => t.project))).sort().map(proj => (
                    <option key={proj} value={proj}>{proj}</option>
                  ))}
                </select>
                <button onClick={() => setShowAsana(false)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white text-sm">
                  ✕
                </button>
              </div>
            </div>
            {asanaTasks.length === 0 ? (
              <p className="text-slate-500 text-sm">No uncompleted tasks found.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {asanaTasks
                  .filter(task => asanaFilter === 'all' || task.project === asanaFilter)
                  .map(task => (
                  <div
                    key={task.gid}
                    className="flex items-center justify-between bg-slate-100 dark:bg-quest-dark rounded-lg p-3"
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <div className="text-sm font-medium truncate">{task.name}</div>
                      <div className="text-xs text-slate-500">
                        {task.project} {task.dueOn ? `• Due ${task.dueOn}` : '• No due date'}
                      </div>
                    </div>
                    <button onClick={() => importAsanaTask(task)} className="btn-primary text-xs px-3 py-1 shrink-0">
                      Import
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quest Editor Modal */}
      <AnimatePresence>
        {editingQuest && (
          <motion.div
            className="quest-card p-6 mb-6 border border-violet-500/30"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h3 className="font-semibold mb-4">{isCreating ? '✨ New Quest' : '✏️ Edit Quest'}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Type</label>
                <select
                  value={editingQuest.type || 'side'}
                  onChange={(e) => setEditingQuest({ ...editingQuest, type: e.target.value as Quest['type'] })}
                  className="select-field"
                >
                  <option value="main">🏰 Main Quest (20 pts)</option>
                  <option value="side">⚔️ Side Quest (5-10 pts)</option>
                  <option value="daily">📋 Daily Quest (3-5 pts)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Points</label>
                <input
                  type="number"
                  value={editingQuest.points || 5}
                  onChange={(e) => setEditingQuest({ ...editingQuest, points: parseInt(e.target.value) || 5 })}
                  className="input-field"
                  min={1}
                  max={50}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs text-slate-500 mb-1">Title</label>
                <input
                  type="text"
                  value={editingQuest.title || ''}
                  onChange={(e) => setEditingQuest({ ...editingQuest, title: e.target.value })}
                  className="input-field"
                  placeholder="Quest title..."
                  autoFocus
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs text-slate-500 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editingQuest.subtitle || ''}
                  onChange={(e) => setEditingQuest({ ...editingQuest, subtitle: e.target.value })}
                  className="input-field"
                  placeholder="Brief description..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs text-slate-500 mb-1">Description</label>
                <textarea
                  value={editingQuest.description || ''}
                  onChange={(e) => setEditingQuest({ ...editingQuest, description: e.target.value })}
                  className="input-field min-h-[80px] resize-y"
                  placeholder="Detailed description (shown on main quest)..."
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Icon</label>
                <div className="flex flex-wrap gap-1.5">
                  {emojiOptions.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setEditingQuest({ ...editingQuest, icon: emoji })}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
                        editingQuest.icon === emoji
                          ? 'bg-violet-600 ring-2 ring-violet-400'
                          : 'bg-slate-100 hover:bg-slate-200 dark:bg-quest-dark dark:hover:bg-quest-hover'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Order</label>
                <input
                  type="number"
                  value={editingQuest.order || 0}
                  onChange={(e) => setEditingQuest({ ...editingQuest, order: parseInt(e.target.value) || 0 })}
                  className="input-field"
                />
                <label className="block text-xs text-slate-500 mt-3 mb-1">Asana Task ID (optional)</label>
                <input
                  type="text"
                  value={editingQuest.asanaTaskId || ''}
                  onChange={(e) => setEditingQuest({ ...editingQuest, asanaTaskId: e.target.value })}
                  className="input-field"
                  placeholder="Asana task GID..."
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={saveQuest} className="btn-primary" disabled={saving || !editingQuest.title}>
                {saving ? '⏳ Saving...' : '💾 Save Quest'}
              </button>
              <button onClick={() => { setEditingQuest(null); setIsCreating(false) }} className="btn-secondary">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quest List */}
      <div className="space-y-6">
        {[
          { label: '🏰 Main Quest', items: mainQuests, type: 'main' },
          { label: '⚔️ Side Quests', items: sideQuests, type: 'side' },
          { label: '📋 Daily Quests', items: dailyQuests, type: 'daily' },
        ].map(({ label, items, type }) => (
          <div key={type}>
            <h2 className={`text-sm font-semibold mb-3 ${
              type === 'main' ? 'text-amber-400' : type === 'side' ? 'text-violet-400' : 'text-cyan-400'
            }`}>
              {label} ({items.length})
            </h2>
            {items.length === 0 ? (
              <div className="quest-card p-4 text-center text-slate-600 text-sm border-dashed">
                No {type} quests for this date
              </div>
            ) : (
              <div className="space-y-2">
                {items.map(quest => (
                  <div
                    key={quest.id}
                    className="quest-card flex items-center gap-3 p-4 group"
                  >
                    <span className="text-xl">{quest.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{quest.title}</div>
                      {quest.subtitle && <div className="text-xs text-slate-500">{quest.subtitle}</div>}
                    </div>
                    <span className="font-pixel text-xs text-quest-gold">{quest.points}pts</span>
                    {quest.asanaTaskId && <span className="text-xs text-slate-600">📎</span>}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingQuest(quest); setIsCreating(false) }}
                        className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-xs"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteQuest(quest.id)}
                        className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
