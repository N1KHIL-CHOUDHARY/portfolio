'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Award, ArrowRight, CheckCircle2 } from 'lucide-react'

interface CertificationBadge {
  name: string
  issuer: string
  id: string
}

const BADGES: CertificationBadge[] = [
  {
    name: 'AWS Solutions Architect',
    issuer: 'AWS',
    id: 'AWS-84920194',
  },
  {
    name: 'Meta Front-End Developer',
    issuer: 'Meta',
    id: 'META-928104',
  },
  {
    name: 'GCP Associate Cloud Engineer',
    issuer: 'GCP',
    id: 'GCP-771920',
  },
]

export default function CertificationsPreview() {
  return (
    <section id="certifications" className="space-y-3.5 py-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
          Certifications
        </h2>
        <Link
          href="/certifications"
          className="inline-flex items-center gap-1 text-xs font-mono text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group"
        >
          <span>View certifications</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Single-line high-density summary badge grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {BADGES.map((cert, idx) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
            className="group flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/50 transition-all duration-200 ease-out"
          >
            <div className="p-1 rounded-md bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 shrink-0">
              <Award className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate tracking-tight">
                {cert.name}
              </p>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                  {cert.issuer}
                </span>
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
