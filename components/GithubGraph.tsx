'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GitCommit, Flame, Trophy } from 'lucide-react'
import { GitHubResponse, DayData, GithubTheme, DEFAULT_GITHUB_THEME } from '@/lib/github'

interface GithubGraphProps {
  initialData?: GitHubResponse
  theme?: GithubTheme
}

function getDefaultFallback(): GitHubResponse {
  const weeks: DayData[][] = []
  const today = new Date()
  for (let w = 51; w >= 0; w--) {
    const week: DayData[] = []
    for (let d = 0; d < 7; d++) {
      const dateObj = new Date(today)
      dateObj.setDate(dateObj.getDate() - (w * 7 + (6 - d)))
      const dateStr = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
      week.push({
        date: dateStr,
        count: 0,
        level: 0,
      })
    }
    weeks.push(week)
  }
  return {
    weeks,
    totalContributions: 0,
    currentStreak: 0,
    maxStreak: 0,
    isLive: false,
  }
}

export default function GithubGraph({ initialData, theme }: GithubGraphProps) {
  const [hoveredDay, setHoveredDay] = useState<{ day: DayData; wIndex: number; dIndex: number } | null>(null)

  const rawData = initialData || getDefaultFallback()
  const activeTheme = theme && theme.light && theme.dark ? theme : DEFAULT_GITHUB_THEME

  // Format weeks array: Fill missing days in week 0 at the start so the first column is complete
  const processedWeeks = useMemo(() => {
    const baseWeeks = rawData.weeks && rawData.weeks.length > 0 
      ? rawData.weeks.map(w => [...w]) 
      : getDefaultFallback().weeks

    if (baseWeeks.length > 0 && baseWeeks[0].length < 7) {
      const firstWeek = baseWeeks[0]
      const missingCount = 7 - firstWeek.length
      const firstDay = firstWeek[0]
      const firstDate = firstDay ? (firstDay.rawDate ? new Date(firstDay.rawDate) : new Date(firstDay.date)) : new Date()

      const startPadding: DayData[] = []
      for (let i = missingCount; i > 0; i--) {
        const dateObj = new Date(firstDate)
        dateObj.setDate(dateObj.getDate() - i)
        const dateStr = dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
        startPadding.push({
          date: dateStr,
          rawDate: dateObj.toISOString(),
          count: 0,
          level: 0,
        })
      }

      baseWeeks[0] = [...startPadding, ...firstWeek]
    }

    return baseWeeks
  }, [rawData.weeks])

  const cssVars = {
    '--gh-l0-light': activeTheme.light.level0,
    '--gh-l1-light': activeTheme.light.level1,
    '--gh-l2-light': activeTheme.light.level2,
    '--gh-l3-light': activeTheme.light.level3,
    '--gh-l4-light': activeTheme.light.level4,

    '--gh-l0-dark': activeTheme.dark.level0,
    '--gh-l1-dark': activeTheme.dark.level1,
    '--gh-l2-dark': activeTheme.dark.level2,
    '--gh-l3-dark': activeTheme.dark.level3,
    '--gh-l4-dark': activeTheme.dark.level4,
  } as React.CSSProperties

  const getLevelClass = (level: 0 | 1 | 2 | 3 | 4) => {
    switch (level) {
      case 0:
        return 'bg-[var(--gh-l0-light)] dark:bg-[var(--gh-l0-dark)]'
      case 1:
        return 'bg-[var(--gh-l1-light)] dark:bg-[var(--gh-l1-dark)]'
      case 2:
        return 'bg-[var(--gh-l2-light)] dark:bg-[var(--gh-l2-dark)]'
      case 3:
        return 'bg-[var(--gh-l3-light)] dark:bg-[var(--gh-l3-dark)]'
      case 4:
        return 'bg-[var(--gh-l4-light)] dark:bg-[var(--gh-l4-dark)]'
      default:
        return 'bg-[var(--gh-l0-light)] dark:bg-[var(--gh-l0-dark)]'
    }
  }

  const monthLabels = useMemo(() => {
    if (!processedWeeks || processedWeeks.length === 0) return []

    const labels: { name: string; colIndex: number }[] = []
    let lastMonth = -1

    processedWeeks.forEach((week, wIndex) => {
      const sampleDay = week[3] || week[0]
      if (!sampleDay) return

      const dateObj = sampleDay.rawDate ? new Date(sampleDay.rawDate) : new Date(sampleDay.date)
      if (isNaN(dateObj.getTime())) return

      const month = dateObj.getMonth()
      if (month !== lastMonth) {
        const lastCol = labels[labels.length - 1]?.colIndex ?? -10
        if (wIndex - lastCol >= 3) {
          labels.push({
            name: dateObj.toLocaleDateString('en-US', { month: 'short' }),
            colIndex: wIndex,
          })
          lastMonth = month
        }
      }
    })

    return labels
  }, [processedWeeks])

  return (
    <section style={cssVars} className="w-full space-y-3 py-2 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-mono">
          GitHub Activity
        </h2>

        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-600 dark:text-zinc-400">
          <GitCommit className="w-3.5 h-3.5 text-zinc-400" />
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {rawData.totalContributions.toLocaleString()}
          </span>
          <span className="text-zinc-400 dark:text-zinc-500">contributions</span>
        </div>
      </div>

      {/* Graph Area */}
      <div className="w-full relative">
        {/* Month Labels */}
        <div className="relative w-full h-4 text-[9px] sm:text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mb-1.5 overflow-hidden">
          {monthLabels.map((m, i) => (
            <span
              key={`${m.name}-${i}`}
              className="absolute"
              style={{
                left: `${(m.colIndex / Math.max(processedWeeks.length, 1)) * 100}%`,
              }}
            >
              {m.name}
            </span>
          ))}
        </div>

        {/* Contribution Grid */}
        <div className="flex w-full justify-between gap-[1.5px] sm:gap-[2px] md:gap-[2.5px] relative">
          {processedWeeks.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col flex-1 gap-[1.5px] sm:gap-[2px] md:gap-[2.5px]">
              {week.map((day, dIndex) => (
                <div
                  key={`${wIndex}-${dIndex}`}
                  onMouseEnter={() => setHoveredDay({ day, wIndex, dIndex })}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`w-full aspect-square rounded-[1px] sm:rounded-[2px] transition-colors duration-150 hover:brightness-125 dark:hover:brightness-135 hover:ring-1 hover:ring-zinc-900 dark:hover:ring-zinc-100 hover:ring-inset cursor-pointer ${getLevelClass(
                    day.level
                  )}`}
                />
              ))}
            </div>
          ))}

          {/* Floating Tooltip positioned inside relative container to prevent layout shifts */}
          <AnimatePresence>
            {hoveredDay && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                style={{
                  left: `${((hoveredDay.wIndex + 0.5) / processedWeeks.length) * 100}%`,
                }}
                className="absolute top-[-32px] -translate-x-1/2 z-30 pointer-events-none px-2.5 py-1 rounded-md bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-[11px] font-mono shadow-md border border-zinc-700 dark:border-zinc-300 whitespace-nowrap"
              >
                <span className="font-semibold">{hoveredDay.day.count} commits</span> on {hoveredDay.day.date}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Streaks Layout Directly Below Graph */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono pt-3 mt-1">
          {/* Streak Metrics */}
          <div className="flex flex-wrap items-center gap-5 sm:gap-7">
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-zinc-500 dark:text-zinc-400">Current Streak:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{rawData.currentStreak} days</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
              <span className="text-zinc-500 dark:text-zinc-400">Max Streak:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{rawData.maxStreak} days</span>
            </div>
          </div>

          {/* Less / More Legend */}
          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-zinc-400 dark:text-zinc-500">
            <span>Less</span>
            {([0, 1, 2, 3, 4] as const).map((lvl) => (
              <div
                key={lvl}
                className={`w-2.5 h-2.5 rounded-[2px] ${getLevelClass(lvl)}`}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  )
}