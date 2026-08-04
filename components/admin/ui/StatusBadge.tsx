'use client'

import React from 'react'

export type StatusType = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | string

export default function StatusBadge({ status }: { status: StatusType }) {
  let badgeStyle = 'bg-zinc-800 text-zinc-400 border-zinc-700/50'
  let label = status

  switch (status) {
    case 'PUBLISHED':
      badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      label = 'Published'
      break
    case 'DRAFT':
      badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      label = 'Draft'
      break
    case 'ARCHIVED':
      badgeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/20'
      label = 'Archived'
      break
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border ${badgeStyle}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'PUBLISHED'
            ? 'bg-emerald-400'
            : status === 'DRAFT'
            ? 'bg-amber-400'
            : 'bg-rose-400'
        }`}
      />
      <span>{label}</span>
    </span>
  )
}
