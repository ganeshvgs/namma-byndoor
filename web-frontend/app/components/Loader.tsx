"use client";

import { motion } from "framer-motion";

const MAP_PATH =
  "M 43 2 L 52 14 L 62 25 L 85 18 L 105 28 L 128 32 L 138 45 L 148 55 L 165 52 L 182 72 L 188 95 L 175 105 L 185 118 L 168 120 L 155 108 L 138 102 L 125 112 L 105 102 L 85 115 L 70 110 L 58 100 L 52 122 L 45 125 L 40 105 L 35 75 L 28 50 L 22 28 L 32 18 Z";

export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
    >
      <motion.div
        style={{
          width: "clamp(240px, 36vw, 430px)",
          height: "clamp(160px, 24vw, 287px)",
        }}
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
      >
        <svg
          viewBox="0 0 210 140"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
          aria-label="Map of Byndoor"
        >
          {/* Outline */}
          <motion.path
            d={MAP_PATH}
            fill="transparent"
            stroke="#0284C7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
            }}
          />

          {/* Fill */}
          <motion.path
            d={MAP_PATH}
            fill="#38BDF8"
            stroke="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 2.5,
              duration: 0.8,
              ease: "easeOut",
            }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}