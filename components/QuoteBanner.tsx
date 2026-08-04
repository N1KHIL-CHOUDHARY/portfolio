'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

export default function QuoteBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="py-2"
    >
      <div className="relative group p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-500">
        <div className="flex items-start gap-4">
          <Quote className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5" />
          <div className="space-y-2 font-mono">
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 italic leading-relaxed tracking-tight">
              &quot;You have a right to perform your prescribed duty, but you are not entitled to the fruits of actions.&quot;
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 text-right font-medium">
              — Bhagavad Gita
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
