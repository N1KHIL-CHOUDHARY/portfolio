'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Award, ArrowUpRight } from 'lucide-react'

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
    return (
      <p className="text-sm font-mono text-neutral-500 dark:text-neutral-400 py-8">
        No certifications found.
      </p>
    )
  }

  return (
    <section className="space-y-4 my-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold">
          Certifications &amp; Achievements
        </h2>
        <span className="text-xs font-mono font-medium text-neutral-500 dark:text-neutral-400">
          {certifications.length} verified
        </span>
      </div>

      {/* Certifications List */}
      <div className="grid grid-cols-1 gap-4">
        {certifications.map((cert, idx) => (
          <motion.div
            key={cert.title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="group relative p-4 sm:p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300/60 dark:border-neutral-700/60">
                    <Award className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 tracking-tight font-mono">
                    {cert.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm font-mono text-neutral-600 dark:text-neutral-400 pt-0.5">
                  {cert.issuer}
                </p>

                <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 pt-0.5">
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
                    className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors inline-flex items-center justify-center"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Skill Tags */}
            {cert.skills && cert.skills.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-3.5 pt-3 border-t border-dashed border-neutral-200 dark:border-neutral-800">
                {cert.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border border-neutral-300/70 dark:border-neutral-700/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
