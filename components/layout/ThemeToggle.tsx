"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const wrapperRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"

  const toggleTheme = useCallback(() => {
    wrapperRef.current?.querySelector("button")?.click()
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      ) {
        return
      }

      const target = event.target as HTMLElement | null

      if (
        target &&
        (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        )
      ) {
        return
      }

      if (event.key.toLowerCase() === "d") {
        toggleTheme()
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [toggleTheme])
  

  return (
    <span ref={wrapperRef} className="inline-flex">
      <AnimatedThemeToggler
        variant="circle"
        theme={isDark ? "dark" : "light"}
        onThemeChange={setTheme}
        aria-label={
          mounted
            ? isDark
              ? "Switch to light theme"
              : "Switch to dark theme"
            : "Toggle theme"
        }
        className={cn(
          buttonVariants({
            variant: "ghost",
            size: "icon",
          }),
          "size-8 rounded-full active:scale-95 [&_svg]:size-4",
          className
        )}
      />
    </span>
  )
}

export default ThemeToggle
