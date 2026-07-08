// path: web-frontend/app/admin/categories/page.tsx
"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "../AdminSidebar";
import CategoriesView from "./CategoriesView";
import { ToastContainer } from "../Toast";
import { api } from "../../lib/api";

export default function CategoriesAdminPage() {
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
      <div className="min-h-screen bg-slate-950 grid place-items-center text-xl font-semibold text-white">
        <div className="flex items-center gap-3">
          <svg className="animate-spin w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Loading Categories...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />

      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
        <AdminSidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-20 h-16 flex items-center justify-between px-5 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            aria-label="Open sidebar"
          >
            <svg
              className="w-6 h-6"
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

          <div className="text-center">
            <h2 className="text-white font-bold text-sm tracking-wide">NAMMA BYNDOOR</h2>
            <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest leading-none">Categories</p>
          </div>

          <div className="w-10" />
        </header>

        {/* Main Content Area */}
        <main className="lg:ml-64 p-6 lg:p-10 max-w-7xl mx-auto">
          <CategoriesView />
        </main>
      </div>
    </>
  );
}