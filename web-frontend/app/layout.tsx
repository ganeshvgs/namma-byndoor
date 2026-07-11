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

  // Show loader only on homepage
  const isHome = pathname === "/";

  // Initial state
  const [loading, setLoading] = useState(isHome);

  // Handle route changes
  useEffect(() => {
    if (isHome) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isHome]);

  // Lock scrolling while loader is visible
  useEffect(() => {
    document.documentElement.style.overflow = loading ? "hidden" : "";
    document.body.style.overflow = loading ? "hidden" : "";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [loading]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}

        {loading && isHome && (
          <Loader
            onComplete={() => {
              setLoading(false);
            }}
          />
        )}
      </body>
    </html>
  );
}