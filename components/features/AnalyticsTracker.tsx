'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Global analytics tracker component.
 * Automatically records page views via /api/analytics/track.
 * Deduplication is enforced on the server via persistent visitor ID and IP hashing.
 * Approximate visitor location is determined server-side from IP.
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
        // Retrieve or generate persistent visitor ID across visits
        let vid: string | null = null
        try {
          vid = localStorage.getItem('portfolio_vid')
          if (!vid) {
            const match = document.cookie.match(/(?:^|; )portfolio_vid=([^;]*)/)
            if (match) {
              vid = decodeURIComponent(match[1])
            }
          }
          if (!vid) {
            vid = crypto.randomUUID()
          }
          localStorage.setItem('portfolio_vid', vid)
          document.cookie = `portfolio_vid=${encodeURIComponent(vid)}; path=/; max-age=315360000; SameSite=Lax`
        } catch {
          // If storage is blocked, continue gracefully
        }

        const payload = {
          path: pathname,
          visitorId: vid || undefined,
          referrer: typeof document !== 'undefined' ? document.referrer : '',
        }

        const jsonString = JSON.stringify(payload)
        const blob = new Blob([jsonString], { type: 'application/json' })

        // Use sendBeacon if available, with graceful fetch fallback
        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
          const sent = navigator.sendBeacon('/api/analytics/track', blob)
          if (!sent) {
            fetch('/api/analytics/track', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: jsonString,
              keepalive: true,
            }).catch(() => {})
          }
        } else {
          fetch('/api/analytics/track', {
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
