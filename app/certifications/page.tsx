import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import BlueprintLayout from '@/components/layout/BlueprintLayout'
import CertificationsSection from '@/components/sections/CertificationsSection'
import { getPortfolioCertifications } from '@/lib/db'
import { SITE_NAME, SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Certifications',
  description: 'Verified industry certifications, cloud credentials, and technical accreditations earned by Nikhil Choudhary.',
  alternates: {
    canonical: '/certifications',
  },
  openGraph: {
    title: `Certifications | ${SITE_NAME}`,
    description: 'Verified industry certifications, cloud credentials, and technical accreditations earned by Nikhil Choudhary.',
    url: `${SITE_URL}/certifications`,
    type: 'website',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} Certifications`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Certifications | ${SITE_NAME}`,
    description: 'Verified industry certifications, cloud credentials, and technical accreditations earned by Nikhil Choudhary.',
    images: ['/banner.png'],
  },
}

export default async function CertificationsPage() {
  const certifications = await getPortfolioCertifications()

  return (
    <BlueprintLayout>
      <div className="flex items-center gap-2 mb-2 text-neutral-800 dark:text-neutral-200 font-mono text-sm">
        <Link
          href="/"
          className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center"
        >
          <ArrowLeft className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
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
