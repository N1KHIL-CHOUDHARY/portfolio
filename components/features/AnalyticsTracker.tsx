'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Global analytics tracker component.
 * Automatically records page views via /api/analytics/view.
 * Deduplication is enforced on the server via Upstash Redis 24-hour IP hashing.
 */
export default function AnalyticsTracker() {
  const pathname = usePathname()
  const lastTrackedPath = useRef<string | null>(null)

  useEffect(() => {
    // Avoid tracking admin panels or internal API routes
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return
    }

    // Avoid duplicate tracking for identical path during immediate component re-renders
    if (lastTrackedPath.current === pathname) {
      return
    }
    lastTrackedPath.current = pathname

    const track = async () => {
      try {
        const payload = {
          path: pathname,
          referrer: typeof document !== 'undefined' ? document.referrer : '',
        }

        const jsonString = JSON.stringify(payload)
        const blob = new Blob([jsonString], { type: 'application/json' })

        // Use sendBeacon if available, with graceful fetch fallback
        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
          const sent = navigator.sendBeacon('/api/analytics/view', blob)
          if (!sent) {
            fetch('/api/analytics/view', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: jsonString,
              keepalive: true,
            }).catch(() => {})
          }
        } else {
          fetch('/api/analytics/view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonString,
            keepalive: true,
          }).catch(() => {})
        }
      } catch {
        // Silently swallow client tracking error to never impact visitor experience
      }
    }

    // Delay by small tick so as not to block main thread rendering
    const timer = setTimeout(track, 150)
    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
