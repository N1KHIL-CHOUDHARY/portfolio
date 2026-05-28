'use client'

import { motion } from 'framer-motion'
import useSWR from 'swr'
import { useRef, useState, useEffect } from 'react'

const BAR_COUNT = 12
const fetcher = (url: string) => fetch(url).then((res) => res.json())

type NowPlayingData = {
  isPlaying: boolean
  title: string
  artist: string
  albumImageUrl: string
  progress: number
  duration: number
}

export default function NowPlaying() {
  // 1. Initial State from localStorage to prevent "flicker" on refresh
  const [fallbackData, setFallbackData] = useState<NowPlayingData | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('last-song')
    if (saved) setFallbackData(JSON.parse(saved))
  }, [])

  const { data } = useSWR<NowPlayingData>('/api/now-playing', fetcher, {
    refreshInterval: 10000,
    dedupingInterval: 0,
    fallbackData: fallbackData || undefined,
  })

  // 2. Sync to localStorage
  useEffect(() => {
    if (data?.title) localStorage.setItem('last-song', JSON.stringify(data))
  }, [data])

  const displayData = data || fallbackData
  const [liveProgress, setLiveProgress] = useState(0)
  const progressRef = useRef({ progress: 0, fetchedAt: Date.now() })

  // 3. Live Progress Sync
  useEffect(() => {
    if (!data) return
    progressRef.current = { progress: data.progress || 0, fetchedAt: Date.now() }
    setLiveProgress(data.progress || 0)
  }, [data])

  useEffect(() => {
    if (!data?.isPlaying) return
    const iv = setInterval(() => {
      const elapsed = Date.now() - progressRef.current.fetchedAt
      const next = Math.min((progressRef.current.progress || 0) + elapsed, data.duration || 1)
      setLiveProgress(next)
    }, 1000)
    return () => clearInterval(iv)
  }, [data?.isPlaying, data?.duration])

  if (!displayData) return null

  const pct = displayData.duration > 0 ? Math.min(Math.round((liveProgress / displayData.duration) * 100), 100) : 0
  const fmt = (ms: number) => {
    const s = Math.floor((ms || 0) / 1000)
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  }

  return (
    <div className="w-[280px] p-4 bg-white/75 dark:bg-neutral-900/75 backdrop-blur-2xl rounded-3xl border border-neutral-200 dark:border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-1.5">
          <motion.span 
            animate={{ opacity: data?.isPlaying ? [1, 0.25, 1] : 1 }} 
            className={`w-2 h-2 rounded-full ${data?.isPlaying ? 'bg-green-500' : 'bg-red-500'}`} 
          />
          <span className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 dark:text-white/45">
            {data?.isPlaying ? 'Listening to' : 'Last Played'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <motion.img
          animate={{ rotate: data?.isPlaying ? 360 : 0 }}
          transition={{ duration: 8, repeat: data?.isPlaying ? Infinity : 0, ease: 'linear' }}
          src={displayData.albumImageUrl || ''}
          alt={displayData.title || 'Album Art'}
          className="w-13 h-13 rounded-xl border border-neutral-200 dark:border-white/10 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-neutral-900 dark:text-white truncate">{displayData.title || 'Unknown'}</p>
          <p className="text-[11px] text-neutral-500 dark:text-white/45 mt-0.5 truncate">{displayData.artist || '-'}</p>
          <div className="flex items-end gap-[2px] mt-2 h-3.5">
            {Array.from({ length: BAR_COUNT }).map((_, i) => (
              <div key={i} style={{ height: data?.isPlaying ? '100%' : '4px' }} className="w-[3px] bg-green-500 rounded-sm" />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3.5">
        <div className="h-[3px] bg-neutral-200 dark:bg-white/[0.08] rounded-full overflow-hidden">
          <motion.div className="h-full bg-[#1DB954] rounded-full" animate={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-neutral-400 dark:text-white/30">{fmt(liveProgress)}</span>
          <span className="text-[10px] text-neutral-400 dark:text-white/30">{fmt(displayData.duration)}</span>
        </div>
      </div>
    </div>
  )
}