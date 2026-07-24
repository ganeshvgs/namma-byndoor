"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
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
    // Read the HTML class set by our synchronous script
    if (document.documentElement.classList.contains("is-loading")) {
      setIsLoaderActive(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaderActive) return;

    // Requirement 2: Minimum 4 seconds duration
    const timer = setTimeout(() => {
      setTimerDone(true);
    }, 4000);

    // Failsafe: Prevent permanent loader if video API fails entirely (max wait 10s)
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
    // Both conditions must be met to remove the loader
    if (timerDone && videoReady) {
      setIsLoaderActive(false);
    }
  }, [timerDone, videoReady]);

  const markVideoReady = () => setVideoReady(true);

  // When framer-motion finishes animating the loader away, reveal the site
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