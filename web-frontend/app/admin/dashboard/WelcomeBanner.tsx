// path: web-frontend/components/admin/dashboard/WelcomeBanner.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function WelcomeBanner() {
  const [greeting, setGreeting] = useState("Welcome back");
  const [currentDate, setCurrentDate] = useState("");
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    // Determine greeting by hour
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // Format current date
    const formattedDate = new Intl.DateTimeFormat("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());
    setCurrentDate(formattedDate);

    // Try to parse admin name from local storage
    try {
      const storedAdmin = localStorage.getItem("admin");
      if (storedAdmin) {
        const parsed = JSON.parse(storedAdmin);
        if (parsed?.name || parsed?.username) {
          setAdminName(parsed.name || parsed.username);
        }
      }
    } catch (e) {
      // Fallback to default "Admin" if storage read fails
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-indigo-500/20 shadow-2xl"
      style={{
        background: "linear-gradient(135deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.9) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-10 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(59,130,246,0) 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute right-1/4 -bottom-12 w-60 h-60 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(56,189,248,0.12) 0%, rgba(14,165,233,0) 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase text-blue-400 bg-blue-500/10 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            {currentDate || "Loading Date..."}
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-indigo-400">{adminName}</span>
          </h1>
          
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Welcome to the <strong className="text-slate-200 font-semibold">Namma Byndoor CMS</strong>. Monitor your ecosystem analytics, manage regional content, and oversee portal activity in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center flex-shrink-0">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-blue-400 shadow-inner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">System Status</div>
            <div className="text-xs font-medium text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              All Services Optimal
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}