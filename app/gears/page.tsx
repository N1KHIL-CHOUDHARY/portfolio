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
  ExternalLink,
} from 'lucide-react'
import BlueprintLayout from '@/components/layout/BlueprintLayout'
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
    <BlueprintLayout>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 text-neutral-800 dark:text-neutral-200 font-mono text-sm">
        <Link
          href="/"
          className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center"
        >
          <ArrowLeft className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
        </Link>
        <h1 className="font-semibold text-xl tracking-tight text-neutral-900 dark:text-neutral-50 font-mono">
          <span className="link--elara">Gears</span>
        </h1>
      </div>

      <p className="tracking-tight text-neutral-600 dark:text-neutral-400 max-w-xl text-sm md:text-base mt-2 mb-6 font-mono">
        Hardware, desk accessories, and audio equipment I use daily to build and design.
      </p>

      {/* DASHED DIVIDER */}
      <div className="-mx-6 sm:-mx-8 h-px border-t border-dashed border-neutral-300 dark:border-neutral-800 my-6" />

      {/* Gears List */}
      <div className="space-y-4 my-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold">
            Devices &amp; Accessories
          </h2>
          <span className="text-xs font-mono font-medium text-neutral-500 dark:text-neutral-400">
            {gears.length} items
          </span>
        </div>

        {gears.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-800 space-y-2">
            <Laptop className="w-6 h-6 mx-auto text-neutral-400 dark:text-neutral-600" />
            <h2 className="text-sm font-semibold font-mono text-neutral-900 dark:text-neutral-100">
              No gears published yet
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {gears.map((item) => {
              const Icon = getGearIcon(item.title)
              const isExternal = item.link && item.link !== '#'

              return (
                <a
                  key={item.id || item.title}
                  href={item.link || '#'}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="group flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-300/60 dark:border-neutral-700/60 flex items-center justify-center text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>

                    <span className="text-xs font-mono text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors truncate">
                      {item.title}
                    </span>
                  </div>

                  {isExternal && (
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors shrink-0 ml-2" />
                  )}
                </a>
              )
            })}
          </div>
        )}
      </div>
    </BlueprintLayout>
  )
}