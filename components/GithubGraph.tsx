'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GitCommit, Flame, Trophy, CheckCircle2 } from 'lucide-react'

interface DayData {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

interface GitHubResponse {
  weeks: DayData[][]
  totalContributions: number
  currentStreak: number
  maxStreak: number
  isLive: boolean
  username?: string
}

export default function GithubGraph() {
  const [hoveredDay, setHoveredDay] = useState<{ day: DayData; x: number; y: number } | null>(null)
  const [liveData, setLiveData] = useState<GitHubResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function fetchGitHubData() {
      setLoading(true)
      try {
        const res = await fetch('/api/github')
        if (res.ok) {
          const data = await res.json()

          if (data.currentStreak > data.maxStreak) {
            data.maxStreak = data.currentStreak
          }

          if (data.weeks && isMounted) {
            setLiveData(data)
          }
        }
      } catch {
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchGitHubData()
    return () => {
      isMounted = false
    }
  }, [])

  const getLevelClass = (level: 0 | 1 | 2 | 3 | 4) => {
    switch (level) {
      case 0:
        return 'bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200/40 dark:border-zinc-700/40'
      case 1:
        return 'bg-zinc-200 dark:bg-zinc-700 border-zinc-300/60 dark:border-zinc-600'
      case 2:
        return 'bg-zinc-400 dark:bg-zinc-500 border-zinc-500/60 dark:border-zinc-400'
      case 3:
        return 'bg-zinc-600 dark:bg-zinc-400 border-zinc-700 dark:border-zinc-300'
      case 4:
        return 'bg-zinc-900 dark:bg-zinc-100 border-zinc-950 dark:border-white'
      default:
        return 'bg-zinc-100 dark:bg-zinc-800'
    }
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  if (loading) {
    return (
      <section className="w-full space-y-3 py-2 overflow-hidden animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="w-full h-32 border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-xl" />
      </section>
    )
  }

  if (!liveData) {
    return null
  }

  return (
    <section className="w-full space-y-3 py-2 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
            GitHub Activity
          </h2>

         
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-[11px] sm:text-xs font-mono">
          <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
            <GitCommit className="w-3 h-3 text-zinc-400" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {liveData.totalContributions.toLocaleString()}
            </span>
            <span className="text-zinc-400 dark:text-zinc-500">commits</span>
          </div>

          <span className="text-zinc-300 dark:text-zinc-700">•</span>

          <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
            <Flame className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{liveData.currentStreak}d</span>
            <span className="text-zinc-400 dark:text-zinc-500">streak</span>
          </div>

          <span className="text-zinc-300 dark:text-zinc-700">•</span>

          <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
            <Trophy className="w-3 h-3 text-zinc-400" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{liveData.maxStreak}d</span>
            <span className="text-zinc-400 dark:text-zinc-500">max</span>
          </div>
        </div>
      </div>

      <div className="w-full border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-xl p-3 sm:p-4 overflow-hidden">
        <div className="flex justify-between w-full text-[9px] sm:text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mb-1.5 px-0.5">
          {months.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>

        <div className="flex w-full justify-between gap-[1.5px] sm:gap-[2px] md:gap-[2.5px]">
          {liveData.weeks.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col flex-1 gap-[1.5px] sm:gap-[2px] md:gap-[2.5px]">
              {week.map((day, dIndex) => (
                <div
                  key={`${wIndex}-${dIndex}`}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    setHoveredDay({
                      day,
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                    })
                  }}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`w-full aspect-square rounded-[1px] sm:rounded-[2px] transition-all duration-200 border ${getLevelClass(
                    day.level
                  )} hover:scale-150 hover:z-20 hover:shadow-sm cursor-pointer`}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono text-zinc-400 dark:text-zinc-500 mt-3 pt-2.5 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <span>52-week activity</span>
          <div className="flex items-center gap-1">
            <span>Less</span>
            {([0, 1, 2, 3, 4] as const).map((lvl) => (
              <div
                key={lvl}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-[1px] sm:rounded-[2px] border ${getLevelClass(lvl)}`}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {hoveredDay && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: -38, scale: 1 }}
            exit={{ opacity: 0, y: 2, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              left: hoveredDay.x,
              top: hoveredDay.y,
              transform: 'translateX(-50%)',
            }}
            className="z-50 pointer-events-none px-2 py-0.5 rounded-md bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-[11px] font-mono shadow-md border border-zinc-700 dark:border-zinc-300 whitespace-nowrap"
          >
            <span className="font-semibold">{hoveredDay.day.count} commits</span> on {hoveredDay.day.date}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}