'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, Sparkles, RefreshCw } from 'lucide-react'

export interface QuoteBannerData {
  id?: string
  text: string
  author: string
  category?: string | null
  order?: number
}

const DEFAULT_QUOTE: QuoteBannerData = {
  text: 'You have a right to perform your prescribed duty, but you are not entitled to the fruits of actions.',
  author: 'Bhagavad Gita',
}

export default function QuoteBanner({ initialQuote }: { initialQuote?: QuoteBannerData }) {
  const [quote, setQuote] = useState<QuoteBannerData>(initialQuote || DEFAULT_QUOTE)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [, startTransition] = useTransition()

  useEffect(() => {
    if (initialQuote) {
      setQuote(initialQuote)
    } else {
      // Fetch today's quote client-side if not provided via props
      fetch('/api/quote/today')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.text) {
            setQuote(data)
          }
        })
        .catch(() => {
          // Keep default quote fallback
        })
    }
  }, [initialQuote])

  const handleShuffle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsRefreshing(true)

    startTransition(async () => {
      try {
        const res = await fetch('/api/quote/today?random=true')
        const data = await res.json()
        if (data && data.text) {
          setQuote(data)
        }
      } catch {
        // Ignore error
      } finally {
        setTimeout(() => setIsRefreshing(false), 200)
      }
    })
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="py-2"
    >
      <div className="relative group p-5 sm:p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200">
        <div className="relative flex items-start gap-4">
          <div className="p-2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 shrink-0 mt-0.5 transition-colors border border-neutral-200 dark:border-neutral-700/60">
            <Quote className="w-4 h-4" />
          </div>

          <div className="space-y-2 font-mono flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={quote.text}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 italic leading-relaxed tracking-tight select-text">
                  &quot;{quote.text}&quot;
                </p>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 text-right font-medium font-mono">
                      — {quote.author}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
