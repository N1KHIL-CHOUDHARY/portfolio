import React from "react";
import Navbar from "@/components/Navbar";

interface BlueprintLayoutProps {
  children: React.ReactNode;
}

export default function BlueprintLayout({ children }: BlueprintLayoutProps) {
  return (
    <div className="relative max-w-4xl mx-auto border-x border-dashed border-neutral-300 dark:border-neutral-800 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 px-8 py-10 md:p-12 relative">
        {children}
      </div>
    </div>
  );
}
