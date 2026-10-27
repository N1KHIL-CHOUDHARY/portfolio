'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Rocket,
  Heart,
} from 'lucide-react'

const ROLES = [
  'Software Engineer',
  'Full Stack Developer',
  'Product Builder',
]

function LinkedInIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#0A66C2"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  )
}

function GitHubIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

function LeetCodeIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 94 110.92" fill="none" aria-hidden="true" className={className}>
      <path d="M67.507 83.066c2.494-2.49 6.53-2.483 9.016.015 2.485 2.498 2.479 6.542-.015 9.032l-11.073 11.057c-10.216 10.201-26.875 10.349-37.263.344-.06-.058-4.686-4.594-19.945-19.557C-1.925 74.003-2.936 58.075 6.617 47.846L24.429 28.775c9.481-10.153 26.958-11.263 37.799-2.496l16.177 13.083c2.74 2.216 3.168 6.236.956 8.981-2.212 2.744-6.226 3.173-8.965.957L54.219 36.217c-5.67-4.585-15.587-3.955-20.479 1.284L15.928 56.573c-4.651 4.979-4.141 13.001 1.218 18.256 11.206 10.988 19.842 19.456 19.852 19.465 5.4 5.202 14.133 5.125 19.436-.17l11.073-11.058Z" fill="#FFA116"></path>
      <path d="M40.607 72.001c-3.521 0-6.375-2.859-6.375-6.386 0-3.527 2.854-6.386 6.375-6.386h47.018c3.521 0 6.375 2.859 6.375 6.386 0 3.527-2.854 6.386-6.375 6.386H40.607Z" fill="#B3B3B3"></path>
      <path d="M49.412 2.023C51.818-.552 55.852-.687 58.423 1.723c2.571 2.41 2.706 6.451.3 9.027L15.928 56.573c-4.65 4.979-4.141 13.001 1.218 18.256l19.763 19.38c2.517 2.467 2.56 6.51.097 9.031-2.463 2.52-6.5 2.564-9.016.096L8.227 83.957C-1.925 74.002-2.936 58.074 6.618 47.846L49.412 2.023Z" className="fill-black dark:fill-white"></path>
    </svg>
  )
}

export interface HeroProps {
  heroData?: {
    name?: string | null
    avatarUrl?: string | null
    location?: string | null
    email?: string | null
  } | null
  socialLinks?: Array<{
    label: string
    url: string
  }> | null
}

export default function HeroSection({ heroData, socialLinks }: HeroProps) {
  const [roleIndex, setRoleIndex] = useState(0)
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null)

  const name = heroData?.name || 'Nikhil'

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

