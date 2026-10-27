'use client'

import { useRef, useCallback, useEffect } from 'react'

interface UseHoverSoundOptions {
  soundUrl?: string
  volume?: number
  pitchShift?: boolean
}

let sharedAudioContext: AudioContext | null = null
let sharedBuffer: AudioBuffer | null = null
let isFetchingBuffer = false

function getOrCreateAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!sharedAudioContext) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioCtx) {
      sharedAudioContext = new AudioCtx()
    }
  }
  return sharedAudioContext
}

// Synthesize a soft, subtle tactile tick using Web Audio API
function playSynthesizedTick(
  ctx: AudioContext,
  volume: number,
  pitchMultiplier: number
) {
  try {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    // Subtle gentle pop: sine wave quick frequency ramp down
    const startFreq = 480 * pitchMultiplier
    osc.type = 'sine'
    osc.frequency.setValueAtTime(startFreq, now)
    osc.frequency.exponentialRampToValueAtTime(140 * pitchMultiplier, now + 0.035)

    // Smooth exponential decay
    gain.gain.setValueAtTime(volume * 0.8, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.035)
  } catch {
    // Audio is non-critical
  }
}

export function useHoverSound({
  soundUrl = '/sounds/click.mp3',
  volume = 0.15,
  pitchShift = true,
}: UseHoverSoundOptions = {}) {
  const optionsRef = useRef({ soundUrl, volume, pitchShift })
  optionsRef.current = { soundUrl, volume, pitchShift }
  const lastPlayTimeRef = useRef(0)

  // Warm up / preload buffer on client mount or idle
  useEffect(() => {
    const ctx = getOrCreateAudioContext()
    if (!ctx || sharedBuffer || isFetchingBuffer) return

    isFetchingBuffer = true
    fetch(soundUrl)
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
      .then((decoded) => {
        sharedBuffer = decoded
      })
      .catch(() => {})
      .finally(() => {
        isFetchingBuffer = false
      })
  }, [soundUrl])

  const playHoverSound = useCallback((index?: number) => {
    const nowMs = performance.now()
    // Prevent overlapping stutter (min 35ms between triggers)
    if (nowMs - lastPlayTimeRef.current < 35) {
      return
    }
    lastPlayTimeRef.current = nowMs

    const ctx = getOrCreateAudioContext()
    if (!ctx) return

    // Resume suspended context (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }

    const { volume, pitchShift } = optionsRef.current

    // Micro pitch modulation for melodic/tactile variation
    // Steps across 7 musical intervals for a warm marimba / tactile keyboard feel
    const pitchMultiplier =
      pitchShift && typeof index === 'number'
        ? 0.95 + (index % 7) * 0.05
        : 1.0

    if (sharedBuffer) {
      try {
        const source = ctx.createBufferSource()
        source.buffer = sharedBuffer
        source.playbackRate.value = pitchMultiplier

        const gainNode = ctx.createGain()
        gainNode.gain.value = volume

        source.connect(gainNode)
        gainNode.connect(ctx.destination)

        source.start(0)
      } catch {
        playSynthesizedTick(ctx, volume, pitchMultiplier)
      }
    } else {
      playSynthesizedTick(ctx, volume, pitchMultiplier)
    }
  }, [])

  return playHoverSound
}
