"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, memo } from "react";
import { usePathname } from "next/navigation";
import Loader from "../components/Loader";

interface LoadingContextType {
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType>({ isLoading: false });

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = memo(function LoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Initialize state lazily without causing hydration mismatch warnings
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    if (window.location.pathname !== "/") return false;
    return !sessionStorage.getItem("namma-byndoor-loader");
  });

  const handleComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isHome) {
      setIsLoading(false);
      return;
    }

    const hasVisited = sessionStorage.getItem("namma-byndoor-loader");

    if (hasVisited) {
      setIsLoading(false);
      // Clean up pre-hydration attribute immediately if already visited
      document.documentElement.removeAttribute("data-loading");
      return;
    }

    // Mark as visited for subsequent navigations
    sessionStorage.setItem("namma-byndoor-loader", "true");
    setIsLoading(true);

    // Once the React Loader component is mounted and covering the viewport,
    // remove the pre-hydration CSS lock so the homepage renders underneath
    const frameId = requestAnimationFrame(() => {
      document.documentElement.removeAttribute("data-loading");
    });

    // PRODUCTION FAILSAFE: Hard termination at 4500ms (500ms buffer over 4.0s animation)
    // Guarantees the site never hangs even if browser tabs are backgrounded or OS throttles JS
    const failsafe = setTimeout(() => {
      setIsLoading(false);
    }, 4500);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(failsafe);
    };
  }, [isHome]);

  // Strict scroll locking during active loading
  useEffect(() => {
    if (isLoading) {
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
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={{ isLoading }}>
      {children}
      {/* Conditionally render pure presentational loader */}
      {isLoading && isHome && <Loader onComplete={handleComplete} />}
    </LoadingContext.Provider>
  );
});