'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import BlueprintLayout from '@/components/layout/BlueprintLayout'
import { ArrowUpRight, ArrowLeft, Check, Disc3 } from 'lucide-react'
import type { SpotifyTrackResponse } from '@/lib/spotify'

function DiscordIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

function MusicBars() {
  return (
    <div className="flex items-end gap-[2px] h-3 w-3">
      <span className="w-[2.5px] bg-emerald-500 rounded-full animate-[music-bar_0.8s_ease-in-out_infinite] [animation-delay:0.1s]" />
      <span className="w-[2.5px] bg-emerald-500 rounded-full animate-[music-bar_0.8s_ease-in-out_infinite] [animation-delay:0.3s]" />
      <span className="w-[2.5px] bg-emerald-500 rounded-full animate-[music-bar_0.8s_ease-in-out_infinite] [animation-delay:0.2s]" />
    </div>
  )
}

const DISCORD_DATA = {
  tag: 'nikhxl_7',
}

const GEARS = [
  {
    name: 'ThinkPad E16 Gen 3',
    category: 'Laptop',
    link: 'https://www.lenovo.com/in/en/p/laptops/thinkpad/thinkpade/lenovo-thinkpad-e16-gen-3-16-inch-intel/21sss1hs00',
  },
  {
    name: 'MSI MAG 255F',
    category: 'Display',
    link: 'https://www.amazon.in/MSI-MAG-255F-E20-Frame-Less/dp/B0DQP36N7T',
  },
  {
    name: 'EvoFox Ronin',
    category: 'Keyboard',
    link: 'https://www.amazon.in/EvoFox-Wireless-Mechanical-Controller-Black/dp/B0F66JWD47',
  },
  {
    name: 'Razer DeathAdder HyperSpeed',
    category: 'Mouse',
    link: 'https://www.amazon.in/Razer-DeathAdder-Hyperspeed-Award-Winning-RZ01-04130100-R3A1/dp/B09KH6NFXG',
  },
  {
    name: 'Motorola Edge 70 Pro Plus',
    category: 'Phone',
    link: 'https://www.motorola.in/smartphones-motorola-edge-70-pro-plus/p?skuId=677',
  },
]

