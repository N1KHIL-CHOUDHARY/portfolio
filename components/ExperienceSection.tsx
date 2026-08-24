'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe } from 'lucide-react'

export interface ExperienceSubRole {
  role: string
  date: string
  bullets: string[]
}

export interface ExperienceTimelineItem {
  id: string
  title: string
  subtitle?: string
  date?: string
  logoType?: 'dbs' | 'sit' | 'activate' | 'digipen' | 'sp' | 'custom'
  logoUrl?: string
  bullets?: string[]
  subRoles?: ExperienceSubRole[]
  projects?: Array<{ name: string; url?: string }>
}

interface ExperienceSectionProps {
  experiences?: any[]
  educationExperiences?: any[]
  isFullPage?: boolean
}

// Helper to derive 1-2 letter initials if logoUrl is not present
function getInitials(name: string): string {
  if (!name) return '?'
  const words = name.trim().split(/\s+/)
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase()
  }
  return (words[0][0] + words[1][0]).toUpperCase()
}

function ExperienceLogoAvatar({
  logoUrl,
  title,
  initials,
}: {
  logoUrl?: string
  title: string
  initials: string
}) {
  const [hasError, setHasError] = useState(false)

  if (!logoUrl || hasError) {
    return (
      <span className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300 select-none">
        {initials}
      </span>
    )
  }

  return (
    <Image
      src={logoUrl}
      alt={title}
      width={48}
      height={48}
      sizes="40px"
      className="object-contain w-full h-full p-1 grayscale group-hover:grayscale-0 transition-all duration-300"
      onError={() => setHasError(true)}
    />
  )
}

export default function ExperienceSection({
  experiences,
  educationExperiences,
}: ExperienceSectionProps) {
  const [activeTab, setActiveTab] = useState<'work' | 'education'>('work')

  // Map dynamic DB experiences
  const workItems: ExperienceTimelineItem[] = (experiences || []).map((e: any, idx: number) => ({
    id: e.id || `work-${idx}`,
    title: e.company || e.title,
    subtitle: e.role || e.subtitle,
    date: e.dates || e.date,
    logoType: e.logoType || 'custom',
    logoUrl: e.companyLogo || e.logoUrl,
    bullets: e.bullets || e.responsibilities || (e.description ? [e.description] : []),
    subRoles: e.subRoles || [],
    projects: e.projects || [],
  }))

  // Map dynamic DB education
  const educationItems: ExperienceTimelineItem[] = (educationExperiences || []).map((e: any, idx: number) => ({
    id: e.id || `edu-${idx}`,
    title: e.institution || e.title,
    subtitle: e.degree || e.subtitle,
    date: e.dates || e.date,
    logoType: e.logoType || 'custom',
    logoUrl: e.logoUrl || e.companyLogo,
    bullets: e.bullets || (e.description ? [e.description] : []),
    projects: e.projects || [],
  }))

  const activeItems = activeTab === 'work' ? workItems : educationItems

  return (
    <div className="space-y-6 my-6">
      {/* Blueprint Tab Toggle */}
      <div className="inline-flex items-center gap-1 p-1 rounded-md border border-neutral-300 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 font-mono text-xs">
        {(['work', 'education'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`relative px-3 py-1.5 rounded transition-colors duration-150 select-none ${
              activeTab === tab
                ? 'text-neutral-900 dark:text-neutral-50 font-medium'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            {activeTab === tab && (
              <motion.span
                layoutId="blueprint-tab-pill"
                className="absolute inset-0 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-2xs"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5 capitalize">
              <span className="opacity-40">&gt;</span>
              {tab === 'work' ? 'Work' : 'Education'}
            </span>
          </button>
        ))}
      </div>

      {/* Main Outer Timeline Card */}
      <div className="relative border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 sm:p-6 bg-neutral-50/50 dark:bg-neutral-900/30 overflow-hidden">
        {/* Dashed Vertical Timeline Line */}
        <div className="absolute left-[34px] sm:left-[38px] top-6 bottom-6 w-px border-r border-dashed border-neutral-300 dark:border-neutral-800" />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="space-y-8 relative"
          >
            {activeItems.map((item, idx) => {
              const initials = getInitials(item.title)
              const isCurrent = item.date?.toLowerCase().includes('present')

              return (
                <div key={item.id || idx} className="group relative flex items-start gap-4 sm:gap-5">
                  {/* Square Monospace Logo Avatar Node */}
                  <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center shrink-0 z-10 ring-4 ring-neutral-50/50 dark:ring-[#0a0a0a]">
                    <ExperienceLogoAvatar
                      logoUrl={item.logoUrl}
                      title={item.title}
                      initials={initials}
                    />
                    {isCurrent && (
                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                      </span>
                    )}
                  </div>

                  {/* Metadata Block */}
                  <div className="flex-1 min-w-0 pt-0.5 space-y-1.5 font-mono">
                    {/* Header Row: Title & Date */}
                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
                        {item.title}
                      </h3>
                      {item.date && (
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 ml-auto shrink-0">
                          [{item.date}]
                        </span>
                      )}
                    </div>

                    {/* Subtitle / Role */}
                    {item.subtitle && (
                      <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                        {item.subtitle}
                      </p>
                    )}

                    {/* Main Bullet Points */}
                    {item.bullets && item.bullets.length > 0 && (
                      <ul className="mt-2 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                        {item.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-neutral-400 dark:text-neutral-600 select-none mt-0.5">&gt;</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Nested Sub-roles */}
                    {item.subRoles && item.subRoles.length > 0 && (
                      <div className="mt-3 pl-3 border-l border-dashed border-neutral-300 dark:border-neutral-800 space-y-3">
                        {item.subRoles.map((sub, sIdx) => (
                          <div key={sIdx} className="relative space-y-1">
                            <div className="flex items-baseline justify-between gap-2 flex-wrap">
                              <p className="text-xs font-medium text-neutral-800 dark:text-neutral-300">
                                {sub.role}
                              </p>
                              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 ml-auto shrink-0">
                                [{sub.date}]
                              </span>
                            </div>
                            {sub.bullets && sub.bullets.length > 0 && (
                              <ul className="mt-1 space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                                {sub.bullets.map((bullet, bIdx) => (
                                  <li key={bIdx} className="flex items-start gap-2 leading-relaxed">
                                    <span className="text-neutral-400 dark:text-neutral-600 select-none">&gt;</span>
                                    <span>{bullet}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Project Badges */}
                    {item.projects && item.projects.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap pt-2">
                        {item.projects.map((proj, pIdx) => {
                          const badgeContent = (
                            <>
                              <Globe className="w-3 h-3 text-neutral-500" />
                              <span>{proj.name}</span>
                            </>
                          )

                          return proj.url ? (
                            <a
                              key={pIdx}
                              href={proj.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300/80 dark:border-neutral-700/80 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
                            >
                              {badgeContent}
                            </a>
                          ) : (
                            <span
                              key={pIdx}
                              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300/80 dark:border-neutral-700/80"
                            >
                              {badgeContent}
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}