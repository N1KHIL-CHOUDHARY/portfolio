'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Copy,
  Disc3,
  Laptop,
  Monitor,
  Keyboard,
  Mouse,
  Smartphone,
} from 'lucide-react'

import BlueprintLayout from '@/components/layout/BlueprintLayout'
import type { SpotifyTrackResponse } from '@/lib/spotify'

function DiscordIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

function MusicBars() {
  return (
    <span aria-hidden="true" className="flex h-3 items-end gap-[2px]">
      {[0, 1, 2].map((bar) => (
        <span
          key={bar}
          className="w-[2.5px] rounded-full bg-emerald-500 animate-[music-bar_0.8s_ease-in-out_infinite]"
          style={{ animationDelay: `${bar * 0.15}s` }}
        />
      ))}
    </span>
  )
}

const DISCORD_TAG = 'nikhxl_7'

const GEARS = [
  {
    name: 'ThinkPad E16 Gen 3',
    category: 'Laptop',
    link: 'https://www.lenovo.com/in/en/p/laptops/thinkpad/thinkpade/lenovo-thinkpad-e16-gen-3-16-inch-intel/21sss1hs00',
    icon: Laptop,
  },
  {
    name: 'MSI MAG 255F',
    category: 'Display',
    link: 'https://www.amazon.in/MSI-MAG-255F-E20-Frame-Less/dp/B0DQP36N7T',
    icon: Monitor,
  },
  {
    name: 'EvoFox Ronin',
    category: 'Keyboard',
    link: 'https://www.amazon.in/EvoFox-Wireless-Mechanical-Controller-Black/dp/B0F66JWD47',
    icon: Keyboard,
  },
  {
    name: 'Razer DeathAdder HyperSpeed',
    category: 'Mouse',
    link: 'https://www.amazon.in/Razer-DeathAdder-Hyperspeed-Award-Winning-RZ01-04130100-R3A1/dp/B09KH6NFXG',
    icon: Mouse,
  },
  {
    name: 'Motorola Edge 70 Pro Plus',
    category: 'Phone',
    link: 'https://www.motorola.in/smartphones-motorola-edge-70-pro-plus/p?skuId=677',
    icon: Smartphone,
  },
]

const INITIAL_SPOTIFY: SpotifyTrackResponse = {
  isPlaying: false,
  title: 'Loading track...',
  artist: 'Spotify',
  album: '',
  albumImageUrl: '',
  songUrl: 'https://open.spotify.com',
}

