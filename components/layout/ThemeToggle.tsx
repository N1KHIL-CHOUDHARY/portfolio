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
      className={`relative inline-flex items-center justify-center  cursor-pointer ${className}`}
    >
      {isDark ? (
        <Sun className="w-4.5 h-4.5 text-neutral-200 hover:rotate-45 transition-transform duration-200" />
      ) : (
        <Moon className="w-4.5 h-4.5 text-neutral-700 hover:-rotate-12 transition-transform duration-200" />
      )}
    </button>
  )
}
