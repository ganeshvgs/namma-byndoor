//path web-frontend/app/components/Loader.tsx
"use client";

import { useEffect, useRef, useState, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Constants ────────────────────────────────────────────────────────────────

const SUBTITLES = [
  "Explore Nature",
  "Explore Beaches",
  "Explore Heritage",
  "Explore Culture",
  "Explore Waterfalls",
  "Explore Temples",
];

const LOCATIONS: ReadonlyArray<{
  readonly name: string;
  readonly cx: number;
  readonly cy: number;
}> = [
  { name: "Byndoor",    cx: 32,  cy: 35  },
  { name: "Maravanthe", cx: 43,  cy: 110 },
  { name: "Kollur",     cx: 105, cy: 65  },
  { name: "Ottinene",   cx: 36,  cy: 55  },
  { name: "Kodachadri", cx: 155, cy: 85  },
] as const;

const MAP_PATH =
  "M 43 2 L 52 14 L 62 25 L 85 18 L 105 28 L 128 32 L 138 45 L 148 55 L 165 52 L 182 72 L 188 95 L 175 105 L 185 118 L 168 120 L 155 108 L 138 102 L 125 112 L 105 102 L 85 115 L 70 110 L 58 100 L 52 122 L 45 125 L 40 105 L 35 75 L 28 50 L 22 28 L 32 18 Z";

// ─── Timeline (all values in seconds unless noted _MS) ────────────────────────
//
//  0.00        white screen
//  0.50        map container starts fading in (0.8s fade+scale)
//  1.30        map fully visible, empty
//  1.30        outline starts drawing (3.0s)
//  4.30        outline fully drawn
//  4.35        fill starts rising from bottom (1.2s)   [+0.05s gap for clarity]
//  5.55        fill done
//  5.55        shading/shadow/glow fade in (0.8s)
//  6.35        shading done
//  6.40        markers start appearing (staggered 250ms each)
//                 5 markers × 250ms → last marker at 6.40 + 1.00 = 7.40
//  7.80        title appears (1.0s)
//  8.90        subtitle appears
//  8.90        progress bar starts
// 11500ms      loader starts dismissing (progress bar duration = 11.5-8.9 = 2.6s)
//  0.8s later  homepage revealed
//
// ─────────────────────────────────────────────────────────────────────────────

const T = {
  // map container
  MAP_FADE_IN:        0.50,
  MAP_FADE_DUR:       0.80,

  // outline draw
  OUTLINE_START:      1.30,
  OUTLINE_DUR:        3.00,

  // fill (bottom→top liquid)
  FILL_START:         4.35,   // strictly after outline (4.30) + small gap
  FILL_DUR:           1.20,

  // terrain shading / depth overlay
  SHADING_IN:         5.60,   // after fill done (5.55) + 0.05s gap
  SHADING_DUR:        0.80,

  // markers
  MARKERS_START:      6.40,
  MARKER_STAGGER:     0.25,

  // title
  TITLE_IN:           7.80,

  // subtitle & progress
  SUBTITLE_IN:        8.90,
  SUBTITLE_HOLD_MS:   2000,
  PROGRESS_START:     8.90,

  // dismiss
  LOADER_DISMISS_MS:  11500,
  FADE_OUT_DUR:       0.80,
} as const;

// ─── Easing ───────────────────────────────────────────────────────────────────

const EASE_CINEMATIC  = [0.65, 0, 0.35, 1]    as const;
const EASE_OUT_SMOOTH = [0.4,  0, 0.2,  1]    as const;
const EASE_SPRING     = [0.34, 1.56, 0.64, 1] as const;
const EASE_IN_EXPO    = [0.7,  0, 0.84, 0]    as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

type CubicBezier = readonly [number, number, number, number];

function tr(
  delay: number,
  duration: number,
  ease: CubicBezier | string = "easeOut",
) {
  return { delay, duration, ease } as const;
}

// ─── Variants ─────────────────────────────────────────────────────────────────

const loaderVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: tr(0, 0.6, EASE_OUT_SMOOTH) },
  exit:    { opacity: 0, transition: tr(0, T.FADE_OUT_DUR, EASE_OUT_SMOOTH) },
} as const;

const mapContainerVariants = {
  hidden:  { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      opacity: tr(T.MAP_FADE_IN, T.MAP_FADE_DUR, "easeOut"),
      scale:   tr(T.MAP_FADE_IN, T.MAP_FADE_DUR, EASE_CINEMATIC),
    },
  },
} as const;

