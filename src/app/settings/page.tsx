'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DailyTemplate {
  id: string
  title: string
  subtitle?: string | null
  description?: string | null
  icon: string
  points: number
  order: number
  active: boolean
}

const emojiOptions = ['⚔️', '🏰', '🎯', '🚀', '💻', '📧', '📊', '🎨', '📝', '🔧', '🌐', '📱', '🎮', '💡', '🔥', '⭐', '🎪', '🛡️', '📚', '🧹']

const defaultTemplate = {
  title: '',
  subtitle: '',
  icon: '📋',
  points: 3,
  order: 0,
}

export default function SettingsPage() {
  const [templates, setTemplates] = useState<DailyTemplate[]>([])
  const [editing, setEditing] = useState<Partial<DailyTemplate> | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    const res = await fetch('/api/daily-templates')
    const data = await res.json()
    setTemplates(data)
  }

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  const saveTemplate = async () => {
    if (!editing?.title) return
    setSaving(true)

    try {
      await fetch('/api/daily-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      })
      showMessage(editing.id ? 'Template updated!' : 'Template created!', 'success')
      setEditing(null)
      setIsCreating(false)
      fetchTemplates()
    } catch {
      showMessage('Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  const deleteTemplate = async (id: string) => {
    if (!confirm('Delete this daily template?')) return

    try {
      await fetch(`/api/daily-templates?id=${id}`, { method: 'DELETE' })
      showMessage('Template deleted', 'success')
      fetchTemplates()
    } catch {
      showMessage('Failed to delete', 'error')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">⚙️ Settings</h1>

      {/* Toast */}
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

      {/* Daily Templates Section */}
      <section className="quest-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">📋 Daily Quest Templates</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              These auto-appear every day. Set them once, forget about them.
            </p>
          </div>
          <button
            onClick={() => { setEditing({ ...defaultTemplate }); setIsCreating(true) }}
            className="btn-primary text-sm"
          >
            + Add Daily
          </button>
        </div>

        {/* Template Editor */}
        <AnimatePresence>
          {editing && (
            <motion.div
              className="bg-slate-100 dark:bg-quest-dark rounded-lg p-4 mb-4 border border-violet-500/30"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Title</label>
                  <input
                    type="text"
                    value={editing.title || ''}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Clear inbox"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={editing.subtitle || ''}
                    onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Emails, messages, tickets"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Points</label>
                  <input
                    type="number"
                    value={editing.points || 3}
                    onChange={(e) => setEditing({ ...editing, points: parseInt(e.target.value) || 3 })}
                    className="input-field w-24"
                    min={1}
                    max={20}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Icon</label>
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {emojiOptions.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => setEditing({ ...editing, icon: emoji })}
                        className={`w-8 h-8 rounded flex items-center justify-center ${
                          editing.icon === emoji ? 'bg-violet-600 ring-2 ring-violet-400' : 'bg-slate-200 dark:bg-quest-hover'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                                      </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={saveTemplate} className="btn-primary" disabled={saving || !editing.title}>
                    {saving ? 'Saving...' : '💾 Save'}
                  </button>
                  <button onClick={() => { setEditing(null); setIsCreating(false) }} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Template List */}
        {templates.length === 0 ? (
          <div className="text-center text-slate-500 py-8">
            No daily templates yet. Add one above!
          </div>
        ) : (
          <div className="space-y-2">
            {templates.map(template => (
              <div
                key={template.id}
                className="flex items-center gap-3 bg-slate-50 dark:bg-quest-dark/50 rounded-lg p-3 group"
              >
                <span className="text-xl">{template.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{template.title}</div>
                  {template.subtitle && <div className="text-xs text-slate-500">{template.subtitle}</div>}
                </div>
                <span className="text-xs text-quest-gold font-pixel">+{template.points}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setEditing(template); setIsCreating(false) }}
                    className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-xs"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteTemplate(template.id)}
                    className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
