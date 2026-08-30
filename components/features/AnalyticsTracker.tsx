'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const lastTrackedPath = useRef<string | null>(null)

  useEffect(() => {
    // Avoid tracking admin panels or internal routes
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return
    }

    // Avoid duplicate tracking for identical path during re-renders
    if (lastTrackedPath.current === pathname) {
      return
    }
    lastTrackedPath.current = pathname

    const track = async () => {
      try {
        let visitorId = ''
        if (typeof window !== 'undefined') {
          visitorId = localStorage.getItem('pv_vid') || ''
          if (!visitorId) {
            visitorId =
              typeof crypto !== 'undefined' && crypto.randomUUID
                ? crypto.randomUUID()
                : Math.random().toString(36).substring(2) + Date.now().toString(36)
            localStorage.setItem('pv_vid', visitorId)
          }
        }

        const payload = {
          path: pathname,
          referrer: typeof document !== 'undefined' ? document.referrer : '',
          visitorId,
        }

        // Use modern navigator.sendBeacon or fetch with keepalive
        const jsonString = JSON.stringify(payload)
        const blob = new Blob([jsonString], { type: 'application/json' })

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
      } catch (err) {
        // Silently swallow client tracking error to avoid impacting visitor experience
      }
    }

    // Delay by small tick to not compete with critical rendering
    const timer = setTimeout(track, 150)
    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
