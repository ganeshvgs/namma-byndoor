//path : web-frontend/app/components/Navbar.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// ─── Shared constant — exact path from Loader.tsx ─────────────────────────────

const MAP_PATH =
  "M 43 2 L 52 14 L 62 25 L 85 18 L 105 28 L 128 32 L 138 45 L 148 55 L 165 52 L 182 72 L 188 95 L 175 105 L 185 118 L 168 120 L 155 108 L 138 102 L 125 112 L 105 102 L 85 115 L 70 110 L 58 100 L 52 122 L 45 125 L 40 105 L 35 75 L 28 50 L 22 28 L 32 18 Z";

// ─── Design tokens ────────────────────────────────────────────────────────────

const BLUE_OUTLINE   = "#0284C7";
const BLUE_BTN_FROM  = "#0369A1";
const BLUE_BTN_TO    = "#38BDF8";
const BRAND_DARK     = "#0F172A";   // slate-900
const BRAND_LABEL    = "#1E3A5F";   // deep navy for "NAMMA"
const SCROLL_THRESH  = 30;          // px before glassmorphism kicks in

// ─── Loop animation keyframes ─────────────────────────────────────────────────
//
//  Phase   Time range   pathLength   Description
//  ──────  ──────────   ──────────   ──────────────────────────────
//  Draw    0 → 0.72     0 → 1        pen traces the boundary
//  Clear   0.72 → 0.74  1 → 0        instant snap-clear
//  Rest    0.74 → 1.0   0            brief breath before next cycle
//
//  Total duration: 4 s  →  draw ≈ 2.88 s, clear ≈ 0.08 s, rest ≈ 1.04 s

const MAP_ANIM = {
  pathLength: [0, 1, 0, 0],
  transition: {
    pathLength: {
      duration:    4,
      ease:        "easeInOut",
      times:       [0, 0.72, 0.74, 1],
      repeat:      Infinity,
      repeatType:  "loop" as const,
    },
    opacity: { duration: 0.3, ease: "easeOut" },
  },
} as const;

// ─── AnimatedMapLogo ──────────────────────────────────────────────────────────

function AnimatedMapLogo() {
  return (
    // viewBox 0 0 210 140 → aspect 3:2 → at h=52px, w=78px
    <svg
      viewBox="0 0 210 140"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Animated map of Byndoor"
      style={{ height: 52, width: "auto", overflow: "visible", flexShrink: 0 }}
    >
      {/*
        Framer Motion handles strokeDasharray / strokeDashoffset internally
        when animating pathLength. Do NOT put a static strokeDasharray
        attribute here — it will conflict with Framer's injected values.
      */}
      <motion.path
        d={MAP_PATH}
        fill="none"
        stroke={BLUE_OUTLINE}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ ...MAP_ANIM, opacity: 1 }}
        transition={MAP_ANIM.transition}
        style={{ willChange: "stroke-dashoffset" }}
      />
    </svg>
  );
}

// ─── BrandLockup ──────────────────────────────────────────────────────────────

function BrandLockup() {
  return (
    <div
      className="flex items-center gap-3"
      aria-label="Namma Byndoor — home"
    >
      <AnimatedMapLogo />

      {/* Thin vertical rule — adds separation without a box */}
      <div
        aria-hidden="true"
        style={{
          width:      1,
          height:     36,
          background: "linear-gradient(to bottom, transparent, #0284C780, transparent)",
          flexShrink: 0,
        }}
      />

      {/* Brand name text */}
      <div className="flex flex-col leading-none" style={{ gap: 2 }}>
        <span
          style={{
            fontSize:      "0.60rem",
            fontWeight:    700,
            letterSpacing: "0.30em",
            color:         BRAND_LABEL,
            opacity:       0.65,
            textTransform: "uppercase",
          }}
        >
          NAMMA
        </span>
        <span
          style={{
            fontSize:      "1.10rem",
            fontWeight:    800,
            letterSpacing: "0.18em",
            color:         BRAND_DARK,
            textTransform: "uppercase",
            lineHeight:    1,
          }}
        >
          BYNDOOR
        </span>
      </div>
    </div>
  );
}

// ─── LoginButton ──────────────────────────────────────────────────────────────

function LoginButton() {
  return (
 <Link href="/login">
  <motion.button
    type="button"
    aria-label="Log in to your account"
    whileHover={{ scale: 1.03, y: -1 }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: "spring", stiffness: 400, damping: 20 }}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "0.40rem",
      paddingInline: "1.25rem",
      paddingBlock: "0.55rem",
      borderRadius: 9999,
      border: "none",
      cursor: "pointer",
      background: `linear-gradient(135deg, ${BLUE_BTN_FROM} 0%, ${BLUE_BTN_TO} 100%)`,
      color: "#fff",
      fontSize: "0.825rem",
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      boxShadow: "0 2px 12px rgba(2,132,199,0.30), 0 1px 3px rgba(0,0,0,0.12)",
      transition: "all .25s ease",
    }}
  >
    LOGIN

    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
    >
      <path
        d="M2.5 6.5H10.5M10.5 6.5L7 3M10.5 6.5L7 10"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </motion.button>
</Link>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESH);

    // Check initial position in case the page loads mid-scroll
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      role="banner"
      aria-label="Site navigation"
      animate={
        scrolled
          ? {
              backgroundColor: "rgba(255,255,255,0.82)",
              borderBottomColor: "rgba(2,132,199,0.10)",
              boxShadow: "0 4px 24px rgba(2,132,199,0.08), 0 1px 6px rgba(0,0,0,0.06)",
            }
          : {
              backgroundColor: "rgba(255,255,255,0)",
              borderBottomColor: "rgba(2,132,199,0)",
              boxShadow: "none",
            }
      }
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position:         "fixed",
        top:              0,
        left:             0,
        right:            0,
        zIndex:           1000,
        height:           80,
        display:          "flex",
        alignItems:       "center",
        paddingInline:    "clamp(1rem, 5vw, 3rem)",
        borderBottom:     "1px solid",
        backdropFilter:   scrolled ? "blur(20px) saturate(1.6)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.6)" : "none",
      }}
    >
      <nav
        style={{
          width:          "100%",
          maxWidth:       1280,
          margin:         "0 auto",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
        }}
      >
        <BrandLockup />
        <LoginButton />
      </nav>
    </motion.header>
  );
}