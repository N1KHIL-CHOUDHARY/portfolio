import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Laptop,
  Smartphone,
  Monitor,
  Tv,
  Keyboard,
  Mouse,
  Grid3X3,
  Mic,
  Headphones,
  Lightbulb,
  Lamp,
  Box,
  Link2,
} from 'lucide-react'
import PageShell from '@/components/PageShell'
import { getPortfolioGears } from '@/lib/db'
import { GearItem } from '@/lib/data'

export const metadata = {
  title: 'Gears — Nikhil',
  description: 'My gears and tools I use to get my work done.',
}

function getGearIcon(title: string): React.ElementType {
  const t = title.toLowerCase()

  if (t.includes('macbook') || t.includes('laptop') || t.includes('computer') || t.includes('desktop')) {
    return Laptop
  }
  if (t.includes('samsung') || t.includes('phone') || t.includes('iphone') || t.includes('mobile') || t.includes('s23')) {
    return Smartphone
  }
  if (t.includes('stand') || t.includes('laptop stand')) {
    return Monitor
  }
  if (t.includes('curved') || t.includes('ultra wide') || t.includes('34wr')) {
    return Tv 
  }
  if (t.includes('monitor') || t.includes('screen') || t.includes('display') || t.includes('ultragear')) {
    return Monitor
  }
  if (t.includes('keyboard')) {
    return Keyboard
  }
  if (t.includes('mouse pad') || t.includes('desk mat') || t.includes('pad')) {
    return Grid3X3
  }
  if (t.includes('mouse')) {
    return Mouse
  }
  if (t.includes('mic') || t.includes('microphone') || t.includes('podcast')) {
    return Mic
  }
  if (t.includes('headphone') || t.includes('earphone') || t.includes('audio') || t.includes('roar') || t.includes('airpod')) {
    return Headphones
  }
  if (t.includes('light strip') || t.includes('led') || t.includes('strip') || t.includes('tapo') || t.includes('bulb')) {
    return Lightbulb
  }
  if (t.includes('keylight') || t.includes('digitek') || t.includes('lamp') || t.includes('lighting')) {
    return Lamp
  }

  return Box
}

export default async function GearsPage() {
  const gears: GearItem[] = await getPortfolioGears()

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to home</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-sans">
            Gears
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-sans">
            My gears and tools I use to get my work done.
          </p>
        </div>

        {/* Divider Line */}
        <div className="w-full h-px bg-zinc-200/80 dark:bg-zinc-800/80 my-6 sm:my-8" />

        {/* Devices & Accessories Single List */}
        <div className="space-y-5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-sans">
            Devices &amp; Accessories
          </h2>

          {gears.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <Laptop className="w-8 h-8 mx-auto text-zinc-400 dark:text-zinc-600" />
              <h2 className="text-sm font-semibold font-mono text-zinc-900 dark:text-zinc-100">
                No gears published yet
              </h2>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-3.5">
              {gears.map((item) => {
                const Icon = getGearIcon(item.title)
                const isExternal = item.link && item.link !== '#'

                return (
                  <a
                    key={item.id || item.title}
                    href={item.link || '#'}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="group flex items-center gap-3.5 sm:gap-4 py-1.5 transition-colors"
                  >
                    {/* Rounded Square Icon Box */}
                    <div className="w-10 h-10 rounded-xl bg-zinc-100/90 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/50 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-zinc-100 group-hover:border-zinc-300 dark:group-hover:border-zinc-600 transition-all shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Title & Link Icon */}
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-sm sm:text-[15px] font-normal text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors truncate">
                        {item.title}
                      </span>
                      <Link2 className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors shrink-0" />
                    </div>
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </PageShell>
  )
}