const titleVariants = {
  hidden: {
    opacity:       0,
    y:             20,
    scale:         0.97,
    filter:        "blur(6px)",
    letterSpacing: "0.10em",
  },
  visible: {
    opacity:       1,
    y:             0,
    scale:         1,
    filter:        "blur(0px)",
    letterSpacing: "0.26em",
    transition: {
      opacity:       tr(T.TITLE_IN, 1.0, "easeOut"),
      y:             tr(T.TITLE_IN, 1.0, EASE_CINEMATIC),
      scale:         tr(T.TITLE_IN, 1.2, EASE_CINEMATIC),
      filter:        tr(T.TITLE_IN, 0.9, "easeOut"),
      letterSpacing: tr(T.TITLE_IN, 1.4, "easeOut"),
    },
  },
} as const;

const dividerVariants = {
  hidden:  { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: tr(T.TITLE_IN + 0.5, 0.8, EASE_CINEMATIC),
  },
} as const;

const subtitleContainerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: tr(T.SUBTITLE_IN, 0.4, "easeOut") },
} as const;

const subtitleVariants = {
  hidden:  { opacity: 0, y: 10, filter: "blur(3px)" },
  visible: { opacity: 1, y: 0,  filter: "blur(0px)", transition: tr(0, 0.55, EASE_CINEMATIC) },
  exit:    { opacity: 0, y: -8, filter: "blur(2px)", transition: tr(0, 0.38, EASE_IN_EXPO) },
} as const;

const progressWrapVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: tr(T.PROGRESS_START, 0.6, "easeOut") },
} as const;

const PROGRESS_DURATION = (T.LOADER_DISMISS_MS / 1000) - T.PROGRESS_START;

const progressBarVariants = {
  hidden:  { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { delay: T.PROGRESS_START, duration: PROGRESS_DURATION, ease: "linear" },
  },
} as const;

const shineVariants = {
  hidden:  { opacity: 0, x: "-100%" },
  visible: {
    opacity: [0, 1, 0],
    x: ["-100%", "300%"],
    transition: {
      delay:       T.PROGRESS_START + 0.3,
      duration:    1.8,
      repeat:      Infinity,
      ease:        "easeInOut",
      repeatDelay: 1.8,
    },
  },
} as const;

// ─── Marker variants (per index) ──────────────────────────────────────────────

function makeMarkerVariants(i: number) {
  const delay = T.MARKERS_START + i * T.MARKER_STAGGER;

  return {
    // persistent soft glow behind the dot
    glow: {
      hidden:  { opacity: 0, scale: 0 },
      visible: {
        opacity: [0, 0.55, 0.20],
        scale:   [0, 1.90, 1.30],
        transition: { delay, duration: 1.4, ease: "easeOut", times: [0, 0.5, 1] },
      },
    },
    // one-shot expanding ring that vanishes
    ring: {
      hidden:  { opacity: 0, scale: 0 },
      visible: {
        opacity: [0, 0.85, 0],
        scale:   [0, 1.0, 2.4],
        transition: { delay, duration: 1.2, ease: "easeOut", times: [0, 0.3, 1] },
      },
    },
    // core dot (white + orange + specular)
    core: {
      hidden:  { opacity: 0, scale: 0 },
      visible: {
        opacity: 1,
        scale:   1,
        transition: tr(delay, 0.5, EASE_SPRING),
      },
    },
  } as const;
}

// ─── LocationMarker ───────────────────────────────────────────────────────────

interface MarkerProps {
  loc:   { name: string; cx: number; cy: number };
  index: number;
}

const LocationMarker = memo(function LocationMarker({ loc, index }: MarkerProps) {
  const v = useMemo(() => makeMarkerVariants(index), [index]);

  return (
    <g role="img" aria-label={loc.name}>
      {/* Persistent glow */}
      <motion.circle
        cx={loc.cx} cy={loc.cy} r={8}
        fill="#F97316"
        filter="url(#dotGlow)"
        variants={v.glow}
        initial="hidden"
        animate="visible"
        style={{ willChange: "transform, opacity" }}
      />
      {/* One-shot expanding ring */}
      <motion.circle
        cx={loc.cx} cy={loc.cy} r={4}
        fill="none"
        stroke="#F97316"
        strokeWidth="1.1"
        variants={v.ring}
        initial="hidden"
        animate="visible"
        style={{ willChange: "transform, opacity" }}
      />
      {/* White outer dot */}
      <motion.circle
        cx={loc.cx} cy={loc.cy} r={2.2}
        fill="#FFFFFF"
        variants={v.core}
        initial="hidden"
        animate="visible"
      />
      {/* Orange inner dot */}
      <motion.circle
        cx={loc.cx} cy={loc.cy} r={1.4}
        fill="#F97316"
        variants={v.core}
        initial="hidden"
        animate="visible"
      />
      {/* Specular highlight */}
      <motion.circle
        cx={loc.cx - 0.5} cy={loc.cy - 0.6} r={0.5}
        fill="#FFFFFF"
        fillOpacity={0.85}
        variants={v.core}
        initial="hidden"
        animate="visible"
      />
    </g>
  );
});

