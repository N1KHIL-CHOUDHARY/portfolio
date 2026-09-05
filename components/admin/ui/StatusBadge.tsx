'use client'

import React from 'react'

export type StatusType = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | string

export default function StatusBadge({ status }: { status: StatusType }) {
  let badgeStyle = 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'
  let dotStyle = 'bg-neutral-400 dark:bg-neutral-500'
  let label = status

  switch (status) {
    case 'PUBLISHED':
      badgeStyle = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
      dotStyle = 'bg-emerald-500'
      label = 'Published'
      break
    case 'DRAFT':
      badgeStyle = 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
      dotStyle = 'bg-amber-500'
      label = 'Draft'
      break
    case 'ARCHIVED':
      badgeStyle = 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30'
      dotStyle = 'bg-rose-500'
      label = 'Archived'
      break
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${badgeStyle}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`} />
      <span>{label}</span>
    </span>
  )
}
