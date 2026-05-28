'use client'

import React, { useState, useCallback } from 'react'
import { Sun, Moon, FileText, Menu, X, ArrowRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

interface NavbarProps {
  isDark: boolean
  toggleTheme: () => void
  scrollToWork: () => void
  scrollToOpenSource: () => void
  scrollToAbout: () => void
  scrollProgress: number
}

const RESUME_PDF = '/assets/RESUME.pdf'

export default function Navbar({ isDark, toggleTheme, scrollToWork, scrollToOpenSource, scrollToAbout, scrollProgress }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeMenu = useCallback(() => setMobileOpen(false), [])

  const navLinks = [
    { label: 'Work', action: () => { scrollToWork(); closeMenu() } },
    { label: 'Open Source', action: () => { scrollToOpenSource(); closeMenu() } },
    { label: 'About', action: () => { scrollToAbout(); closeMenu() } },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="backdrop-blur-xl border-b transition-colors duration-300 bg-[#FAFAF9]/80 dark:bg-[#151515]/85 border-neutral-200/40 dark:border-white/[0.04]">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-[17px] font-bold tracking-tight text-neutral-900 dark:text-white"
          >
            Nikhil<span className="text-blue-500"></span>
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 ml-1 mb-0.5 animate-pulse" />
          </button>

          <div className="flex items-center gap-3">
            <ul className="hidden md:flex items-center gap-1 text-sm font-medium">
              {navLinks.map(({ label, action }) => (
                <li key={label}>
                  <button
                    onClick={action}
                    className="px-3 py-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200"
                  >
                    {label}
                  </button>
                </li>
              ))}
              <li>
                <a
                  href={RESUME_PDF}
                  download="Nikhil_Resume.pdf"
                  className="flex items-center gap-1.5 ml-1 px-3 py-1.5 rounded-lg text-sm text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-white/8 hover:border-neutral-300 dark:hover:border-white/12 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-white/4 transition-all duration-200"
                >
                  <FileText size={13} />
                  <span>Resume</span>
                </a>
              </li>
            </ul>

            <a
              href="mailto:nikhil2k7h@gmail.com"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-100 transition-all duration-200 shadow-sm"
            >
              Let&apos;s Connect
              <ArrowRight size={13} />
            </a>

            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>

            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 border border-neutral-200/60 dark:border-white/8 transition-all duration-200"
              aria-label={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="md:hidden backdrop-blur-xl bg-[#FAFAF9]/95 dark:bg-[#151515]/95 border-b border-neutral-200/40 dark:border-white/[0.04]"
          >
            <div className="max-w-6xl mx-auto px-6 py-4 space-y-1">
              {navLinks.map(({ label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="block w-full text-left px-3 py-2.5 rounded-lg text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200"
                >
                  {label}
                </button>
              ))}
              <a
                href={RESUME_PDF}
                download="Nikhil_Resume.pdf"
                onClick={closeMenu}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200"
              >
                <FileText size={14} />
                Download Resume
              </a>
              <a
                href="mailto:nikhil2k7h@gmail.com"
                onClick={closeMenu}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 transition-all duration-200 mt-2"
              >
                Let&apos;s Connect
                <ArrowRight size={13} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
