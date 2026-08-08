'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Wrench, Terminal } from 'lucide-react'

export interface PersonalSectionProps {
  gearsTitle?: string
  gearsSubtitle?: string
  gearsTags?: string[]
  devTitle?: string
  devSubtitle?: string
  devTags?: string[]
}



export default function PersonalSection({
  gearsTitle = 'Gears & Hardware',
  gearsSubtitle = 'Tools & devices I use for development, extensions, hardware, and productivity setups.',
  gearsTags,
  devTitle = 'Development Setup',
  devSubtitle = 'AI code editor, GPU-accelerated terminal, Unix environment, and daily developer workflow.',
  devTags,
}: PersonalSectionProps) {
  return (
    <section id="personal" className="space-y-2 py-2">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-mono">
            Gears & Setup
          </h2>
        </div>
        <span className="text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400">
          Workspace (2)
        </span>
      </div>

      {/* 2 Full-Width Cards */}
      <div className="grid grid-cols-1 gap-2">
        {/* Card 1: Gears */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <Link
            href="/gears"
            aria-label="View all workstation gears and hardware"
            className="group block w-full p-2 sm:p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-all duration-300 ease-out shadow-xs"
          >
            <div className="space-y-1.5 w-full">
              {/* Title Row */}
              <div className="flex items-center justify-between">
                <h3 className="inline-flex items-center gap-2 text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight group-hover:text-zinc-950 dark:group-hover:text-white transition-colors font-mono">
                  <span>{gearsTitle}</span>
                </h3>
              </div>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-sans leading-relaxed tracking-tight">
                {gearsSubtitle}
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Card 2: Development Setup */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Link
            href="/development"
            aria-label="View full development setup and workflow guide"
            className="group block w-full p-2 sm:p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-all duration-300 ease-out shadow-xs"
          >
            <div className="space-y-1.5 w-full">
              {/* Title Row */}
              <div className="flex items-center justify-between">
                <h3 className="inline-flex items-center gap-2 text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight group-hover:text-zinc-950 dark:group-hover:text-white transition-colors font-mono">
                  <span>{devTitle}</span>
                </h3>
              </div>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-sans leading-relaxed tracking-tight">
                {devSubtitle}
              </p>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
