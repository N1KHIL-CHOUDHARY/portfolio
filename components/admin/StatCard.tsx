import React from 'react'
import { FolderKanban, Briefcase, Award, Cpu, Eye, Image as ImageIcon } from 'lucide-react'

export type StatIconType = 'projects' | 'experience' | 'certifications' | 'skills' | 'visitors' | 'media'

export interface StatCardProps {
  title: string
  value: string | number
  subtext?: string
  iconType?: StatIconType
  trend?: {
    label: string
    positive?: boolean
  }
}

export default function StatCard({
  title,
  value,
  subtext,
  iconType = 'projects',
  trend,
}: StatCardProps) {
  let Icon = FolderKanban
  switch (iconType) {
    case 'experience':
      Icon = Briefcase
      break
    case 'certifications':
      Icon = Award
      break
    case 'skills':
      Icon = Cpu
      break
    case 'visitors':
      Icon = Eye
      break
    case 'media':
      Icon = ImageIcon
      break
    case 'projects':
    default:
      Icon = FolderKanban
      break
  }

  return (
    <div className="p-4 sm:p-5 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 hover:border-neutral-400 dark:hover:border-neutral-700 transition-all duration-200 space-y-3 font-mono">
      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold">
          {title}
        </span>
        <div className="p-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          {value}
        </div>

        {trend && (
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
              trend.positive
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700'
            }`}
          >
            {trend.label}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 pt-2 border-t border-dashed border-neutral-200 dark:border-neutral-800/80 truncate">
          {subtext}
        </p>
      )}
    </div>
  )
}
