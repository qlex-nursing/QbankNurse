import Link from "next/link";
import { HeartPulse, ArrowUpRight } from "lucide-react";

import {
  footerGroups,
  footerLegalLinks,
} from "@/data/mock/footer-links";

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#FBF3F7] px-5 py-20 sm:px-8 sm:py-24">
      <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-[#E8DEFF]/35 blur-[100px]" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-[#FFD6A5]/30 blur-[100px]" />

      <div className="relative mx-auto max-w-[760px] text-center">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#C46C99]">
          Your next step starts here
        </span>

        <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-[#2D1B68] sm:text-4xl lg:text-5xl">
          Make your next study
          <br className="hidden sm:block" />
          session count.
        </h2>

        <p className="mx-auto mt-5 max-w-[540px] text-sm leading-7 text-[#777087] sm:text-base">
          Choose an exam, answer at your own pace, and leave
          knowing exactly what to review next.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/study"
            className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#5B3DF5] px-7 py-3.5 text-sm font-extrabold text-white shadow-[0_10px_25px_rgba(91,61,245,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#492BD8] sm:w-auto"
          >
            Try a Practice Set
            <ArrowUpRight size={17} />
          </Link>

          <Link
            href="/#study-library"
            className="inline-flex min-h-13 w-full items-center justify-center rounded-xl border border-[#DCC5D6] bg-white/70 px-7 py-3.5 text-sm font-bold text-[#2D1B68] transition-all hover:border-[#5B3DF5] hover:bg-white sm:w-auto"
          >
            View the Exam Library
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Footer() {
  return (
    <>
      <FinalCTA />

      <footer className="bg-[#2D1B68] px-5 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1350px] py-14 lg:py-16">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-10">
            {/* Brand */}
            <div className="max-w-[310px]">
              <Link
                href="/"
                aria-label="QbankNurse home"
                className="inline-flex items-center gap-3"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E85D5D] text-white">
                  <HeartPulse size={24} strokeWidth={2.2} />
                </span>

                <span className="text-2xl font-extrabold tracking-tight">
                  QbankNurse
                  <span className="text-[#FFD6A5]">.</span>
                </span>
              </Link>

              <p className="mt-6 text-sm leading-7 text-white/65">
                A focused place to practise nursing exams,
                understand the reasoning, and keep moving forward.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold text-white/70">
                <span className="h-2 w-2 rounded-full bg-[#E85D5D]" />
                Learn with purpose. Grow with confidence.
              </div>
            </div>

            {/* Link groups */}
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-[11px] font-extrabold uppercase tracking-[0.17em] text-[#FFD6A5]">
                  {group.title}
                </h3>

                <ul className="mt-6 space-y-4">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-1 text-sm text-white/65 transition-colors hover:text-white"
                      >
                        {link.label}

                        <ArrowUpRight
                          size={12}
                          className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-white/45">
        © 2026 QbankNurse. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {footerLegalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs text-white/50 transition-colors hover:text-[#FFD6A5]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}