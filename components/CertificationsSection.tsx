'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Award, ArrowUpRight, CheckCircle2 } from 'lucide-react'

export interface Certification {
  title: string
  issuer: string
  issueDate: string
  credentialId?: string
  verifyUrl?: string
  skills: string[]
}

interface CertificationsSectionProps {
  certifications?: Certification[]
}

export default function CertificationsSection({ certifications }: CertificationsSectionProps) {
  if (!certifications || certifications.length === 0) {
    return null
  }

  return (
    <section className="space-y-3.5 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-mono">
            Certifications & Achievements
          </h2>
        </div>
        <span className="text-xs font-mono font-semibold text-zinc-600 dark:text-zinc-400">
          {certifications.length} verified
        </span>
      </div>

      {/* Certifications List */}
      <div className="grid grid-cols-1 gap-3.5">
        {certifications.map((cert, idx) => (
          <motion.div
            key={cert.title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="group relative p-4 sm:p-5 rounded-xl border border-zinc-300/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-300 ease-out shadow-2xs"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                    <Award className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                    {cert.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 tracking-tight pt-0.5">
                  {cert.issuer}
                </p>

                <p className="text-[11px] sm:text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400 pt-0.5">
                  {cert.issueDate} {cert.credentialId && `· ID: ${cert.credentialId}`}
                </p>
              </div>

              {cert.verifyUrl && (
                <div className="shrink-0 pt-0.5">
                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Verify ${cert.title}`}
                    className="p-1.5 rounded-lg text-zinc-500 group-hover:text-zinc-950 dark:group-hover:text-zinc-100 group-hover:bg-zinc-200/80 dark:group-hover:bg-zinc-700/60 transition-all duration-200 inline-flex items-center justify-center"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Skill Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-3.5 pt-3 border-t border-zinc-200 dark:border-zinc-800">
              {cert.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-mono font-medium bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-300/70 dark:border-zinc-700/50"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
