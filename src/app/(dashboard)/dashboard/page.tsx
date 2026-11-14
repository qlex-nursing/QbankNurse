"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  FileQuestion,
  Search,
  Sparkles,
  Star,
} from "lucide-react";

import {
  recentExams,
  studyCategories,
} from "@/data/mock/dashboard/overview";

const accentStyles = {
  red: {
    badge: "dashboard-badge-red",
    icon: "dashboard-icon-red",
    border: "hover:border-[#E85D5D]/50",
  },
  indigo: {
    badge: "dashboard-badge-indigo",
    icon: "dashboard-icon-indigo",
    border: "hover:border-[#5B3DF5]/50",
  },
  apricot: {
    badge: "dashboard-badge-apricot",
    icon: "dashboard-icon-apricot",
    border: "hover:border-[#D58A42]/50",
  },
  green: {
    badge: "dashboard-badge-green",
    icon: "dashboard-icon-green",
    border: "hover:border-[#24945F]/50",
  },
};

export default function DashboardPage() {
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return studyCategories;

    return studyCategories.filter(
      (category) =>
        category.title.toLowerCase().includes(query) ||
        category.program.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <div className="dashboard-content mx-auto w-full max-w-[1600px] space-y-8 px-5 py-7 sm:px-7 lg:px-9">
           {/* Study library banner */}
      <section className="dashboard-library-banner relative overflow-hidden rounded-3xl px-6 py-7 text-white sm:px-9 sm:py-8">
        <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border-[45px] border-white/[0.06]" />
        <div className="pointer-events-none absolute -bottom-36 right-1/3 h-64 w-64 rounded-full bg-[#E8DEFF]/15 blur-3xl" />

        <div className="relative max-w-5xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#E8DEFF] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#392576]">
            <Sparkles size={13} />
            Study Library
          </span>

          <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
            Everything you need{" "}
            <span className="text-[#E8DEFF]">
              to prepare with confidence.
            </span>
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/85">
            Explore nursing question banks, practise at your own pace,
            and understand the reasoning behind every answer.
          </p>

          <div className="mt-5 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <label className="relative min-w-0 flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#77718C]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search study categories..."
                className="dashboard-banner-search h-11 w-full rounded-xl border px-11 pr-4 text-sm outline-none transition focus:ring-4 focus:ring-[#E8DEFF]/30"
              />
            </label>

            <a
              href="#study-categories"
              className="dashboard-banner-button inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-6 text-sm font-bold transition-all"
            >
              Explore library
              <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      {/* Progress section */}
      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="dashboard-heading text-lg font-extrabold sm:text-xl">
              My study progress
            </h2>

            <p className="dashboard-muted mt-1 text-xs">
              Your learning activity will appear here.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/my-library"
              className="dashboard-secondary-button inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all"
            >
              My Library
            </Link>

            <Link
              href="/dashboard/study-library"
              className="dashboard-primary-button inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all"
            >
              Continue studying
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="dashboard-card flex items-center justify-between gap-4 rounded-2xl border border-dashed p-5">
            <div>
              <p className="dashboard-body text-sm font-semibold">
                You haven't opened any study topics yet.
              </p>

              <p className="dashboard-muted mt-1 text-xs">
                Choose a subject below to begin your first session.
              </p>
            </div>

            <BookOpen
              size={23}
              className="dashboard-accent-icon shrink-0"
            />
          </div>

          <div className="dashboard-card flex items-center justify-between gap-4 rounded-2xl border border-dashed p-5">
            <div>
              <p className="dashboard-body text-sm font-semibold">
                Your performance summary is waiting.
              </p>

              <p className="dashboard-muted mt-1 text-xs">
                Complete a practice test to start tracking your progress.
              </p>
            </div>

            <CheckCircle2
              size={23}
              className="shrink-0 text-[#E85D5D]"
            />
          </div>
        </div>
      </section>

      {/* Recent exams */}
      <section className="dashboard-card rounded-2xl border p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="dashboard-heading text-base font-extrabold">
              Recent exams
            </h2>

            <p className="dashboard-muted mt-1 text-xs">
              Your recently accessed practice sets.
            </p>
          </div>

          <Clock3 size={20} className="dashboard-accent-icon" />
        </div>

        <div className="space-y-1">
          {recentExams.map((exam) => {
            const progress =
              exam.questions > 0
                ? Math.round((exam.answered / exam.questions) * 100)
                : 0;

            return (
              <div
                key={exam.id}
                className="dashboard-list-row flex flex-col gap-3 rounded-xl px-3 py-3 transition-colors sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="dashboard-soft-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                    <FileQuestion size={17} />
                  </span>

                  <div className="min-w-0">
                    <p className="dashboard-body truncate text-sm font-semibold">
                      {exam.title}
                    </p>

                    <p className="dashboard-muted mt-1 text-[11px]">
                      {exam.questions} questions · {exam.updatedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:w-36">
                  <div className="dashboard-progress-track h-1.5 flex-1 overflow-hidden rounded-full">
                    <div
                      className="dashboard-progress-fill h-full rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <span className="dashboard-muted w-10 text-right text-[11px] font-bold">
                    {progress}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Continue studying */}
      <section className="dashboard-card rounded-2xl border p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="dashboard-icon-red flex h-10 w-10 items-center justify-center rounded-xl">
              <Clock3 size={20} />
            </span>

            <div>
              <h2 className="dashboard-heading text-base font-extrabold">
                Continue where you left off
              </h2>

              <p className="dashboard-muted mt-1 text-xs">
                Pick up your unfinished practice sessions.
              </p>
            </div>
          </div>

          <span className="dashboard-demo-badge rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide">
            Demo preview
          </span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {recentExams.slice(0, 2).map((exam) => (
            <div
              key={exam.id}
              className="dashboard-inner-card rounded-xl border p-4"
            >
              <p className="dashboard-body text-sm font-bold">
                {exam.title}
              </p>

              <p className="dashboard-muted mt-2 text-xs">
                {exam.answered} of {exam.questions} answered
              </p>

              <div className="dashboard-progress-track mt-3 h-1.5 overflow-hidden rounded-full">
                <div className="dashboard-progress-fill h-full w-0 rounded-full" />
              </div>

              <button
                type="button"
                disabled
                className="dashboard-disabled-action mt-4 inline-flex items-center gap-2 text-xs font-bold"
              >
                <Clock3 size={14} />
                No saved session yet
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Study categories */}
      <section id="study-categories" className="scroll-mt-28">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="dashboard-section-label text-[10px] font-extrabold uppercase tracking-[0.18em]">
              Find your next study set
            </span>

            <h2 className="dashboard-heading mt-2 text-xl font-extrabold sm:text-2xl">
              Explore popular study categories
            </h2>

            <p className="dashboard-muted mt-2 max-w-xl text-xs leading-6 sm:text-sm">
              Choose a nursing subject and discover practice questions
              designed to strengthen your understanding.
            </p>
          </div>

          <span className="dashboard-count-badge rounded-full px-3 py-2 text-[11px] font-bold">
            {filteredCategories.length} categories
          </span>
        </div>

        {filteredCategories.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredCategories.map((category) => {
              const accent = accentStyles[category.accent];

              return (
                <article
                  key={category.id}
                  className={`dashboard-category-card group flex h-full flex-col rounded-2xl border p-5 shadow-[0_4px_15px_rgba(45,27,104,0.035)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(45,27,104,0.09)] ${accent.border}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide ${accent.badge}`}
                    >
                      {category.program}
                    </span>

                    <span className="dashboard-question-count rounded-full px-2.5 py-1 text-[10px] font-bold">
                      {category.questions.toLocaleString()} Q
                    </span>
                  </div>

                  <h3 className="dashboard-card-title mt-5 text-base font-extrabold transition-colors group-hover:text-[#5B3DF5]">
                    {category.title}
                  </h3>

                  <div className="dashboard-muted mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px]">
                    <span className="inline-flex items-center gap-1 font-bold text-[#D58A42]">
                      <Star size={12} fill="currentColor" />
                      {category.rating.toFixed(1)}
                    </span>

                    <span>
                      ({category.reviews.toLocaleString()} reviews)
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <FileQuestion size={12} />
                      Question bank
                    </span>
                  </div>

                  <p className="dashboard-card-description mt-4 flex-1 text-xs leading-6">
                    {category.description}
                  </p>

                  <Link
  href={`/dashboard/exams/ati/${category.title
    .toLowerCase()
    .replaceAll(" ", "-")}`}
                    className="dashboard-primary-button mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold transition-all"
                  >
                    Browse sets
                    <ArrowRight size={15} />
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="dashboard-card rounded-2xl border border-dashed px-5 py-12 text-center">
            <Search
              size={25}
              className="dashboard-muted mx-auto"
            />

            <p className="dashboard-body mt-3 text-sm font-bold">
              No matching categories found
            </p>

            <p className="dashboard-muted mt-1 text-xs">
              Try another subject or search term.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}