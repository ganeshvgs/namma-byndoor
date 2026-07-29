"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import Loader from "../components/Loader";

interface LoaderContextType {
  markVideoReady: () => void;
}

const LoaderContext = createContext<LoaderContextType>({
  markVideoReady: () => {},
});

export const useLoader = () => useContext(LoaderContext);

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    // Read the HTML class set by our synchronous script in layout.tsx
    if (document.documentElement.classList.contains("is-loading")) {
      setIsLoaderActive(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaderActive) return;

    // OPTIMIZATION: The Loader map draws for 2.5s, fills for 0.8s (Total 3.3s). 
    // Reduced from forced 4000ms to 3400ms to dismiss the millisecond the brand drawing finishes.
    const timer = setTimeout(() => {
      setTimerDone(true);
    }, 3400);

    // Failsafe: Prevent permanent loader if network dies or DB is empty
    const failsafe = setTimeout(() => {
      setTimerDone(true);
      setVideoReady(true);
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearTimeout(failsafe);
    };
  }, [isLoaderActive]);

  useEffect(() => {
    // Both branding minimum AND first Hero video readiness must be met
    if (timerDone && videoReady) {
      setIsLoaderActive(false);
    }
  }, [timerDone, videoReady]);

  // Wrapped in useCallback to prevent continuous re-rendering of children using context
  const markVideoReady = useCallback(() => {
    setVideoReady((prev) => {
      if (prev) return prev; // Idempotent check
      return true;
    });
  }, []);

  // When framer-motion finishes fading the loader away, reveal scrollbar
  const handleLoaderExitComplete = () => {
    document.documentElement.classList.remove("is-loading");
  };

  return (
    <LoaderContext.Provider value={{ markVideoReady }}>
      {children}
      <AnimatePresence onExitComplete={handleLoaderExitComplete}>
        {isLoaderActive && <Loader />}
      </AnimatePresence>
    </LoaderContext.Provider>
  );
}