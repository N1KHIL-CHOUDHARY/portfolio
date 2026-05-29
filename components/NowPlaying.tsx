'use client'

import Image from 'next/image'
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
   * Instant local data on refresh
   */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('last-song')

      if (saved) {
        const parsed = JSON.parse(saved)

        setFallbackData(parsed)
      }
    } catch {}
  }, [])

  /*
   * Spotify data
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
   * Persist latest song
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
   * Live progress animation
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

  /*
   * Avoid recalculation every render
   */
  const progressPercent = useMemo(() => {
    if (!displayData?.duration) return 0

    return Math.min(
      (liveProgress / displayData.duration) * 100,
      100
    )
  }, [liveProgress, displayData])

  if (!displayData) return null

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000)

    return `${Math.floor(s / 60)}:${String(
      s % 60
    ).padStart(2, '0')}`
  }

  return (
    <div
      className="
        w-[280px]
        p-4
        bg-[#fdfbf7]
        dark:bg-[#1c1b18]
        border-4
        border-black
        dark:border-white
        shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]
        dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)]
        rotate-[-2deg]
        hover:rotate-0
        transition-transform
        duration-200
        will-change-transform
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b-4 border-dotted border-black dark:border-white pb-2">
        <div className="flex items-center gap-2">
          <span
            className={`
              w-3
              h-3
              border-2
              border-black
              dark:border-white
              ${displayData.isPlaying ? 'bg-[#1DB954]' : 'bg-neutral-300'}
            `}
          />

          <span className="text-[11px] font-bold tracking-widest uppercase text-black dark:text-white">
            {displayData.isPlaying
              ? 'Now Playing'
              : 'Last Played'}
          </span>
        </div>

        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="#1DB954"
          className="rounded-full"
        >
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      </div>

      {/* Song */}
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 shrink-0 border-2 border-black dark:border-white overflow-hidden rounded-sm">
          <Image
            src={displayData.albumImageUrl}
            alt={displayData.title}
            fill
            sizes="56px"
            unoptimized
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-black dark:text-white truncate">
            {displayData.title}
          </p>

          <p className="text-[11px] uppercase tracking-tight text-black/70 dark:text-white/70 truncate">
            {displayData.artist}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="h-[8px] border-2 border-black dark:border-white overflow-hidden">
          <div
            className="
              h-full
              bg-[#1DB954]
              transition-[width]
              duration-1000
              ease-linear
            "
            style={{
              width: displayData.isPlaying
                ? `${progressPercent}%`
                : '100%',
            }}
          />
        </div>

        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] font-bold uppercase text-black dark:text-white">
            {displayData.isPlaying
              ? formatTime(liveProgress)
              : 'Paused'}
          </span>

          <span className="text-[10px] font-bold uppercase text-black dark:text-white">
            {formatTime(displayData.duration)}
          </span>
        </div>
      </div>
    </div>
  )
}