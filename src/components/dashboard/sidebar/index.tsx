"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
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
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (label: string) => {
    setExpandedItems((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/dashboard") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const renderItem = (
    item: (typeof dashboardNavigation)[number]["items"][number],
    depth = 0,
  ) => {
    const Icon = item.icon;
    const hasChildren = Boolean(item.children?.length);
    const expanded = expandedItems.includes(item.label);
    const active = isActive(item.href);

    return (
      <div key={item.label}>
        {hasChildren ? (
          <button
            type="button"
            title={collapsed ? item.label : undefined}
            onClick={() => {
              if (collapsed) onToggleCollapse();
              toggleExpanded(item.label);
            }}
            className={`group flex w-full items-center gap-3 rounded-2xl transition-all duration-200 ${
              depth === 0
                ? "px-3 py-3"
                : "px-3 py-2"
            } ${
              expanded
                ? "bg-[#263B59] text-white"
                : "text-slate-300 hover:bg-[#263B59] hover:text-white"
            } ${collapsed && depth === 0 ? "justify-center" : ""}`}
          >
            {Icon && (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#B9A9FF]">
                <Icon size={18} />
              </span>
            )}

            {!collapsed && (
              <>
                <span className="min-w-0 flex-1 text-left text-sm font-semibold">
                  {item.label}
                </span>

                <ChevronDown
                  size={16}
                  className={`shrink-0 transition-transform ${
                    expanded ? "rotate-180 text-[#B9A9FF]" : "text-slate-400"
                  }`}
                />
              </>
            )}
          </button>
        ) : (
          <Link
            href={item.href ?? "/dashboard"}
            onClick={onMobileClose}
            title={collapsed ? item.label : undefined}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
              active
                ? "bg-[#5B3DF5] text-white shadow-[0_5px_18px_rgba(91,61,245,0.25)]"
                : "text-slate-300 hover:bg-[#263B59] hover:text-white"
            } ${collapsed && depth === 0 ? "justify-center" : ""}`}
          >
            {Icon && <Icon size={19} className="shrink-0" />}

            {!collapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </Link>
        )}

        {hasChildren && expanded && !collapsed && (
          <div className="ml-5 mt-2 space-y-1 border-l border-white/10 pl-3">
            {item.children?.map((child) => {
              const childHasChildren = Boolean(child.children?.length);
              const childExpanded = expandedItems.includes(
                `${item.label}-${child.label}`,
              );

              if (childHasChildren) {
                return (
                  <div key={child.label}>
                    <button
                      type="button"
                      onClick={() =>
                        toggleExpanded(`${item.label}-${child.label}`)
                      }
                      className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-xs font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      {child.label}

                      <ChevronDown
                        size={14}
                        className={`transition-transform ${
                          childExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {childExpanded && (
                      <div className="ml-2 space-y-1 border-l border-white/10 pl-3">
                        {child.children?.map((nested) => (
                          <Link
                            key={nested.label}
                            href={nested.href ?? "/dashboard"}
                            onClick={onMobileClose}
                            className={`block rounded-lg px-2 py-1.5 text-xs transition-colors ${
                              isActive(nested.href)
                                ? "bg-white/10 font-semibold text-white"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            {nested.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={child.label}
                  href={child.href ?? "/dashboard"}
                  onClick={onMobileClose}
                  className={`block rounded-lg px-2 py-2 text-xs transition-colors ${
                    isActive(child.href)
                      ? "bg-white/10 font-semibold text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {child.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-[#0D1728]/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/5 bg-[#17263F] text-white transition-all duration-300 lg:sticky lg:top-0 lg:z-30 lg:h-screen ${
          collapsed ? "lg:w-[84px]" : "lg:w-[280px]"
        } ${
          mobileOpen
            ? "w-[280px] translate-x-0"
            : "w-[280px] -translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-white/10 px-5">
          <Link
            href="/dashboard"
            onClick={onMobileClose}
            className="flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E85D5D] text-sm font-black text-white">
              Q
            </span>

            {!collapsed && (
              <span className="text-xl font-extrabold tracking-tight">
                QNurse<span className="text-[#B9A9FF]">.</span>
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
            className="hidden rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white lg:block"
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
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
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
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
                    {group.title}
                  </span>
                  <span className="h-px flex-1 bg-white/10" />
                </div>
              )}

              <div className="space-y-1.5">
                {group.items.map((item) => renderItem(item))}
              </div>
            </div>
          ))}
        </nav>

        {!collapsed && (
          <div className="shrink-0 border-t border-white/10 px-5 py-4">
            <p className="text-[10px] font-medium text-slate-500">
              QNurse Learning Platform
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