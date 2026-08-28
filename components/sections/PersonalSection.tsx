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
  devTitle = 'Development Setup',
  devSubtitle = 'AI code editor, GPU-accelerated terminal, Unix environment, and daily developer workflow.',
}: PersonalSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
      {/* Card 1: Gears */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.25, delay: 0.05 }}
      >
        <Link
          href="/gears"
          aria-label="View all workstation gears and hardware"
          className="group block h-full p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200"
        >
          <div className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 tracking-tight group-hover:underline font-mono">
              {gearsTitle}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
              {gearsSubtitle}
            </p>
          </div>
        </Link>
      </motion.div>

      {/* Card 2: Development Setup */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.25, delay: 0.1 }}
      >
        <Link
          href="/development"
          aria-label="View full development setup and workflow guide"
          className="group block h-full p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200"
        >
          <div className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 tracking-tight group-hover:underline font-mono">
              {devTitle}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
              {devSubtitle}
            </p>
          </div>
        </Link>
      </motion.div>
    </div>
  )
}
