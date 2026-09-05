'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Award,
  Terminal,
  Cpu,
  ImageIcon,
  BarChart3,
  Settings,
  ChevronRight,
  ExternalLink,
  Wrench,
  Quote,
  GitPullRequest,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: string
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Telemetry & Views', href: '/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Portfolio Content',
    items: [
      { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
      { label: 'Experience & Roles', href: '/admin/experience', icon: Briefcase },
      { label: 'Skills Matrix', href: '/admin/skills', icon: Cpu },
      { label: 'Certifications', href: '/admin/certifications', icon: Award },
    ],
  },
  {
    title: 'Showcase & Setup',
    items: [
      { label: 'Open Source PRs', href: '/admin/opensource', icon: GitPullRequest },
      { label: 'Hardware & Gear', href: '/admin/gears', icon: Wrench },
      { label: 'Development Setup', href: '/admin/development', icon: Terminal },
      { label: 'Daily Quotes', href: '/admin/quotes', icon: Quote },
    ],
  },
  {
    title: 'System & Configuration',
    items: [
      { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
      { label: 'Site Configuration', href: '/admin/settings', icon: Settings },
    ],
  },
]

export const ADMIN_NAV_ITEMS: NavItem[] = ADMIN_NAV_GROUPS.flatMap((g) => g.items)

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen?: boolean
  onClose?: () => void
}) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white dark:bg-neutral-950 border-r border-dashed border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 font-mono ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo Header */}
        <div className="h-14 px-5 border-b border-dashed border-neutral-300 dark:border-neutral-800 flex items-center justify-between shrink-0">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-bold flex items-center justify-center text-xs group-hover:scale-105 transition-transform">
              N
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 tracking-tight leading-none">
                Nikhil CMS
              </div>
              <div className="text-[9px] text-neutral-500 dark:text-neutral-400 tracking-wider pt-0.5">
                BLUEPRINT STUDIO
              </div>
            </div>
          </Link>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="View Live Portfolio"
            className="p-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Navigation Items Groups */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
          {ADMIN_NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-2.5 pb-1 text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-semibold">
                {group.title}
              </div>

              {group.items.map((item) => {
                const Icon = item.icon
                const isActive =
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname === item.href || pathname.startsWith(item.href + '/')

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all duration-200 ${
                      isActive
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-neutral-50 font-semibold border border-neutral-300/80 dark:border-neutral-700/80 shadow-xs'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 hover:bg-neutral-100/70 dark:hover:bg-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        className={`w-3.5 h-3.5 transition-colors ${
                          isActive
                            ? 'text-neutral-950 dark:text-neutral-100'
                            : 'text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {isActive && (
                      <ChevronRight className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </div>

        {/* System Status Footer */}
        <div className="p-3 border-t border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 shrink-0">
          <div className="flex items-center justify-between text-[11px] text-neutral-600 dark:text-neutral-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Database Connected</span>
            </span>
            <span className="text-[10px] text-neutral-400">v2.0</span>
          </div>
        </div>
      </aside>
    </>
  )
}
