'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import TechStackBadges from './TechStackBadges'

export interface ExperienceItem {
  company: string
  role: string
  dates: string
  location: string
  employmentType?: string
  isCurrent?: boolean
  description?: string
  responsibilities?: string[]
  technologies?: string[]
  companyLogo?: string
}

const FORMAT_TYPE: Record<string, string> = {
  FULL_TIME: 'Full-Time',
  PART_TIME: 'Part-Time',
  CONTRACT: 'Contract',
  FREELANCE: 'Freelance',
  INTERNSHIP: 'Internship',
}

interface ExperienceSectionProps {
  experiences?: ExperienceItem[]
  isFullPage?: boolean
}

export default function ExperienceSection({ experiences, isFullPage = false }: ExperienceSectionProps) {
  const [showAll, setShowAll] = useState(isFullPage)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  if (!experiences || experiences.length === 0) {
    return null
  }

  const displayedExperiences = showAll ? experiences : experiences.slice(0, 3)

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx)
  }

  return (
    <section className="space-y-3.5 py-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-mono">
          Experience
        </h2>
        <span className="text-xs font-mono font-semibold text-zinc-600 dark:text-zinc-400">
          {experiences.length} roles
        </span>
      </div>

      {/* Experience List */}
      <div className="space-y-3">
        {displayedExperiences.map((item, idx) => {
          const isExpanded = expandedIndex === idx
          const typeBadge = item.employmentType ? (FORMAT_TYPE[item.employmentType] || item.employmentType) : null
          const hasDetails = Boolean(
            item.description ||
            (item.responsibilities && item.responsibilities.length > 0) ||
            (item.technologies && item.technologies.length > 0)
          )

          return (
            <motion.div
              key={item.company + item.role}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => toggleExpand(idx)}
              className={`group relative p-4 sm:p-4.5 rounded-xl border transition-all duration-300 ease-out cursor-pointer select-none ${
                isExpanded
                  ? 'border-zinc-400 dark:border-zinc-600 bg-white dark:bg-zinc-800/40 shadow-md'
                    : 'border-zinc-400 dark:border-zinc-600 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 shadow-2xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight group-hover:text-zinc-950 dark:group-hover:text-white transition-colors font-mono">
                      {item.company}
                    </h3>

                    {typeBadge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-300/70 dark:border-zinc-700/50">
                        {typeBadge}
                      </span>
                    )}

                    {item.isCurrent && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Working
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 tracking-tight">
                    {item.role}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-mono shrink-0 pt-1 sm:pt-0">
                  <div className="sm:text-right">
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">{item.dates}</p>
                    <p className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">{item.location}</p>
                  </div>

                  {hasDetails && (
                    <div className="p-1 rounded-md text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded Drawer: Overview, Responsibilities, Technologies */}
              <AnimatePresence>
                {isExpanded && hasDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3.5 mt-3.5 border-t border-zinc-200 dark:border-zinc-800 space-y-3 text-xs">
                      {/* Overview / Description */}
                      {item.description && (
                        <div className="space-y-1">
                          <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans font-medium">
                            {item.description}
                          </p>
                        </div>
                      )}

                      {/* Responsibilities */}
                      {item.responsibilities && item.responsibilities.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-bold">
                            Key Responsibilities & Highlights
                          </p>
                          <ul className="space-y-1.5 pl-1">
                            {item.responsibilities.map((resp, rIdx) => (
                              <li key={rIdx} className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Technologies */}
                      {item.technologies && item.technologies.length > 0 && (
                        <div className="space-y-1.5 pt-1" onClick={(e) => e.stopPropagation()}>
                          <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-bold">
                            Tech Stack & Tools
                          </p>
                          <TechStackBadges
                            skills={item.technologies.map((t) => ({ name: t }))}
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {experiences.length > 3 && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono border border-zinc-300/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors shadow-2xs font-medium"
          >
            <span>{showAll ? 'Show less' : 'Show all work experiences'}</span>
            {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
    </section>
  )
}
