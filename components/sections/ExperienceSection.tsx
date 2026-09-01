'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export interface ExperienceTimelineItem {
  id: string
  title: string
  subtitle?: string
  date?: string
  logoUrl?: string
}

interface ExperienceSectionProps {
  experiences?: any[]
  educationExperiences?: any[]
  isFullPage?: boolean
}

function getInitials(name: string): string {
  if (!name) return '?'
  const words = name.trim().split(/\s+/)
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase()
  }
  return (words[0][0] + words[1][0]).toUpperCase()
}

function LogoAvatar({ logoUrl, title, initials }: { logoUrl?: string; title: string; initials: string }) {
  const [hasError, setHasError] = useState(false)

  if (!logoUrl || hasError) {
    return (
      <span className="text-[11px] font-mono font-bold text-neutral-600 dark:text-neutral-400 select-none">
        {initials}
      </span>
    )
  }

  return (
    <Image
      src={logoUrl}
      alt={title}
      width={40}
      height={40}
      sizes="40px"
      className="object-cover w-full h-full rounded-full"
      onError={() => setHasError(true)}
    />
  )
}

export default function ExperienceSection({ experiences, educationExperiences }: ExperienceSectionProps) {
  const workItems: ExperienceTimelineItem[] = (experiences || []).map((e: any, idx: number) => ({
    id: e.id || `work-${idx}`,
    title: e.company || e.title,
    subtitle: e.role || e.subtitle,
    date: e.dates || e.date,
    logoUrl: e.companyLogo || e.logoUrl,
  }))

  const educationItems: ExperienceTimelineItem[] = (educationExperiences || []).map((e: any, idx: number) => ({
    id: e.id || `edu-${idx}`,
    title: e.institution || e.title,
    subtitle: e.degree || e.subtitle,
    date: e.dates || e.date,
    logoUrl: e.logoUrl || e.companyLogo,
  }))

  const allItems = [...workItems, ...educationItems]

  return (
    <div className="space-y-0 divide-y divide-neutral-100 dark:divide-neutral-800/60">
      {allItems.map((item, idx) => {
        const initials = getInitials(item.title)

        return (
          <motion.div
            key={item.id || idx}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.04 }}
            className="flex items-center justify-between gap-3 py-3.5 sm:py-4"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Circular Logo */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                <LogoAvatar logoUrl={item.logoUrl} title={item.title} initials={initials} />
              </div>

              <div className="flex items-baseline justify-between gap-4 min-w-0 flex-1">
                <div>
                  <h3 className="text-[14px] font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-[12px] sm:text-[13px] text-neutral-500 dark:text-neutral-400 font-normal mt-0.5">
                      {item.subtitle}
                    </p>
                  )}
                </div>

                {item.date && (
                  <span className="text-[11px] sm:text-[12px] font-normal text-neutral-400 dark:text-neutral-500 shrink-0">
                    {item.date}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}