'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Calendar, Send, Check, ArrowUpRight } from 'lucide-react'

function GitHubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

function LinkedInIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#0A66C2"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  )
}

function LeetCodeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 94 110.92" fill="none" aria-hidden="true" className={className}>
      <path
        d="M67.507 83.066c2.494-2.49 6.53-2.483 9.016.015 2.485 2.498 2.479 6.542-.015 9.032l-11.073 11.057c-10.216 10.201-26.875 10.349-37.263.344-.06-.058-4.686-4.594-19.945-19.557C-1.925 74.003-2.936 58.075 6.617 47.846L24.429 28.775c9.481-10.153 26.958-11.263 37.799-2.496l16.177 13.083c2.74 2.216 3.168 6.236.956 8.981-2.212 2.744-6.226 3.173-8.965.957L54.219 36.217c-5.67-4.585-15.587-3.955-20.479 1.284L15.928 56.573c-4.651 4.979-4.141 13.001 1.218 18.256 11.206 10.988 19.842 19.456 19.852 19.465 5.4 5.202 14.133 5.125 19.436-.17l11.073-11.058Z"
        fill="#FFA116"
      />
      <path
        d="M40.607 72.001c-3.521 0-6.375-2.859-6.375-6.386 0-3.527 2.854-6.386 6.375-6.386h47.018c3.521 0 6.375 2.859 6.375 6.386 0 3.527-2.854 6.386-6.375 6.386H40.607Z"
        fill="#B3B3B3"
      />
      <path
        d="M49.412 2.023C51.818-.552 55.852-.687 58.423 1.723c2.571 2.41 2.706 6.451.3 9.027L15.928 56.573c-4.65 4.979-4.141 13.001 1.218 18.256l19.763 19.38c2.517 2.467 2.56 6.51.097 9.031-2.463 2.52-6.5 2.564-9.016.096L8.227 83.957C-1.925 74.002-2.936 58.074 6.618 47.846L49.412 2.023Z"
        className="fill-black dark:fill-white"
      />
    </svg>
  )
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n.toLocaleString() + (s[(v - 20) % 10] || s[v] || s[0])
}

interface FooterProps {
  initialViews?: number
}

