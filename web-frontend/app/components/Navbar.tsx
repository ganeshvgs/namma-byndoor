// path: app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Shared constant ─────────────────────────────────────────────────────────
const MAP_PATH =
  "M 43 2 L 52 14 L 62 25 L 85 18 L 105 28 L 128 32 L 138 45 L 148 55 L 165 52 L 182 72 L 188 95 L 175 105 L 185 118 L 168 120 L 155 108 L 138 102 L 125 112 L 105 102 L 85 115 L 70 110 L 58 100 L 52 122 L 45 125 L 40 105 L 35 75 L 28 50 L 22 28 L 32 18 Z";

// ─── Design tokens ────────────────────────────────────────────────────────────
const BLUE_OUTLINE   = "#0284C7";
const BLUE_BTN_FROM  = "#0369A1";
const BLUE_BTN_TO    = "#38BDF8";
const BRAND_DARK     = "#0F172A";
const BRAND_LABEL    = "#1E3A5F";
const SCROLL_THRESH  = 30;

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Places", href: "/places" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
];

const MAP_ANIM = {
  pathLength: [0, 1, 0, 0],
  transition: {
    pathLength: { duration: 4, ease: "easeInOut", times: [0, 0.72, 0.74, 1], repeat: Infinity, repeatType: "loop" as const },
    opacity: { duration: 0.3, ease: "easeOut" },
  },
} as const;

function AnimatedMapLogo() {
  return (
    <svg viewBox="0 0 210 140" xmlns="http://www.w3.org/2000/svg" aria-label="Animated map of Byndoor" style={{ height: 52, width: "auto", overflow: "visible", flexShrink: 0 }}>
      <motion.path d={MAP_PATH} fill="none" stroke={BLUE_OUTLINE} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ ...MAP_ANIM, opacity: 1 }} transition={MAP_ANIM.transition} style={{ willChange: "stroke-dashoffset" }} />
    </svg>
  );
}

function BrandLockup() {
  return (
    <Link href="/" className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] rounded-lg">
      <AnimatedMapLogo />
      <div aria-hidden="true" style={{ width: 1, height: 36, background: "linear-gradient(to bottom, transparent, #0284C780, transparent)", flexShrink: 0 }} />
      <div className="flex flex-col leading-none" style={{ gap: 2 }}>
        <span style={{ fontSize: "0.60rem", fontWeight: 700, letterSpacing: "0.30em", color: BRAND_LABEL, opacity: 0.65, textTransform: "uppercase" }}>NAMMA</span>
        <span style={{ fontSize: "1.10rem", fontWeight: 800, letterSpacing: "0.18em", color: BRAND_DARK, textTransform: "uppercase", lineHeight: 1 }}>BYNDOOR</span>
      </div>
    </Link>
  );
}

function LoginButton({ mobile = false }: { mobile?: boolean }) {
  return (
    <Link href="/login" className={mobile ? "w-full block" : ""}>
      <motion.button
        type="button"
        aria-label="Log in to your account"
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: mobile ? "center" : "flex-start",
          gap: "0.40rem",
          paddingInline: mobile ? "0" : "1.25rem",
          paddingBlock: mobile ? "1rem" : "0.55rem",
          width: mobile ? "100%" : "auto",
          borderRadius: 9999,
          border: "none",
          cursor: "pointer",
          background: `linear-gradient(135deg, ${BLUE_BTN_FROM} 0%, ${BLUE_BTN_TO} 100%)`,
          color: "#fff",
          fontSize: mobile ? "0.95rem" : "0.825rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          boxShadow: "0 2px 12px rgba(2,132,199,0.30), 0 1px 3px rgba(0,0,0,0.12)",
        }}
      >
        LOGIN
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5H10.5M10.5 6.5L7 3M10.5 6.5L7 10" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </motion.button>
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESH);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.header
        role="banner"
        aria-label="Site navigation"
        animate={
          scrolled || mobileMenuOpen
            ? { backgroundColor: "rgba(255,255,255,0.82)", borderBottomColor: "rgba(2,132,199,0.10)", boxShadow: "0 4px 24px rgba(2,132,199,0.08)" }
            : { backgroundColor: "rgba(255,255,255,0)", borderBottomColor: "rgba(2,132,199,0)", boxShadow: "none" }
        }
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999, height: 80,
          display: "flex", alignItems: "center", paddingInline: "clamp(1rem, 5vw, 3rem)",
          borderBottom: "1px solid",
          backdropFilter: scrolled || mobileMenuOpen ? "blur(20px) saturate(1.6)" : "none",
          WebkitBackdropFilter: scrolled || mobileMenuOpen ? "blur(20px) saturate(1.6)" : "none",
        }}
      >
        <nav style={{ width: "100%", maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <BrandLockup />
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="relative group text-[0.875rem] font-bold text-[#0F172A] uppercase tracking-[0.1em] transition-colors hover:text-[#0284C7]">
                {link.label}
                {pathname === link.href && (
                  <motion.div layoutId="navbar-indicator" className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#0284C7]" />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <LoginButton />
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-[10000] focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <motion.span animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 8 : 0 }} className="w-6 h-[2px] bg-[#0F172A] rounded-full block transition-transform" />
            <motion.span animate={{ opacity: mobileMenuOpen ? 0 : 1 }} className="w-6 h-[2px] bg-[#0F172A] rounded-full block transition-opacity" />
            <motion.span animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -8 : 0 }} className="w-6 h-[2px] bg-[#0F172A] rounded-full block transition-transform" />
          </button>
        </nav>
      </motion.header>

      {/* Premium Mobile Slide Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[9998] bg-[#F8FCFF] md:hidden flex flex-col pt-28 px-6 pb-8"
          >
            <div className="flex flex-col gap-6 flex-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div 
                  key={link.label}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                >
                  <Link 
                    href={link.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block text-3xl font-black uppercase tracking-wider ${pathname === link.href ? "text-[#0284C7]" : "text-[#0F172A]"}`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <LoginButton mobile />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}