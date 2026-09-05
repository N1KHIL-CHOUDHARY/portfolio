'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Loader2, MessageSquareHeart, Heart, Lightbulb, Bug, MessageCircle } from 'lucide-react'
import { useToggleSound } from '@/hooks/useToggleSound'

export interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

const CATEGORIES = [
  { id: 'loved', label: 'Loved it', icon: Heart },
  { id: 'suggestion', label: 'Suggestion', icon: Lightbulb },
  { id: 'bug', label: 'Found a bug', icon: Bug },
  { id: 'hello', label: 'Just saying hi', icon: MessageCircle },
]

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id)
  const [message, setMessage] = useState('')
  const [contact, setContact] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const playToggleSound = useToggleSound({ soundUrl: '/sounds/click.mp3', volume: 0.25 })

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    const timer = setTimeout(() => {
      textareaRef.current?.focus()
    }, 120)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timer)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false)
      setErrorMessage(null)
      setMessage('')
      setContact('')
      setSelectedCategory(CATEGORIES[0].id)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isSubmitting) return

    playToggleSound()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          message: message.trim(),
          contact: contact.trim() || undefined,
        }),
      })

      const data = await res.json().catch(() => null)

      if (res.ok && data?.success) {
        setIsSuccess(true)
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        setErrorMessage(data?.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setErrorMessage('Network error. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              playToggleSound()
              onClose()
            }}
            className="fixed inset-0 bg-neutral-900/40 dark:bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative z-10 w-full max-w-[460px] bg-white dark:bg-[#0d0d0d] border border-neutral-200/60 dark:border-neutral-800/60 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/10 dark:shadow-black/40 font-sans"
          >
            <button
              type="button"
              onClick={() => {
                playToggleSound()
                onClose()
              }}
              aria-label="Close dialog"
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-700"
            >
              <X className="w-4 h-4" />
            </button>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25, type: 'spring', bounce: 0.4 }}
                  className="py-12 flex flex-col items-center text-center space-y-4"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20"
                  >
                    <Check className="w-7 h-7 stroke-[2.5]" />
                  </motion.div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
                      Message sent
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-[260px] mx-auto leading-relaxed">
                      Thanks for taking the time to share your thoughts. It means a lot!
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3.5 pr-8">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/60 dark:border-neutral-700/50 flex items-center justify-center shrink-0 shadow-sm">
                      <MessageSquareHeart className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                    </div>
                    <div>
                      <h3
                        id="feedback-dialog-title"
                        className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight leading-none mb-1.5"
                      >
                        Leave a thought
                      </h3>
                      <p className="text-[13px] text-neutral-500 dark:text-neutral-400 leading-tight">
                        Feedback, bugs, or just saying hi.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat.id
                      const Icon = cat.icon
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            playToggleSound()
                            setSelectedCategory(cat.id)
                          }}
                          className={`px-3.5 py-2 rounded-xl text-[13px] font-medium tracking-tight transition-all duration-200 flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-700 ${
                            isSelected
                              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-md scale-[1.02]'
                              : 'bg-neutral-50 dark:bg-neutral-800/40 text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 hover:text-neutral-900 dark:hover:text-neutral-200'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'opacity-100' : 'opacity-70'}`} />
                          {cat.label}
                        </button>
                      )
                    })}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5 relative">
                      <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="What's on your mind?"
                        rows={4}
                        maxLength={1000}
                        required
                        className="w-full text-[14px] bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl px-4 py-3.5 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 focus:ring-4 focus:ring-neutral-900/5 dark:focus:ring-white/5 transition-all resize-none shadow-inner shadow-black/5 dark:shadow-none"
                      />
                      <div className="absolute bottom-3 right-4 text-[11px] font-medium text-neutral-400 dark:text-neutral-500 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm px-1.5 rounded-md">
                        {message.length}/1000
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Email or X handle (optional for reply)"
                        maxLength={100}
                        className="w-full text-[14px] bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 focus:ring-4 focus:ring-neutral-900/5 dark:focus:ring-white/5 transition-all shadow-inner shadow-black/5 dark:shadow-none"
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <motion.p 
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[13px] font-medium text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-3 py-2 rounded-lg"
                    >
                      {errorMessage}
                    </motion.p>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        playToggleSound()
                        onClose()
                      }}
                      className="h-10 px-4 rounded-full text-[13px] font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-700"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={!message.trim() || isSubmitting}
                      className="h-10 px-5 rounded-full text-[13px] font-medium bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-neutral-900/20 dark:shadow-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 dark:focus:ring-offset-neutral-900"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <span>Send message</span>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}