export default function Footer({ initialViews }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const [timeString, setTimeString] = useState<string>('')
  const [visitorCount, setVisitorCount] = useState<number>(initialViews || 2169)
  const [senderContact, setSenderContact] = useState('')
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null)

  const emailAddress = 'nikhil2k7h@gmail.com'

  useEffect(() => {
    const updateTime = () => {
      try {
        const formatted = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }).format(new Date())
        setTimeString(formatted)
      } catch {
        setTimeString(new Date().toLocaleTimeString())
      }
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetch('/api/analytics/stats')
      .then((res) => res.json())
      .then((json) => {
        const count = json?.data?.totalViews || json?.data?.uniqueVisitors
        if (count && typeof count === 'number' && count > 0) {
          setVisitorCount(count)
        }
      })
      .catch(() => {})
  }, [])

  const copyEmail = () => {
    navigator.clipboard.writeText(emailAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    const subject = encodeURIComponent(`Message from ${senderContact || 'Portfolio Visitor'}`)
    const body = encodeURIComponent(message)
    window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const socialLinks = [
    {
      label: 'GitHub',
      href: 'https://github.com/n1khil-choudhary',
      icon: <GitHubIcon className="w-[18px] h-[18px]" />,
    },
    {
      label: 'LeetCode',
      href: 'https://leetcode.com/u/nikhil-h-dev/',
      icon: <LeetCodeIcon className="w-[18px] h-[18px]" />,
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/nikhil-h-dev/',
      icon: <LinkedInIcon className="w-[18px] h-[18px]" />,
    },
  ]

  return (
    <footer className="w-full pt-16 sm:pt-20 pb-12 flex flex-col select-none">
      
      <div className="w-full">
        <p className="font-mono text-[15px] text-neutral-500 dark:text-neutral-400 mb-5">
          <span className="text-neutral-400 dark:text-neutral-600 mr-1 select-none">#</span> contact
        </p>

        {/* Contact Form Card with enhanced frosted blur */}
        <div className="relative z-10 w-full rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 p-4 sm:p-5 backdrop-blur-md space-y-4 shadow-sm">
          <form onSubmit={handleSendMessage} className="space-y-3">
            <input
              type="text"
              placeholder="Your email or @handle"
              value={senderContact}
              onChange={(e) => setSenderContact(e.target.value)}
              className="w-full bg-neutral-50/70 dark:bg-neutral-950/50 border border-neutral-200/80 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-[13px] text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors font-mono"
            />
            <textarea
              rows={2}
              placeholder="Leave a short note or proposal..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-neutral-50/70 dark:bg-neutral-950/50 border border-neutral-200/80 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-[13px] text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors resize-none leading-relaxed"
            />

            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 text-[12px] font-mono text-neutral-600 dark:text-neutral-400 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-neutral-900 transition-all cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
                  ) : (
                    <Mail className="w-3.5 h-3.5 stroke-[1.8]" />
                  )}
                  <span>{copied ? 'Copied' : 'Copy Email'}</span>
                </button>

                <Link
                  href="https://cal.com/nikhil-dev/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 text-[12px] font-mono text-neutral-600 dark:text-neutral-400 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-neutral-900 transition-all cursor-pointer group"
                >
                  <Calendar className="w-3.5 h-3.5 stroke-[1.8]" />
                  <span>Schedule</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-400 group-hover:text-white dark:group-hover:text-neutral-900 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              <button
                type="submit"
                disabled={!message.trim()}
                className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white text-[12.5px] font-mono font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed group cursor-pointer shadow-xs active:scale-95"
              >
                <span>Send Note</span>
                <Send className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </form>
        </div>

        {/* ── Sprite tucked ~40% under the contact card with frosted blur reveal ── */}
        <div className="relative z-0 w-full flex justify-center -mt-5 sm:-mt-5 pointer-events-none select-none">
          <Image
            src="/sprites/fight.gif"
            alt="One Piece Sprite"
            width={300}
            height={400}
            unoptimized
            className="w-48 sm:w-60 h-auto object-contain [image-rendering:pixelated]"
          />
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="w-full h-px border-t border-neutral-200/70 dark:border-neutral-800/70 " />

      {/* ── Mid Row: Socials & Location Stats ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 w-full my-10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 block mb-2.5">
            CONNECT
          </span>

          <div className="flex items-center gap-4 text-neutral-700 dark:text-neutral-300">
            {socialLinks.map((item) => (
              <div
                key={item.label}
                className="relative flex items-center justify-center"
                onMouseEnter={() => setHoveredSocial(item.label)}
                onMouseLeave={() => setHoveredSocial(null)}
              >
                <AnimatePresence>
                  {hoveredSocial === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 3, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 2, scale: 0.92 }}
                      transition={{ duration: 0.12 }}
                      className="pointer-events-none absolute -top-8 z-30 select-none whitespace-nowrap"
                    >
                      <div className="rounded-md border border-neutral-800/80 bg-neutral-900 px-2 py-0.5 font-mono text-[11px] font-medium text-neutral-100 shadow-sm dark:border-neutral-200/80 dark:bg-neutral-100 dark:text-neutral-900">
                        {item.label}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Link
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="hover:scale-110 hover:opacity-90 transition-transform inline-flex items-center justify-center"
                >
                  {item.icon}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="text-left sm:text-right font-mono space-y-1">
          <div className="text-[12px] sm:text-[13px] text-neutral-500 dark:text-neutral-400">
            <span className="text-neutral-800 dark:text-neutral-200 font-medium">Chennai, India</span> · {timeString || '10:21 PM'}
          </div>

          <div className="text-[13px] sm:text-[14px] text-neutral-500 dark:text-neutral-400">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              {getOrdinal(visitorCount)}
            </span>{' '}
            visitor
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Credits & Scroll-To-Top ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full pt-4 border-t border-neutral-100 dark:border-neutral-900 font-mono text-[12px] text-neutral-500 dark:text-neutral-400">
        <p className="order-2 sm:order-1 text-center sm:text-left">
          Designed &amp; developed by{' '}
          <Link
            href="https://github.com/n1khil-choudhary"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-900 dark:text-neutral-100 font-medium hover:underline underline-offset-4"
          >
            Nikhil H
          </Link>{' '}
          · &copy; {currentYear}
        </p>

        <button
          type="button"
          onClick={scrollToTop}
          className="order-1 sm:order-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer"
        >
          <span>Back to top</span>
          <span>&uarr;</span>
        </button>
      </div>
    </footer>
  )
}