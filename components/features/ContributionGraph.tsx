'use client'

import React, { useState, useMemo, useCallback, memo } from 'react'
import { GitHubResponse, DayData, GithubTheme, DEFAULT_GITHUB_THEME } from '@/lib/github'

export interface ContributionGraphProps {
  githubData?: GitHubResponse
  leetcodeData?: GitHubResponse
  theme?: GithubTheme
}

const LEVEL_CLASSES: Record<number, string> = {
  0: 'bg-[var(--gh-l0-light)] dark:bg-[var(--gh-l0-dark)] ring-1 ring-black/[0.04] dark:ring-white/[0.05]',
  1: 'bg-[var(--gh-l1-light)] dark:bg-[var(--gh-l1-dark)]',
  2: 'bg-[var(--gh-l2-light)] dark:bg-[var(--gh-l2-dark)]',
  3: 'bg-[var(--gh-l3-light)] dark:bg-[var(--gh-l3-dark)]',
  4: 'bg-[var(--gh-l4-light)] dark:bg-[var(--gh-l4-dark)]',
}

const DayCell = memo(function DayCell({
  day,
  wIndex,
  dIndex,
  onHover,
  onLeave,
}: {
  day: DayData
  wIndex: number
  dIndex: number
  onHover: (day: DayData, wIndex: number, dIndex: number) => void
  onLeave: () => void
}) {
  return (
    <div
      onMouseEnter={() => onHover(day, wIndex, dIndex)}
      onMouseLeave={onLeave}
      className={`w-full aspect-square rounded-[3px] transition-all duration-150 cursor-pointer hover:scale-[1.18] hover:z-20 hover:brightness-110 dark:hover:brightness-125 hover:ring-1 hover:ring-neutral-900/40 dark:hover:ring-neutral-100/50 ${
        LEVEL_CLASSES[day.level] || LEVEL_CLASSES[0]
      }`}
    />
  )
})

