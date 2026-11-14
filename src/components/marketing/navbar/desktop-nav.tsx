"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowUpRight } from "lucide-react";

const navigationLinks = [
  { label: "Home", href: "/", color: "red" },
  { label: "Study", href: "/dashboard/study-hub", color: "apricot" },
  { label: "Care Plans", href: "/dashboard/care-plans", color: "indigo" },
  { label: "Community", href: "/dashboard/community", color: "red" },
  { label: "FAQ", href: "/#faq", color: "butter" },
] as const;

const navColorClasses = {
  red: "hover:!text-[#E85D5D] [&:hover::after]:!bg-[#E85D5D]",
  apricot: "hover:!text-[#D58A42] [&:hover::after]:!bg-[#D58A42]",
  indigo: "hover:!text-[#5B3DF5] [&:hover::after]:!bg-[#5B3DF5]",
  butter: "hover:!text-[#B39B00] [&:hover::after]:!bg-[#B39B00]",
};

const examLinks = [
  {
    title: "NCLEX-RN",
    description: "Registered Nurse preparation",
    href: "/dashboard/custom-practice",
  },
  {
    title: "NCLEX-PN",
    description: "Practical Nurse preparation",
    href: "/dashboard/custom-practice",
  },
  {
    title: "ATI Exams",
    description: "Nursing assessment preparation",
    href: "/dashboard/study-library",
  },
  {
    title: "HESI Exams",
    description: "HESI and exit examination practice",
    href: "/dashboard/study-library",
  },
  {
    title: "TEAS",
    description: "Test of Essential Academic Skills",
    href: "/dashboard/study-library",
  },
];

export default function DesktopNav() {
  const [examsOpen, setExamsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setExamsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExamsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      className="hidden items-center gap-7 xl:flex"
    >
      {/* Home */}
      <Link
        href="/"
        className={`nav-link ${navColorClasses.red}`}
      >
        Home
      </Link>

      {/* Exams dropdown */}
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          aria-haspopup="true"
          aria-expanded={examsOpen}
          onClick={() => setExamsOpen((previous) => !previous)}
          className={`nav-link [--nav-hover-color:#E85D5D] inline-flex items-center gap-1.5 ${
            examsOpen ? "nav-link-active" : ""
          }`}
        >
          Exams

          <ChevronDown
            size={15}
            className={`transition-transform duration-200 ${
              examsOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {examsOpen && (
          <div className="absolute left-1/2 top-full z-50 mt-5 w-[340px] -translate-x-1/2 rounded-2xl border border-[#ECE7F2] bg-white p-3 shadow-[0_20px_60px_rgba(45,27,104,0.13)]">
            <div className="px-3 pb-3 pt-2">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#9389AB]">
                Explore exam pathways
              </p>
            </div>

            {examLinks.map((exam) => (
              <Link
                key={exam.title}
                href={exam.href}
                onClick={() => setExamsOpen(false)}
                className="group flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-[#E8DEFF]/40"
              >
                <div>
                  <p className="text-sm font-extrabold text-[#2D1B68] transition-colors group-hover:text-[#5B3DF5]">
                    {exam.title}
                  </p>

                  <p className="mt-1 text-[11px] text-[#89829A]">
                    {exam.description}
                  </p>
                </div>

                <ArrowUpRight
                  size={15}
                  className="text-[#AAA1BB] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#5B3DF5]"
                />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Remaining navigation links */}
      {navigationLinks.slice(1).map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className={`nav-link ${navColorClasses[link.color]}`}
        >
          {link.label}
        </Link>
      ))}

      {/* NCLEX */}
     <Link
  href="/dashboard/custom-practice"
        className="nav-link [--nav-hover-color:#5B3DF5]"
      >
        NCLEX
      </Link>
    </nav>
  );
}