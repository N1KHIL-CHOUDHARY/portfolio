'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, Github, Linkedin, Mail, Twitter } from 'lucide-react'

const SOCIAL = [
  { href: 'https://github.com/N1KHIL-CHOUDHARY', icon: Github, label: 'GitHub' },
  { href: 'https://linkedin.com/in/nikhil-h-184560338', icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:nikhil2k7h@gmail.com', icon: Mail, label: 'Email' },
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
]

export function CTABanner() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-8 rounded-3xl overflow-hidden
          bg-neutral-900 dark:bg-white/5
          border border-neutral-800 dark:border-white/10
          shadow-[0_8px_48px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_48px_rgba(0,0,0,0.4)]"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-white/10 dark:bg-white/10">
            <span className="text-2xl">👋</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Let&apos;s build something amazing together!
            </h2>
            <p className="text-sm text-neutral-400 mt-0.5">
              I&apos;m currently open to new opportunities and exciting projects.
            </p>
          </div>
        </div>

        <a
          href="mailto:nikhil2k7h@gmail.com"
          className="relative flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-white text-neutral-900 hover:bg-neutral-100 transition-colors duration-200 shadow-sm shrink-0"
        >
          Let&apos;s Connect
          <ArrowRight size={14} />
        </a>
      </motion.div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="dark:border-white/[0.1] bg-transparent py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <span className="text-sm font-bold text-neutral-900 dark:text-white">
            Nikhil<span className="text-blue-500">.</span>
          </span>
          <span className="hidden sm:block text-neutral-400 dark:text-white/20">|</span>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            © {new Date().getFullYear()} Nikhil. All rights reserved.
          </p>
        </div>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 hidden md:block">
          Find me on
        </p>

        <div className="flex items-center gap-4">
          {SOCIAL.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors duration-200"
              aria-label={label}
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
