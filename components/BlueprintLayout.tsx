import React from "react";

interface BlueprintLayoutProps {
  children: React.ReactNode;
}

export default function BlueprintLayout({ children }: BlueprintLayoutProps) {
  return (
    <div className="relative max-w-4xl mx-auto border-x border-dashed border-neutral-300 dark:border-neutral-800 min-h-screen flex flex-col">
      
      <div className="h-28 w-full bg-dot-grid opacity-40 dark:opacity-30 border-b border-dashed border-neutral-300 dark:border-neutral-800" />

      
      <div className="flex-1 px-8 py-10 md:p-12 relative">
        {children}
      </div>

     
      <div className="w-full border-t border-dashed border-neutral-300 dark:border-neutral-800 my-4" />
      <div className="h-32 w-full bg-dot-grid opacity-40 dark:opacity-30 border-t border-dashed border-neutral-300 dark:border-neutral-800" />
    </div>
  );
}
