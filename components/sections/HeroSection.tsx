'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Download, Mail, ExternalLink, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandDiscord,
  IconBrandYoutube,
} from '@tabler/icons-react'
import ThemeToggle from '@/components/layout/ThemeToggle'
import { useToggleSound } from '@/hooks/useToggleSound'

const ROLES = ['AI Engineer', 'Full Stack Developer', 'Software Engineer']

interface HeroData {
  name?: string | null
  age?: string | number | null
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

function getSocialIcon(label: string, iconProp?: string) {
  const l = `${label} ${iconProp || ''}`.toLowerCase()
  if (l.includes('github')) return IconBrandGithub
  if (l.includes('linkedin')) return IconBrandLinkedin
  if (l.includes('twitter') || l === 'x' || l.includes('x.com')) return IconBrandX
  if (l.includes('discord')) return IconBrandDiscord
  if (l.includes('youtube')) return IconBrandYoutube
  if (l.includes('mail') || l.includes('email')) return Mail
  return ExternalLink
}

export default function Header({
  heroData,
  socialLinks: dynamicSocialLinks,
}: HeaderProps) {
  const [heroImageError, setHeroImageError] = useState(false)
  const [profileImageError, setProfileImageError] = useState(false)
  // false = showing hero.png (initial), true = showing profile.png
  const [showProfile, setShowProfile] = useState(false)
  const [roleIndex, setRoleIndex] = useState(0)
  const playToggleSound = useToggleSound({ soundUrl: '/sounds/click.mp3', volume: 0.25 })

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length)
    }, 2600)
    return () => clearInterval(timer)
  }, [])

  const rawName = heroData?.name || ''
  const age = heroData?.age || null
  const location = heroData?.location || ''
  const availability = heroData?.availability || ''
  const displayEmail = heroData?.email || ''
  const resumeUrl = heroData?.resumeUrl || 'https://drive.google.com/file/d/15l1MU4SVFpC7BaRMF0iH-J9qz_SxlEC_/view?usp=drive_link'

  const heroAvatar = '/images/hero.png'
  const profileAvatar = '/images/profile.png'

  const bothFailed = heroImageError && profileImageError

  const initials = rawName
    ? rawName
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'ME'

  const socialLinks =
    dynamicSocialLinks && dynamicSocialLinks.length > 0
      ? dynamicSocialLinks.map((s) => ({
          label: s.label,
          href: s.url,
          icon: getSocialIcon(s.label, s.icon),
        }))
      : [
          ...(displayEmail
            ? [{ label: 'Mail', href: `mailto:${displayEmail}`, icon: Mail }]
            : []),
        ]

  return (
    <header className="space-y-2 sm:space-y-2.5">
      {/* ── Top Profile Row ── */}
      <div className="flex items-start justify-between gap-2.5">
        {/* Avatar + Metadata */}
        <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">

          {/* ── Avatar Column ── */}
          <div className="shrink-0 flex flex-col items-center gap-1.5">
            {bothFailed ? (
              /* Initials fallback */
              <div
                className="relative flex size-14 sm:size-20 md:size-[84px] items-center justify-center rounded-[8px] border-2 border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800 font-mono text-xl sm:text-2xl font-bold text-neutral-700 dark:text-neutral-300 select-none"
              >
                {initials}
              </div>
            ) : (
              <div
                className="relative block overflow-hidden rounded-[8px] p-[3px] border-2 border-neutral-300 dark:border-neutral-600 size-14 sm:size-20 md:size-[84px] bg-neutral-100 dark:bg-neutral-800 select-none"
              >
                <span className="block relative w-full h-full rounded-[5px] overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                  {/* hero.png — shown when showProfile=false */}
                  {!heroImageError && (
                    <Image
                      src={heroAvatar}
                      alt={rawName ? `${rawName} - hero` : 'Hero avatar'}
                      fill
                      sizes="(max-width: 640px) 56px, (max-width: 768px) 80px, 84px"
                      priority
                      onError={() => setHeroImageError(true)}
                      className={`object-cover scale-110 transition-all duration-500 ease-out ${
                        showProfile
                          ? 'opacity-0 scale-[1.18] blur-[3px] pointer-events-none'
                          : 'opacity-100 scale-110 blur-0'
                      }`}
                    />
                  )}

                  {/* profile.png — shown when showProfile=true */}
                  {!profileImageError && (
                    <Image
                      src={profileAvatar}
                      alt={rawName ? `${rawName} - profile photo` : 'Profile photo'}
                      fill
                      sizes="(max-width: 640px) 56px, (max-width: 768px) 80px, 84px"
                      loading="lazy"
                      onError={() => setProfileImageError(true)}
                      className={`absolute inset-0 object-cover transition-all duration-500 ease-out ${
                        showProfile
                          ? 'opacity-100 scale-100 blur-0'
                          : 'opacity-0 scale-[0.95] blur-[3px] pointer-events-none'
                      }`}
                    />
                  )}
                </span>
              </div>
            )}

            {/* Toggle Switch under Avatar */}
            {!bothFailed && (
              <div className="flex justify-center w-full pt-1">
                <button
                  type="button"
                  role="switch"
                  aria-checked={showProfile}
                  aria-label="Show real photo"
                  onClick={() => {
                    playToggleSound()
                    setShowProfile((prev) => !prev)
                  }}
                  className={`focus-visible:ring-ring/50 relative h-[18px] w-8 shrink-0 cursor-pointer rounded-full border transition-colors outline-none focus-visible:ring-[3px] border-transparent ${
                    showProfile
                      ? 'bg-neutral-800 dark:bg-neutral-200'
                      : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-1/2 size-3 -translate-y-1/2 rounded-full shadow-sm transition-[left] duration-200 ${
                      showProfile
                        ? 'bg-white dark:bg-neutral-900 left-[15px]'
                        : 'bg-white dark:bg-neutral-300 left-[2px]'
                    }`}
                  />
                </button>
              </div>
            )}
          </div>

          {/* Identity Info */}
          <div className="flex flex-col gap-1 min-w-0 justify-center">
            <h1 className="text-[24px] sm:text-[28px] font-semibold tracking-[-0.02em] text-neutral-900 dark:text-neutral-100 leading-[1.1]">
              {rawName || 'Developer'}
            </h1>

            {/* Animated Role Switcher */}
            <div className="h-5 overflow-hidden flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={ROLES[roleIndex]}
                  initial={{ y: 12, opacity: 0, filter: 'blur(3px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: -12, opacity: 0, filter: 'blur(3px)' }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center gap-1.5 text-[14px] leading-[1.4]"
                >
                  <span className="font-normal text-neutral-600 dark:text-neutral-400">
                    {ROLES[roleIndex]}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Meta Row: Resume, Mail, Age, Availability */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-[12px] font-normal tracking-normal text-neutral-500 dark:text-neutral-400 pt-0.5">
              {resumeUrl && resumeUrl !== '#' && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playToggleSound()}
                  className="inline-flex items-center gap-1 text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-neutral-100 font-medium transition-colors cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Resume</span>
                </a>
              )}

              {resumeUrl && resumeUrl !== '#' && (displayEmail || 'nikhil2k7h@gmail.com') && (
                <span className="text-neutral-300 dark:text-neutral-700">•</span>
              )}

              {(displayEmail || 'nikhil2k7h@gmail.com') && (
                <a
                  href={`mailto:${displayEmail || 'nikhil2k7h@gmail.com'}`}
                  onClick={() => playToggleSound()}
                  className="inline-flex items-center gap-1 text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-neutral-100 font-medium transition-colors cursor-pointer"
                >
                  <Mail className="w-3 h-3" />
                  <span>Mail</span>
                </a>
              )}

              {((resumeUrl && resumeUrl !== '#') || displayEmail || 'nikhil2k7h@gmail.com') && age && (
                <span className="text-neutral-300 dark:text-neutral-700">•</span>
              )}
              {age && (
                <span>{typeof age === 'number' ? `${age} yrs` : age}</span>
              )}
              {((resumeUrl && resumeUrl !== '#') || displayEmail || 'nikhil2k7h@gmail.com' || age) && availability && (
                <span className="text-neutral-300 dark:text-neutral-700">•</span>
              )}
              {availability && (
                <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>{availability}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <div className="shrink-0 pt-0.5">
          <ThemeToggle className="w-8 h-8 rounded-lg border border-neutral-200/90 dark:border-neutral-800/90 bg-white/90 dark:bg-neutral-900/90 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-2xs hover:shadow-xs" />
        </div>
      </div>
    </header>
  )
}