// ─── Loader ───────────────────────────────────────────────────────────────────

interface LoaderProps {
  onComplete?: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [subtitleReady, setSubtitleReady] = useState(false);
  const [isVisible, setIsVisible]         = useState(true);
  const hasStarted                        = useRef(false);

  // Unlock subtitle cycling after SUBTITLE_IN seconds
  useEffect(() => {
    const t = setTimeout(() => setSubtitleReady(true), T.SUBTITLE_IN * 1000);
    return () => clearTimeout(t);
  }, []);

  // Cycle subtitles
  useEffect(() => {
    if (!subtitleReady) return;
    const id = setInterval(
      () => setSubtitleIndex((prev) => (prev + 1) % SUBTITLES.length),
      T.SUBTITLE_HOLD_MS,
    );
    return () => clearInterval(id);
  }, [subtitleReady]);

  // Dismiss loader
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    const t = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) setTimeout(onComplete, T.FADE_OUT_DUR * 1000);
    }, T.LOADER_DISMISS_MS);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loader"
          variants={loaderVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 85% 75% at 50% 44%, #FFFFFF 0%, #EFF8FF 45%, #E8F4FD 75%, #F0F9FF 100%)",
          }}
        >
          {/* ── Map SVG ────────────────────────────────────────────────────── */}
          <motion.div
            variants={mapContainerVariants}
            initial="hidden"
            animate="visible"
            style={{
              width:      "clamp(240px, 36vw, 430px)",
              height:     "clamp(160px, 24vw, 287px)",
              willChange: "transform, opacity",
            }}
          >
            <svg
              viewBox="0 0 210 140"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full overflow-visible"
              aria-label="Map of Byndoor region"
            >
              <defs>
                <linearGradient id="terrainGradient" x1="0%" y1="0%" x2="8%" y2="100%">
                  <stop offset="0%"   stopColor="#0369A1" stopOpacity="0.95" />
                  <stop offset="15%"  stopColor="#0284C7" stopOpacity="0.92" />
                  <stop offset="30%"  stopColor="#38BDF8" stopOpacity="0.88" />
                  <stop offset="46%"  stopColor="#16A34A" stopOpacity="0.90" />
                  <stop offset="68%"  stopColor="#65A30D" stopOpacity="0.86" />
                  <stop offset="84%"  stopColor="#CA8A04" stopOpacity="0.82" />
                  <stop offset="100%" stopColor="#D97706" stopOpacity="0.78" />
                </linearGradient>

                <linearGradient id="depthOverlay" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.20" />
                  <stop offset="35%"  stopColor="#FFFFFF" stopOpacity="0.04" />
                  <stop offset="70%"  stopColor="#000000" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.16" />
                </linearGradient>

                <clipPath id="mapClip">
                  <path d={MAP_PATH} />
                </clipPath>

                <filter id="dotGlow" x="-120%" y="-120%" width="340%" height="340%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                </filter>

                <filter id="strokeGlow" x="-6%" y="-6%" width="112%" height="112%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* STEP 4 — terrain fill, rises from bottom after outline finishes */}
              <g clipPath="url(#mapClip)">
                <motion.rect
                  x={0}
                  width={210}
                  height={140}
                  fill="url(#terrainGradient)"
                  initial={{ y: 140 }}
                  animate={{ y: 0 }}
                  transition={{
                    delay:    T.FILL_START,
                    duration: T.FILL_DUR,
                    // Use a non-overshooting ease so fill never leaks above the clip
                    ease:     EASE_OUT_SMOOTH,
                  }}
                />
              </g>

              {/* STEP 5 — depth/shadow/glow, appears after fill */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={tr(T.SHADING_IN, T.SHADING_DUR, "easeOut")}
              >
                {/* Drop shadow */}
                <path
                  d={MAP_PATH}
                  fill="rgba(2,132,199,0.09)"
                  transform="translate(2, 5)"
                  style={{ filter: "blur(7px)" }}
                />
                {/* Depth overlay */}
                <rect
                  x={0} y={0} width={210} height={140}
                  fill="url(#depthOverlay)"
                  clipPath="url(#mapClip)"
                />
                {/* Glowing stroke halo (sits behind the crisp outline) */}
                <path
                  d={MAP_PATH}
                  fill="none"
                  stroke="rgba(2,132,199,0.50)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#strokeGlow)"
                />
              </motion.g>

              {/*
                STEP 3 — blue outline drawing animation (THE HERO)
                ─────────────────────────────────────────────────
                Framer Motion's `pathLength` prop sets strokeDasharray/strokeDashoffset
                automatically via its internal SVG animation engine.
                Do NOT put a static strokeDasharray attribute on this element —
                it will override Framer's computed dash and break the draw.
              */}
              <motion.path
                d={MAP_PATH}
                fill="none"
                stroke="#0284C7"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: {
                    delay:    T.OUTLINE_START,
                    duration: T.OUTLINE_DUR,
                    ease:     EASE_CINEMATIC,
                  },
                  opacity: {
                    delay:    T.OUTLINE_START,
                    duration: 0.15,
                    ease:     "easeOut",
                  },
                }}
                style={{ willChange: "stroke-dashoffset, opacity" }}
              />

              {/* STEP 6 — location markers */}
              {LOCATIONS.map((loc, i) => (
                <LocationMarker key={loc.name} loc={loc} index={i} />
              ))}
            </svg>
          </motion.div>

          {/* ── Text & UI below the map ────────────────────────────────────── */}
          <div className="mt-8 md:mt-10 flex flex-col items-center select-none w-full px-4">

            {/* STEP 7 — NAMMA BYNDOOR title */}
            <motion.h1
              variants={titleVariants}
              initial="hidden"
              animate="visible"
              className="text-center font-black text-[#1F2937] leading-tight"
              style={{
                fontSize:      "clamp(1.75rem, 4.5vw, 3.25rem)",
                fontWeight:    900,
                letterSpacing: "0.22em",
                textShadow:
                  "0 1px 18px rgba(2,132,199,0.09), 0 1px 3px rgba(0,0,0,0.05)",
                willChange: "transform, opacity, filter",
              }}
            >
              NAMMA
              <br />
              BYNDOOR
            </motion.h1>

            {/* Divider */}
            <motion.div
              variants={dividerVariants}
              initial="hidden"
              animate="visible"
              style={{
                width:           "clamp(44px, 7vw, 72px)",
                height:          1,
                background:
                  "linear-gradient(90deg, transparent, #0284C7, #38BDF8, transparent)",
                transformOrigin: "center",
                marginTop:       "clamp(10px, 1.5vw, 14px)",
              }}
            />

            {/* STEP 8 — cycling subtitle */}
            <motion.div
              variants={subtitleContainerVariants}
              initial="hidden"
              animate="visible"
              className="mt-3 relative w-full flex justify-center items-center overflow-hidden"
              style={{ height: 28, minHeight: 28 }}
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={subtitleIndex}
                  variants={subtitleVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute text-xs md:text-sm text-gray-400 font-semibold uppercase"
                  style={{ letterSpacing: "0.28em" }}
                >
                  {SUBTITLES[subtitleIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* STEP 9 — progress bar */}
            <motion.div
              variants={progressWrapVariants}
              initial="hidden"
              animate="visible"
              style={{
                marginTop: "clamp(20px, 3vw, 30px)",
                position:  "relative",
              }}
            >
              <div
                role="progressbar"
                aria-label="Loading progress"
                style={{
                  width:        "clamp(180px, 28vw, 240px)",
                  height:       5,
                  borderRadius: 99,
                  background:   "rgba(0,0,0,0.06)",
                  boxShadow:
                    "inset 0 1px 3px rgba(0,0,0,0.07), 0 1px 0 rgba(255,255,255,0.9)",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  variants={progressBarVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    height:          "100%",
                    borderRadius:    99,
                    background:
                      "linear-gradient(90deg, #0369A1 0%, #0284C7 18%, #38BDF8 35%, #16A34A 55%, #84CC16 75%, #CA8A04 90%, #D97706 100%)",
                    transformOrigin: "left center",
                    boxShadow:       "0 0 7px rgba(2,132,199,0.32)",
                    position:        "relative",
                    overflow:        "hidden",
                  }}
                >
                  <motion.span
                    aria-hidden="true"
                    variants={shineVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                      position:     "absolute",
                      insetBlock:   0,
                      width:        "4rem",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)",
                      borderRadius: 99,
                      left:         0,
                      willChange:   "transform",
                    }}
                  />
                </motion.div>
              </div>

              {/* Subtle border ring around the progress track */}
              <div
                aria-hidden="true"
                style={{
                  position:      "absolute",
                  inset:         "-3px",
                  borderRadius:  99,
                  border:        "1px solid rgba(255,255,255,0.52)",
                  boxShadow:     "0 2px 8px rgba(2,132,199,0.07)",
                  pointerEvents: "none",
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
