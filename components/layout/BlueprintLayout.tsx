"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import { cn } from "@/lib/utils";

interface BlueprintLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  className?: string;
}

export default function BlueprintLayout({
  children,
  showNavbar,
  className,
}: BlueprintLayoutProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const shouldShowNavbar = showNavbar !== undefined ? showNavbar : isHomePage;

  return (
    <main
      className={cn(
        "min-h-screen w-full flex flex-col items-center px-6 sm:px-8 bg-white dark:bg-neutral-950 font-sans",
        className
      )}
    >
      <div className="w-full max-w-[720px]">
        {shouldShowNavbar && <Navbar />}
        <div className={cn("relative pb-16", !shouldShowNavbar && "pt-8 sm:pt-10")}>
          {children}
        </div>
      </div>
    </main>
  );
}
