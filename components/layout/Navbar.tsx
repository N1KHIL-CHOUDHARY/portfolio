"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/layout/ThemeToggle";

export interface NavbarProps {
  onNavigate?: (sectionId: string) => void;
  className?: string;
}

export default function Navbar({
  onNavigate,
  className,
}: NavbarProps) {
  const pathname = usePathname();

  const navItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "projects", label: "Projects", href: "/projects" },
    { id: "gears", label: "Gears", href: "/gears" },
  ];

  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className={cn("w-full pt-8 pb-14 flex items-center justify-between", className)}>
      <nav className="flex items-center gap-7">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={item.id === "home" ? handleHomeClick : undefined}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100",
                isActive
                  ? "text-neutral-900 dark:text-neutral-100 font-medium text-[14px]"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-normal text-[14px]"
              )}
            >
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2 shrink-0">
        <ThemeToggle />
      </div>
    </header>
  );
}