export default function MePage() {
  const [copiedDiscord, setCopiedDiscord] = useState(false)
  const [spotify, setSpotify] = useState<SpotifyTrackResponse>({
    isPlaying: false,
    title: 'Loading track...',
    artist: 'Spotify',
    album: '',
    albumImageUrl: '',
    songUrl: 'https://open.spotify.com',
  })

  useEffect(() => {
    async function fetchSpotify() {
      try {
        const res = await fetch('/api/spotify')
        if (res.ok) {
          const data = await res.json()
          setSpotify(data)
        }
      } catch {
        // Keeps previous state on error
      }
    }

    fetchSpotify()
    const interval = setInterval(fetchSpotify, 15000)
    return () => clearInterval(interval)
  }, [])

  const handleCopyDiscord = () => {
    if (DISCORD_DATA.tag) {
      navigator.clipboard.writeText(DISCORD_DATA.tag)
      setCopiedDiscord(true)
      setTimeout(() => setCopiedDiscord(false), 2000)
    }
  }

  return (
    <BlueprintLayout showNavbar={false}>
      <div className="w-full space-y-10 py-2 select-none">
        
        {/* Navigation */}
        <div className="flex flex-column">
          <Link
          href="/"
          className="p-1 rounded-md w-fit hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center"
        >
          <ArrowLeft className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
          
        </Link>
        <span className="ml-2 text-lg font-semibold text-neutral-600 dark:text-neutral-100">More</span>
        </div>

        {/* ── LIVE PRESENCE (Spotify & Discord Cards) ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Enhanced Spotify Widget */}
          <a
            href={spotify.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-xl border border-neutral-200/70 dark:border-neutral-800/80 bg-neutral-50/40 dark:bg-neutral-900/20 p-3 sm:p-3.5 flex items-center gap-3.5 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/40 transition-colors"
          >
            {/* Album Artwork or Vinyl Disc */}
            <div className="relative size-12 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800 shrink-0 border border-black/5 dark:border-white/5 flex items-center justify-center">
              {spotify.albumImageUrl ? (
                <Image
                  src={spotify.albumImageUrl}
                  alt={spotify.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <Disc3 className="size-6 text-neutral-400 animate-spin [animation-duration:8s]" />
              )}
            </div>

            {/* Track Info */}
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider">
                {spotify.isPlaying ? (
                  <>
                    <MusicBars />
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">NOW PLAYING</span>
                  </>
                ) : (
                  <>
                    <span className="size-1.5 rounded-full bg-neutral-400" />
                    <span className="text-neutral-500">RECENTLY PLAYED</span>
                  </>
                )}
              </div>

              <div className="text-[13px] font-medium text-neutral-900 dark:text-neutral-100 truncate group-hover:underline underline-offset-2">
                {spotify.title}
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                {spotify.artist}
              </p>
            </div>

            <ArrowUpRight className="size-3.5 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mr-1" />
          </a>

          {/* Discord Presence with Refined Micro-Tooltip */}
          <div className="relative group">
            <button
              type="button"
              onClick={handleCopyDiscord}
              aria-label="Copy Discord username"
              className="w-full text-left rounded-xl border border-neutral-200/70 dark:border-neutral-800/80 bg-neutral-50/40 dark:bg-neutral-900/20 p-3 sm:p-3.5 flex items-center gap-3.5 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/40 transition-colors cursor-pointer select-none"
            >
              <div className="relative flex items-center justify-center size-12 rounded-lg bg-[#5865F2]/10 text-[#5865F2] shrink-0 border border-[#5865F2]/20">
                <DiscordIcon className="size-6 transition-transform duration-300 group-hover:scale-105" />
                <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-900" />
              </div>

              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 dark:text-neutral-400 tracking-wider">
                  <span>DISCORD</span>
                </div>
                <div className="text-[13px] font-medium text-neutral-900 dark:text-neutral-100 truncate">
                  {DISCORD_DATA.tag}
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Click to copy username
                </p>
              </div>
            </button>

            {/* Micro Tooltip */}
            <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-all duration-150 ease-out z-20">
              <div className="relative bg-neutral-900/90 dark:bg-neutral-100/95 text-white dark:text-neutral-900 text-[10px] font-mono tracking-tight py-0.5 px-2 rounded-md shadow-sm border border-neutral-800 dark:border-neutral-200 whitespace-nowrap flex items-center gap-1">
                {copiedDiscord ? (
                  <>
                    <Check className="size-2.5 text-emerald-400 dark:text-emerald-600" />
                    <span>Copied tag</span>
                  </>
                ) : (
                  <span>Copy to clipboard</span>
                )}
                {/* Arrow Caret */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-[3px] border-transparent border-t-neutral-900/90 dark:border-t-neutral-100/95" />
              </div>
            </div>
          </div>

        </section>

        {/* ── HARDWARE GEARS ── */}
        <section className="space-y-3">
          <h2 className="text-[13px] sm:text-[14px] font-medium text-neutral-500 dark:text-neutral-400">
            <span className="text-neutral-400 dark:text-neutral-600 mr-1 select-none">#</span>
            Gears and Device
          </h2>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-900">
            {GEARS.map((gear) => (
              <a
                key={gear.name}
                href={gear.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between py-2.5 hover:bg-neutral-50/60 dark:hover:bg-neutral-900/40 px-2 -mx-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group-hover:underline underline-offset-4">
                    {gear.name}
                  </span>
                  <ArrowUpRight className="size-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500 text-right">
                  {gear.category}
                </span>
              </a>
            ))}
          </div>
        </section>

      </div>
    </BlueprintLayout>
  )
}