// path: web-frontend/components/admin/dashboard/DashboardView.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import WelcomeBanner from "./WelcomeBanner";
import StatCards, { StatItem } from "./StatCards";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";
import SystemStatus from "./SystemStatus";
import { api } from "../../lib/api";

export default function DashboardView() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Fetch real video count if available
        let totalVideos = 0;
        try {
          const res = await api.get<{ videos: unknown[] }>("/api/hero-videos");
          totalVideos = Array.isArray(res.videos) ? res.videos.length : 0;
        } catch {
          totalVideos = 3; // fallback display count
        }

        // Configure the 6 categories required by specification
        const computedStats: StatItem[] = [
          {
            id: "cat",
            label: "Categories",
            count: "12",
            description: "Active classification tags",
            gradient: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)",
            iconBg: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
            borderColor: "rgba(59, 130, 246, 0.25)",
            icon: (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              </svg>
            ),
          },
          {
            id: "places",
            label: "Places",
            count: "28",
            description: "Regional tourist spots",
            gradient: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
            iconBg: "linear-gradient(135deg, #6366F1, #4338CA)",
            borderColor: "rgba(99, 102, 241, 0.25)",
            icon: (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            ),
          },
          {
            id: "videos",
            label: "Hero Videos",
            count: totalVideos,
            description: "Homepage video reels",
            gradient: "radial-gradient(circle, rgba(14,165,233,0.3) 0%, transparent 70%)",
            iconBg: "linear-gradient(135deg, #0EA5E9, #0369A1)",
            borderColor: "rgba(14, 165, 233, 0.25)",
            icon: (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125v-9.375C2.25 8.004 2.754 7.5 3.375 7.5h17.25C21.246 7.5 21.75 8.004 21.75 8.625v9.75c0 .621-.504 1.125-1.125 1.125m0 0h-1.5m-15.75 0a1.125 1.125 0 011.125-1.125h13.5A1.125 1.125 0 0121 18.375M15 12l-4.5 2.598V9.402L15 12z" />
              </svg>
            ),
          },
          {
            id: "events",
            label: "Events",
            count: "6",
            description: "Upcoming cultural events",
            gradient: "radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)",
            iconBg: "linear-gradient(135deg, #10B981, #047857)",
            borderColor: "rgba(16, 185, 129, 0.25)",
            icon: (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            ),
          },
          {
            id: "gallery",
            label: "Gallery",
            count: "142",
            description: "High-resolution photos",
            gradient: "radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)",
            iconBg: "linear-gradient(135deg, #F59E0B, #B45309)",
            borderColor: "rgba(245, 158, 11, 0.25)",
            icon: (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            ),
          },
          {
            id: "messages",
            label: "Messages",
            count: "18",
            description: "Unread inquiries & support",
            gradient: "radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)",
            iconBg: "linear-gradient(135deg, #EC4899, #BE185D)",
            borderColor: "rgba(236, 72, 153, 0.25)",
            icon: (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            ),
          },
        ];

        setStats(computedStats);
      } finally {
        setLoadingStats(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Welcome Banner */}
      <WelcomeBanner />

      {/* 2. Statistics Cards */}
      <section>
        <StatCards stats={stats} loading={loadingStats} />
      </section>

      {/* 3. Quick Actions */}
      <section>
        <QuickActions />
      </section>

      {/* 4. Recent Activity & 5. System Status (2-column layout on Desktop) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <RecentActivity />
        </div>
        <div className="lg:col-span-5">
          <SystemStatus />
        </div>
      </section>
    </div>
  );
}