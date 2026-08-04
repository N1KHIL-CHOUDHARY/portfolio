import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ExperienceSection from '@/components/ExperienceSection'
import PageShell from '@/components/PageShell'
import { getPortfolioExperiences } from '@/lib/db'

export const metadata = {
  title: 'Experience — Nikhil',
  description: 'Detailed work experience and roles history.',
}

export default async function ExperiencePage() {
  const experiences = await getPortfolioExperiences()

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors group font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-zinc-500" />
            <span>Back to home</span>
          </Link>
        </div>

        <div className="space-y-1 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-zinc-950 dark:text-zinc-100 tracking-tight">
            /experience
          </h1>
          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-sans">
            Detailed timeline of my professional roles, engineering contributions, and software experience.
          </p>
        </div>

        <ExperienceSection experiences={experiences || undefined} isFullPage={true} />
      </main>
    </PageShell>
  )
}