function buildNovToOctGrid(endYear = new Date().getFullYear()): DayData[][] {
  const startDate = new Date(endYear - 1, 10, 1) // Nov 1
  const endDate = new Date(endYear, 9, 31)        // Oct 31

  const cursor = new Date(startDate)
  cursor.setDate(cursor.getDate() - cursor.getDay())

  const weeks: DayData[][] = []

  while (cursor <= endDate || cursor.getDay() !== 0) {
    const week: DayData[] = []
    for (let d = 0; d < 7; d++) {
      week.push({
        date: cursor.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        rawDate: cursor.toISOString(),
        count: 0,
        level: 0,
      })
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
    if (cursor > endDate && cursor.getDay() === 0) break
  }

  return weeks
}

function normalizeKey(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function ContributionGraph({ githubData, leetcodeData, theme }: ContributionGraphProps) {
  const [activeTab, setActiveTab] = useState<'github' | 'leetcode'>('github')
  const [hoveredDay, setHoveredDay] = useState<{ day: DayData; wIndex: number; dIndex: number } | null>(null)

  const activeData = activeTab === 'github' ? githubData : leetcodeData
  const activeTheme = theme && theme.light && theme.dark ? theme : DEFAULT_GITHUB_THEME

  const { processedWeeks, totalCount } = useMemo(() => {
    const endYear = new Date().getFullYear()
    const templateWeeks = buildNovToOctGrid(endYear)

    const startDate = new Date(endYear - 1, 10, 1)
    const endDate = new Date(endYear, 9, 31, 23, 59, 59)

    const dataMap = new Map<string, DayData>()
    if (activeData?.weeks) {
      activeData.weeks.flat().forEach((d) => {
        const key = normalizeKey(d.rawDate || d.date)
        dataMap.set(key, d)
      })
    }

    let calculatedTotal = 0

    const mappedWeeks: DayData[][] = templateWeeks.map((week) =>
      week.map((day): DayData => {
        const dayDate = new Date(day.rawDate || day.date)
        const key = normalizeKey(day.rawDate || day.date)
        const matched = dataMap.get(key)

        if (dayDate < startDate || dayDate > endDate) {
          return { ...day, count: 0, level: 0 }
        }

        if (matched) {
          calculatedTotal += matched.count
          const safeLevel = Math.max(0, Math.min(4, matched.level ?? 0)) as DayData['level']

          return {
            ...day,
            count: matched.count,
            level: safeLevel,
            date: matched.date || day.date,
          }
        }

        return day
      })
    )

    return {
      processedWeeks: mappedWeeks,
      totalCount: activeData?.totalContributions || calculatedTotal,
    }
  }, [activeData])

  const cssVars = {
    '--gh-l0-light': activeTheme.light.level0 || '#ebedf0',
    '--gh-l1-light': activeTheme.light.level1 || '#9be9a8',
    '--gh-l2-light': activeTheme.light.level2 || '#40c463',
    '--gh-l3-light': activeTheme.light.level3 || '#30a14e',
    '--gh-l4-light': activeTheme.light.level4 || '#216e39',

    '--gh-l0-dark': activeTheme.dark.level0 || '#161b22',
    '--gh-l1-dark': activeTheme.dark.level1 || '#0e4429',
    '--gh-l2-dark': activeTheme.dark.level2 || '#006d32',
    '--gh-l3-dark': activeTheme.dark.level3 || '#26a641',
    '--gh-l4-dark': activeTheme.dark.level4 || '#39d353',
  } as React.CSSProperties

  const monthLabels = useMemo(() => {
    if (!processedWeeks.length) return []

    const labels: { name: string; colIndex: number }[] = []
    let lastMonth = -1

    processedWeeks.forEach((week, wIndex) => {
      const sampleDay = week[3] || week[0]
      if (!sampleDay) return

      const dateObj = new Date(sampleDay.rawDate || sampleDay.date)
      if (isNaN(dateObj.getTime())) return

      const month = dateObj.getMonth()
      if (month !== lastMonth) {
        const lastCol = labels[labels.length - 1]?.colIndex ?? -10
        if (wIndex - lastCol >= 3) {
          labels.push({
            name: dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
            colIndex: wIndex,
          })
          lastMonth = month
        }
      }
    })

    return labels
  }, [processedWeeks])

  const handleHover = useCallback((day: DayData, wIndex: number, dIndex: number) => {
    setHoveredDay({ day, wIndex, dIndex })
  }, [])

  const handleLeave = useCallback(() => {
    setHoveredDay(null)
  }, [])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between py-1">
        <h2 className="text-[15px] sm:text-[16px] font-medium tracking-tight text-neutral-600 dark:text-neutral-500 leading-[1.2]">
          {activeTab === 'github' ? (
            <>
              <span className="text-neutral-400 dark:text-neutral-500 mr-1 select-none">#</span>
              contributions
            </>
          ) : (
            <>
              <span className="text-neutral-400 dark:text-neutral-500 mr-1 select-none">#</span>
              submissions
            </>
          )}
        </h2>

        <div className="inline-flex items-center gap-1.5 text-[12px] font-medium select-none">
          <button
            type="button"
            onClick={() => { setActiveTab('github'); setHoveredDay(null); }}
            className={`transition-colors cursor-pointer ${
              activeTab === 'github'
                ? 'text-neutral-900 dark:text-neutral-100 font-semibold'
                : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            github
          </button>
          <span className="text-neutral-300 dark:text-neutral-600 select-none">/</span>
          <button
            type="button"
            onClick={() => { setActiveTab('leetcode'); setHoveredDay(null); }}
            className={`transition-colors cursor-pointer ${
              activeTab === 'leetcode'
                ? 'text-neutral-900 dark:text-neutral-100 font-semibold'
                : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            leetcode
          </button>
        </div>
      </div>

      <section style={cssVars} className="w-full space-y-3 py-2 select-none">
        <div className="w-full overflow-x-auto sm:overflow-x-visible overflow-y-visible pt-8 pb-1 scrollbar-thin">
          <div className="min-w-[700px] sm:min-w-full sm:w-full">
            <div className="relative h-4 text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mb-2.5">
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

            <div className="flex relative gap-[3px] sm:gap-[2.5px] w-full">
              {processedWeeks.map((week, wIndex) => (
                <div
                  key={wIndex}
                  className="flex flex-col flex-1 gap-[3px] sm:gap-[2.5px]"
                >
                  {week.map((day, dIndex) => (
                    <DayCell
                      key={`${wIndex}-${dIndex}`}
                      day={day}
                      wIndex={wIndex}
                      dIndex={dIndex}
                      onHover={handleHover}
                      onLeave={handleLeave}
                    />
                  ))}
                </div>
              ))}

              {hoveredDay && (
                <div
                  style={{
                    left: `${((hoveredDay.wIndex + 0.5) / processedWeeks.length) * 100}%`,
                  }}
                  className="
                    absolute top-[-36px] -translate-x-1/2 z-30
                    pointer-events-none
                    px-2.5 py-1 rounded-[5px]
                    bg-neutral-900 dark:bg-neutral-100
                    text-neutral-100 dark:text-neutral-900
                    text-[11px] font-mono shadow-md
                    border border-neutral-700/60 dark:border-neutral-300/60
                    whitespace-nowrap animate-tooltip-in
                  "
                >
                  <span className="font-semibold">
                    {hoveredDay.day.count} {activeTab === 'github' ? 'commits' : 'submissions'}
                  </span>{' '}
                  on {hoveredDay.day.date}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px] sm:text-[13px] pt-2">
          <div className="flex flex-wrap items-center gap-5 sm:gap-7">
            <div className="flex items-center gap-1.5 font-mono text-[12px]">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                {totalCount.toLocaleString()}
              </span>
              <span className="text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                {activeTab === 'github' ? 'COMMITS · NOV–OCT' : 'SUBMISSIONS · NOV–OCT'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
            <span>LESS</span>
            {([0, 1, 2, 3, 4] as const).map((lvl) => (
              <div
                key={lvl}
                className={`w-[11px] h-[11px] rounded-[2.5px] ${LEVEL_CLASSES[lvl]}`}
              />
            ))}
            <span>MORE</span>
          </div>
        </div>
      </section>
    </div>
  )
}