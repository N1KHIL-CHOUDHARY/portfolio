'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface EducationItem {
  id: string
  title: string
  subtitle?: string
  date?: string
  logoUrl?: string
  bullets?: string[]
}

interface EducationSectionProps {
  educations?: any[]
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

export default function EducationSection({ educations }: EducationSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const items: EducationItem[] = (educations || []).map((e: any, idx: number) => ({
    id: e.id || `edu-${idx}`,
    title: e.institution || e.title,
    subtitle: e.degree || e.subtitle,
    date: e.dates || e.date,
    logoUrl: e.logoUrl || e.logo || e.schoolLogo || e.institutionLogo,
    bullets: e.bullets || (e.description ? [e.description] : []),
  }))

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id))

  return (
    <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
      {items.map((item, idx) => {
        const isOpen = expandedId === item.id
        const hasDetails = (item.subtitle || (item.bullets && item.bullets.length > 0))
        const initials = getInitials(item.title)

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.04 }}
          >
            <button
              type="button"
              onClick={() => hasDetails && toggle(item.id)}
              className={`w-full flex items-center justify-between gap-3 py-3.5 sm:py-4 text-left transition-colors group ${hasDetails ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Circular Logo */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                  <LogoAvatar logoUrl={item.logoUrl} title={item.title} initials={initials} />
                </div>

                <div className="flex items-baseline justify-between gap-4 min-w-0 flex-1">
                  <div>
                    <span className="text-[14px] font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-950 dark:group-hover:text-neutral-50 transition-colors">
                      {item.title}
                    </span>
                    {item.subtitle && !isOpen && (
                      <p className="text-[12px] sm:text-[13px] text-neutral-500 dark:text-neutral-400 font-normal mt-0.5">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                  <span className="text-[11px] sm:text-[12px] font-normal text-neutral-400 dark:text-neutral-500 shrink-0">
                    {item.date}
                  </span>
                </div>
              </div>

              {hasDetails && (
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-neutral-400 dark:text-neutral-600 shrink-0 ml-2"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </motion.span>
              )}
            </button>

            <AnimatePresence initial={false}>
              {isOpen && hasDetails && (
                <motion.div
                  key="edu-content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="pl-12 sm:pl-13 pt-0 pb-3 space-y-1.5">
                    {item.subtitle && (
                      <p className="text-[12px] sm:text-[13px] text-neutral-500 dark:text-neutral-400 font-normal">
                        {item.subtitle}
                      </p>
                    )}
                    {item.bullets && item.bullets.length > 0 && (
                      <ul className="space-y-1">
                        {item.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2 text-[13px] text-neutral-600 dark:text-neutral-400 font-normal leading-[1.5]">
                            <span className="text-neutral-400 dark:text-neutral-600 select-none mt-0.5">·</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
