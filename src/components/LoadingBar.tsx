"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function LoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // This runs when navigation finishes
    setLoading(false);
  }, [pathname, searchParams]);

  // We need a way to detect the START of navigation.
  // In Next.js App Router, this is hard without a library or overriding Link.
  // However, we can simulate it by adding a listener to all clicks on <a> tags.
  
  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (
        anchor && 
        anchor.href && 
        anchor.href.startsWith(window.location.origin) && 
        !anchor.target &&
        anchor.href !== window.location.href
      ) {
        setLoading(true);
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-1 bg-black/20">
      <div className="h-full bg-primary shadow-[0_0_10px_#d4af37] transition-all duration-1000 ease-out animate-progress-loading" />
    </div>
  );
}
