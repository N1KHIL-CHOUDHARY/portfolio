import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Terminal } from 'lucide-react'
import BlueprintLayout from '@/components/layout/BlueprintLayout'
import { getPortfolioDevelopment } from '@/lib/db'
import { DevelopmentData } from '@/lib/data'
import { SITE_NAME, SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Development Setup',
  description: 'IDE configuration, GPU-accelerated terminal, Unix environment, editor fonts, and daily engineering tools used by Nikhil Choudhary.',
  alternates: {
    canonical: '/development',
  },
  openGraph: {
    title: `Development Setup | ${SITE_NAME}`,
    description: 'IDE configuration, GPU-accelerated terminal, Unix environment, editor fonts, and daily engineering tools used by Nikhil Choudhary.',
    url: `${SITE_URL}/development`,
    type: 'website',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} Development Setup`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Development Setup | ${SITE_NAME}`,
    description: 'IDE configuration, GPU-accelerated terminal, Unix environment, editor fonts, and daily engineering tools used by Nikhil Choudhary.',
    images: ['/banner.png'],
  },
}

export default async function DevelopmentPage() {
  const tools: DevelopmentData[] = await getPortfolioDevelopment()

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
          <span className="link--elara">Development</span>
        </h1>
      </div>

      <p className="tracking-tight text-neutral-600 dark:text-neutral-400 max-w-xl text-sm md:text-base mt-2 mb-6 font-mono">
        IDE configuration, GPU-accelerated terminal, Unix environment, editor fonts, and daily engineering tools.
      </p>

      <div className="-mx-6 sm:-mx-8 h-px border-t border-dashed border-neutral-300 dark:border-neutral-800 my-6" />

      {tools.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-800 space-y-2">
          <Terminal className="w-6 h-6 mx-auto text-neutral-400 dark:text-neutral-600" />
          <h2 className="text-sm font-semibold font-mono text-neutral-900 dark:text-neutral-100">
            No development setups published yet
          </h2>
          <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
            Tools and configurations will appear here once added in the management dashboard.
          </p>
        </div>
      ) : (
        <div className="space-y-4 my-6">
          <div className="flex flex-col">
            {tools.map((item) => {
              const href = item.link || `/development/${item.slug}`
              const isExternal = !!item.link && item.link !== '#'

              return (
                <Link
                  key={item.slug || item.title}
                  href={href}
                 
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  title={isExternal ? 'Open link' : 'View details'}
                  className="group flex items-center justify-between py-3 border-b last:border-0 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors px-2 -mx-2 rounded-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="text-sm font-mono text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors truncate">
                      {item.title}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>

                  <span className="opacity-0 group-hover:opacity-100 text-[11px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 transition-opacity ml-4 shrink-0">
                    {isExternal ? 'Open link' : 'View details'}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </BlueprintLayout>
  )
}