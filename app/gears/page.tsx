import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Laptop, Monitor, Keyboard, Mouse, Package } from 'lucide-react'
import BlueprintLayout from '@/components/layout/BlueprintLayout'
import { getPortfolioGears } from '@/lib/db'
import { GearItem } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Gears & Hardware',
  description: 'Workstation hardware, developer devices, accessories, and productivity setup used by Nikhil Choudhary.',
  alternates: {
    canonical: '/gears',
  },
}

function getGearMeta(title: string) {
  const t = title.toLowerCase()
  if (t.includes('thinkpad') || t.includes('macbook') || t.includes('laptop')) {
    return { tag: 'Laptop', icon: Laptop }
  }
  if (t.includes('monitor') || t.includes('display') || t.includes('mag') || t.includes('msi')) {
    return { tag: 'Display', icon: Monitor }
  }
  if (t.includes('keyboard') || t.includes('fox') || t.includes('ronin') || t.includes('switch')) {
    return { tag: 'Keyboard', icon: Keyboard }
  }
  if (t.includes('mouse') || t.includes('deathadder') || t.includes('razer')) {
    return { tag: 'Mouse', icon: Mouse }
  }
  return { tag: 'Gear', icon: Package }
}

export default async function GearsPage() {
  const gears: GearItem[] = await getPortfolioGears()

  return (
    <BlueprintLayout>
      <main className="w-full max-w-[720px] mx-auto py-8 sm:py-12 select-none">
        
        {/* ── Header & Navigation ── */}
        <div className="space-y-4 mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>cd .. / home</span>
          </Link>

          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Gears &amp; Setup
            </h1>
            <p className="mt-1.5 text-sm sm:text-[15px] text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed">
              Hardware, desk accessories, and equipment I use daily to build and ship software.
            </p>
          </div>
        </div>

        {/* ── Section Header ── */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-neutral-200/70 dark:border-neutral-800/70 font-mono text-xs">
          <span className="uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
            <span className="text-neutral-400 dark:text-neutral-600">#</span>
            devices &amp; accessories
          </span>
          <span className="text-neutral-400 dark:text-neutral-500">
            {gears.length} {gears.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* ── Empty State ── */}
        {gears.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 space-y-2 mt-4">
            <p className="text-sm font-mono text-neutral-500 dark:text-neutral-400">
              No gears published yet
            </p>
          </div>
        ) : (
          /* ── Gears List ── */
          <div className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60">
            {gears.map((item) => {
              const isExternal = Boolean(item.link && item.link !== '#')
              const { tag, icon: Icon } = getGearMeta(item.title)

              const content = (
                <>
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-center shrink-0 text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </span>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 min-w-0">
                      <span className="text-[14px] sm:text-[15px] font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors truncate">
                        {item.title}
                      </span>
                      <span className="inline-flex self-start sm:self-auto text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800/80 text-neutral-500 dark:text-neutral-400 border border-neutral-200/60 dark:border-neutral-800/60">
                        {tag}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pl-2">
                    {isExternal ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 transition-colors">
                        <span className="hidden sm:inline">View</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    ) : (
                      <span className="font-mono text-[11px] text-neutral-400/60 dark:text-neutral-600">
                        Daily
                      </span>
                    )}
                  </div>
                </>
              )

              if (isExternal) {
                return (
                  <a
                    key={item.id || item.title}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between py-3 px-2.5 -mx-2.5 rounded-xl transition-all hover:bg-neutral-50/80 dark:hover:bg-neutral-900/50 cursor-pointer"
                  >
                    {content}
                  </a>
                )
              }

              return (
                <div
                  key={item.id || item.title}
                  className="group flex items-center justify-between py-3 px-2.5 -mx-2.5 rounded-xl transition-all hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30"
                >
                  {content}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </BlueprintLayout>
  )
}