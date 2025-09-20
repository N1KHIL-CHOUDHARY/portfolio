'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [, startTransition] = useTransition()

  useEffect(() => {
    if (initialQuote) {
      setQuote(initialQuote)
    } else {
      fetch('/api/quote/today')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.text) {
            setQuote(data)
          }
        })
        .catch(() => {})
    }
  }, [initialQuote])

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="py-1.5"
    >
      <div className="flex flex-col items-center justify-center text-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={quote.text}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="space-y-2 max-w-xl py-1"
          >
            <p className="text-[14px] sm:text-[15px] text-neutral-800 dark:text-neutral-200 italic leading-[1.6] select-text">
              &ldquo;{quote.text}&rdquo;
            </p>
            <p className="text-[11px] sm:text-[12px] font-normal text-neutral-500 dark:text-neutral-400">
              — {quote.author}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  )
}
