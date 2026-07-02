"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loader from "./components/Loader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Initialize loading state. 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Enforce strict route-based loader behavior:
    // - Disable loader immediately on any route other than Home ("/")
    // - Enable loader every time the user visits or refreshes Home ("/")
    if (pathname !== "/") {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [pathname]);

  return (
    <html lang="en">
      {/* 
        Optional UX addition: conditionally applying overflow-hidden prevents 
        the user from accidentally scrolling the background page while the 
        loader overlay is still active. 
      */}
      <body 
        suppressHydrationWarning 
        style={{ overflow: loading && pathname === "/" ? "hidden" : "auto" }}
      >
        {/* 
          1. THE LOADER OVERLAY
          Rendered alongside children. Since your Loader.tsx already has 
          `fixed inset-0 z-[9999]`, it acts as an absolute cover.
          Once its internal fade-out finishes, it triggers onComplete.
        */}
        {loading && pathname === "/" && (
          <Loader onComplete={() => setLoading(false)} />
        )}

        {/* 
          2. THE APPLICATION (BACKGROUND PRE-RENDER)
          By rendering `children` unconditionally, the Next.js App Router 
          mounts the homepage immediately behind the loader. 
          Hero videos, images, and components are given those ~9 seconds 
          to fully fetch, paint, and begin playing seamlessly.
        */}
        {children}
      </body>
    </html>
  );
}