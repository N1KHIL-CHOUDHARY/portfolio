import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import BlueprintLayout from '@/components/layout/BlueprintLayout'
import { getPortfolioGears } from '@/lib/db'
import { GearItem } from '@/lib/data'
import { SITE_NAME, SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Gears & Hardware',
  description: 'Workstation hardware, developer devices, accessories, and productivity setup used by Nikhil Choudhary.',
  alternates: {
    canonical: '/gears',
  },
  openGraph: {
    title: `Gears & Hardware | ${SITE_NAME}`,
    description: 'Workstation hardware, developer devices, accessories, and productivity setup used by Nikhil Choudhary.',
    url: `${SITE_URL}/gears`,
    type: 'website',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} Workstation Gears`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Gears & Hardware | ${SITE_NAME}`,
    description: 'Workstation hardware, developer devices, accessories, and productivity setup used by Nikhil Choudhary.',
    images: ['/banner.png'],
  },
}

export default async function GearsPage() {
  const gears: GearItem[] = await getPortfolioGears()

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
          <span className="link--elara">Gears</span>
        </h1>
      </div>

      <p className="tracking-tight text-neutral-600 dark:text-neutral-400 max-w-xl text-sm md:text-base mt-2 mb-6 font-mono">
        Hardware, desk accessories, and audio equipment I use daily to build and design.
      </p>

      <div className="-mx-6 sm:-mx-8 h-px border-t border-dashed border-neutral-300 dark:border-neutral-800 my-6" />

      <div className="space-y-4 my-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold">
            Devices &amp; Accessories
          </h2>
          <span className="text-xs font-mono font-medium text-neutral-500 dark:text-neutral-400">
            {gears.length} items
          </span>
        </div>

        {gears.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-800 space-y-2">
            <h2 className="text-sm font-semibold font-mono text-neutral-900 dark:text-neutral-100">
              No gears published yet
            </h2>
          </div>
        ) : (
          <div className="flex flex-col">
            {gears.map((item) => {
              const isExternal = item.link && item.link !== '#'

              return (
                <a
                  key={item.id || item.title}
                  href={item.link || '#'}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  title={isExternal ? 'Open link' : undefined}
                  className="group flex items-center justify-between py-3 border-b last:border-0 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors px-2 -mx-2 rounded-md"
                >
                  <span className="text-sm font-mono text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors truncate">
                    {item.title}
                  </span>

                  {isExternal && (
                    <span className="opacity-0 group-hover:opacity-100 text-[11px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 transition-opacity ml-4 shrink-0">
                      Open link
                    </span>
                  )}
                </a>
              )
            })}
          </div>
        )}
      </div>
    </BlueprintLayout>
  )
}