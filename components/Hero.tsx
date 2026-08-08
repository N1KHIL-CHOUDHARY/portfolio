'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Copy, 
  Check, 
  Clock, 
  Mail,
} from 'lucide-react'
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandYoutube,
} from '@tabler/icons-react'
import TechStackBadges from './TechStackBadges'

interface HeaderProps {
  email?: string
  heroData?: {
    name?: string
    headline?: string
    subtitle?: string
    location?: string
    availability?: string
    profileImage?: string
    resumeUrl?: string
    email?: string
    shortBio?: string
  } | null
  socialLinks?: Array<{ label: string; url: string; icon?: string }> | null
  skills?: any[] | null
}

export default function Header({
  email: defaultEmail = 'nikhil2k7h@gmail.com',
  heroData,
  socialLinks: dynamicSocialLinks,
  skills,
}: HeaderProps) {
  const displayEmail = heroData?.email || defaultEmail
  const displayName = heroData?.name || 'Nikhil Choudhary'
  const displayHeadline = heroData?.headline || 'Engineer · Polymath · Full Stack Developer'
  const displayBio = heroData?.shortBio || heroData?.subtitle || 'Building ultra-clean digital products focused on performance, minimal architecture, and thoughtful micro-interactions.'
  const displayAvatar = heroData?.profileImage || '/profile-3.webp'
  const displayAvailability = heroData?.availability || 'NO'
  const displayLocation = heroData?.location || 'Chennai India'

  const [copied, setCopied] = useState(false)

  

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayEmail)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const socialLinks = dynamicSocialLinks && dynamicSocialLinks.length > 0
    ? dynamicSocialLinks.map((s) => ({
        label: s.label,
        href: s.url,
        icon: s.label.toLowerCase().includes('github') ? IconBrandGithub : s.label.toLowerCase().includes('linkedin') ? IconBrandLinkedin : s.label.toLowerCase().includes('youtube') ? IconBrandYoutube : Mail,
      }))
    : [
        { label: 'GitHub', href: 'https://github.com', icon: IconBrandGithub },
        { label: 'LinkedIn', href: 'https://linkedin.com', icon: IconBrandLinkedin },
        { label: 'Mail', href: `mailto:${displayEmail}`, icon: Mail },
      ]

  return (
    <header className="space-y-5 pt-2">
      {/* Top Row: Avatar & Basic Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 shrink-0 shadow-sm">
            <Image
              src={displayAvatar}
              alt={displayName}
              fill
              priority
              sizes="(max-width: 640px) 64px, 80px"
              className="object-cover"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {displayName}
              </h1>
              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-semibold">
                @{displayName.split(' ')[0].toLowerCase()}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium tracking-tight">
              {displayHeadline}
            </p>
            <p className='text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium tracking-tight'>
                {displayLocation} </p>
          </div>
        </div>

        {/* Copy Email Pill micro-interaction */}
        <div className="relative shrink-0 self-start sm:self-auto">
          <button
            onClick={handleCopy}
            className="group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border border-zinc-300/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-colors duration-200 shadow-2xs"
            title="Click to copy email"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-200 transition-colors" />
            )}
            <span>{displayEmail}</span>
          </button>

          <AnimatePresence>
            {copied && (
              <motion.span
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: -28, scale: 1 }}
                exit={{ opacity: 0, y: -34, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="absolute left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-mono text-xs font-medium shadow-md pointer-events-none whitespace-nowrap z-20"
              >
                Copied!
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bio Paragraph */}
      <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed tracking-tight max-w-2xl">
        {displayBio}
      </p>

      
        {/* Live Status Badge */}
        { displayAvailability!= 'NO' && <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/80 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-[6px] h-2 w-2 bg-emerald-500" />
          </span>
          <span>{displayAvailability}</span>
        </div>}


      {/* Hover-to-Expand Tech Stack Badges */}
      <div className="pt-2">
        <TechStackBadges skills={skills} />
      </div>

      {/* Social Links Row */}
      <div className="flex items-center gap-4 pt-1 border-b border-zinc-200/80 dark:border-zinc-800/60 pb-5">
        {socialLinks.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors p-1 -m-1"
            title={label}
            aria-label={label}
          >
            <Icon className="w-4 h-4" />
          </a>
        ))}
      </div>
    </header>
  )
}
