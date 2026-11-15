"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardSidebar from "@/components/dashboard/sidebar";
import DashboardHeader from "@/components/dashboard/header";
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

    setAuthenticated(true);
    setCheckingSession(false);
  }, [router]);

  if (checkingSession || !authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F7FC]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E8DEFF] border-t-[#5B3DF5]" />
          <p className="mt-4 text-sm font-semibold text-[#706782]">
            Preparing your QbankNurse dashboard...
          </p>
        </div>
      </div>
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