/**
 * Singleton SoundManager for high-performance audio playback with zero latency.
 * Preloads audio once and maintains shared instances in memory to eliminate loading delays
 * and prevent overlapping audio playback glitches.
 */
class SoundManager {
  private static instance: SoundManager
  private audioMap: Map<string, HTMLAudioElement> = new Map()

  private constructor() {}

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager()
    }
    return SoundManager.instance
  }

  /**
   * Preloads an audio file into memory.
   */
  public preload(src: string, volume: number = 0.25): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null

    let audio = this.audioMap.get(src)
    if (!audio) {
      audio = new Audio(src)
      audio.preload = 'auto'
      audio.volume = volume
      this.audioMap.set(src, audio)
    } else {
      audio.volume = volume
    }
    return audio
  }

  /**
   * Instantly plays the preloaded audio from start (currentTime = 0).
   * Catches browser autoplay restrictions silently.
   */
  public play(src: string, volume: number = 0.25): void {
    if (typeof window === 'undefined') return

    let audio = this.audioMap.get(src)
    if (!audio) {
      audio = this.preload(src, volume)!
    }

    if (audio) {
      audio.volume = volume
      audio.currentTime = 0
      const promise = audio.play()
      if (promise !== undefined) {
        promise.catch(() => {
          // Silently handle autoplay / user gesture restrictions
        })
      }
    }
  }
}

export const soundManager = SoundManager.getInstance()
