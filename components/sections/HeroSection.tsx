'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useToggleSound } from '@/hooks/useToggleSound'
import ThemeToggle from '@/components/layout/ThemeToggle'
import { Eye } from 'lucide-react'

const ROLES = ['Full Stack developer','Break, Learn, & Ship.']

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
  initialViews?: number
}

export default function Header({
  heroData,
  initialViews,
}: HeaderProps) {
  const [heroImageError, setHeroImageError] = useState(false)
  const [profileImageError, setProfileImageError] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [roleIndex, setRoleIndex] = useState(0)
  const [views, setViews] = useState<number>(initialViews || 0)
  const [isNameHovered, setIsNameHovered] = useState(false)

  const playToggleSound = useToggleSound({ soundUrl: '/sounds/click.mp3', volume: 0.25 })

  // Cycle through roles with smooth character blur transition
  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length)
    }, 3200)
    return () => clearInterval(timer)
  }, [])

  
  useEffect(() => {
    let isMounted = true
    fetch('/api/analytics/stats')
      .then((res) => res.json())
      .then((resData) => {
        if (isMounted && resData?.success && typeof resData?.data?.totalViews === 'number') {
          setViews(resData.data.totalViews)
        }
      })
      .catch(() => {
        if (isMounted) setViews(0)
      })
    return () => {
      isMounted = false
    }
  }, [])

  const rawName = heroData?.name
  const age = heroData?.age 
  const location = heroData?.location

  const heroAvatar = heroData?.profileImage || '/images/hero.png'
  const profileAvatar = '/images/profile.png'
  const bothFailed = heroImageError && profileImageError

  useEffect(() => {
    setHeroImageError(false)
  }, [heroAvatar])

  useEffect(() => {
    setProfileImageError(false)
  }, [profileAvatar])

  const currentRole = ROLES[roleIndex]
  const roleChars = Array.from(currentRole)

  const handleAvatarToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    playToggleSound()
    setShowProfile((prev) => !prev)
  }

  return (
    <header className="w-full">
      <div className="flex flex-row gap-3 sm:gap-7 items-center w-full h-auto sm:h-38 py-3 sm:py-0">
        
        {/* ── Left Profile Box Frame (Non-clickable, switching is done via toggle button) ── */}
        <div
          className="relative ml-1 sm:ml-4 bg-neutral-200 dark:bg-neutral-800/90 border border-neutral-300/80 dark:border-neutral-700/80 overflow-hidden shrink-0 rounded-[12px] w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center shadow-xs select-none"
        >
          <div className="relative rounded-[10px] w-[86px] h-[86px] sm:w-[102px] sm:h-[102px] overflow-hidden bg-neutral-100 dark:bg-neutral-900">
            {bothFailed ? (
              <div className="w-full h-full flex items-center justify-center font-mono text-xl sm:text-2xl font-bold text-neutral-700 dark:text-neutral-300">
                {rawName ? rawName.charAt(0) : 'N'}
              </div>
            ) : (
              <>
                {/* hero.png */}
                {!heroImageError && (
                  <Image
                    src={heroAvatar}
                    alt={rawName ? `${rawName} - hero` : 'Hero image'}
                    fill
                    sizes="(max-width: 640px) 96px, 112px"
                    priority
                    unoptimized
                    onError={() => setHeroImageError(true)}
                    className={`absolute inset-0 m-auto w-full h-full rounded-lg shadow-xs object-cover transition-all duration-500 ease-out ${
                      showProfile
                        ? 'opacity-0 scale-110 blur-[2px] pointer-events-none'
                        : 'opacity-100 scale-100 blur-0'
                    }`}
                  />
                )}

                {/* profile.png */}
                {!profileImageError && (
                  <Image
                    src={profileAvatar}
                    alt={rawName ? `${rawName} - profile` : 'Profile image'}
                    fill
                    sizes="(max-width: 640px) 96px, 112px"
                    loading="lazy"
                    unoptimized
                    onError={() => setProfileImageError(true)}
                    className={`absolute inset-0 m-auto w-full h-full rounded-lg shadow-xs object-cover transition-all duration-500 ease-out ${
                      showProfile
                        ? 'opacity-100 scale-100 blur-0'
                        : 'opacity-0 scale-95 blur-[2px] pointer-events-none'
                    }`}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Middle / Right Main Information ── */}
        <div className="flex flex-row justify-between w-full items-center gap-3 pr-2 sm:pr-0 min-w-0 flex-1">
          
          {/* Identity & Role Column */}
          <div className="flex flex-col items-start text-left min-w-0 flex-1">
            
            {/* Avatar Switcher Icon Button (Toggles between hero.png & profile.png) */}
            <button
              type="button"
              onClick={handleAvatarToggle}
              aria-label={showProfile ? 'Show Hero Avatar' : 'Show Profile Photo'}
              title={showProfile ? 'Show Hero Avatar' : 'Show Profile Photo'}
              className="cursor-pointer mb-2 text-neutral-700 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-all duration-300 focus:outline-none"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                version="1.1"
                viewBox="0 0 30 30"
                className={`transition-transform duration-500 ease-out ${showProfile ? 'rotate-180' : 'rotate-0'}`}
                height="1.15em"
                width="1.15em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3.74,14.44c0-1.52,0.3-2.98,0.89-4.37s1.4-2.58,2.4-3.59s2.2-1.81,3.59-2.4s2.84-0.89,4.37-0.89s2.98,0.3,4.37,0.89
                s2.59,1.4,3.6,2.4s1.81,2.2,2.4,3.59s0.89,2.84,0.89,4.37s-0.3,2.98-0.89,4.37s-1.4,2.59-2.4,3.6s-2.2,1.81-3.6,2.4
                s-2.85,0.89-4.37,0.89s-2.98-0.3-4.37-0.89s-2.58-1.4-3.59-2.4s-1.81-2.2-2.4-3.6S3.74,15.97,3.74,14.44z M4.94,14.44
                c0,1.37,0.27,2.67,0.8,3.91s1.25,2.31,2.15,3.21s1.97,1.61,3.21,2.15s2.54,0.8,3.9,0.8h0.21V4.39h-0.21c-1.36,0-2.66,0.27-3.9,0.8
                S8.79,6.44,7.89,7.34s-1.61,1.97-2.15,3.21S4.94,13.09,4.94,14.44z"></path>
              </svg>
            </button>

            {/* Name with Interactive Hover Annotation */}
            <div
              className="relative inline-flex items-center cursor-default group"
              onMouseEnter={() => setIsNameHovered(true)}
              onMouseLeave={() => setIsNameHovered(false)}
            >
              <h1 className="text-[24px] sm:text-[28px] font-semibold tracking-[-0.02em] text-neutral-900 dark:text-neutral-100 leading-[1.1] truncate max-w-full">
                {rawName || 'Nikhil H.'}
              </h1>

              {/* Hover Tooltip: ↳ yes, that's actually me */}
              <AnimatePresence>
                {isNameHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95, filter: 'blur(3px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -4, scale: 0.95, filter: 'blur(3px)' }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    className="absolute left-0 -top-7 sm:-top-8 z-30 pointer-events-none select-none whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 text-[12px] font-mono shadow-md border border-neutral-800 dark:border-neutral-200">
                      <span>They call me Niki</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Smooth Vertical Role Switcher */}
<div className="h-[22px] sm:h-[28px] flex items-center overflow-hidden">
  <AnimatePresence mode="wait">
    <motion.span
      key={currentRole}
      initial={{
        opacity: 0,
        y: 18,
        filter: 'blur(4px)',
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
      }}
      exit={{
        opacity: 0,
        y: -18,
        filter: 'blur(4px)',
      }}
      transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        text-xs sm:text-lg
        font-semibold
        text-neutral-500 dark:text-neutral-400
        whitespace-nowrap
        select-none
      "
    >
      {currentRole}
    </motion.span>
  </AnimatePresence>
</div>
            {/* Sub-Info / Location */}
            <div className="flex flex-wrap items-center gap-1.5 text-[9px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-semibold mt-0.5 truncate max-w-full">
              <span>
                {age ? `${age}, ` : ''}
                {location}
              </span>
            </div>
          </div>

              
          {/* ── Right: View Counter & Theme Toggle Side by Side ── */}
          <div className="flex shrink-0 items-center self-start pt-1.5 pr-1 sm:pr-4">
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <div
                className="flex gap-1.5 items-center text-neutral-600 dark:text-neutral-400 cursor-default select-none"
                title="Total Portfolio Views"
              >
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 stroke-[2]" />
                <div className="relative h-4 sm:h-5 flex items-center justify-start min-w-[28px]">
                  <span className="font-mono text-xs sm:text-[13px] tracking-tight">
                    {views.toLocaleString()}
                  </span>
                </div>
              </div>

              <ThemeToggle className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}