"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

import { studyCategories } from "@/data/mock/dashboard/overview";
import { practiceQuestions } from "@/data/mock/dashboard/practice-questions";

type SubjectFilter = "all" | "available" | "coming-soon";

function getSubjectSlug(title: string) {
  return title.toLowerCase().replaceAll(" ", "-");
}

function getPracticeCount(slug: string) {
  return (
    practiceQuestions[slug as keyof typeof practiceQuestions]?.length ?? 0
  );
}

export default function ATISubjectsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<SubjectFilter>("all");

  const subjects = useMemo(
    () =>
      studyCategories.map((subject) => {
        const slug = getSubjectSlug(subject.title);
        const practiceCount = getPracticeCount(slug);

        return {
          ...subject,
          slug,
          practiceCount,
          available: practiceCount > 0,
        };
      }),
    [],
  );

  const filteredSubjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return subjects.filter((subject) => {
      const matchesSearch =
        !query ||
        subject.title.toLowerCase().includes(query) ||
        subject.description.toLowerCase().includes(query);

      const matchesFilter =
        filter === "all" ||
        (filter === "available" && subject.available) ||
        (filter === "coming-soon" && !subject.available);

      return matchesSearch && matchesFilter;
    });
  }, [subjects, search, filter]);

  const availableCount = subjects.filter(
    (subject) => subject.available,
  ).length;

  const totalQuestions = subjects.reduce(
    (total, subject) => total + subject.questions,
    0,
  );

  const filters: { label: string; value: SubjectFilter }[] = [
    { label: "All subjects", value: "all" },
    { label: "Available now", value: "available" },
    { label: "Coming soon", value: "coming-soon" },
  ];

  return (
    <main className="w-full pb-7">
      {/* BREADCRUMB */}
      <div className="px-5 pb-4 pt-5 sm:px-7 lg:px-9">
        <Link
          href="/dashboard/exams/rn"
          className="dashboard-muted inline-flex items-center gap-2 text-sm font-semibold transition hover:text-[#5B3DF5]"
        >
          <ArrowLeft size={16} />
          Back to RN Exams
        </Link>
      </div>

      {/* SLIM FULL-WIDTH HERO */}
      <section className="relative isolate flex min-h-[165px] w-full items-center overflow-hidden bg-gradient-to-r from-[#17263F] via-[#202C50] to-[#30245F] px-5 py-6 text-white sm:px-8 lg:px-11">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_50%,rgba(91,61,245,0.22),transparent_55%)]" />

        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/[0.06]" />

        <div className="relative z-10 w-full max-w-4xl">
          <span className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.22em] text-[#B9A9FF]">
            <GraduationCap size={13} />
            RN · ATI PREPARATION
          </span>

          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Explore your ATI{" "}
            <span className="text-[#B9A9FF]">subjects</span>
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-white/60">
            Find your nursing subject, explore its learning resources and
            strengthen your clinical knowledge.
          </p>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[11px] font-semibold text-white/70">
            <span>{subjects.length} subjects</span>
            <span>{availableCount} with practice content</span>
            <span>{totalQuestions.toLocaleString()} catalogue questions</span>
          </div>
        </div>
      </section>

      {/* PAGE CONTENT */}
      <div className="mx-auto w-full max-w-[1500px] space-y-6 px-5 pt-6 sm:px-7 lg:px-9">
        {/* SEARCH AND FILTERS */}
        <section className="space-y-3">
          <div>
            <p className="dashboard-section-label">FIND YOUR SUBJECT</p>

            <h2 className="dashboard-heading mt-1 text-xl font-extrabold">
              Explore ATI subjects
            </h2>

            <p className="dashboard-muted mt-1 text-sm">
              Search by subject name or browse the available categories.
            </p>
          </div>

          {/* SEARCH */}
          <div className="dashboard-search flex min-h-11 items-center gap-3 rounded-xl px-4">
            <Search size={18} className="dashboard-muted shrink-0" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search nursing subjects..."
              className="dashboard-heading w-full bg-transparent text-sm outline-none placeholder:opacity-60"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="dashboard-muted transition hover:opacity-60"
              >
                <X size={17} />
              </button>
            )}
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((item, index) => {
              const active = filter === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all ${
                    active
                      ? "border-[#5B3DF5] bg-[#5B3DF5] text-white shadow-[0_4px_12px_rgba(91,61,245,0.18)]"
                      : "dashboard-card dashboard-heading border-[var(--dashboard-border)] hover:border-[#5B3DF5] hover:text-[#5B3DF5]"
                  }`}
                >
                  {index === 0 && <SlidersHorizontal size={13} />}
                  {item.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* SUBJECT CARDS */}
        <section className="space-y-4 border-t border-[var(--dashboard-border)] pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="dashboard-heading text-lg font-bold">
                Nursing subjects
              </h2>

              <p className="dashboard-muted mt-1 text-xs sm:text-sm">
                Select a subject to view its topics and study options.
              </p>
            </div>

            <span className="dashboard-count-badge">
              {filteredSubjects.length}{" "}
              {filteredSubjects.length === 1 ? "subject" : "subjects"}
            </span>
          </div>

          {filteredSubjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredSubjects.map((subject, index) => (
                <Link
                  key={subject.id}
                  href={`/dashboard/exams/ati/${subject.slug}`}
                  className="dashboard-card group relative flex min-h-[205px] flex-col overflow-hidden rounded-xl border border-[var(--dashboard-border)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#8D79FF]/50 hover:shadow-[0_10px_24px_rgba(55,40,120,0.07)]"
                >
                  {/* CARD TOP */}
                  <div className="flex items-center justify-between">
                    <div className="dashboard-accent-icon !h-10 !w-10">
                      <BookOpen size={18} />
                    </div>

                    <span className="text-[10px] font-extrabold tracking-widest text-[var(--dashboard-muted)] opacity-60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* BADGES */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-[#E8DEFF] px-2.5 py-1 text-[9px] font-bold text-[#392576]">
                      {subject.program}
                    </span>

                    {subject.available ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[9px] font-bold text-emerald-600">
                        <CheckCircle2 size={11} />
                        Practice available
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[9px] font-bold text-amber-600">
                        Coming soon
                      </span>
                    )}
                  </div>

                  {/* SUBJECT DETAILS */}
                  <div className="mt-3 flex-1">
                    <h3 className="dashboard-heading text-base font-extrabold leading-snug transition-colors group-hover:text-[#5B3DF5]">
                      {subject.title}
                    </h3>

                    <p className="dashboard-muted mt-1.5 text-xs leading-5">
                      {subject.description}
                    </p>
                  </div>

                  {/* CARD FOOTER */}
                  <div className="mt-3 flex items-center justify-between border-t border-[var(--dashboard-border)] pt-3">
                    <div>
                      <p className="dashboard-heading text-sm font-bold">
                        {subject.questions.toLocaleString()}
                      </p>

                      <p className="dashboard-muted text-[10px]">
                        Catalogue questions
                      </p>
                    </div>

                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--dashboard-border)] transition-all group-hover:border-[#5B3DF5] group-hover:bg-[#5B3DF5] group-hover:text-white">
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="dashboard-card flex flex-col items-center justify-center rounded-xl px-5 py-12 text-center">
              <div className="dashboard-accent-icon mb-3">
                <Search size={22} />
              </div>

              <h3 className="dashboard-heading text-base font-bold">
                No subjects found
              </h3>

              <p className="dashboard-muted mt-2 max-w-sm text-sm leading-6">
                No subjects match your search and selected filter. Try another
                keyword or reset the filters.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="dashboard-primary-button mt-4 rounded-xl px-5 py-2.5 text-sm font-semibold"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* INFORMATION PANEL */}
        <section className="dashboard-inner-card flex items-center gap-3 rounded-xl p-4">
          <div className="dashboard-accent-icon shrink-0">
            <Sparkles size={18} />
          </div>

          <div>
            <h3 className="dashboard-heading text-sm font-bold">
              Keep progressing, one subject at a time
            </h3>

            <p className="dashboard-muted mt-1 text-xs leading-5 sm:text-sm">
              Your subject library brings your ATI preparation resources
              together in one place.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}