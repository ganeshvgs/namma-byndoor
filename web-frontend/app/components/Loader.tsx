"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAP_PATH =
  "M 43 2 L 52 14 L 62 25 L 85 18 L 105 28 L 128 32 L 138 45 L 148 55 L 165 52 L 182 72 L 188 95 L 175 105 L 185 118 L 168 120 L 155 108 L 138 102 L 125 112 L 105 102 L 85 115 L 70 110 L 58 100 L 52 122 L 45 125 L 40 105 L 35 75 L 28 50 L 22 28 L 32 18 Z";

// ─── Loader ───────────────────────────────────────────────────────────────────

interface LoaderProps {
  onComplete?: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const hasStarted = useRef(false);

  // Dismiss loader sequence
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    
    // Starts fading out at 4.0s
    const t = setTimeout(() => {
      setIsVisible(false);
      // Wait for fade-out duration (0.4s) before triggering completion at 4.4s
      if (onComplete) setTimeout(onComplete, 400);
    }, 4000);
    
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.2, // Loader fades in (0.0s -> 0.2s)
            exit: { duration: 0.4, ease: "easeInOut" } // Loader fades away (4.0s -> 4.4s)
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#FFFFFF" }}
        >
          {/* ── Map SVG ────────────────────────────────────────────────────── */}
          <motion.div
            style={{
              width: "clamp(240px, 36vw, 430px)",
              height: "clamp(160px, 24vw, 287px)",
            }}
          >
            <svg
              viewBox="0 0 210 140"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full overflow-visible"
              aria-label="Map of Byndoor region"
            >
              <motion.path
                d={MAP_PATH}
                fill="#38BDF8"
                stroke="#0284C7"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ pathLength: 1, fillOpacity: 1 }}
                transition={{
                  pathLength: {
                    delay: 0.2, // Starts after container fade-in
                    duration: 2.6, // Finishes at 2.8s
                    ease: "easeInOut",
                  },
                  fillOpacity: {
                    delay: 2.8, // Starts exactly when outline finishes
                    duration: 0.8, // Finishes at 3.6s (fully colored at 3.8s with transition tail)
                    ease: "easeOut",
                  },
                }}
                style={{ willChange: "stroke-dashoffset, opacity" }}
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}