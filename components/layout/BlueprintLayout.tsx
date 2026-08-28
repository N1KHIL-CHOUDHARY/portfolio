import Navbar from "./Navbar";

interface BlueprintLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export default function BlueprintLayout({
  children,
  showNavbar = true,
}: BlueprintLayoutProps) {
  return (
    <div className="relative max-w-4xl mx-auto border-x border-dashed border-neutral-300 dark:border-neutral-800 min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      {showNavbar && <Navbar />}
      <div className="flex-1 px-6 sm:px-8 py-10 md:py-12 relative">
        {children}
      </div>
    </div>
  );
}
