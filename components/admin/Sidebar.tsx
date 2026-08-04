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
  User,
  FileText,
  Share2,
  Globe,
  Image as ImageIcon,
  BarChart3,
  Trash2,
  Settings,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: string
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { label: 'Experience', href: '/admin/experience', icon: Briefcase },
  { label: 'Certifications', href: '/admin/certifications', icon: Award },
  { label: 'Development Setup', href: '/admin/development', icon: Terminal },
  { label: 'Skills', href: '/admin/skills', icon: Cpu },
  { label: 'Hero Section', href: '/admin/hero', icon: Sparkles },
  { label: 'About Section', href: '/admin/about', icon: User },
  { label: 'Social Links', href: '/admin/social', icon: Share2 },
  { label: 'SEO Settings', href: '/admin/seo', icon: Globe },
  { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Trash Bin', href: '/admin/trash', icon: Trash2 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

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
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-zinc-950 border-r border-zinc-800/80 text-zinc-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo Header */}
        <div className="h-16 px-5 border-b border-zinc-800/80 flex items-center justify-between shrink-0">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-950 font-mono font-bold flex items-center justify-center text-sm shadow-md group-hover:scale-105 transition-transform">
              N
            </div>
            <div>
              <div className="font-mono text-sm font-bold text-white tracking-tight leading-none">
                Nikhil CMS
              </div>
              <div className="text-[10px] font-mono text-zinc-500 tracking-wider">
                PORTFOLIO ADMIN
              </div>
            </div>
          </Link>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="View Live Portfolio"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-zinc-800">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Navigation
          </div>

          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all duration-200 ${
                  isActive
                    ? 'bg-zinc-800/90 text-white font-semibold shadow-xs border border-zinc-700/50'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-emerald-400'
                        : 'text-zinc-500 group-hover:text-zinc-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                )}
              </Link>
            )
          })}
        </div>

        {/* System Status Footer */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/50 shrink-0 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Neon DB Connected
            </span>
            <span className="text-zinc-500 text-[10px]">v1.0</span>
          </div>
        </div>
      </aside>
    </>
  )
}
