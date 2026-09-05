'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

export type Theme = 'dark' | 'light' | 'system'

export type ThemeOrigin =
  | React.MouseEvent
  | MouseEvent
  | { clientX: number; clientY: number }
  | HTMLElement
  | null
  | undefined

export interface UseThemeReturn {
  theme: Theme
  isDark: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: (origin?: ThemeOrigin) => void
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
  const isTransitioningRef = useRef(false)

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

  const toggleTheme = useCallback(
    (origin?: ThemeOrigin) => {
      // Prevent multiple transitions from running simultaneously
      if (isTransitioningRef.current) return

      const nextDark = !isDark
      const nextTheme: Theme = nextDark ? 'dark' : 'light'

      // Respect prefers-reduced-motion: reduce
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReducedMotion || typeof window === 'undefined') {
        setTheme(nextTheme)
        return
      }

      // Calculate origin coordinates (x, y) relative to viewport
      let x = window.innerWidth / 2
      let y = window.innerHeight / 2

      if (origin) {
        if ('currentTarget' in origin && origin.currentTarget instanceof HTMLElement) {
          const rect = origin.currentTarget.getBoundingClientRect()
          x = rect.left + rect.width / 2
          y = rect.top + rect.height / 2
        } else if ('target' in origin && origin.target instanceof HTMLElement) {
          const rect = origin.target.getBoundingClientRect()
          x = rect.left + rect.width / 2
          y = rect.top + rect.height / 2
        } else if (origin instanceof HTMLElement) {
          const rect = origin.getBoundingClientRect()
          x = rect.left + rect.width / 2
          y = rect.top + rect.height / 2
        } else if ('clientX' in origin && typeof origin.clientX === 'number') {
          if (origin.clientX !== 0 || origin.clientY !== 0) {
            x = origin.clientX
            y = origin.clientY
          }
        }
      }

      // Calculate exact radius to cover all 4 corners of the viewport
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )
      const targetRadius = Math.ceil(endRadius) + 2

      const doc = document as any

      // ── Option B: View Transition API (Chrome, Edge, Safari 18+) ──
      if (typeof doc.startViewTransition === 'function') {
        isTransitioningRef.current = true

        // Temporarily suppress global CSS color transitions so the snapshot captures
        // the destination theme state immediately with zero delay or partial fade
        const disableTransitions = document.createElement('style')
        disableTransitions.textContent =
          '*, *::before, *::after { transition: none !important; }'
        document.head.appendChild(disableTransitions)

        let transition: any
        try {
          transition = doc.startViewTransition(() => {
            setThemeState(nextTheme)
            try {
              localStorage.setItem(STORAGE_KEY, nextTheme)
            } catch {}
            setIsDark(nextDark)
            applyTheme(nextDark)
          })
        } catch {
          if (disableTransitions.parentNode) {
            disableTransitions.parentNode.removeChild(disableTransitions)
          }
          isTransitioningRef.current = false
          setTheme(nextTheme)
          return
        }

        transition.ready
          .then(() => {
            if (disableTransitions.parentNode) {
              disableTransitions.parentNode.removeChild(disableTransitions)
            }

            const clipPath = [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${targetRadius}px at ${x}px ${y}px)`,
            ]

            try {
              const animation = document.documentElement.animate(
                { clipPath },
                {
                  duration: 500,
                  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  pseudoElement: '::view-transition-new(root)',
                }
              )
              return animation.finished
            } catch {
              return transition.finished
            }
          })
          .catch(() => {})
          .finally(() => {
            if (disableTransitions.parentNode) {
              disableTransitions.parentNode.removeChild(disableTransitions)
            }
            isTransitioningRef.current = false
          })

        return
      }

      // ── Option A: Destination Overlay Fallback (for browsers without View Transition API) ──
      isTransitioningRef.current = true
      const overlay = document.createElement('div')
      overlay.setAttribute('aria-hidden', 'true')
      const destBg = nextDark ? '#0a0a0a' : '#ffffff'
      overlay.style.cssText = `
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        background-color: ${destBg};
        z-index: 99999;
        pointer-events: none;
        clip-path: circle(0px at ${x}px ${y}px);
        will-change: clip-path;
      `
      document.body.appendChild(overlay)

      const cleanupFallback = () => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay)
        }
        isTransitioningRef.current = false
      }

      if (typeof overlay.animate === 'function') {
        const anim = overlay.animate(
          [
            { clipPath: `circle(0px at ${x}px ${y}px)` },
            { clipPath: `circle(${targetRadius}px at ${x}px ${y}px)` },
          ],
          {
            duration: 480,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards',
          }
        )

        anim.onfinish = () => {
          setTheme(nextTheme)
          cleanupFallback()
        }

        anim.oncancel = () => {
          setTheme(nextTheme)
          cleanupFallback()
        }
      } else {
        setTheme(nextTheme)
        cleanupFallback()
      }
    },
    [isDark, setTheme]
  )

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
    mounted,
  }
}
