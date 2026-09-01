'use client'

import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useToggleSound } from '@/hooks/useToggleSound'
import { useTheme } from '@/hooks/useTheme'

interface ThemeToggleProps {
  isDark?: boolean
  toggleTheme?: () => void
  className?: string
  soundUrl?: string
  volume?: number
}

/**
 * Dedicated ThemeToggle button component with WCAG AA compliance,
 * optional sound feedback, and fallback to unified useTheme hook.
 */
export default function ThemeToggle({
  isDark: propIsDark,
  toggleTheme: propToggleTheme,
  className = '',
  soundUrl = '/sounds/click.mp3',
  volume = 0.25,
}: ThemeToggleProps) {
  const { isDark: hookIsDark, toggleTheme: hookToggleTheme, mounted } = useTheme()
  const playToggleSound = useToggleSound({ soundUrl, volume })

  const isDark = propIsDark !== undefined ? propIsDark : hookIsDark
  const activeToggle = propToggleTheme || hookToggleTheme

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    playToggleSound()
    activeToggle()
  }

  // Prevent hydration mismatch during initial SSR paint
  if (!mounted && propIsDark === undefined) {
    return (
      <div
        aria-hidden="true"
        className={`inline-flex items-center justify-center w-8 h-8 rounded-md ${className}`}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative inline-flex items-center justify-center rounded-md text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100 cursor-pointer ${className}`}
    >
      {isDark ? (
        <Sun className="w-4.5 h-4.5 text-amber-400 hover:rotate-45 transition-transform duration-200" />
      ) : (
        <Moon className="w-4.5 h-4.5 text-neutral-700 hover:-rotate-12 transition-transform duration-200" />
      )}
    </button>
  )
}
