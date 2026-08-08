'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Download, Mail } from 'lucide-react'
import { IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react'
import DraggableEraseStack from './DraggableEraseStack'

interface HeroData {
  name?: string | null
  headline?: string | null
  subtitle?: string | null
  location?: string | null
  availability?: string | null
  profileImage?: string | null
  resumeUrl?: string | null
  email?: string | null
  shortBio?: string | null
}

interface HeaderProps {
  heroData?: HeroData | null
  socialLinks?: Array<{ label: string; url: string; icon?: string }> | null
  skills?: any[] | null
}

export default function Header({ heroData, socialLinks: dynamicSocialLinks }: HeaderProps) {
  const rawName = heroData?.name || ''
  const firstName = rawName.split(' ')[0].toLowerCase() || 'you'

  const displayEmail = heroData?.email || ''
  const displayHeadline = heroData?.headline || ''
  const displayBio = heroData?.shortBio || heroData?.subtitle || ''
  const displayAvatar = heroData?.profileImage || '/profile-3.webp'
  const resumeUrl = heroData?.resumeUrl || '#'

  const stackImages = [
    displayAvatar,
    '/profile-1.webp',
    '/profile-2.webp',
    '/profile-4.webp',
  ].filter(Boolean)

  const socialLinks =
    dynamicSocialLinks && dynamicSocialLinks.length > 0
      ? dynamicSocialLinks.map((s) => ({
          label: s.label,
          href: s.url,
          icon: s.label.toLowerCase().includes('github')
            ? IconBrandGithub
            : s.label.toLowerCase().includes('linkedin')
            ? IconBrandLinkedin
            : Mail,
        }))
      : [
          ...(displayEmail
            ? [{ label: 'Mail', href: `mailto:${displayEmail}`, icon: Mail }]
            : []),
        ]

  return (
    <header className="pt-2 sm:pt-4 pb-2">
      <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-6 sm:gap-8">
        <div className="space-y-3.5 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
              <span>hi {firstName} here.</span>
              <span className="inline-block origin-bottom-right hover:rotate-12 transition-transform duration-200 cursor-default text-xl sm:text-2xl">
                👋
              </span>
            </h1>
          </motion.div>

          {displayHeadline && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 tracking-tight"
            >
              {displayHeadline}
            </motion.p>
          )}

          {displayBio && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal"
            >
              {displayBio}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="flex items-center gap-3 pt-1"
          >
            {resumeUrl && resumeUrl !== '#' ? (
              <a
                href={resumeUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-300/80 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold transition-all shadow-2xs hover:shadow-xs active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
                <span>Resume</span>
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-400 dark:text-zinc-600 text-xs font-semibold cursor-not-allowed select-none">
                <Download className="w-3.5 h-3.5" />
                <span>Resume</span>
              </span>
            )}

            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

            <div className="flex items-center gap-1">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
                  title={label}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="relative shrink-0 flex items-center justify-center self-center sm:self-auto"
        >
          <DraggableEraseStack images={stackImages} />
        </motion.div>
      </div>
    </header>
  )
}