'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Laptop, Cpu, Wrench, ArrowUpRight } from 'lucide-react'
import { DEVELOPMENT_DATA, DevelopmentData } from '@/lib/data'

const ICON_MAP: Record<string, React.ElementType> = {
  'gears': Wrench,
  'setup': Laptop,
  'tech-stack': Cpu,
  'gears-hardware': Wrench,
  'development-setup': Laptop,
}

interface DevelopmentGridProps {
  items?: DevelopmentData[]
}

export default function DevelopmentGrid({ items = DEVELOPMENT_DATA }: DevelopmentGridProps) {
  const displayItems = items && items.length > 0 ? items : DEVELOPMENT_DATA

  return (
    <section id="development" className="space-y-3.5 py-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
          Development & Setup
        </h2>
        <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
          Personal / Stack ({displayItems.length})
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {displayItems.map((item, idx) => {
          const Icon = ICON_MAP[item.slug] || Wrench
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Link
                href={`/personal/${item.slug}`}
                className="group block p-4 sm:p-5 h-full rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/50 transition-all duration-300 ease-out flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-md bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    <div className="p-1 rounded-md text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 tracking-tight">
                    {item.subtitle}
                  </p>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pt-1 line-clamp-2">
                    {item.whyIUseIt}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-zinc-200/40 dark:border-zinc-800/40">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200/40 dark:border-zinc-700/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
