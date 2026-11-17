"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";

import { dashboardNavigation } from "@/data/mock/dashboard/navigation";

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function DashboardSidebar({
  mobileOpen,
  onMobileClose,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = (href?: string) => {
    if (!href) return false;

    const [targetPath, targetQuery] = href.split("?");

    if (targetPath === "/dashboard") {
      return pathname === targetPath;
    }

    const pathMatches =
      pathname === targetPath || pathname.startsWith(`${targetPath}/`);

    if (!pathMatches) return false;

    if (!targetQuery) return true;

    const targetParams = new URLSearchParams(targetQuery);

    for (const [key, value] of targetParams.entries()) {
      if (searchParams.get(key) !== value) return false;
    }

    return true;
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-[#0D1728]/65 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/[0.07] bg-[#14233B] text-white shadow-[12px_0_40px_rgba(8,15,30,0.12)] transition-all duration-300 lg:sticky lg:top-0 lg:z-30 lg:h-screen ${
          collapsed ? "lg:w-[84px]" : "lg:w-[280px]"
        } ${
          mobileOpen
            ? "w-[280px] translate-x-0"
            : "w-[280px] -translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-white/[0.08] px-5">
          <Link
            href="/dashboard"
            onClick={onMobileClose}
            className="flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-br from-[#F07878] to-[#D94765] text-sm font-black text-white shadow-[0_5px_18px_rgba(232,93,93,0.25)]">
              Q
            </span>

            {!collapsed && (
              <span className="text-xl font-extrabold tracking-tight">
                QbankNurse<span className="text-[#B9A9FF]">.</span>
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => {
              if (window.innerWidth < 1024) {
                onMobileClose();
              } else {
                onToggleCollapse();
              }
            }}
            aria-label="Toggle sidebar"
            className="hidden rounded-xl border border-white/[0.08] bg-white/[0.04] p-2 text-slate-400 transition-all hover:border-[#8D79FF]/40 hover:bg-white/[0.09] hover:text-white lg:block"
          >
            {collapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>

          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close sidebar"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {dashboardNavigation.map((group, index) => (
            <div key={group.title ?? `main-${index}`}>
              {group.title && !collapsed && (
                <div className="mb-3 flex items-center gap-3 px-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">
                    {group.title}
                  </span>
                  <span className="h-px flex-1 bg-white/[0.08]" />
                </div>
              )}

              <div className="space-y-2">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.label}
                      href={item.href ?? "/dashboard"}
                      onClick={onMobileClose}
                      title={collapsed ? item.label : undefined}
                      aria-current={active ? "page" : undefined}
                      className={`group relative flex min-h-[46px] items-center gap-3 overflow-hidden rounded-xl border px-3 py-2.5 transition-all duration-200 active:scale-[0.975] ${
                        collapsed ? "justify-center" : ""
                      } ${
                        active
                          ? "border-[#8874FF]/35 bg-gradient-to-r from-[#5B3DF5]/25 via-[#5140B2]/15 to-white/[0.035] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_5px_18px_rgba(5,10,25,0.18)]"
                          : "border-transparent bg-white/[0.025] text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] hover:-translate-y-[1px] hover:border-[#8D79FF]/25 hover:bg-white/[0.075] hover:text-white hover:shadow-[0_6px_16px_rgba(5,10,25,0.2)]"
                      }`}
                    >
                      {/* Active indicator */}
                      {active && (
                        <>
                          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-[#9C8AFF] shadow-[0_0_6px_2px_rgba(156,138,255,0.55)]" />
                          <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-[#9C8AFF] shadow-[0_0_10px_rgba(156,138,255,0.7)]" />
                        </>
                      )}

                      {Icon && (
                        <span
                          className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 ${
                            active
                              ? "border-[#9C8AFF]/30 bg-[#7259F5]/20 text-[#C5B9FF]"
                              : "border-white/[0.07] bg-white/[0.045] text-slate-400 group-hover:border-[#9C8AFF]/25 group-hover:bg-[#7259F5]/15 group-hover:text-[#C5B9FF]"
                          }`}
                        >
                          <Icon size={17} strokeWidth={1.9} />
                        </span>
                      )}

                      {!collapsed && (
                        <span
                          className={`min-w-0 flex-1 truncate text-[13px] ${
                            active ? "font-bold" : "font-medium"
                          }`}
                        >
                          {item.label}
                        </span>
                      )}

                      {active && !collapsed && (
                        <span className="mr-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9C8AFF]/70" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="shrink-0 border-t border-white/[0.08] px-5 py-4">
            <p className="text-[10px] font-medium tracking-wide text-slate-500">
              QBANKNURSE LEARNING PLATFORM
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-300">
              Learn with purpose.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}