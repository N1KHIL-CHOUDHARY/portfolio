import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Wrench, Laptop, Monitor, Keyboard, Mouse, Headphones, Shield, Sun, CheckCircle2 } from 'lucide-react'
import PageShell from '@/components/PageShell'
import { getPortfolioGears } from '@/lib/db'
import { GEARS_ITEMS, GearItem } from '@/lib/data'

export const metadata = {
  title: 'Gears & Hardware — Nikhil',
  description: 'Physical workstation hardware, mechanical keyboards, 4K monitors, and ergonomic developer accessories.',
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
            Physical workstation setup, high-resolution displays, mechanical keyboards, and ergonomic peripherals.
          </p>
        </div>

        {/* List of all gears */}
        <div className="space-y-4">
          {gears.map((item) => {
            const Icon = CATEGORY_ICON_MAP[item.category] || Wrench

            return (
              <div
                key={item.title}
                className="group relative p-5 sm:p-6 rounded-xl border border-zinc-300/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-300 shadow-2xs"
              >
                <div className="space-y-4">
                  {/* Top Bar: Category badge & Direct link */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-mono font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>

                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border border-zinc-300/80 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 transition-all shadow-2xs"
                    >
                      <span>Product link</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white" />
                    </a>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-1">
                    <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight font-mono">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline underline-offset-4 decoration-zinc-400 dark:decoration-zinc-600"
                      >
                        {item.title}
                      </a>
                    </h2>
                    <p className="text-xs sm:text-sm font-sans font-medium text-zinc-600 dark:text-zinc-400">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans pt-0.5">
                      {item.description}
                    </p>
                  )}

                  {/* Specs Breakdown */}
                  {item.specs && item.specs.length > 0 && (
                    <div className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 rounded-lg border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40 overflow-hidden text-xs">
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
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
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
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </PageShell>
  )
}
