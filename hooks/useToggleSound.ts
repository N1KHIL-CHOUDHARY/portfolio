'use client'

import { useRef, useCallback } from 'react'

interface UseToggleSoundOptions {
  soundUrl?: string
  volume?: number
}

// Shared audio context – created lazily on first user interaction
let sharedAudioContext: AudioContext | null = null
const bufferCache = new Map<string, AudioBuffer>()
const loadingPromises = new Map<string, Promise<AudioBuffer | null>>()

function getOrCreateAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!sharedAudioContext) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioCtx) {
      sharedAudioContext = new AudioCtx()
    }
  }
  return sharedAudioContext
}

// Load audio buffer lazily – only fetched when actually needed
function loadAudioBuffer(ctx: AudioContext, soundUrl: string): Promise<AudioBuffer | null> {
  if (bufferCache.has(soundUrl)) {
    return Promise.resolve(bufferCache.get(soundUrl)!)
  }

  // Deduplicate concurrent load requests
  if (loadingPromises.has(soundUrl)) {
    return loadingPromises.get(soundUrl)!
  }

  const promise = fetch(soundUrl)
    .then((res) => res.arrayBuffer())
    .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
    .then((decoded) => {
      bufferCache.set(soundUrl, decoded)
      loadingPromises.delete(soundUrl)
      return decoded
    })
    .catch(() => {
      loadingPromises.delete(soundUrl)
      return null
    })

  loadingPromises.set(soundUrl, promise)
  return promise
}

export function useToggleSound({
  soundUrl = '/sounds/toggle.mp3',
  volume = 0.25,
}: UseToggleSoundOptions = {}) {
  const optionsRef = useRef({ soundUrl, volume })
  optionsRef.current = { soundUrl, volume }

  // No useEffect, no eager loading. Everything happens on first call.
  const playToggleSound = useCallback(async () => {
    const ctx = getOrCreateAudioContext()
    if (!ctx) return

    // Resume suspended context (browser autoplay policy)
    if (ctx.state === 'suspended') {
      try { await ctx.resume() } catch { return }
    }

    const url = optionsRef.current.soundUrl

    // Load on first play – cached for subsequent plays
    const buffer = await loadAudioBuffer(ctx, url)
    if (!buffer) return

    try {
      const source = ctx.createBufferSource()
      source.buffer = buffer

      const gainNode = ctx.createGain()
      gainNode.gain.value = optionsRef.current.volume

      source.connect(gainNode)
      gainNode.connect(ctx.destination)

      source.start(0)
    } catch {
      // Silently fail – audio is non-critical
    }
  }, [])

  return playToggleSound
}
