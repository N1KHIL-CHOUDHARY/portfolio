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
        promise.catch(() => {})
      }
    }
  }
}

export const soundManager = SoundManager.getInstance()
