'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-slate-800 dark:text-white">
      <div className="mx-auto max-w-2xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-extrabold mb-4 text-center">Contact Us</h1>
          <p className="text-center text-slate-500 dark:text-gray-400 mb-12">
            Got a question, bug report, or feature request? We&apos;d love to hear from you.
          </p>

          {status === 'sent' ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-xl font-bold mb-2">Message Sent!</h2>
              <p className="text-slate-500 dark:text-gray-400 mb-6">We&apos;ll get back to you as soon as we can.</p>
              <Link href="/" className="text-amber-600 dark:text-quest-gold hover:underline">
                ← Back to Home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input-field resize-none"
                  placeholder="What's on your mind?"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-3 px-6 bg-quest-gold text-black font-semibold rounded-lg hover:bg-amber-300 transition-all disabled:opacity-50"
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
              {status === 'error' && (
                <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
              )}
            </form>
          )}
        </motion.div>

        <div className="text-center mt-12">
          <Link href="/" className="text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
