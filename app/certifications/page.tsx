import React from 'react'
import Link from 'next/link'
import BlueprintLayout from '@/components/layout/BlueprintLayout'
import CertificationsSection from '@/components/sections/CertificationsSection'
import { getPortfolioCertifications } from '@/lib/db'

export const metadata = {
  title: 'Certifications — Nikhil',
  description: 'Verified professional cloud and web development certifications.',
}

export default async function CertificationsPage() {
  const certifications = await getPortfolioCertifications()

  return (
    <BlueprintLayout>
      <div className="flex items-center gap-2 mb-2 text-neutral-800 dark:text-neutral-200 font-mono text-sm">
        <Link className="hover:underline flex items-center gap-1" href="/">
          <span>&larr;</span>
        </Link>
        <h1 className="font-semibold text-xl tracking-tight text-neutral-900 dark:text-neutral-50 font-mono">
          <span className="link--elara">Certifications</span>
        </h1>
      </div>

      <p className="tracking-tight text-neutral-600 dark:text-neutral-400 max-w-xl text-sm md:text-base mt-2 mb-6 font-mono">
        Verified industry certifications, cloud credentials, and technical accreditations.
      </p>

      {/* DASHED DIVIDER */}
      <div className="-mx-6 sm:-mx-8 h-px border-t border-dashed border-neutral-300 dark:border-neutral-800 my-6" />

      <CertificationsSection certifications={certifications || undefined} />
    </BlueprintLayout>
  )
}
