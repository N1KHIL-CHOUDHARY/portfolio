'use client'

import React from 'react'
import Link from 'next/link'

interface FooterProps {
  onNavigate?: (sectionId: string) => void
}

export default function Footer({ onNavigate }: FooterProps) {
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
    <footer className="pt-8 border-t border-zinc-300/80 dark:border-zinc-800/80 space-y-6">
      {/* Dual Column Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs font-mono">
        {/* NAVIGATE COLUMN */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
            Navigate
          </h4>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-zinc-700 dark:text-zinc-300 font-medium">
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
    </footer>
  )
}
