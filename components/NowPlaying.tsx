'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import useSWR from 'swr'
import { useEffect, useMemo, useRef, useState } from 'react'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  return res.json()
}

type NowPlayingData = {
  isPlaying: boolean
  title: string
  artist: string
  albumImageUrl: string
  progress: number
  duration: number
}

export default function NowPlaying() {
  const [fallbackData, setFallbackData] =
    useState<NowPlayingData | null>(null)

  const progressRef = useRef({
    progress: 0,
    fetchedAt: Date.now(),
  })

  const [liveProgress, setLiveProgress] = useState(0)

  /*
   * Fast fallback from localStorage
   */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('last-song')

      if (saved) {
        setFallbackData(JSON.parse(saved))
      }
    } catch {}
  }, [])

  /*
   * Spotify API
   */
  const { data } = useSWR<NowPlayingData>(
    '/api/now-playing',
    fetcher,
    {
      refreshInterval: 15000,
      revalidateOnFocus: false,
      dedupingInterval: 10000,
      fallbackData: fallbackData || undefined,
    }
  )

  /*
   * Save latest song
   */
  useEffect(() => {
    if (!data?.title) return

    localStorage.setItem(
      'last-song',
      JSON.stringify(data)
    )
  }, [data])

  const displayData = data || fallbackData

  /*
   * Sync progress
   */
  useEffect(() => {
    if (!displayData) return

    progressRef.current = {
      progress: displayData.progress,
      fetchedAt: Date.now(),
    }

    setLiveProgress(displayData.progress)
  }, [displayData])

  /*
   * Live progress update
   */
  useEffect(() => {
    if (!displayData?.isPlaying) return

    const interval = setInterval(() => {
      const elapsed =
        Date.now() - progressRef.current.fetchedAt

      const next = Math.min(
        progressRef.current.progress + elapsed,
        displayData.duration
      )

      setLiveProgress(next)
    }, 1000)

    return () => clearInterval(interval)
  }, [displayData])

  if (!displayData) return null

  /*
   * Memoized progress %
   */
  const progressPercent = useMemo(() => {
    if (!displayData.duration) return 0

    return Math.min(
      (liveProgress / displayData.duration) * 100,
      100
    )
  }, [liveProgress, displayData.duration])

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000)

    return `${Math.floor(s / 60)}:${String(
      s % 60
    ).padStart(2, '0')}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        w-[280px]
        p-4
        rounded-3xl
        border
        border-neutral-200
        dark:border-white/[0.08]
        bg-white/75
        dark:bg-neutral-900/75
        backdrop-blur-xl
        shadow-xl
        shadow-black/10
        dark:shadow-black/20
        transition-transform
        duration-300
        hover:scale-[1.015]
        will-change-transform
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-1.5">
          <motion.span
            animate={{
              opacity: displayData.isPlaying
                ? [1, 0.35, 1]
                : 1,
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
            }}
            className={`
              w-2
              h-2
              rounded-full
              ${displayData.isPlaying
                ? 'bg-green-500'
                : 'bg-red-500'}
            `}
          />

          <span className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 dark:text-white/45">
            {displayData.isPlaying
              ? 'Listening to'
              : 'Last Played'}
          </span>
        </div>

        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="#1DB954"
        >
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      </div>

      {/* Song */}
      <div className="flex items-center gap-3">
        <motion.div
          animate={{
            rotate: displayData.isPlaying ? 360 : 0,
          }}
          transition={{
            duration: 14,
            repeat: displayData.isPlaying
              ? Infinity
              : 0,
            ease: 'linear',
          }}
          className="
            relative
            w-[52px]
            h-[52px]
            shrink-0
            rounded-xl
            overflow-hidden
            border
            border-neutral-200
            dark:border-white/10
          "
        >
          <Image
            src={displayData.albumImageUrl}
            alt={displayData.title}
            fill
            sizes="52px"
            unoptimized
            className="object-cover"
          />
        </motion.div>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-neutral-900 dark:text-white truncate">
            {displayData.title}
          </p>

          <p className="text-[11px] text-neutral-500 dark:text-white/45 mt-0.5 truncate">
            {displayData.artist}
          </p>

          {/* Equalizer */}
          <div className="flex items-end gap-[2px] mt-2 h-3.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: displayData.isPlaying
                    ? [4, 10, 6, 12, 4]
                    : 4,
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.08,
                  ease: 'easeInOut',
                }}
                className="w-[3px] bg-green-500 rounded-sm"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-3.5">
        <div className="h-[3px] bg-neutral-200 dark:bg-white/[0.08] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#1DB954] rounded-full"
            animate={{
              width: displayData.isPlaying
                ? `${progressPercent}%`
                : '100%',
            }}
            transition={{
              duration: 1,
              ease: 'linear',
            }}
          />
        </div>

        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-neutral-400 dark:text-white/30">
            {displayData.isPlaying
              ? formatTime(liveProgress)
              : 'Paused'}
          </span>

          <span className="text-[10px] text-neutral-400 dark:text-white/30">
            {formatTime(displayData.duration)}
          </span>
        </div>
      </div>
    </motion.div>
  )
}