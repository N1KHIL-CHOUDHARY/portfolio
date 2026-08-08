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

// Default Work Experiences
const DEFAULT_WORK_ITEMS: ExperienceTimelineItem[] = [
  {
    id: 'dbs-associate',
    title: 'DBS Bank',
    subtitle: 'Associate',
    date: 'Jul 2025 - Present',
    logoType: 'dbs',
    bullets: [
      'Building Java, Spring Boot, and Activiti services for current and savings account servicing business processes; raised JUnit coverage above 80% and led a team knowledge base project.',
    ],
    subRoles: [
      {
        role: 'Graduate Associate (SEED Programme)',
        date: 'Jul 2023 - Jun 2025',
        bullets: [
          'Built a Python and SQL automation tool to migrate and configure over 1,000 configuration variants of a process-tracking workflow from a vendor platform into an in-house Spring Boot and Activiti application (MariaDB), reducing per-configuration setup from 1-2 hours to under 5 minutes.',
          'Developed backend services in Java, Spring Boot, and Activiti and collaborated across teams on end-to-end delivery.',
        ],
      },
    ],
  },
  {
    id: 'sit-dev',
    title: 'Singapore Institute of Technology',
    subtitle: 'Software Developer (Contract)',
    date: 'Apr 2023 - Jun 2023',
    logoType: 'sit',
    bullets: [
      'Built NFTVue, a NFT gallery website that allows students to connect their crypto wallets to view and verify their school event-issued NFTs',
      'Worked on DemoConstruct, a full-stack web application (React + Python) that uses Meshroom to reconstruct 3D models from captured images',
    ],
    projects: [{ name: 'NFTVue' }],
  },
  {
    id: 'dbs-intern',
    title: 'DBS Bank',
    subtitle: 'Software Developer (Intern)',
    date: 'May 2022 - Dec 2022',
    logoType: 'dbs',
    bullets: [
      'Worked on the backend for the digital exchange and asset custody application using Spring Boot and Java',
      'Built an admin dashboard web application for a DBS Metaverse event using Spring Security and Angular',
    ],
  },
  {
    id: 'activate-intern',
    title: 'Activate Interactive Pte Ltd',
    subtitle: 'Software Developer (Intern)',
    date: 'May 2019 - Aug 2019',
    logoType: 'activate',
    bullets: [
      'Developed RP Connect, the iOS and Android mobile app for Republic Polytechnic using React Native',
    ],
  },
]

// Default Education Experiences
const DEFAULT_EDUCATION_ITEMS: ExperienceTimelineItem[] = [
  {
    id: 'digipen-edu',
    title: 'Digipen Institute of Technology Singapore',
    subtitle: 'BS in Computer Science in Real-Time Interactive Simulation',
    date: 'Sep 2019 - Apr 2023',
    logoType: 'digipen',
    bullets: [
      'Graduated with a Minor in Mathematics',
      'President of Digipen Student Management Committee for freshman year',
      '3-time recipient of the Dean\'s Honor List',
    ],
    projects: [
      { name: 'Final Year Project' },
      { name: '2nd Year Project' },
    ],
  },
  {
    id: 'sp-edu',
    title: 'Singapore Polytechnic',
    subtitle: 'Diploma in Games Design and Development',
    date: 'Apr 2014 - May 2017',
    logoType: 'sp',
    projects: [
      { name: 'Final Year Project' },
    ],
  },
]

