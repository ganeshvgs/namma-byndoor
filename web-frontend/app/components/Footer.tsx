// path : web-frontend/app/components/Footer.tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const MAP_PATH =
  "M 43 2 L 52 14 L 62 25 L 85 18 L 105 28 L 128 32 L 138 45 L 148 55 L 165 52 L 182 72 L 188 95 L 175 105 L 185 118 L 168 120 L 155 108 L 138 102 L 125 112 L 105 102 L 85 115 L 70 110 L 58 100 L 52 122 L 45 125 L 40 105 L 35 75 L 28 50 L 22 28 L 32 18 Z";

function AnimatedMapLogo() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 210 140"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      // Optimization: Removed drop-shadow-md to save filter rendering costs.
      className="h-14 w-auto overflow-visible flex-shrink-0 mb-4"
    >
      <motion.path
        d={MAP_PATH}
        fill="none"
        stroke="#38BDF8"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: prefersReducedMotion ? 1 : 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        // Optimization: Plays exactly once. After completion, it becomes a 100% static path.
        viewport={{ once: true, margin: "-50px" }}
        // Optimization: Reduced duration to 1.5s for a snappier, more refined ending draw.
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full flex flex-col relative z-10" aria-label="Site footer">
      
      {/* ─── LAYER 1: EXPLORE CTA ─── */}
      {/* Optimization: Seamless transition from #EEF8FF (the bottom of CategoryWisePlaces) into white */}
      <div className="w-full bg-gradient-to-b from-[#EEF8FF] to-white py-20 px-6 md:px-12 lg:px-24 flex flex-col items-center justify-center text-center border-t border-[#0284C7]/5">
        <h2 className="text-3xl md:text-4xl font-medium text-[#0F172A] tracking-tight mb-4">
          Discover more of Byndoor
        </h2>
        <p className="text-[#1E3A5F]/80 text-lg md:text-xl font-light max-w-2xl mb-10 leading-relaxed">
          From the Arabian Sea to the Western Ghats, discover beaches, waterfalls, mountains, temples and places across Byndoor.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Optimization: Replaced <motion.button> with semantic semantic <Link> + CSS transforms */}
          <Link 
            href="/places" 
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-br from-[#0369A1] to-[#38BDF8] text-white text-sm md:text-base font-bold tracking-[0.1em] uppercase shadow-lg shadow-[#0284C7]/20 transition-all duration-300 hover:shadow-[#0284C7]/40 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:ring-offset-2"
          >
            Explore Places
          </Link>
          <Link 
            href="/about" 
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white border border-[#0284C7]/20 text-[#0369A1] text-sm md:text-base font-bold tracking-[0.1em] uppercase transition-all duration-300 hover:bg-[#F8FCFF] motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:ring-offset-2"
          >
            About Byndoor
          </Link>
        </div>
      </div>

      {/* ─── LAYER 2: MAIN FOOTER ─── */}
      <div className="relative w-full bg-[#0F172A] overflow-hidden pt-20 pb-12 px-6 md:px-12 lg:px-24">
        
        {/* Large Background Map Signature (Strictly Static & Lightweight) */}
        <svg
          viewBox="0 0 210 140"
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] md:w-[80vw] max-w-[1200px] h-auto opacity-[0.05] pointer-events-none"
        >
          <path d={MAP_PATH} fill="none" stroke="#38BDF8" strokeWidth="2" />
        </svg>

        <div className="relative z-10 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 lg:gap-16">
          
          {/* Brand Section */}
          <div className="md:col-span-5 lg:col-span-6 flex flex-col items-start">
            <AnimatedMapLogo />
            <div className="flex flex-col leading-none mb-6 gap-1">
              <span className="text-[0.65rem] md:text-xs font-bold tracking-[0.30em] text-[#38BDF8] opacity-90 uppercase">
                NAMMA
              </span>
              <span className="text-xl md:text-2xl font-black tracking-[0.18em] text-white uppercase leading-none">
                BYNDOOR
              </span>
            </div>
            <p className="text-white/60 text-sm md:text-base font-light max-w-sm leading-relaxed">
              Discover the coast, rivers, waterfalls, mountains and heritage of Byndoor.
            </p>
          </div>

          {/* Explore Navigation */}
          <nav aria-label="Footer Explore Navigation" className="md:col-span-4 lg:col-span-3 flex flex-col">
            <span className="text-[#38BDF8] text-xs font-bold tracking-[0.2em] uppercase mb-6">
              Explore
            </span>
            <ul className="flex flex-col gap-4">
              {[
                { label: "Home", href: "/" },
                { label: "Places", href: "/places" },
                { label: "About", href: "/about" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center text-white/70 hover:text-white transition-colors text-sm md:text-base font-light focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:ring-offset-[#0F172A] rounded-sm"
                  >
                    <span className="relative">
                      {link.label}
                      {/* Optimization: Converted layout width animation to scaleX CSS transform */}
                      <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-[#38BDF8] scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
                    </span>
                    {/* Optimization: Converted Framer motion.svg to a standard SVG using purely CSS transitions */}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="ml-2 opacity-0 -translate-x-2 transition-[opacity,transform] duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0"
                    >
                      <path d="M3.33334 8H12.6667M12.6667 8L8 3.33333M12.6667 8L8 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect Section */}
          <nav aria-label="Footer Connect Navigation" className="md:col-span-3 lg:col-span-3 flex flex-col">
            <span className="text-[#38BDF8] text-xs font-bold tracking-[0.2em] uppercase mb-6">
              Connect
            </span>
            <ul className="flex flex-col gap-4">
              <li>
                <Link
                  href="/contact"
                  className="group inline-flex items-center text-white/70 hover:text-white transition-colors text-sm md:text-base font-light focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:ring-offset-[#0F172A] rounded-sm"
                >
                  <span className="relative">
                    Contact
                    <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-[#38BDF8] scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  </span>
                </Link>
              </li>
            </ul>
          </nav>

        </div>
      </div>

      {/* ─── LAYER 3: BOTTOM BAR ─── */}
      <div className="w-full bg-[#0F172A] px-6 md:px-12 lg:px-24 pb-8">
        <div className="max-w-[1400px] mx-auto border-t border-[#1E3A5F] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          {/* Optimization: Bumped text contrast from white/40 to white/50 for improved accessibility */}
          <p className="text-white/50 text-xs md:text-sm font-light">
            &copy; {currentYear} Namma Byndoor
          </p>
          <p className="text-[#38BDF8]/60 text-xs md:text-sm font-medium tracking-wide">
            Built for Byndoor.
          </p>
        </div>
      </div>

    </footer>
  );
}