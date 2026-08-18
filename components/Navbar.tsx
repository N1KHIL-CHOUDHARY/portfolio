"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Code2,
  Mail,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToggleSound } from "@/hooks/useToggleSound";

export interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
  onNavigate?: (sectionId: string) => void;
  activeSection?: string;
  className?: string;
}

export default function Navbar({
  isDark,
  toggleTheme,
  onNavigate,
  className,
}: NavbarProps) {
  const playToggleSound = useToggleSound({ soundUrl: "/sounds/toggle.mp3", volume: 0.25 });
  const pathname = usePathname();
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
    }
  }, []);

  const navItems = [
    { id: "home", label: "Home", href: "/", icon: <Home className="w-3.5 h-3.5 shrink-0" /> },
    { id: "projects", label: "Projects", href: "/projects", icon: <Code2 className="w-3.5 h-3.5 shrink-0" /> },
    { id: "contact", label: "Contact", href: "/contact", icon: <Mail className="w-3.5 h-3.5 shrink-0" /> },
  ];

  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className={cn("sticky top-0 z-50 w-full backdrop-blur-md bg-[var(--bg)]/80 transition-colors duration-200", className)}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 h-14 flex items-center justify-between gap-2 sm:gap-4">
        <nav className="flex items-center gap-1 p-1 font-mono text-xs">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={item.id === "home" ? handleHomeClick : undefined}
              aria-label={item.label}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-1 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-zinc-950 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60",
                pathname === item.href
                  ? "text-zinc-950 dark:text-white font-bold bg-zinc-200/40 dark:bg-zinc-800/40"
                  : "text-zinc-700 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              )}
            >
              {item.icon}
              <span className="hidden sm:inline-block">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              playToggleSound();
              toggleTheme();
            }}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className="p-2 rounded-lg border border-zinc-300/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white active:scale-95 shadow-2xs"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700 transition-transform duration-200 hover:-rotate-12" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}