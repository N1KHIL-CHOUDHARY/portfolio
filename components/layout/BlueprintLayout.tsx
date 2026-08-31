import Navbar from "./Navbar";
import { cn } from "@/lib/utils";

interface BlueprintLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  className?: string;
}

export default function BlueprintLayout({
  children,
  showNavbar = false,
  className,
}: BlueprintLayoutProps) {
  return (
    <div
      className={cn(
        "relative max-w-3xl mx-auto border-x border-dashed border-neutral-300 dark:border-neutral-800 min-h-screen flex flex-col bg-white dark:bg-neutral-950",
        className
      )}
    >
      {showNavbar && <Navbar />}
      <div className="flex-1 px-6 sm:px-8 py-10 md:py-12 relative">
        {children}
      </div>
    </div>
  );
}
