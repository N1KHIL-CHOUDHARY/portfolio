'use client'

import React, { useState, useCallback, useLayoutEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import QuoteBanner from '@/components/QuoteBanner'

function useTheme() {
  const [isDark, setIsDark] = useState(false)

  useLayoutEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = saved === 'dark' || (saved === null && prefersDark)

    setIsDark(dark)
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
  }, [])

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      document.documentElement.style.colorScheme = next ? 'dark' : 'light'
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }, [])

  return { isDark, toggleTheme }
}

export default function PageShell({ children }: { children: React.ReactNode }) {
  const { isDark, toggleTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()

  const handleNavigate = useCallback((sectionId: string) => {
    if (pathname === '/') {
      if (sectionId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          router.push(`/${sectionId}`)
        }
      }
    } else {
      if (sectionId === 'top') {
        router.push('/')
      } else {
        router.push(`/${sectionId}`)
      }
    }
  }, [pathname, router])

  return (
    <div className="min-h-screen bg-[#f9f9f9] dark:bg-[#100f0f] text-zinc-900 dark:text-zinc-100 selection:bg-zinc-200 dark:selection:bg-zinc-800 transition-colors duration-200 antialiased font-sans">
      <Navbar
        isDark={isDark}
        toggleTheme={toggleTheme}
        onNavigate={handleNavigate}
      />

      {children}

      {pathname !== '/' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pb-12 pt-4">
          <QuoteBanner />
        </div>
      )}
    </div>
  )
}
