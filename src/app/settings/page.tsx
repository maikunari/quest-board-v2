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

function SoundToggle() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return true
    return localStorage.getItem('quest-sound') !== 'off'
  })

  function toggle() {
    const newVal = !enabled
    setEnabled(newVal)
    localStorage.setItem('quest-sound', newVal ? 'on' : 'off')
  }

  return (
    <section className="quest-card p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">🔊 Sound Effects</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Play sounds for completions, level ups, and achievements
          </p>
        </div>
        <button
          onClick={toggle}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            enabled ? 'bg-quest-gold' : 'bg-slate-600'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : ''
            }`}
          />
        </button>
      </div>
    </section>
  )
}

function AsanaConnection() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'disconnected' | 'error'>('loading')
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [workspaceName, setWorkspaceName] = useState<string | null>(null)
  const [taskCount, setTaskCount] = useState<number | null>(null)

  useEffect(() => {
    checkConnection()
  }, [])

  async function checkConnection() {
    try {
      const res = await fetch('/api/asana/status')
      if (!res.ok) {
        setStatus('disconnected')
        return
      }
      const data = await res.json()
      if (data.connected) {
        setStatus('connected')
        setUserEmail(data.email || null)
        setWorkspaceName(data.workspace || null)
        setTaskCount(data.taskCount ?? null)
      } else {
        setStatus('disconnected')
      }
    } catch {
      setStatus('disconnected')
    }
  }

  return (
    <section className="quest-card p-6 mb-6">
      <h2 className="text-lg font-semibold mb-2">🔗 Asana Integration</h2>

      {status === 'loading' && (
        <p className="text-sm text-slate-500 dark:text-slate-400">Checking connection...</p>
      )}

      {status === 'connected' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">Connected</span>
          </div>
          {userEmail && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Account: <span className="text-slate-700 dark:text-slate-300">{userEmail}</span>
            </p>
          )}
          {workspaceName && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Workspace: <span className="text-slate-700 dark:text-slate-300">{workspaceName}</span>
            </p>
          )}
          {taskCount !== null && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {taskCount} incomplete task{taskCount !== 1 ? 's' : ''} assigned to you
            </p>
          )}
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            Import tasks from the Admin page → &quot;Import from Asana&quot;
          </p>
        </div>
      )}

      {status === 'disconnected' && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Connect Asana to import your tasks as quests. You need a Personal Access Token.
          </p>
          <div className="bg-slate-50 dark:bg-quest-dark rounded-lg p-4 text-sm space-y-3 border border-slate-200 dark:border-white/10">
            <p className="font-medium">Setup steps:</p>
            <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                Go to{' '}
                <a
                  href="https://app.asana.com/0/my-apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-600 dark:text-violet-400 underline"
                >
                  Asana Developer Console
                </a>
              </li>
              <li>Click <strong>&quot;Create new token&quot;</strong> and copy it</li>
              <li>
                Set these environment variables on your server / Vercel:
                <code className="block mt-1 bg-slate-200 dark:bg-white/5 rounded px-2 py-1 text-xs font-mono">
                  ASANA_TOKEN=&quot;your_personal_access_token&quot;
                </code>
              </li>
              <li>
                Find your Workspace GID (it&apos;s in the URL when you open Asana, or use the API):
                <code className="block mt-1 bg-slate-200 dark:bg-white/5 rounded px-2 py-1 text-xs font-mono">
                  ASANA_WORKSPACE_GID=&quot;your_workspace_gid&quot;
                </code>
              </li>
              <li>Redeploy your app, then come back here</li>
            </ol>
          </div>
          <a
            href="https://app.asana.com/0/my-apps"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block text-sm"
          >
            Get Asana Token →
          </a>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-sm font-medium text-red-600 dark:text-red-400">Connection error</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your Asana token may be invalid or expired. Generate a new one at{' '}
            <a
              href="https://app.asana.com/0/my-apps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-600 dark:text-violet-400 underline"
            >
              Asana Developer Console
            </a>
          </p>
        </div>
      )}
    </section>
  )
}

function BillingSection() {
  const [loading, setLoading] = useState(false)

  async function openPortal() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (error) {
      console.error('Portal error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="quest-card p-6 mb-6">
      <h2 className="text-lg font-semibold mb-2">💳 Billing & Plan</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Manage your subscription, update payment method, or change plans.
      </p>
      <div className="flex gap-3">
        <a href="/pricing" className="btn-primary text-sm">View Plans</a>
        <button onClick={openPortal} disabled={loading} className="btn-secondary text-sm">
          {loading ? 'Loading...' : 'Manage Billing'}
        </button>
      </div>
    </section>
  )
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
    setTemplates(Array.isArray(data) ? data : [])
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

      {/* Sound */}
      <SoundToggle />

      {/* Asana */}
      <AsanaConnection />

      {/* Billing */}
      <BillingSection />

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
