'use client'

import React, { useTransition } from 'react'
import Link from 'next/link'
import { Menu, Search, ExternalLink, LogOut, ShieldCheck, Command } from 'lucide-react'
import { logoutAdmin } from '@/actions/auth'

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
    <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between font-sans">
      {/* Left section: Mobile menu & Quick Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 lg:hidden transition-colors"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Command Palette Search Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all font-mono text-xs shadow-xs w-48 sm:w-64"
        >
          <Search className="w-3.5 h-3.5 text-zinc-500" />
          <span className="flex-1 text-left truncate">Search CMS...</span>
          <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 border border-zinc-700/50">
            <Command className="w-2.5 h-2.5" /> K
          </span>
        </button>
      </div>

      {/* Right section: Live Portfolio Link & Admin Logout */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all"
        >
          <span>Live Portfolio</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Admin Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 hover:text-rose-200 text-xs font-mono transition-all flex items-center gap-1.5 disabled:opacity-50"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}
