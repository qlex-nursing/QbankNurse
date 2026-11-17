"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardSidebar from "@/components/dashboard/sidebar";
import DashboardHeader from "@/components/dashboard/header";
import HeartbeatLoader from "@/components/dashboard/heartbeat-loader";

import { getDemoSession } from "@/lib/demo-auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

 useEffect(() => {
  const session = getDemoSession();

  if (!session) {
    router.replace("/login");
    return;
  }

  // Keep the loader visible briefly for a polished transition.
  const timer = window.setTimeout(() => {
    setAuthenticated(true);
    setCheckingSession(false);
  }, 1300);

  return () => window.clearTimeout(timer);
}, [router]);

  if (checkingSession || !authenticated) {
    return (
      <HeartbeatLoader message="Preparing your QbankNurse dashboard" />
    );
  }

  return (
    <div
      className={`dashboard-theme min-h-screen ${
        darkMode ? "dashboard-dark" : "dashboard-light"
      }`}
    >
      <div className="flex min-h-screen">
        <DashboardSidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((current) => !current)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader
            onMenuClick={() => setMobileOpen(true)}
            darkMode={darkMode}
            onToggleTheme={() => setDarkMode((current) => !current)}
          />

          <main className="dashboard-workspace min-w-0 flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}