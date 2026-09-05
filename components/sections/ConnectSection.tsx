'use client'

import React from 'react'
import { FileText, Mail, ExternalLink } from 'lucide-react'
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandDiscord,
  IconBrandYoutube,
} from '@tabler/icons-react'

import { useToggleSound } from '@/hooks/useToggleSound'

interface ConnectSectionProps {
  resumeUrl?: string | null
  email?: string | null
  socialLinks?: Array<{
    label?: string
    url: string
    icon?: string
    platform?: string
  }> | null
}

function getIconComponent(label: string, iconProp?: string) {
  const l = `${label} ${iconProp || ''}`.toLowerCase()

  if (l.includes('resume') || l.includes('cv')) return FileText
  if (l.includes('github')) return IconBrandGithub
  if (l.includes('linkedin')) return IconBrandLinkedin

  if (
    l.includes('twitter') ||
    l.includes('x.com') ||
    l.includes('twitter.com') ||
    l.includes('tweet') ||
    l.includes('@')
  ) {
    return IconBrandX
  }

  if (l.includes('discord')) return IconBrandDiscord
  if (l.includes('youtube')) return IconBrandYoutube
  if (l.includes('mail') || l.includes('email')) return Mail

  return ExternalLink
}

function formatCleanLabel(rawLabel: string) {
  if (!rawLabel) return ''

  const trimmed = rawLabel.trim()
  const lower = trimmed.toLowerCase()

  if (lower.includes('linkedin')) return 'LinkedIn'
  if (lower.includes('github')) return 'GitHub'
  if (lower.includes('twitter') || lower === 'x' || lower.includes('x.com')) {
    return 'X'
  }
  if (lower.includes('discord')) return 'Discord'
  if (lower.includes('youtube')) return 'YouTube'
  if (lower.includes('telegram')) return 'Telegram'
  if (lower.includes('email') || lower.includes('mail')) return 'Email'
  if (lower.includes('resume') || lower.includes('cv')) return 'Resume'

  return (
    trimmed.replace(/\s*(profile|account|link|handle)\b/gi, '').trim() ||
    trimmed
  )
}

export default function ConnectSection({
  resumeUrl,
  email,
  socialLinks,
}: ConnectSectionProps) {
  const playToggleSound = useToggleSound({
    soundUrl: '/sounds/click.mp3',
    volume: 0.25,
  })

  const items: Array<{
    label: string
    url: string
    Icon: React.ComponentType<{ className?: string }>
    download?: boolean
  }> = []

  // 1. Resume
  if (resumeUrl && resumeUrl !== '#') {
    items.push({
      label: 'Resume',
      url: resumeUrl,
      Icon: FileText,
      download: true,
    })
  }

  // 2. Dynamic Social Links
  if (socialLinks && Array.isArray(socialLinks)) {
    for (const s of socialLinks) {
      if (s.url && s.url !== '#') {
        items.push({
          label: formatCleanLabel(s.label || s.platform || ''),
          url: s.url,
          Icon: getIconComponent(s.label || s.platform || '', s.icon),
        })
      }
    }
  }

  // 3. Email
  const contactEmail = email || 'nikhil2k7h@gmail.com'

  if (
    contactEmail &&
    !items.some(
      (item) =>
        item.label.toLowerCase().includes('email') ||
        item.label.toLowerCase().includes('mail') ||
        item.url.startsWith('mailto:')
    )
  ) {
    items.push({
      label: 'Email',
      url: `mailto:${contactEmail}`,
      Icon: Mail,
    })
  }

  if (items.length === 0) {
    return null
  }

  /*
   * BUTTON DESIGN ONLY
   *
   * Light mode:
   * white background + black border + black text
   *
   * Dark mode:
   * original dark filled appearance
   */
  const buttonClasses =
    'h-[34px] px-3 ' +
    'text-[12px] sm:text-[13px] font-medium tracking-normal ' +
    'inline-flex items-center justify-center gap-1.5 ' +
    'overflow-hidden rounded-md whitespace-nowrap outline-none ' +
    'transition-all duration-200 ' +
    'w-full cursor-pointer ' +
    'bg-white text-neutral-900 border border-neutral-900 ' +
    'hover:bg-neutral-100 ' +
    'active:scale-95 ' +
    'focus-visible:ring-[3px] focus-visible:ring-neutral-400/50 ' +
    'dark:bg-neutral-100 dark:text-neutral-900 ' +
    'dark:border-transparent ' +
    'dark:hover:opacity-90 ' +
    'dark:focus-visible:ring-ring/50'

  return (
    <section aria-labelledby="connect" className="space-y-3">
      <div className="relative pt-1 pb-0.5">
        {/* Top Divider — UNCHANGED */}
        <div className="-mx-6 sm:-mx-8 border-t border-dashed border-neutral-300 dark:border-neutral-800" />

        {/* Title */}
        <div className="flex items-center justify-between py-2">
          <h2
            id="connect"
            className="
              text-[20px]
              sm:text-[22px]
              font-medium
              tracking-tight
              text-neutral-900
              dark:text-neutral-100
              leading-[1.2]
            "
          >
            Connect
          </h2>
        </div>

        {/* Bottom Divider — UNCHANGED */}
        <div className="-mx-6 sm:-mx-8 border-b border-dashed border-neutral-300 dark:border-neutral-800" />
      </div>

      {/* Connect Buttons */}
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1 pb-0">
        {items.map((item) => (
          <li
            key={item.label + item.url}
            className="flex min-w-0"
          >
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              download={item.download ? true : undefined}
              onClick={() => playToggleSound()}
              className={buttonClasses}
              aria-label={item.label}
            >
              <item.Icon className="shrink-0 h-4 w-4" />

              <span className="truncate">
                {item.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}