"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearDemoSession } from "@/lib/demo-auth";
import {
  Menu,
  Search,
  Sun,
  Moon,
  ChevronDown,
  UserRound,
  Settings,
  LogOut,
} from "lucide-react";

interface DashboardHeaderProps {
  onMenuClick: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
}

export default function DashboardHeader({
  onMenuClick,
  darkMode,
  onToggleTheme,
}: DashboardHeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    clearDemoSession();
    setProfileOpen(false);
    router.replace("/");
  };

  return (
    <header className="dashboard-header sticky top-0 z-30 flex h-[76px] items-center justify-between gap-4 border-b px-4 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="dashboard-icon-button flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors lg:hidden"
      >
        <Menu size={21} />
      </button>

      <div className="relative min-w-0 flex-1 lg:max-w-[560px]">
        <Search
          size={19}
          className="dashboard-muted absolute left-4 top-1/2 -translate-y-1/2"
        />

        <input
          type="search"
          placeholder="Search exams, subjects, or study resources..."
          aria-label="Search exams, subjects, or study resources"
          className="dashboard-search h-11 w-full rounded-xl border pl-11 pr-4 text-sm outline-none transition-all"
        />
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="dashboard-icon-button flex h-10 w-10 items-center justify-center rounded-xl border transition-all"
        >
          {darkMode ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((current) => !current)}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            className="dashboard-profile-button flex items-center gap-2 rounded-xl p-1.5 transition-colors"
          >
            <span className="dashboard-avatar flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold">
              Q
            </span>

            <span className="hidden text-left sm:block">
              <span className="dashboard-heading block text-xs font-bold">
                My Account
              </span>
              <span className="dashboard-muted mt-0.5 block text-[10px]">
                Demo profile
              </span>
            </span>

            <ChevronDown
              size={15}
              className={`dashboard-muted hidden transition-transform sm:block ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <>
              <button
                type="button"
                aria-label="Close profile menu"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setProfileOpen(false)}
              />

              <div
                role="menu"
                className="dashboard-dropdown absolute right-0 top-full z-50 mt-3 w-52 rounded-2xl border p-2 shadow-xl"
              >
                <div className="dashboard-divider border-b px-3 py-3">
                  <p className="dashboard-heading text-xs font-bold">
                    Demo account
                  </p>
                  <p className="dashboard-muted mt-1 text-[11px]">
                    QbankNurse preview
                  </p>
                </div>

                <Link
                  href="/dashboard/account"
                  role="menuitem"
                  onClick={() => setProfileOpen(false)}
                  className="dashboard-menu-item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium"
                >
                  <UserRound size={16} />
                  My Account
                </Link>

                <Link
                  href="/dashboard/settings"
                  role="menuitem"
                  onClick={() => setProfileOpen(false)}
                  className="dashboard-menu-item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium"
                >
                  <Settings size={16} />
                  Settings
                </Link>

                <div className="dashboard-divider my-1 border-t" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleSignOut}
                  className="dashboard-menu-item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}