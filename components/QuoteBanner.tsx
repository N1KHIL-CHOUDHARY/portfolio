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
        setTimeout(() => setIsRefreshing(false), 400)
      }
    })
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="py-2"
    >
      <div className="relative group p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-zinc-300 dark:hover:border-zinc-700/90 transition-all duration-500 shadow-2xs">
        {/* Subtle background glow on hover */}



        <div className="relative flex items-start gap-4">
          <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5 transition-colors">
            <Quote className="w-4 h-4" />
          </div>

          <div className="space-y-2 font-mono flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={quote.text}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.25 }}
                className="space-y-2"
              >
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 italic leading-relaxed tracking-tight select-text">
                  &quot;{quote.text}&quot;
                </p>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 text-right font-medium font-mono">
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
