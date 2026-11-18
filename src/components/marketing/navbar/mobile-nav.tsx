"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

const links = [
  { label: "Home", href: "/" },
  { label: "Study", href: "/dashboard/study-hub" },
  { label: "Care Plans", href: "/dashboard/care-plans" },
  { label: "Community", href: "/dashboard/community" },
  { label: "FAQ", href: "/#faq" },
];

const exams = [
  { label: "NCLEX-RN", href: "/dashboard/exams/rn" },
  { label: "NCLEX-PN", href: "/dashboard/exams/lpn" },
  { label: "ATI Exams", href: "/dashboard/exams/rn/ati" },
  { label: "HESI Exams", href: "/dashboard/study-library" },
];

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const [examsOpen, setExamsOpen] = useState(false);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-[#2D1B68]/30 backdrop-blur-sm xl:hidden"
      />

      <div className="absolute left-0 right-0 top-full z-50 border-t border-[#ECE7F2] bg-white shadow-xl xl:hidden">
        <div className="mx-auto max-h-[calc(100dvh-80px)] max-w-[1320px] overflow-y-auto px-5 py-5 sm:px-8">
          <nav aria-label="Mobile navigation" className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={onClose}
                className="flex items-center justify-between rounded-xl px-3 py-3.5 text-sm font-bold text-[#51476E] transition-colors hover:bg-[#E8DEFF]/40 hover:text-[#5B3DF5]"
              >
                {link.label}
                <ChevronRight size={16} className="text-[#AAA1BB]" />
              </Link>
            ))}

            <div>
              <button
                type="button"
                aria-expanded={examsOpen}
                onClick={() => setExamsOpen((previous) => !previous)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-3.5 text-sm font-bold text-[#51476E] transition-colors hover:bg-[#E8DEFF]/40 hover:text-[#5B3DF5]"
              >
                Exams
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    examsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {examsOpen && (
                <div className="ml-3 space-y-1 border-l-2 border-[#E85D5D] py-2 pl-4">
                  {exams.map((exam) => (
                    <Link
                      key={exam.label}
                      href={exam.href}
                      onClick={onClose}
                      className="block rounded-lg px-3 py-2.5 text-xs font-semibold text-[#716887] transition-colors hover:bg-[#E8DEFF]/40 hover:text-[#5B3DF5]"
                    >
                      {exam.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#ECE7F2] pt-5">
            <Link
              href="/login"
              onClick={onClose}
              className="flex min-h-12 items-center justify-center rounded-xl border border-[#E3DDED] px-4 py-3 text-sm font-bold text-[#2D1B68] transition-colors hover:bg-[#E8DEFF]/40"
            >
              Log in
            </Link>

            <Link
              href="/register"
              onClick={onClose}
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#FFD6A5] px-4 py-3 text-sm font-extrabold text-[#2D1B68] transition-colors hover:bg-[#FFC98C]"
            >
              Start Studying
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}