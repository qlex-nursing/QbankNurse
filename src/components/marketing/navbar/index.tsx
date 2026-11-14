"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";

import Logo from "@/components/ui/logo";
import DesktopNav from "./desktop-nav";
import MobileNav from "./mobile-nav";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#ECE7F2] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[78px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Logo />

        <DesktopNav />

        <div className="hidden items-center gap-4 xl:flex">
          <Link
            href="/login"
            className="px-4 py-3 text-[13px] font-bold text-[#2D1B68] transition-colors hover:text-[#5B3DF5]"
          >
            Log in
          </Link>

          <Link
            href="/register"
            className="group inline-flex items-center gap-2 rounded-full bg-[#FFD6A5] px-6 py-3 text-[13px] font-extrabold text-[#2D1B68] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FFC98C] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5B3DF5]"
          >
            Start Studying
            <ArrowUpRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((previous) => !previous)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#ECE7F2] text-[#2D1B68] transition-colors hover:border-[#E8DEFF] hover:bg-[#E8DEFF]/40 xl:hidden"
        >
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  );
}