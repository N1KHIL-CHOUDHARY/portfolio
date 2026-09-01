'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export interface PersonalSectionProps {
  gearsTitle?: string
  gearsSubtitle?: string
  gearsTags?: string[]
  devTitle?: string
  devSubtitle?: string
  devTags?: string[]
}

const items = [
  {
    href: '/gears',
    title: 'Gears & Hardware',
    subtitle: 'Tools & devices I use for development, extensions, hardware, and productivity setups.',
    ariaLabel: 'View all workstation gears and hardware',
  },
  {
    href: '/development',
    title: 'Development Setup',
    subtitle: 'Find out more about the tools and technologies I use for development, extensions, hardware, and productivity setups.',
    ariaLabel: 'View full development setup and workflow guide',
  },
]

export default function PersonalSection({
  gearsTitle = 'Gears & Hardware',
  gearsSubtitle = 'Find out more about the tools and technologies I use for development, extensions, hardware, and productivity setups.',
  devTitle = 'Development Setup',
  devSubtitle = 'Find out more about the tools and technologies I use for development, extensions, hardware, and productivity setups.',
}: PersonalSectionProps) {
  const resolved = [
    { href: '/gears', title: gearsTitle, subtitle: gearsSubtitle, ariaLabel: 'View all workstation gears and hardware' },
    { href: '/development', title: devTitle, subtitle: devSubtitle, ariaLabel: 'View full development setup and workflow guide' },
  ]

  return (
    <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
      {resolved.map((item, idx) => (
        <motion.div
          key={item.href}
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: idx * 0.06 }}
        >
          <Link
            href={item.href}
            aria-label={item.ariaLabel}
            className="group flex items-start justify-between gap-4 py-3 sm:py-3.5"
          >
            <div className="space-y-0.5">
              <p className="text-[14px] font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-950 dark:group-hover:text-neutral-50 transition-colors tracking-tight leading-snug">
                {item.title}
              </p>
              <p className="text-[13px] text-neutral-600 dark:text-neutral-400 font-normal leading-[1.5]">
                {item.subtitle}
              </p>
            </div>
            <motion.span
              className="text-neutral-400 dark:text-neutral-500 text-sm mt-0.5 shrink-0"
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
