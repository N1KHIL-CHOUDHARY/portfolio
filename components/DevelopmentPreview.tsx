'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Laptop, Wrench, ArrowRight } from 'lucide-react'

interface SetupCard {
  title: string
  subtitle: string
  icon: React.ElementType
  tags: string[]
}

const PREVIEW_ITEMS: SetupCard[] = [
  {
    title: 'Gears & Hardware',
    subtitle: 'Tools & devices for productivity',
    icon: Wrench,
    tags: ['MacBook Pro', 'Keychron', 'MX Master 3S'],
  },
  {
    title: 'Development Setup',
    subtitle: 'IDE & Workflow Guide',
    icon: Laptop,
    tags: ['Cursor AI', 'VS Code', 'Geist Mono'],
  },
]

export default function DevelopmentPreview() {
  return (
    <section id="development" className="space-y-3.5 py-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
          Development Setup
        </h2>
        <Link
          href="/development"
          className="inline-flex items-center gap-1 text-xs font-mono text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group"
        >
          <span>View full setup</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PREVIEW_ITEMS.map((item, idx) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="group p-3.5 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/50 transition-all duration-300 ease-out flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {item.title}
                  </h3>
                </div>

                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 tracking-tight">
                  {item.subtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-zinc-200/40 dark:border-zinc-800/40">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200/40 dark:border-zinc-700/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
