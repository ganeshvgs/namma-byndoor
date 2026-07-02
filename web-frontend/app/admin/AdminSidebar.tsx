"use client";
// components/admin/AdminSidebar.tsx

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ─── Nav items ────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    label: "Hero Videos",
    href: "/admin/hero-videos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125v-9.375C2.25 8.004 2.754 7.5 3.375 7.5h17.25C21.246 7.5 21.75 8.004 21.75 8.625v9.75c0 .621-.504 1.125-1.125 1.125m0 0h-1.5m-15.75 0a1.125 1.125 0 011.125-1.125h13.5A1.125 1.125 0 0121 18.375M15 12l-4.5 2.598V9.402L15 12z" />
      </svg>
    ),
  },
];

// ─── Logo mark ────────────────────────────────────────────────────────────────

function SidebarLogo() {
  return (
    <div className="flex items-center gap-3 px-5 py-6">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)",
          boxShadow: "0 0 20px rgba(99,102,241,0.4)",
        }}
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
        </svg>
      </div>
      <div>
        <p className="text-white font-bold text-sm leading-none tracking-wide">NAMMA</p>
        <p
          className="text-xs font-semibold tracking-widest leading-none mt-1"
          style={{ background: "linear-gradient(90deg, #60A5FA, #818CF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          BYNDOOR
        </p>
      </div>
    </div>
  );
}

// ─── Nav link ─────────────────────────────────────────────────────────────────

function NavLink({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick?: () => void;
}) {
  const router = useRouter();

  return (
    <motion.button
      whileHover={{ x: active ? 0 : 4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18 }}
      onClick={() => {
        router.push(item.href);
        onClick?.();
      }}
      className="relative w-full flex items-center gap-3 px-4 py-3 mx-1 rounded-xl text-left transition-colors"
      style={{
        color: active ? "#fff" : "rgba(148,163,184,0.85)",
        background: active
          ? "linear-gradient(135deg, rgba(59,130,246,0.28) 0%, rgba(99,102,241,0.22) 100%)"
          : "transparent",
        border: active ? "1px solid rgba(99,102,241,0.28)" : "1px solid transparent",
      }}
    >
      {active && (
        <motion.span
          layoutId="nav-indicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full"
          style={{ background: "linear-gradient(180deg, #3B82F6, #6366F1)" }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <span className={active ? "text-blue-400" : ""}>{item.icon}</span>
      <span className="text-sm font-medium">{item.label}</span>
    </motion.button>
  );
}

// ─── Sidebar content (shared between desktop + drawer) ────────────────────────

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    router.push("/login");
  }

  return (
    <div className="flex flex-col h-full">
      <SidebarLogo />

      {/* Divider */}
      <div className="mx-5 h-px mb-4" style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)" }} />

      {/* Section label */}
      <p className="px-5 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
        Navigation
      </p>

      <nav className="flex-1 space-y-1 px-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={pathname === item.href}
            onClick={onNavClick}
          />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-2 pb-6">
        <div className="mx-3 h-px mb-4" style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent)" }} />
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.18 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 mx-1 rounded-xl text-left transition-colors"
          style={{ color: "rgba(248,113,113,0.85)" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          <span className="text-sm font-medium">Logout</span>
        </motion.button>
      </div>
    </div>
  );
}

// ─── AdminSidebar ─────────────────────────────────────────────────────────────

interface AdminSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const SIDEBAR_STYLE: React.CSSProperties = {
  background: "linear-gradient(180deg, rgba(15,23,42,0.97) 0%, rgba(15,23,42,0.95) 100%)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  borderRight: "1px solid rgba(99,102,241,0.12)",
};

export default function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
  // Close on route change (mobile)
  const pathname = usePathname();
  useEffect(() => {
    onMobileClose();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* ── Desktop fixed sidebar ── */}
      <aside
        className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 z-30"
        style={SIDEBAR_STYLE}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile backdrop ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onMobileClose}
            className="lg:hidden fixed inset-0 z-40 bg-black/60"
            style={{ backdropFilter: "blur(4px)" }}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 35 }}
            className="lg:hidden fixed inset-y-0 left-0 w-72 z-50 flex flex-col"
            style={SIDEBAR_STYLE}
          >
            {/* Close button */}
            <button
              onClick={onMobileClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
            <SidebarContent onNavClick={onMobileClose} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}