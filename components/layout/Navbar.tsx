"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Code2, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToggleSound } from "@/hooks/useToggleSound";
import { useTheme } from "@/hooks/useTheme";

export interface NavbarProps {
  isDark?: boolean;
  toggleTheme?: () => void;
  onNavigate?: (sectionId: string) => void;
  className?: string;
}

export default function Navbar({
  isDark: propIsDark,
  toggleTheme: propToggleTheme,
  onNavigate,
  className,
}: NavbarProps) {
  const { isDark: hookIsDark, toggleTheme: hookToggleTheme, mounted } = useTheme();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const playToggleSound = useToggleSound({ soundUrl: "/sounds/click.mp3", volume: 0.25 });
  const pathname = usePathname();

  const isDark = propIsDark !== undefined ? propIsDark : hookIsDark;
  const activeToggle = propToggleTheme || hookToggleTheme;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleToggleTheme = () => {
    playToggleSound();
    activeToggle();
  };

  const navItems = [
    { id: "home", label: "Home", href: "/", icon: <Home className="w-3.5 h-3.5 shrink-0" /> },
    { id: "projects", label: "Projects", href: "/projects", icon: <Code2 className="w-3.5 h-3.5 shrink-0" /> },
  ];

  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200 border-b border-dashed border-neutral-300 dark:border-neutral-800",
        scrolled
          ? "bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md"
          : "bg-white dark:bg-neutral-950",
        className
      )}
    >
      <div className="w-full px-6 sm:px-8 h-14 flex items-center justify-between gap-4">
        <nav className="flex items-center gap-1 font-mono text-xs">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={item.id === "home" ? handleHomeClick : undefined}
              aria-label={item.label}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100",
                pathname === item.href
                  ? "text-neutral-950 dark:text-neutral-50 font-semibold bg-neutral-100 dark:bg-neutral-800 border border-neutral-300/80 dark:border-neutral-700/80"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 hover:bg-neutral-100/70 dark:hover:bg-neutral-900"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {mounted ? (
            <button
              type="button"
              onClick={handleToggleTheme}
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              title={isDark ? "Switch to light theme" : "Switch to dark theme"}
              className="p-2 rounded-md border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-neutral-100 hover:border-neutral-400 dark:hover:border-neutral-700 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100 active:scale-95 cursor-pointer"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-700 transition-transform duration-200 hover:-rotate-12" />
              )}
            </button>
          ) : (
            <div className="w-8 h-8 rounded-md" aria-hidden="true" />
          )}
        </div>
      </div>
    </header>
  );
}