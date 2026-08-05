'use client'

import { useEffect, useRef, useCallback } from 'react'

interface UseToggleSoundOptions {
  soundUrl?: string
  volume?: number
}

let sharedAudioContext: AudioContext | null = null
const bufferCache = new Map<string, AudioBuffer>()

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!sharedAudioContext) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioCtx) {
      sharedAudioContext = new AudioCtx()
    }
  }
  return sharedAudioContext
}

export function useToggleSound({
  soundUrl = '/sounds/toggle.mp3',
  volume = 0.25,
}: UseToggleSoundOptions = {}) {
  const audioBufferRef = useRef<AudioBuffer | null>(null)
  const optionsRef = useRef({ soundUrl, volume })

  useEffect(() => {
    optionsRef.current = { soundUrl, volume }
  }, [soundUrl, volume])

  useEffect(() => {
    let isMounted = true

    async function loadAudio() {
      const ctx = getAudioContext()
      if (!ctx) return

      if (bufferCache.has(soundUrl)) {
        audioBufferRef.current = bufferCache.get(soundUrl) || null
        return
      }

      try {
        const response = await fetch(soundUrl)
        const arrayBuffer = await response.arrayBuffer()
        const decodedData = await ctx.decodeAudioData(arrayBuffer)

        bufferCache.set(soundUrl, decodedData)
        if (isMounted) {
          audioBufferRef.current = decodedData
        }
      } catch {
      }
    }

    loadAudio()

    return () => {
      isMounted = false
    }
  }, [soundUrl])

  const playToggleSound = useCallback(() => {
    const ctx = getAudioContext()
    const buffer = audioBufferRef.current || bufferCache.get(optionsRef.current.soundUrl)

    if (!ctx || !buffer) return

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }

    try {
      const source = ctx.createBufferSource()
      source.buffer = buffer

      const gainNode = ctx.createGain()
      gainNode.gain.value = optionsRef.current.volume

      source.connect(gainNode)
      gainNode.connect(ctx.destination)

      source.start(0)
    } catch {
    }
  }, [])

  return playToggleSound
}
