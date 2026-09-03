'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface BannerSectionProps {
  bannerUrl?: string
  alt?: string
  className?: string
}

export default function BannerSection({
  bannerUrl = '/banner.gif',
  alt = 'Profile Banner',
  className = '',
}: BannerSectionProps) {
  const [imgSrc, setImgSrc] = useState(bannerUrl)
  const [timeObj, setTimeObj] = useState<{ hours: string; minutes: string; seconds: string } | null>(null)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeObj({
        hours: String(now.getHours()).padStart(2, '0'),
        minutes: String(now.getMinutes()).padStart(2, '0'),
        seconds: String(now.getSeconds()).padStart(2, '0'),
      })
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section
      aria-label="Banner"
      className={`-mx-6 sm:-mx-8 -mt-10 md:-mt-12 border-b border-dashed border-neutral-300 dark:border-neutral-800 overflow-hidden ${className}`}
    >
      <div className="relative w-full h-28 sm:h-36 md:h-50 bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
        <Image
          src={imgSrc}
          alt={alt}
          fill
          priority
          unoptimized={typeof imgSrc === 'string' && imgSrc.endsWith('.gif')}
          sizes="(max-width: 896px) 100vw, 896px"
          className="object-cover object-center"
          onError={() => {
            if (imgSrc !== '/banner.png') {
              setImgSrc('/banner.png')
            }
          }}
        />
      
        

        {/* ── Subtle Edge Gradients ── */}
        <div className="absolute inset-x-0 bottom-0 h-8 pointer-events-none z-[5] bg-gradient-to-t from-white/70 to-transparent dark:from-black/40 dark:to-transparent" />
        <div className="absolute left-0 top-0 bottom-0 w-6 pointer-events-none z-[5] bg-gradient-to-r from-white/60 to-transparent dark:from-black/30 dark:to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-6 pointer-events-none z-[5] bg-gradient-to-l from-white/60 to-transparent dark:from-black/30 dark:to-transparent" />

        {/* ── Doto Dot-Matrix Live 24-Hour Clock (Bottom Right) ── */}
        {timeObj && (
          <div className="absolute bottom-3 right-2 z-10 pointer-events-auto">
            <div className="flex items-center h-[24px]">
              <div
                className="text-[20px] sm:text-[24px] tracking-[0.15em] flex items-center text-zinc-200 h-full select-none"
                style={{ fontFamily: '"Doto", monospace', fontWeight: 700 }}
              >
                <span>{timeObj.hours}</span>
                <div className="mx-0.5 sm:mx-1 flex flex-col gap-2 -translate-x-[2px] sm:-translate-x-[3px]">
                  <div className="w-[2px] h-[2px] bg-zinc-200" />
                  <div className="w-[2px] h-[2px] bg-zinc-200" />
                </div>
                <span>{timeObj.minutes}</span>
                <div className="mx-0.5 sm:mx-1 flex flex-col gap-2 -translate-x-[2px] sm:-translate-x-[3px]">
                  <div className="w-[2px] h-[2px] bg-zinc-200" />
                  <div className="w-[2px] h-[2px] bg-zinc-200" />
                </div>
                <span>{timeObj.seconds}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
