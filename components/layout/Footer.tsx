'use client'

import React from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { Eye, Shield } from 'lucide-react'

interface FooterProps {
  onNavigate?: (sectionId: string) => void
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Footer({ onNavigate }: FooterProps) {
  const { data } = useSWR('/api/analytics/stats', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  })

  const stats = data?.data

  const navigateLinks = [
    { label: 'Home', href: '/' },
    { label: 'Experience', action: () => onNavigate?.('experience') },
    { label: 'Projects', href: '/projects' },
    { label: 'Certifications', action: () => onNavigate?.('certifications') },
    { label: 'Gears', href: '/gears' },
    { label: 'Resume', href: '/RESUME.pdf', target: '_blank' },
  ]

  const connectLinks = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nikhil-h-184560338/' },
    { label: 'GitHub', href: 'https://github.com/n1khil-choudhary' },
    { label: 'Mail', href: 'mailto:nikhil2k7h@gmail.com' },
  ]

  return (
    <footer className="pt-8 space-y-6">
      <div className="-mx-6 sm:-mx-8 h-px border-t border-dashed border-neutral-300 dark:border-neutral-800 mb-8" />
      {/* Dual Column Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs font-mono">
        {/* NAVIGATE COLUMN */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            Navigate
          </h4>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-neutral-700 dark:text-neutral-300 font-medium">
            {navigateLinks.map((item) => {
              if (item.href) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    target={item.target}
                    rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                    className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </Link>
                )
              }

              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* CONNECT COLUMN */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
            Connect
          </h4>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-zinc-700 dark:text-zinc-300 font-medium">
            {connectLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Live Views Counter & Privacy Line */}
      {stats && stats.totalViews > 0 && (
        <div className="pt-4 border-t border-dashed border-neutral-200 dark:border-neutral-800/60 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-emerald-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Telemetry</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-zinc-400" />
              <span>{stats.totalViews.toLocaleString()} views ({stats.uniqueVisitors.toLocaleString()} unique)</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-600">
            <Shield className="w-3 h-3" />
            <span>Redis + Postgres Persistent</span>
          </div>
        </div>
      )}
    </footer>
  )
}

