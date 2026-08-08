import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CertificationsSection from '@/components/CertificationsSection'
import PageShell from '@/components/PageShell'
import { getPortfolioCertifications } from '@/lib/db'

export const metadata = {
  title: 'Certifications — Nikhil',
  description: 'Verified professional cloud and web development certifications.',
}

export default async function CertificationsPage() {
  const certifications = await getPortfolioCertifications()

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to home</span>
          </Link>
        </div>

        <div className="space-y-1 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-4">
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 tracking-tight">
            /certifications
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-sans">
            Verified industry certifications, cloud credentials, and technical accreditations.
          </p>
        </div>

        <CertificationsSection certifications={certifications || undefined} />
      </main>
    </PageShell>
  )
}
