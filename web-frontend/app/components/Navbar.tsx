// path : web-frontend/app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// ─── Shared constant ─────────────────────────────────────────────────────────
const MAP_PATH =
  "M 43 2 L 52 14 L 62 25 L 85 18 L 105 28 L 128 32 L 138 45 L 148 55 L 165 52 L 182 72 L 188 95 L 175 105 L 185 118 L 168 120 L 155 108 L 138 102 L 125 112 L 105 102 L 85 115 L 70 110 L 58 100 L 52 122 L 45 125 L 40 105 L 35 75 L 28 50 L 22 28 L 32 18 Z";

// ─── Design tokens ────────────────────────────────────────────────────────────
const BLUE_OUTLINE   = "#0284C7";
const BRAND_DARK     = "#0F172A";
const BRAND_LABEL    = "#1E3A5F";
const SCROLL_THRESH  = 30;

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Places", href: "/places" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "#" },
];

function AnimatedMapLogo() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <svg viewBox="0 0 210 140" xmlns="http://www.w3.org/2000/svg" aria-label="Animated map of Byndoor" className="h-[52px] w-auto overflow-visible shrink-0">
      <motion.path 
        d={MAP_PATH} 
        fill="none" 
        stroke={BLUE_OUTLINE} 
        strokeWidth="5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        initial={{ pathLength: prefersReducedMotion ? 1 : 0, opacity: 0 }} 
        animate={{ pathLength: 1, opacity: 1 }} 
        transition={{ duration: 1.5, ease: "easeOut" }} 
      />
    </svg>
  );
}

function BrandLockup() {
  return (
    <Link href="/" className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] rounded-lg">
      <AnimatedMapLogo />
      <div aria-hidden="true" className="w-[1px] h-[36px] bg-gradient-to-b from-transparent via-[#0284C780] to-transparent shrink-0" />
      <div className="flex flex-col leading-none gap-[2px]">
        <span className="text-[0.60rem] font-bold tracking-[0.30em] uppercase opacity-65" style={{ color: BRAND_LABEL }}>NAMMA</span>
        <span className="text-[1.10rem] font-extrabold tracking-[0.18em] uppercase leading-none" style={{ color: BRAND_DARK }}>BYNDOOR</span>
      </div>
    </Link>
  );
}

function LoginButton({ mobile = false, onClick }: { mobile?: boolean, onClick?: () => void }) {
  // Optimized for mobile: pure CSS hover/active states offload work from JS
  return (
    <Link href="/login" className={mobile ? "w-full block" : ""} onClick={onClick}>
      <button
        type="button"
        aria-label="Log in to your account"
        className={`flex items-center gap-2 border-none rounded-full cursor-pointer bg-gradient-to-br from-[#0369A1] to-[#38BDF8] text-white font-bold tracking-[0.08em] uppercase shadow-[0_2px_12px_rgba(2,132,199,0.30)] transition-transform duration-200 active:scale-95 ${
          mobile 
            ? "w-full justify-center py-4 text-[0.95rem]" 
            : "w-auto justify-start py-[0.55rem] px-5 text-[0.825rem] md:hover:-translate-y-[1px] md:hover:scale-105"
        }`}
      >
        LOGIN
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M2.5 6.5H10.5M10.5 6.5L7 3M10.5 6.5L7 10" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrolledRef = useRef(false);
  const pathname = usePathname();

  // Scroll handler refactored to prevent unnecessary React state updates
  useEffect(() => {
    const onScroll = () => {
      const isScrolled = window.scrollY > SCROLL_THRESH;
      if (isScrolled !== scrolledRef.current) {
        scrolledRef.current = isScrolled;
        setScrolled(isScrolled);
      }
    };
    onScroll(); // initialize
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Robust body scroll lock
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  // Framer Motion variants for lighter menu stagger
  const menuVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: {
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.05 }
    },
    exit: { opacity: 0, x: "100%", transition: { duration: 0.2, ease: "easeIn" } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } }
  };

  return (
    <>
      <header
        role="banner"
        aria-label="Site navigation"
        // CSS transitions replace JS-driven Framer Motion properties for background/border/blur
        className={`fixed top-0 left-0 right-0 z-[9999] h-20 flex items-center px-4 md:px-8 lg:px-12 border-b transition-all duration-300 ease-out transform-gpu ${
          scrolled || mobileMenuOpen
            ? "bg-white/90 border-[#0284C7]/10 shadow-[0_4px_24px_rgba(2,132,199,0.08)] backdrop-blur-md backdrop-saturate-150"
            : "bg-transparent border-transparent shadow-none"
        }`}
      >
        <nav className="w-full max-w-[1400px] mx-auto flex items-center justify-between">
          <BrandLockup />
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.label} 
                href={link.href} 
                className="relative group text-[0.875rem] font-bold text-[#0F172A] uppercase tracking-[0.1em] transition-colors hover:text-[#0284C7]"
              >
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

          {/* Mobile Menu Toggle (Stripped of conflicting CSS transition classes) */}
          <button 
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-[10000] focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <motion.span animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 8 : 0 }} className="w-6 h-[2px] bg-[#0F172A] rounded-full block" />
            <motion.span animate={{ opacity: mobileMenuOpen ? 0 : 1 }} className="w-6 h-[2px] bg-[#0F172A] rounded-full block" />
            <motion.span animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -8 : 0 }} className="w-6 h-[2px] bg-[#0F172A] rounded-full block" />
          </button>
        </nav>
      </header>

      {/* Premium Mobile Slide Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            id="mobile-menu"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[9998] bg-[#F8FCFF] md:hidden flex flex-col pt-28 px-6 pb-8"
          >
            <div className="flex flex-col gap-6 flex-1">
              {NAV_LINKS.map((link) => (
                <motion.div key={link.label} variants={itemVariants}>
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
            <motion.div variants={itemVariants}>
              <LoginButton mobile onClick={() => setMobileMenuOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}