export default function MePage() {
  const [copiedDiscord, setCopiedDiscord] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const [spotify, setSpotify] = useState<SpotifyTrackResponse>(INITIAL_SPOTIFY)

  // Spotify presence
  useEffect(() => {
    let active = true
    let inFlight = false

    const fetchSpotify = async () => {
      if (inFlight) return
      inFlight = true

      try {
        const response = await fetch('/api/spotify', {
          cache: 'no-store',
        })

        if (!response.ok) return

        const data: SpotifyTrackResponse = await response.json()
        if (active) setSpotify(data)
      } catch {
        // Keep the last successful response
      } finally {
        inFlight = false
      }
    }

    void fetchSpotify()
    const interval = window.setInterval(() => void fetchSpotify(), 15000)

    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [])

  const handleCopyDiscord = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(DISCORD_TAG)
      setCopiedDiscord(true)
      setCopyError(false)
      window.setTimeout(() => setCopiedDiscord(false), 2000)
    } catch {
      setCopyError(true)
      window.setTimeout(() => setCopyError(false), 2500)
    }
  }, [])

  return (
    <BlueprintLayout showNavbar={false}>
      {/* ── SPIDER-MAN BOTTOM-RIGHT FIXED EASTER EGG ── */}
     
      <main className="mx-auto w-full max-w-2xl space-y-10 py-4 sm:py-8">
        {/* Header */}
        <header className="space-y-7">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <ArrowLeft className="size-4" />
            <span>Back to home</span>
          </Link>

          <div className="space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-400">
              A little more about me
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-4xl">
              Beyond the code.
            </h1>

            <p className="max-w-lg text-sm leading-7 text-neutral-500 dark:text-neutral-400 sm:text-base">
              The music I listen to, where to find me, and the hardware I use to build things.
            </p>
          </div>
        </header>

        {/* Presence */}
        <section aria-labelledby="presence-heading" className="space-y-3">
          <SectionHeading id="presence-heading" number="01" title="Around the internet" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Spotify */}
            <a
              href={spotify.songUrl || 'https://open.spotify.com'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${spotify.title} on Spotify`}
              className="group flex min-w-0 items-center gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-4 transition-colors hover:border-neutral-300 hover:bg-neutral-100/70 dark:border-neutral-800 dark:bg-neutral-900/30 dark:hover:border-neutral-700 dark:hover:bg-neutral-900/70"
            >
              <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800">
                {spotify.albumImageUrl ? (
                  <Image
                    src={spotify.albumImageUrl}
                    alt={`${spotify.album || spotify.title} album artwork`}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <Disc3 className="size-6 text-neutral-400 motion-safe:animate-spin [animation-duration:8s]" />
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-1.5">
                  {spotify.isPlaying ? (
                    <>
                      <MusicBars />
                      <span className="text-[10px] font-medium tracking-wider text-emerald-600 dark:text-emerald-400">
                        NOW PLAYING
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="size-1.5 shrink-0 rounded-full bg-neutral-400" />
                      <span className="text-[10px] font-medium tracking-wider text-neutral-500">
                        RECENTLY PLAYED
                      </span>
                    </>
                  )}
                </div>

                <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {spotify.title}
                </p>

                <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                  {spotify.artist}
                </p>
              </div>

              <ArrowUpRight className="size-4 shrink-0 text-neutral-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>

            {/* Discord */}
            <button
              type="button"
              onClick={handleCopyDiscord}
              aria-label={`Copy Discord username ${DISCORD_TAG}`}
              className="group flex min-w-0 items-center gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-4 text-left transition-colors hover:border-neutral-300 hover:bg-neutral-100/70 dark:border-neutral-800 dark:bg-neutral-900/30 dark:hover:border-neutral-700 dark:hover:bg-neutral-900/70 cursor-pointer"
            >
              <div className="relative flex size-12 shrink-0 items-center justify-center rounded-lg border border-[#5865F2]/15 bg-[#5865F2]/10 text-[#5865F2]">
                <DiscordIcon className="size-6 transition-transform group-hover:scale-105" />
                <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-neutral-900" />
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-[10px] font-medium tracking-wider text-neutral-500">DISCORD</p>
                <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {DISCORD_TAG}
                </p>
                <p
                  aria-live="polite"
                  className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400"
                >
                  {copiedDiscord ? (
                    <>
                      <Check className="size-3 text-emerald-500" />
                      Copied to clipboard
                    </>
                  ) : copyError ? (
                    'Could not copy. Check clipboard permissions.'
                  ) : (
                    <>
                      <Copy className="size-3" />
                      Click to copy
                    </>
                  )}
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* Hardware */}
        <section aria-labelledby="gear-heading" className="space-y-3">
          <SectionHeading id="gear-heading" number="02" title="My setup" />

          <div className="overflow-hidden rounded-xl border border-neutral-200/80 dark:border-neutral-800">
            {GEARS.map((gear, index) => {
              const Icon = gear.icon

              return (
                <a
                  key={gear.name}
                  href={gear.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-3 px-3 py-3.5 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/60 sm:px-4 ${
                    index !== GEARS.length - 1
                      ? 'border-b border-neutral-100 dark:border-neutral-800/80'
                      : ''
                  }`}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 dark:bg-neutral-800/70 dark:text-neutral-400">
                    <Icon className="size-4" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {gear.name}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                      {gear.category}
                    </p>
                  </div>

                  <ArrowUpRight className="size-4 shrink-0 text-neutral-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
                </a>
              )
            })}
          </div>

          <p className="px-1 text-xs leading-5 text-neutral-400">
            The tools behind the things I build.
          </p>
        </section>

        {/* Footer */}
        <footer className="flex items-center justify-between border-t border-neutral-200/80 pt-5 text-xs text-neutral-400 dark:border-neutral-800">
          <span>Built with curiosity.</span>
          <Link
            href="/"
            className="inline-flex items-center gap-1 transition-colors hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            Home <ArrowUpRight className="size-3" />
          </Link>
        </footer>
      </main>
    </BlueprintLayout>
  )
}

function SectionHeading({
  id,
  number,
  title,
}: {
  id: string
  number: string
  title: string
}) {
  return (
    <h2
      id={id}
      className="flex items-center gap-2.5 pb-1 text-sm font-medium text-neutral-800 dark:text-neutral-200"
    >
      <span className="font-mono text-[10px] text-neutral-400">{number}</span>
      <span>{title}</span>
    </h2>
  )
}