const defaultLinks = [
    { label: 'LinkedIn', url: 'https://linkedin.com' },
    { label: 'GitHub', url: 'https://github.com' },
    { label: 'LeetCode', url: 'https://leetcode.com' },
  ]

  const links = (socialLinks && socialLinks.length > 0 ? socialLinks : defaultLinks).filter((link) => {
    const l = (link.label || '').toLowerCase()
    return !l.includes('x') && !l.includes('twitter')
  })

  
  const renderIcon = (label: string) => {
    const l = label.toLowerCase()
    if (l.includes('linkedin')) return <LinkedInIcon className="w-[21px] h-[21px]" />
    if (l.includes('github')) return <GitHubIcon className="w-[21px] h-[21px]" />
    if (l.includes('leetcode')) return <LeetCodeIcon className="w-[21px] h-[21px]" />
    return null
  }

  return (
    <section className="w-full flex flex-col pt-4 pb-2">
      <div className="flex flex-col space-y-6 sm:space-y-7">
        
        {/* Title row with Doodle Arrow */}
        <div className="relative">
          <svg
            viewBox="0 0 90 56"
            aria-hidden="true"
            className="pointer-events-none absolute -left-28 top-1/2 hidden w-[90px] -translate-y-[calc(50%+8px)] text-neutral-300 dark:text-neutral-700 lg:block select-none"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 9c18-6 30 5 25 17-4 10-19 10-17 0 2-11 22-8 36 2 8 6 16 10 26 11" />
            <path d="M74 32c2 3 4 5 8 7-4 2-6 4-8 8" />
          </svg>

          <h1 className="text-[38px] sm:text-[48px] md:text-[54px] font-semibold text-neutral-900 dark:text-neutral-100 leading-[1.2] tracking-[-0.03em] flex flex-wrap items-center gap-x-3 sm:gap-x-4">
            <span>Hey, I&apos;m</span>

            <span className="inline-flex items-center align-middle my-1">
              <span className="relative inline-block w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] [perspective:1000px] cursor-pointer group">
                <span className="relative block w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  <span className="absolute inset-0 w-full h-full rounded-[18px] overflow-hidden border border-neutral-200 dark:border-white/10 [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
                    <Image
                      src="/images/doodle.png"
                      alt={`${name}'s avatar`}
                      fill
                      sizes="(max-width: 640px) 56px, (max-width: 768px) 64px, 72px"
                      priority
                      className="object-cover"
                    />
                  </span>
                  <span className="absolute inset-0 w-full h-full rounded-[18px] overflow-hidden border border-neutral-200 dark:border-white/10 [transform:rotateY(180deg)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
                    <Image
                      src="/images/profile1.png"
                      alt={`${name}'s photo`}
                      fill
                      sizes="(max-width: 640px) 56px, (max-width: 768px) 64px, 72px"
                      priority
                      className="object-cover"
                    />
                  </span>
                </span>
              </span>
            </span>

            <span>{name}</span>
          </h1>
        </div>

        {/* Narrative bio with optimized spacing */}
        <div className="space-y-2.5 text-[15px] sm:text-[16px] leading-[1.7] text-neutral-600 dark:text-neutral-400 font-normal">
          {/* Animated role line */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span>I&apos;m a</span>
            <div className="relative inline-flex h-[24px] overflow-hidden items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={ROLES[roleIndex]}
                  initial={{ opacity: 0, y: 10, filter: 'blur(3px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
                  transition={{ duration: 0.2, ease: [0.22, 0.5, 0.36, 0.5] }}
                  className="font-medium text-neutral-900 dark:text-neutral-100 whitespace-nowrap"
                >
                  {ROLES[roleIndex]}.
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <p>
            I build full products on my own, from the database up to{' '}
            <strong className="font-medium text-neutral-900 dark:text-neutral-100">deployment</strong>{' '}
            <Rocket className="inline w-3.5 h-3.5 ml-0.5 text-neutral-500 inline-block align-[-2px]" />. I care a lot about the{' '}
            <strong className="font-medium text-neutral-900 dark:text-neutral-100">small stuff</strong>{' '}
            <Sparkles className="inline w-3.5 h-3.5 ml-0.5 text-neutral-500 inline-block align-[-2px]" />. Clean APIs, fast interfaces, interactions that actually{' '}
            <span className="font-medium text-neutral-900 dark:text-neutral-100">feel right</span>{' '}
            <Heart className="inline w-3.5 h-3.5 ml-0.5 text-neutral-500 inline-block align-[-2px]" />.
          </p>

          <p>
            I mostly work with{' '}
            <span className="font-medium text-neutral-900 dark:text-neutral-100">TypeScript</span>,{' '}
            <span className="font-medium text-neutral-900 dark:text-neutral-100">Next.js</span>,{' '}
            <span className="font-medium text-neutral-900 dark:text-neutral-100">React</span>, and{' '}
            <span className="font-medium text-neutral-900 dark:text-neutral-100">PostgreSQL</span>.
          </p>
        </div>

        {/* Social icons row with minimal tooltips */}
        <div className="pt-2 flex items-center gap-5 text-neutral-700 dark:text-neutral-300">
          {links.map((link) => (
            <div
              key={link.label}
              className="relative flex items-center justify-center"
              onMouseEnter={() => setHoveredSocial(link.label)}
              onMouseLeave={() => setHoveredSocial(null)}
            >
              <AnimatePresence>
                {hoveredSocial === link.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 3, scale: 0.92 }}
                    transition={{ duration: 0.14, ease: 'easeOut' }}
                    className="pointer-events-none absolute -top-8 z-30 select-none whitespace-nowrap"
                  >
                    <div className="rounded-md border border-neutral-800/80 bg-neutral-900 px-2 py-0.5 font-mono text-[11px] font-medium text-neutral-100 shadow-sm dark:border-neutral-200/80 dark:bg-neutral-100 dark:text-neutral-900">
                      {link.label}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Link
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="inline-flex items-center justify-center transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0"
              >
                {renderIcon(link.label)}
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}