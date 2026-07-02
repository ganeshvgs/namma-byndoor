"use client";

import { useEffect, useState } from "react";

import AdminSidebar from "./AdminSidebar";
import HeroVideos from "./HeroVideos";
import { ToastContainer } from "./Toast";
import { api } from "../lib/api";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
  const verifyAdmin = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.replace("/login");
      return;
    }

    try {
      await api.get("/api/auth/me");
      setLoading(false);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      window.location.replace("/login");
    }
  };

  verifyAdmin();
}, []);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <>
      <ToastContainer />

      <div className="min-h-screen bg-slate-950">
        <AdminSidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-20 h-16 flex items-center justify-between px-5 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"
          >
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <h2 className="text-white font-bold">
            Admin Panel
          </h2>

          <div className="w-10" />
        </header>

        <main className="lg:ml-64 p-6 lg:p-10">
          <HeroVideos />
        </main>
      </div>
    </>
  );
}