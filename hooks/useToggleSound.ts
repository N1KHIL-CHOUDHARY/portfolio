'use client'

import { useEffect, useRef, useCallback } from 'react'
import { soundManager } from '@/lib/sound'

interface UseToggleSoundOptions {
  soundUrl?: string
  volume?: number
}

/**
 * Reusable hook for playing the theme toggle UI sound effect.
 * Preloads the audio once on mount using useRef to prevent unnecessary re-renders.
 */
export function useToggleSound({
  soundUrl = '/sounds/toggle.mp3',
  volume = 0.25,
}: UseToggleSoundOptions = {}) {
  const optionsRef = useRef({ soundUrl, volume })

  useEffect(() => {
    optionsRef.current = { soundUrl, volume }
  }, [soundUrl, volume])

  // Preload audio once on mount or when soundUrl/volume change
  useEffect(() => {
    soundManager.preload(soundUrl, volume)
  }, [soundUrl, volume])

  const playToggleSound = useCallback(() => {
    const { soundUrl: url, volume: vol } = optionsRef.current
    soundManager.play(url, vol)
  }, [])

  return playToggleSound
}
