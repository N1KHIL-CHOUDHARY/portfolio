'use client'

import { useEffect, useState, useCallback } from 'react'

export type Theme = 'dark' | 'light' | 'system'

export interface UseThemeReturn {
  theme: Theme
  isDark: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  mounted: boolean
}

const STORAGE_KEY = 'theme'

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(isDark: boolean) {
  const root = document.documentElement
  if (isDark) {
    root.classList.add('dark')
    root.style.colorScheme = 'dark'
  } else {
    root.classList.remove('dark')
    root.style.colorScheme = 'light'
  }
}

export function useTheme(): UseThemeReturn {
  const [mounted, setMounted] = useState(false)
  const [theme, setThemeState] = useState<Theme>('system')
  const [isDark, setIsDark] = useState<boolean>(true)

  // Initialize theme on client mount
  useEffect(() => {
    setMounted(true)
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null
      const currentTheme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : 'system'
      setThemeState(currentTheme)

      const activeDark =
        currentTheme === 'system'
          ? getSystemTheme() === 'dark'
          : currentTheme === 'dark'

      setIsDark(activeDark)
      applyTheme(activeDark)
    } catch {
      const activeDark = getSystemTheme() === 'dark'
      setIsDark(activeDark)
      applyTheme(activeDark)
    }
  }, [])

  // Listen to OS system color scheme changes if in 'system' mode
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleMediaChange = (e: MediaQueryListEvent) => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (!saved || saved === 'system') {
          const newDark = e.matches
          setIsDark(newDark)
          applyTheme(newDark)
        }
      } catch {}
    }

    mediaQuery.addEventListener('change', handleMediaChange)
    return () => mediaQuery.removeEventListener('change', handleMediaChange)
  }, [])

  // Listen to cross-tab storage sync
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const newTheme = (e.newValue as Theme) || 'system'
        setThemeState(newTheme)
        const newDark =
          newTheme === 'system' ? getSystemTheme() === 'dark' : newTheme === 'dark'
        setIsDark(newDark)
        applyTheme(newDark)
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // MutationObserver fallback to catch any external class mutations
  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkDomDark = () => {
      const domDark = document.documentElement.classList.contains('dark')
      setIsDark((prev) => (prev !== domDark ? domDark : prev))
    }

    const observer = new MutationObserver(checkDomDark)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    try {
      if (newTheme === 'system') {
        localStorage.removeItem(STORAGE_KEY)
        const systemDark = getSystemTheme() === 'dark'
        setIsDark(systemDark)
        applyTheme(systemDark)
      } else {
        localStorage.setItem(STORAGE_KEY, newTheme)
        const nextDark = newTheme === 'dark'
        setIsDark(nextDark)
        applyTheme(nextDark)
      }
    } catch {
      const nextDark = newTheme === 'dark'
      setIsDark(nextDark)
      applyTheme(nextDark)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    const nextDark = !isDark
    const nextTheme: Theme = nextDark ? 'dark' : 'light'
    setTheme(nextTheme)
  }, [isDark, setTheme])

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
    mounted,
  }
}
