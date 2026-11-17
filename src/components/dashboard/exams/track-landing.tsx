import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  ClipboardCheck,
  Layers3,
  Sparkles,
} from "lucide-react";

interface TrackLandingProps {
  track: "RN" | "LPN";
}

const categories = [
  {
    title: "ATI Exams",
    description:
      "Explore subject-based ATI practice, review nursing concepts and strengthen your clinical knowledge.",
    eyebrow: "SUBJECT LIBRARY",
    href: "ati",
    icon: BookOpen,
    number: "01",
    accent: "from-violet-500/15 to-indigo-500/5",
    iconClass: "bg-violet-500/10 text-violet-600",
  },
  {
    title: "HESI Exams",
    description:
      "Prepare with HESI specialty assessments and comprehensive exit examination practice.",
    eyebrow: "ASSESSMENT PREP",
    href: "hesi",
    icon: ClipboardCheck,
    number: "02",
    accent: "from-sky-500/15 to-cyan-500/5",
    iconClass: "bg-sky-500/10 text-sky-600",
  },
  {
    title: "Regular Practice",
    description:
      "Build confidence with focused practice sessions and questions across nursing topics.",
    eyebrow: "BUILD YOUR SKILLS",
    href: "regular",
    icon: Layers3,
    number: "03",
    accent: "from-emerald-500/15 to-teal-500/5",
    iconClass: "bg-emerald-500/10 text-emerald-600",
  },
  {
    title: "Certification",
    description:
      "Prepare for professional certification assessments with targeted practice resources.",
    eyebrow: "CAREER READINESS",
    href: "certification",
    icon: Award,
    number: "04",
    accent: "from-amber-500/15 to-orange-500/5",
    iconClass: "bg-amber-500/10 text-amber-600",
  },
];

export default function TrackLanding({ track }: TrackLandingProps) {
  const shortTitle = track;

  return (
    <main className="w-full">
      {/* SLIM FULL-WIDTH HERO */}
      <section className="relative isolate flex min-h-[175px] w-full items-center overflow-hidden bg-[#17263F] px-5 py-6 text-white sm:px-8 lg:px-11">
        {/* Subtle indigo lighting */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(91,61,245,0.18),transparent_55%)]" />

        <div className="pointer-events-none absolute -right-16 -top-28 h-64 w-64 rounded-full border border-white/[0.05]" />

        <div className="pointer-events-none absolute -right-4 -bottom-32 h-56 w-56 rounded-full border border-white/[0.04]" />

        <div className="relative z-10 w-full max-w-4xl">
          <div className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.2em] text-[#B9A9FF]">
            <Sparkles size={13} />
            {shortTitle} EXAM PREPARATION
          </div>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Everything you need to prepare for{" "}
            <span className="text-[#B9A9FF]">{shortTitle}</span>
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
            Explore nursing examination resources, practise clinical questions
            and build confidence through focused learning.
          </p>
        </div>
      </section>

      {/* PAGE CONTENT */}
      <div className="mx-auto w-full max-w-[1500px] space-y-7 px-5 py-7 sm:px-7 lg:px-9">
        {/* CATEGORY SECTION */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="dashboard-section-label">
                CHOOSE YOUR PATH
              </p>

              <h2 className="dashboard-heading mt-1.5 text-xl font-extrabold tracking-tight sm:text-2xl">
                Explore exam categories
              </h2>

              <p className="dashboard-muted mt-1 text-sm">
                Select a category to explore its available learning resources.
              </p>
            </div>

            <span className="dashboard-count-badge">
              04 categories
            </span>
          </div>

          {/* RESPONSIVE CATEGORY GRID */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.href}
                  href={`/dashboard/exams/${shortTitle.toLowerCase()}/${category.href}`}
                  className="dashboard-card group relative flex min-h-[225px] flex-col overflow-hidden rounded-xl border border-[var(--dashboard-border)] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#8D79FF]/50 hover:shadow-[0_10px_25px_rgba(55,40,120,0.08)] sm:p-4"
                >
                  {/* Subtle card accent */}
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${category.accent} opacity-60`}
                  />

                  <div className="relative flex h-full flex-1 flex-col">
                    {/* Icon and number */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${category.iconClass}`}
                      >
                        <Icon size={20} />
                      </div>

                      <span className="text-[10px] font-extrabold tracking-widest text-[var(--dashboard-muted)] opacity-60">
                        {category.number}
                      </span>
                    </div>

                    {/* Card content */}
                    <div className="mt-4">
                      <p className="text-[9px] font-extrabold tracking-[0.15em] text-[#7663C9]">
                        {category.eyebrow}
                      </p>

                      <h3 className="dashboard-heading mt-1.5 text-base font-extrabold leading-snug">
                        {category.title}
                      </h3>

                      <p className="dashboard-muted mt-2 text-xs leading-5">
                        {category.description}
                      </p>
                    </div>

                    {/* Action */}
                    <div className="mt-auto flex items-center justify-between border-t border-[var(--dashboard-border)] pt-3 mt-4">
                      <span className="text-xs font-bold text-[#5B3DF5]">
                        Explore category
                      </span>

                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--dashboard-border)] bg-[var(--dashboard-surface)] transition-all duration-300 group-hover:border-[#5B3DF5] group-hover:bg-[#5B3DF5] group-hover:text-white">
                        <ArrowRight
                          size={15}
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* BOTTOM INFORMATION */}
        <section className="dashboard-inner-card flex flex-col gap-3 rounded-xl p-4 sm:flex-row sm:items-center">
          <div className="dashboard-accent-icon shrink-0">
            <Sparkles size={19} />
          </div>

          <div>
            <h3 className="dashboard-heading text-sm font-bold">
              Make every practice session count
            </h3>

            <p className="dashboard-muted mt-1 text-xs leading-5 sm:text-sm">
              Explore your resources, identify areas for improvement and keep
              building your nursing knowledge one session at a time.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}