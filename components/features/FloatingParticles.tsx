'use client'

import React, { useEffect, useRef } from 'react'

interface Particle {
  x: number
  baseY: number
  y: number
  size: number
  aspectRatio: number
  speed: number
  baseOpacity: number
  rotation: number
  rotationSpeed: number
  verticalAmplitude: number
  verticalFrequency: number
  phase: number
  depth: 'bg' | 'mid' | 'fg'
  colorDark: string
  colorLight: string
}

const PALETTE_DARK = [
  'rgba(255, 255, 255, 0.9)',
  'rgba(255, 255, 255, 0.85)',
  'rgba(255, 255, 255, 0.85)',
  'rgba(255, 255, 255, 0.8)',
]

const PALETTE_LIGHT = [
  'rgba(116, 145, 183, 0.85)',
  'rgba(70, 85, 110, 0.8)',
  'rgba(213, 185, 185, 0.95)',
  'rgba(125, 168, 211, 0.75)',
]

function createParticle(width: number, height: number, initialRandomX = true): Particle {
  const depthRand = Math.random()
  let depth: 'bg' | 'mid' | 'fg' = 'mid'
  let size = 5.5
  let speed = 0.45
  let baseOpacity = 0.6
  let amplitude = 6
  let freq = 0.0018

  if (depthRand < 0.35) {
    depth = 'bg'
    size = 3.5 + Math.random() * 2.0
    speed = 0.25 + Math.random() * 0.2
    baseOpacity = 0.45 + Math.random() * 0.15
    amplitude = 4 + Math.random() * 4
    freq = 0.0012 + Math.random() * 0.0006
  } else if (depthRand < 0.75) {
    depth = 'mid'
    size = 5.5 + Math.random() * 2.5
    speed = 0.4 + Math.random() * 0.3
    baseOpacity = 0.6 + Math.random() * 0.2
    amplitude = 6 + Math.random() * 5
    freq = 0.0015 + Math.random() * 0.0008
  } else {
    depth = 'fg'
    size = 7.5 + Math.random() * 3.0
    speed = 0.6 + Math.random() * 0.35
    baseOpacity = 0.75 + Math.random() * 0.2
    amplitude = 8 + Math.random() * 6
    freq = 0.0018 + Math.random() * 0.001
  }

  const colorDark = PALETTE_DARK[Math.floor(Math.random() * PALETTE_DARK.length)]
  const colorLight = PALETTE_LIGHT[Math.floor(Math.random() * PALETTE_LIGHT.length)]

  const x = initialRandomX
    ? Math.random() * (width + 40) - 20
    : -20 - Math.random() * 30
  const baseY = Math.random() * height
  const phase = Math.random() * Math.PI * 2

  return {
    x,
    baseY,
    y: baseY,
    size,
    aspectRatio: 1.8 + Math.random() * 0.8,
    speed,
    baseOpacity,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.35) * 0.012,
    verticalAmplitude: amplitude,
    verticalFrequency: freq,
    phase,
    depth,
    colorDark,
    colorLight,
  }
}

function drawPetal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  aspectRatio: number,
  rotation: number,
  color: string,
  opacity: number
) {
  if (opacity <= 0.005) return

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.globalAlpha = opacity

  ctx.fillStyle = color
  ctx.beginPath()

  const w = size * aspectRatio
  const h = size

  ctx.moveTo(0, 0)
  ctx.bezierCurveTo(w * 0.35, -h * 1.05, w * 0.75, -h * 0.85, w, 0)
  ctx.bezierCurveTo(w * 0.75, h * 0.85, w * 0.35, h * 1.05, 0, 0)
  ctx.closePath()
  ctx.fill()

  ctx.restore()
}

export default function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId = 0
    let isVisible = true
    let width = 0
    let height = 0
    let particles: Particle[] = []

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const isReducedMotion = mediaQuery.matches

    const initParticles = (w: number, h: number) => {
      const isMobile = w < 640
      const count = isMobile ? 10 : 20
      particles = []
      for (let i = 0; i < count; i++) {
        particles.push(createParticle(w, h, true))
      }
    }

    const resizeCanvas = () => {
      const parent = canvas.parentElement || canvas
      const rect = parent.getBoundingClientRect()
      width = rect.width
      height = rect.height

      if (width === 0 || height === 0) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)

      if (particles.length === 0) {
        initParticles(width, height)
      }
    }

    resizeCanvas()

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas()
    })
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement)
    }

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (isVisible && !isReducedMotion && !animationFrameId) {
        lastTime = performance.now()
        animationFrameId = requestAnimationFrame(animate)
      } else if (!isVisible && animationFrameId) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = 0
      }
    })
    intersectionObserver.observe(canvas)

    let lastTime = performance.now()

    const render = (time: number) => {
      if (!ctx || width === 0 || height === 0) return

      ctx.clearRect(0, 0, width, height)

      const isDark = document.documentElement.classList.contains('dark')

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        let currentOpacity = p.baseOpacity
        const fadeInZone = Math.max(width * 0.1, 35)
        if (p.x < fadeInZone) {
          const t = Math.max(0, (p.x + 20) / (fadeInZone + 20))
          currentOpacity *= t
        }

        const fadeOutZone = width - Math.max(width * 0.1, 35)
        if (p.x > fadeOutZone) {
          const t = Math.max(0, (width + 20 - p.x) / (width + 20 - fadeOutZone))
          currentOpacity *= t
        }

        p.y = p.baseY + Math.sin(time * p.verticalFrequency + p.phase) * p.verticalAmplitude

        const color = isDark ? p.colorDark : p.colorLight

        drawPetal(
          ctx,
          p.x,
          p.y,
          p.size,
          p.aspectRatio,
          p.rotation,
          color,
          currentOpacity
        )
      }
    }

    const animate = (time: number) => {
      const delta = Math.min(time - lastTime, 64)
      lastTime = time

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.speed * (delta / 16.67)
        p.rotation += p.rotationSpeed * (delta / 16.67)

        if (p.x > width + 25) {
          particles[i] = createParticle(width, height, false)
        }
      }

      render(time)

      if (isVisible && !isReducedMotion) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    if (isReducedMotion) {
      render(0)
    } else {
      animationFrameId = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      aria-hidden="true"
    />
  )
}