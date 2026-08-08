import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Tag, Laptop, Monitor, Keyboard, Mouse, Headphones, Shield, Sun } from 'lucide-react'
import PageShell from '@/components/PageShell'
import { getPortfolioGears } from '@/lib/db'
import { GEARS_ITEMS, GearItem } from '@/lib/data'

export const metadata = {
  title: 'Gears & Hardware — Nikhil',
  description: 'Tools & devices I use for development, extensions, hardware, and productivity setups.',
}

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  'Computer': Laptop,
  'Monitor': Monitor,
  'Keyboard': Keyboard,
  'Mouse': Mouse,
  'Audio': Headphones,
  'Dock': Laptop,
  'Lighting': Sun,
  'Chair': Shield,
}

export default async function GearsPage() {
  const gears: GearItem[] = (await getPortfolioGears()) || GEARS_ITEMS

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors group font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-zinc-500" />
            <span>Back to home</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="space-y-1 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-zinc-950 dark:text-zinc-100 tracking-tight">
              /gears
            </h1>
            <span className="text-xs font-mono font-semibold text-zinc-600 dark:text-zinc-400">
              Hardware ({gears.length})
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed">
            Tools & devices I use for development, extensions, hardware, and productivity setups.
          </p>
        </div>

        {/* List of all gears */}
        <div className="space-y-3 sm:space-y-4">
          {gears.map((item) => {
            const Icon = CATEGORY_ICON_MAP[item.category] || Tag

            return (
              <a
                key={item.title}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col gap-2.5 p-4 sm:p-5 rounded-xl border border-zinc-300/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-300 shadow-2xs"
              >
                {/* Header row: icon + title + category, arrow at end */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="shrink-0 p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex items-baseline gap-2 flex-wrap">
                      <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight font-mono truncate group-hover:underline underline-offset-4 decoration-zinc-400 dark:decoration-zinc-600">
                        {item.title}
                      </h2>
                      <span className="text-[10px] sm:text-[11px] font-mono font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <ArrowUpRight className="w-4 h-4 shrink-0 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-950 dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </div>

                {/* Subtitle — only if present */}
                {item.subtitle && (
                  <p className="text-xs sm:text-sm font-sans font-medium text-zinc-600 dark:text-zinc-400 pl-8">
                    {item.subtitle}
                  </p>
                )}

                {/* Description — only if present */}
                {item.description && (
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans pl-8">
                    {item.description}
                  </p>
                )}

                {/* Specs Breakdown */}
                {item.specs && item.specs.length > 0 && (
                  <div className="ml-8 divide-y divide-zinc-200/60 dark:divide-zinc-800/60 rounded-lg border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40 overflow-hidden text-xs">
                    {item.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="flex flex-col sm:flex-row sm:items-center justify-between px-3.5 py-2.5 gap-1"
                      >
                        <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                          {spec.label}
                        </span>
                        <span className="font-sans text-xs text-zinc-900 dark:text-zinc-100 font-medium">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pl-8">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300/70 dark:border-zinc-700 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </a>
            )
          })}
        </div>
      </main>
    </PageShell>
  )
}