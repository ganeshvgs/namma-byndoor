//path web-frontend/app/layout.tsx
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
  const isHome = pathname === "/";

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // No loader on other pages
    if (!isHome) {
      setLoading(false);
      return;
    }

    // Show loader only once per browser session
    const hasVisited = sessionStorage.getItem("namma-byndoor-loader");

    if (hasVisited) {
      setLoading(false);
      return;
    }

    sessionStorage.setItem("namma-byndoor-loader", "true");
    setLoading(true);

    // Main loader duration
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    // Failsafe (prevents permanent loader)
    const failsafe = setTimeout(() => {
      setLoading(false);
    }, 6000);

    return () => {
      clearTimeout(timer);
      clearTimeout(failsafe);
    };
  }, [pathname, isHome]);

  // Prevent scrolling while loader is visible
  useEffect(() => {
    if (loading) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [loading]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}

        {loading && isHome && <Loader />}
      </body>
    </html>
  );
}