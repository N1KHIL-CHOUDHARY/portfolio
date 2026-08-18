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
    <div className="p-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md space-y-3 relative overflow-hidden group hover:border-zinc-700 transition-all duration-200 shadow-lg font-sans">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
          {title}
        </span>
        <div className="p-2 rounded-xl bg-zinc-800/80 text-zinc-300 group-hover:text-white group-hover:bg-zinc-700 transition-colors">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
          {value}
        </div>

        {trend && (
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
              trend.positive
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700/50'
            }`}
          >
            {trend.label}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-xs font-mono text-zinc-500 pt-1 border-t border-zinc-800/50 truncate">
          {subtext}
        </p>
      )}
    </div>
  )
}
