'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export interface ExperienceItem {
  company: string
  role: string
  dates: string
  location: string
  isCurrent?: boolean
}

const RECENT_EXPERIENCES: ExperienceItem[] = [
  {
    company: 'ASBL',
    role: 'SDE-L1 [Full Stack]',
    dates: 'Jan 2026 – Present',
    location: 'Hyderabad, India',
    isCurrent: true,
  },
  {
    company: 'Promote',
    role: 'Founding Frontend Engineer',
    dates: 'Aug 2025 – Dec 2025',
    location: 'United States (Remote)',
  },
]

export default function ExperiencePreview() {
  return (
    <section id="experience" className="space-y-3.5 py-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
          Experience
        </h2>
        <Link
          href="/experience"
          className="inline-flex items-center gap-1 text-xs font-mono text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group"
        >
          <span>View full timeline</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {RECENT_EXPERIENCES.map((item, idx) => (
          <motion.div
            key={item.company + item.role}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="group relative p-3.5 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/50 transition-all duration-300 ease-out"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {item.company}
                  </h3>

                  {item.isCurrent && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Working
                    </span>
                  )}
                </div>

                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 tracking-tight">
                  {item.role}
                </p>
              </div>

              <div className="text-xs font-mono text-zinc-400 dark:text-zinc-500 sm:text-right shrink-0">
                <p className="font-medium text-zinc-600 dark:text-zinc-400">{item.dates}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