export default function ExperienceSection({
  experiences,
  educationExperiences,
}: ExperienceSectionProps) {
  const [activeTab, setActiveTab] = useState<'work' | 'education'>('work')

  // Map dynamic DB experiences or fallback to default dataset
  const workItems: ExperienceTimelineItem[] = experiences && experiences.length > 0
    ? experiences.map((e: any, idx: number) => ({
        id: e.id || `work-${idx}`,
        title: e.company || e.title,
        subtitle: e.role || e.subtitle,
        date: e.dates || e.date,
        logoType: e.logoType || (
          e.company?.toLowerCase().includes('dbs') ? 'dbs' :
          e.company?.toLowerCase().includes('sit') || e.company?.toLowerCase().includes('singapore institute') ? 'sit' :
          e.company?.toLowerCase().includes('activate') ? 'activate' :
          'custom'
        ),
        logoUrl: e.companyLogo || e.logoUrl,
        bullets: e.bullets || e.responsibilities || (e.description ? [e.description] : []),
        subRoles: e.subRoles || [],
        projects: e.projects || [],
      }))
    : DEFAULT_WORK_ITEMS

  // Map dynamic DB education or fallback to default dataset
  const educationItems: ExperienceTimelineItem[] = educationExperiences && educationExperiences.length > 0
    ? educationExperiences.map((e: any, idx: number) => ({
        id: e.id || `edu-${idx}`,
        title: e.institution || e.title,
        subtitle: e.degree || e.subtitle,
        date: e.dates || e.date,
        logoType: e.logoType || (
          e.institution?.toLowerCase().includes('digipen') ? 'digipen' :
          e.institution?.toLowerCase().includes('polytechnic') || e.institution?.toLowerCase().includes('sp') ? 'sp' :
          'custom'
        ),
        logoUrl: e.logoUrl || e.companyLogo,
        bullets: e.bullets || (e.description ? [e.description] : []),
        projects: e.projects || [],
      }))
    : DEFAULT_EDUCATION_ITEMS

  const activeItems = activeTab === 'work' ? workItems : educationItems

  return (
    <section className="space-y-4 py-2">
      {/* Segmented Tab Control Header — sliding pill indicator */}
      <div className="relative w-full rounded-xl bg-zinc-200/70 dark:bg-zinc-900/90 border border-zinc-300/80 dark:border-zinc-800/90 p-1 flex items-center shadow-inner">
        {(['work', 'education'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`relative flex-1 py-2 px-4 rounded-lg text-xs sm:text-sm font-semibold text-center select-none transition-colors duration-200 ${
              activeTab === tab
                ? 'text-zinc-900 dark:text-white'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            {activeTab === tab && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-lg bg-white dark:bg-zinc-800 shadow-sm"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">{tab === 'work' ? 'Work' : 'Education'}</span>
          </button>
        ))}
      </div>

      {/* Main Outer Timeline Card */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-[#100f0f] p-5 sm:p-7 relative overflow-hidden shadow-xs">
        {/* Continuous Left Vertical Timeline Line — precisely centered on avatar nodes, fades at both ends */}
        <div
          className="absolute left-[40px] sm:left-[52px] top-[40px] sm:top-[52px] bottom-[40px] sm:bottom-[52px] w-px bg-gradient-to-b from-transparent via-zinc-300 dark:via-zinc-800 to-transparent"
        />

        {/* Timeline Entries List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-10 relative"
          >
            {activeItems.map((item, idx) => {
              const initials = getInitials(item.title)
              const isCurrent = item.date?.toLowerCase().includes('present')

              return (
                <div
                  key={item.id || idx}
                  className="group flex items-start gap-4 sm:gap-5 relative rounded-xl -m-2 p-2 transition-colors duration-200 hover:bg-white/60 dark:hover:bg-zinc-900/40"
                >
                  {/* Logo Avatar Node — ring matches card bg so the line tucks cleanly behind it */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-900 flex items-center justify-center shrink-0 z-10 shadow-xs relative ring-4 ring-zinc-50/50 dark:ring-[#100f0f]">
                    {item.logoUrl ? (
                      <Image
                        src={item.logoUrl}
                        alt={item.title}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-xs sm:text-sm font-bold font-mono text-zinc-700 dark:text-zinc-200 select-none">
                        {initials}
                      </span>
                    )}
                    {isCurrent && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-zinc-50 dark:bg-[#100f0f] flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-white animate-pulse" />
                      </span>
                    )}
                  </div>

                  {/* Metadata Block */}
                  <div className="flex-1 min-w-0 pt-0.5 space-y-1.5">
                    {/* Header Row: Title & Date */}
                    <div className="flex items-baseline justify-between gap-3 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                        {item.title}
                      </h3>
                      {item.date && (
                        <span
                          className={`text-xs sm:text-sm ml-auto shrink-0 font-normal ${
                            isCurrent
                              ? 'text-zinc-900 dark:text-zinc-100 font-medium'
                              : 'text-zinc-500 dark:text-zinc-400'
                          }`}
                        >
                          {item.date}
                        </span>
                      )}
                    </div>

                    {/* Subtitle / Role */}
                    {item.subtitle && (
                      <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                        {item.subtitle}
                      </p>
                    )}

                    {/* Main Bullet Points */}
                    {item.bullets && item.bullets.length > 0 && (
                      <ul className="mt-2 space-y-1.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
                        {item.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-zinc-400 dark:text-zinc-500 select-none mt-0.5">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Nested Sub-roles — indented mini-timeline so it reads as a sub-track, not a new block */}
                    {item.subRoles && item.subRoles.length > 0 && (
                      <div className="mt-3 pl-4 border-l border-zinc-200 dark:border-zinc-800 space-y-4">
                        {item.subRoles.map((sub, sIdx) => (
                          <div key={sIdx} className="relative space-y-1.5">
                            <span className="absolute -left-[18px] top-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                            <div className="flex items-baseline justify-between gap-3 flex-wrap">
                              <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-300 font-medium">
                                {sub.role}
                              </p>
                              <span className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 ml-auto shrink-0 font-normal">
                                {sub.date}
                              </span>
                            </div>
                            {sub.bullets && sub.bullets.length > 0 && (
                              <ul className="mt-1.5 space-y-1.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
                                {sub.bullets.map((bullet, bIdx) => (
                                  <li key={bIdx} className="flex items-start gap-2 leading-relaxed">
                                    <span className="text-zinc-400 dark:text-zinc-500 select-none mt-0.5">•</span>
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
                              <Globe className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                              <span>{proj.name}</span>
                            </>
                          )

                          return proj.url ? (
                            <a
                              key={pIdx}
                              href={proj.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 shadow-2xs hover:scale-[1.02] hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer select-none"
                            >
                              {badgeContent}
                            </a>
                          ) : (
                            <span
                              key={pIdx}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 shadow-2xs select-none"
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
    </section>
  )
}