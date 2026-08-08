'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Home, 
  Briefcase, 
  Code2, 
  Award,
  Wrench, 
  Copy, 
  Sun, 
  Moon, 
  FileText,
  X,
  Check,
} from 'lucide-react'
import { IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react';
import { useToggleSound } from '@/hooks/useToggleSound'

interface CommandPaletteProps {
  isOpen: boolean
  onOpen?: () => void
  onClose: () => void
  isDark: boolean
  toggleTheme: () => void
  onNavigate: (sectionId: string) => void
  email?: string
}

export default function CommandPalette({
  isOpen,
  onOpen,
  onClose,
  isDark,
  toggleTheme,
  onNavigate,
  email = 'nikhil2k7h@gmail.com',
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const playToggleSound = useToggleSound({ soundUrl: '/sounds/toggle.mp3', volume: 0.25 })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (isOpen) {
          onClose()
        } else {
          setQuery('')
          onOpen?.()
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onOpen, onClose])

  const copyEmailAction = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        onClose()
      }, 800)
    } catch {}
  }

  const actions = [
    {
      id: 'nav-home',
      label: 'Jump to Top',
      category: 'Navigation',
      icon: Home,
      perform: () => {
        onNavigate('top')
        onClose()
      },
    },
    {
      id: 'nav-exp',
      label: 'Jump to Experience',
      category: 'Navigation',
      icon: Briefcase,
      perform: () => {
        onNavigate('experience')
        onClose()
      },
    },
    {
      id: 'nav-proj',
      label: 'Jump to Projects & Work',
      category: 'Navigation',
      icon: Code2,
      perform: () => {
        onNavigate('projects')
        onClose()
      },
    },
    {
      id: 'nav-certs',
      label: 'Jump to Certifications & Achievements',
      category: 'Navigation',
      icon: Award,
      perform: () => {
        onNavigate('certifications')
        onClose()
      },
    },
    {
      id: 'nav-personal',
      label: 'Jump to Personal & Stack',
      category: 'Navigation',
      icon: Wrench,
      perform: () => {
        onNavigate('personal')
        onClose()
      },
    },
    {
      id: 'page-gears',
      label: 'View Gears & Hardware (/gears)',
      category: 'Pages',
      icon: Wrench,
      perform: () => {
        window.location.href = '/gears'
        onClose()
      },
    },
    {
      id: 'page-dev',
      label: 'View Development Setup (/development)',
      category: 'Pages',
      icon: Code2,
      perform: () => {
        window.location.href = '/development'
        onClose()
      },
    },
    {
      id: 'act-copy',
      label: copied ? 'Email Copied!' : `Copy Email (${email})`,
      category: 'Actions',
      icon: copied ? Check : Copy,
      perform: copyEmailAction,
    },
    {
      id: 'act-theme',
      label: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      category: 'Actions',
      icon: isDark ? Sun : Moon,
      perform: () => {
        playToggleSound()
        toggleTheme()
        onClose()
      },
    },
    {
      id: 'act-resume',
      label: 'Download / View Resume',
      category: 'Actions',
      icon: FileText,
      perform: () => {
        window.open('/RESUME.pdf', '_blank')
        onClose()
      },
    },
    {
      id: 'link-github',
      label: 'Open GitHub Profile',
      category: 'Socials',
      icon: IconBrandGithub,
      perform: () => {
        window.open('https://github.com', '_blank')
        onClose()
      },
    },
    {
      id: 'link-linkedin',
      label: 'Open LinkedIn Profile',
      category: 'Socials',
      icon: IconBrandLinkedin,
      perform: () => {
        window.open('https://linkedin.com', '_blank')
        onClose()
      },
    },
  ]

  const filteredActions = actions.filter((act) =>
    act.label.toLowerCase().includes(query.toLowerCase()) ||
    act.category.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-10"
          >
            <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-zinc-200/80 dark:border-zinc-800/80">
              <Search className="w-4 h-4 text-zinc-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search section..."
                className="w-full bg-transparent text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none font-mono"
              />
              <button
                onClick={onClose}
                className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto p-1.5 space-y-1">
              {filteredActions.length === 0 ? (
                <div className="py-8 text-center text-xs font-mono text-zinc-400">
                  No commands found matching &quot;{query}&quot;
                </div>
              ) : (
                filteredActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <button
                      key={action.id}
                      onClick={action.perform}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                        <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium group-hover:text-zinc-950 dark:group-hover:text-white">
                          {action.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                        {action.category}
                      </span>
                    </button>
                  )
                })
              )}
            </div>

            <div className="px-3.5 py-2 border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-950/50 flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <span>Navigation shortcut</span>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">Esc</kbd> to close
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
