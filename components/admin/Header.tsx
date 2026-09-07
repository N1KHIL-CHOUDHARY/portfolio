'use client'

import React, { useTransition } from 'react'
import Link from 'next/link'
import { Menu, ExternalLink, LogOut, ShieldCheck, Search, Command } from 'lucide-react'
import { logoutAdmin } from '@/actions/auth'
import ThemeToggle from '@/components/layout/ThemeToggle'

export default function Header({
  onOpenSidebar,
  onOpenCommandPalette,
}: {
  onOpenSidebar?: () => void
  onOpenCommandPalette?: () => void
}) {
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAdmin()
    })
  }

  return (
    <header className="h-14 border-b border-dashed border-neutral-300 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between font-mono text-xs">
      {/* Left section: Mobile menu toggle & quick search */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="p-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 lg:hidden transition-colors cursor-pointer"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>

        {onOpenCommandPalette && (
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <span>Search admin...</span>
            <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-neutral-200 dark:bg-neutral-800 text-[10px] text-neutral-600 dark:text-neutral-400">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>
        )}
      </div>

      {/* Right section: Theme Toggle, Live Portfolio Link, Admin Badge & Logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-neutral-100 hover:border-neutral-400 dark:hover:border-neutral-700 transition-all"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Admin Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin</span>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isPending}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-md bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}
