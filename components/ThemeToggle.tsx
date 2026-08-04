'use client'

import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useToggleSound } from '@/hooks/useToggleSound'

interface ThemeToggleProps {
  isDark: boolean
  toggleTheme: () => void
  className?: string
  soundUrl?: string
  volume?: number
}

/**
 * Dedicated ThemeToggle button component.
 * Uses the preloaded useToggleSound hook for zero-latency playback on click.
 */
export default function ThemeToggle({
  isDark,
  toggleTheme,
  className = '',
  soundUrl = '/sounds/toggle.mp3',
  volume = 0.25,
}: ThemeToggleProps) {
  const playToggleSound = useToggleSound({ soundUrl, volume })

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    playToggleSound()
    toggleTheme()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative inline-flex items-center justify-center p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors focus:outline-none ${className}`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400" />
      ) : (
        <Moon className="w-5 h-5 text-zinc-600" />
      )}
    </button>
  )
}
