'use client'

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

  useEffect(() => {
    if (data?.title) {
      localStorage.setItem('last-song', JSON.stringify(data))
    }
  }, [data])

  const displayData = data || fallbackData
  
  const [heights] = useState<number[]>(Array(BAR_COUNT).fill(4))
  const [liveProgress, setLiveProgress] = useState(0)
  const progressRef = useRef({ progress: 0, fetchedAt: Date.now() })

  useEffect(() => {
    if (!data) return
    if (data.isPlaying) {
      progressRef.current = { progress: data.progress, fetchedAt: Date.now() }
      setLiveProgress(data.progress)
    } else {
      setLiveProgress(data.progress)
    }
  }, [data])

  useEffect(() => {
    if (!data?.isPlaying) return
    const iv = setInterval(() => {
      const elapsed = Date.now() - progressRef.current.fetchedAt
      const next = Math.min(progressRef.current.progress + elapsed, data.duration)
      setLiveProgress(next)
    }, 1000)
    return () => clearInterval(iv)
  }, [data?.isPlaying, data?.duration])

  if (!displayData) return null

  const pct = Math.min(Math.round((liveProgress / displayData.duration) * 100), 100)
  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000)
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  }

  return (
    <div className="w-[280px] p-4 bg-[#fdfbf7] dark:bg-[#1c1b18] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] rotate-[-3deg] hover:rotate-0 transition-transform duration-200">
      <div className="flex items-center justify-between mb-3.5 border-b-4 border-black dark:border-white pb-2 border-dotted">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-3 h-3 border-2 border-black dark:border-white ${data?.isPlaying ? 'bg-[#1DB954]' : 'bg-[#d3d3d3]'}`}
          />
          <span className="text-[12px] font-bold tracking-widest uppercase text-black dark:text-white font-serif">
            {data?.isPlaying ? 'Now Spinning' : 'Last Track'}
          </span>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1DB954" className="border-2 border-black bg-black rounded-full">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      </div>

      <div className="flex items-center gap-3">
        <img
          src={displayData.albumImageUrl}
          alt={displayData.title}
          className={`w-14 h-14 border-2 border-black dark:border-white object-cover rounded-sm`}
        />
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-black dark:text-white truncate font-serif">{displayData.title}</p>
          <p className="text-[12px] font-mono text-black/70 dark:text-white/70 mt-0.5 truncate uppercase tracking-tight">{displayData.artist}</p>
          <div className="flex items-end gap-[3px] mt-2 h-3.5">
            {heights.map((h, i) => (
              <div key={i} style={{ height: data?.isPlaying ? h : 4 }} className="w-[4px] bg-black dark:bg-white transition-all duration-300" />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-[8px] bg-transparent border-2 border-black dark:border-white w-full">
          <div className="h-full bg-[#1DB954] transition-all duration-1000 ease-linear border-r-2 border-black" style={{ width: data?.isPlaying ? `${pct}%` : '100%' }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[11px] font-bold text-black dark:text-white uppercase">{data?.isPlaying ? fmt(liveProgress) : 'Paused'}</span>
          <span className="text-[11px] font-bold text-black dark:text-white uppercase">{fmt(displayData.duration)}</span>
        </div>
      </div>
    </div>
  )
}