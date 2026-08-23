"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useToggleSound } from "@/hooks/useToggleSound";

export default function FloatingThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);
  const playToggleSound = useToggleSound({ soundUrl: "/sounds/toggle.mp3", volume: 0.25 });

  useEffect(() => {
    setMounted(true);
    const checkDark = () => {
      const dark = document.documentElement.classList.contains("dark");
      setIsDark(dark);
    };

    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleToggle = () => {
    playToggleSound();
    const nextDark = !isDark;
    setIsDark(nextDark);

    document.documentElement.classList.toggle("dark", nextDark);
    document.documentElement.style.colorScheme = nextDark ? "dark" : "light";
    try {
      localStorage.setItem("theme", nextDark ? "dark" : "light");
    } catch (_) {}
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-2 sm:right-2 z-50">
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        className="group relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md border border-neutral-300/80 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md shadow-lg dark:shadow-neutral-950/60 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 cursor-pointer"
      >
        <div className="relative w-5 h-5 flex items-center justify-center select-none">
          {isDark ? (
            <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300" />
          ) : (
            <Moon className="w-5 h-5 text-neutral-800 transition-transform duration-300" />
          )}
        </div>
      </button>
    </div>
  );
}
