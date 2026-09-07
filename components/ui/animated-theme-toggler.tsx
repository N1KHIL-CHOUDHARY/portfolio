
"use client"

import React, { useRef } from "react"
import { flushSync } from "react-dom"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToggleSound } from "@/hooks/useToggleSound"

export interface AnimatedThemeTogglerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "circle"
  theme?: "light" | "dark"
  onThemeChange?: (theme: "light" | "dark") => void
  className?: string
  soundUrl?: string
  volume?: number
}

export function AnimatedThemeToggler({
  variant = "circle",
  theme = "light",
  onThemeChange,
  className,
  soundUrl = "/sounds/click.mp3",
  volume = 0.25,
  onClick,
  children,
  ...props
}: AnimatedThemeTogglerProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const playToggleSound = useToggleSound({ soundUrl, volume })

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    if (e.defaultPrevented) return

    playToggleSound()

    const nextTheme: "light" | "dark" = theme === "dark" ? "light" : "dark"

    if (
      typeof document === "undefined" ||
      !("startViewTransition" in document) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      onThemeChange?.(nextTheme)
      return
    }

    const button = buttonRef.current
    if (!button) {
      onThemeChange?.(nextTheme)
      return
    }

    const rect = button.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const doc = document as Document & {
      startViewTransition: (callback: () => Promise<void> | void) => {
        ready: Promise<void>
        finished: Promise<void>
      }
    }

    const transition = doc.startViewTransition(() => {
      flushSync(() => {
        onThemeChange?.(nextTheme)
      })
    })

    transition.ready
      .then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ]

        document.documentElement.animate(
          {
            clipPath,
          },
          {
            duration: 600,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          }
        )
      })
      .catch(() => {})
  }

  const isDark = theme === "dark"

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleToggle}
      className={cn(
        "cursor-pointer flex items-center justify-center transition-colors",
        className
      )}
      {...props}
    >
      {children ? (
        children
      ) : isDark ? (
        <Sun className="h-4 w-4 text-neutral-200 hover:rotate-45 transition-transform duration-200" />
      ) : (
        <Moon className="h-4 w-4 text-neutral-700 hover:-rotate-12 transition-transform duration-200" />
      )}
    </button>
  )
}

export default AnimatedThemeToggler
