"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  BookOpen,
  Search,
  SlidersHorizontal,
  Star,
  FileText,
  Play,
  Eye,
  GraduationCap,
  MoreHorizontal,
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import {
  studySets,
  studyLibraryFilters,
  type StudySet,
} from "@/data/mock/dashboard/study-sets";

type LibraryFilter = (typeof studyLibraryFilters)[number];

export default function StudyLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] =
    useState<LibraryFilter>("All");

  const filteredStudySets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return studySets.filter((set) => {
      const matchesSearch =
        set.title.toLowerCase().includes(query) ||
        set.programme.toLowerCase().includes(query) ||
        set.description.toLowerCase().includes(query) ||
        set.tags.some((tag) => tag.toLowerCase().includes(query));

      let matchesFilter = true;

      switch (selectedFilter) {
        case "RN Exams":
          matchesFilter = set.track === "RN";
          break;

        case "LPN Exams":
          matchesFilter = set.track === "LPN";
          break;

        case "NCLEX":
          matchesFilter = set.track === "NCLEX";
          break;

        case "Dosage Calculations":
          matchesFilter = set.tags.some(
            (tag) => tag.toLowerCase() === "dosage calculations",
          );
          break;

        default:
          matchesFilter = true;
      }

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, selectedFilter]);

  const totalQuestions = studySets.reduce(
    (total, set) => total + set.questionCount,
    0,
  );

  const availableSets = studySets.filter(
    (set) => set.status === "available",
  ).length;

  const getPracticeHref = (
    set: StudySet,
    mode: "exam" | "review" | "tutor",
  ) => {
    if (set.status !== "available" || !set.subjectSlug) {
      return "#";
    }

    return `/dashboard/exams/ati/${set.subjectSlug}/practice?mode=${mode}`;
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedFilter("All");
  };

  return (
    <main className="w-full pb-7">
      {/* FULL-WIDTH HERO */}
      <section className="relative isolate flex min-h-[165px] w-full items-center overflow-hidden bg-gradient-to-r from-[#17263F] via-[#202C50] to-[#30245F] px-5 py-6 text-white sm:px-8 lg:px-11">
        {/* BACKGROUND EFFECTS */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_50%,rgba(91,61,245,0.22),transparent_55%)]" />

        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/[0.06]" />

        <div className="pointer-events-none absolute -bottom-32 right-1/4 h-64 w-64 rounded-full border border-white/[0.05]" />

        {/* HERO CONTENT */}
        <div className="relative z-10 w-full max-w-4xl">
          <span className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.22em] text-[#B9A9FF]">
            <GraduationCap size={13} />
            YOUR LEARNING LIBRARY
          </span>

          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Explore your study{" "}
            <span className="text-[#B9A9FF]">library</span>
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-white/60">
            Access your nursing study sets, practise examination questions
            and strengthen your clinical knowledge.
          </p>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[11px] font-semibold text-white/70">
            <span>{studySets.length} study sets</span>

            <span>{availableSets} available for practice</span>

            <span>
              {totalQuestions.toLocaleString()} catalogue questions
            </span>
          </div>
        </div>
      </section>

      {/* PAGE CONTENT */}
      <div className="mx-auto w-full max-w-[1500px] space-y-6 px-5 pt-6 sm:px-7 lg:px-9">
        {/* SEARCH AND FILTERS */}
        <section className="space-y-3">
          <div>
            <p className="dashboard-section-label">
              FIND YOUR RESOURCES
            </p>

            <h2 className="dashboard-heading mt-1 text-xl font-extrabold">
              Explore study sets
            </h2>

            <p className="dashboard-muted mt-1 text-sm">
              Find the right study material and choose how you want to learn.
            </p>
          </div>

          {/* SEARCH */}
          <div className="dashboard-search flex min-h-11 items-center gap-3 rounded-xl px-4">
            <Search
              size={18}
              className="dashboard-muted shrink-0"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search study sets, topics, or keywords..."
              className="dashboard-heading w-full bg-transparent text-sm outline-none placeholder:opacity-60"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="dashboard-muted transition hover:opacity-60"
              >
                <X size={17} />
              </button>
            )}
          </div>

          {/* FILTER PILLS */}
          <div className="flex flex-wrap items-center gap-2">
            {studyLibraryFilters.map((filter, index) => {
              const active = selectedFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedFilter(filter)}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
                    active
                      ? "border-[#5B3DF5] bg-[#5B3DF5] text-white shadow-[0_4px_12px_rgba(91,61,245,0.18)]"
                      : "dashboard-card dashboard-heading border-[var(--dashboard-border)] hover:border-[#5B3DF5] hover:text-[#5B3DF5]"
                  }`}
                >
                  {index === 0 && (
                    <SlidersHorizontal size={13} />
                  )}

                  {filter}
                </button>
              );
            })}
          </div>
        </section>

        {/* STUDY SET LISTING */}
        <section className="space-y-4 border-t border-[var(--dashboard-border)] pt-5">
          {/* SECTION HEADER */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="dashboard-heading text-lg font-bold">
                Your study resources
              </h2>

              <p className="dashboard-muted mt-1 text-xs sm:text-sm">
                Select a study set and choose your preferred learning mode.
              </p>
            </div>

            <span className="dashboard-count-badge">
              {filteredStudySets.length}{" "}
              {filteredStudySets.length === 1
                ? "study set"
                : "study sets"}
            </span>
          </div>

          {/* STUDY SET CARDS */}
          {filteredStudySets.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredStudySets.map((set, index) => (
                <StudySetCard
                  key={set.id}
                  studySet={set}
                  index={index}
                  getPracticeHref={getPracticeHref}
                />
              ))}
            </div>
          ) : (
            /* EMPTY STATE */
            <div className="dashboard-card flex flex-col items-center justify-center rounded-xl px-5 py-12 text-center">
              <div className="dashboard-accent-icon mb-3">
                <Search size={22} />
              </div>

              <h3 className="dashboard-heading text-base font-bold">
                No study sets found
              </h3>

              <p className="dashboard-muted mt-2 max-w-sm text-sm leading-6">
                We couldn't find a study set matching your search and
                selected filter. Try another keyword or reset your filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
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
              Keep building your nursing knowledge
            </h3>

            <p className="dashboard-muted mt-1 text-xs leading-5 sm:text-sm">
              Explore examination resources, practise clinical questions
              and strengthen your understanding through guided learning.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   STUDY SET CARD
========================================================= */

interface StudySetCardProps {
  studySet: StudySet;
  index: number;

  getPracticeHref: (
    set: StudySet,
    mode: "exam" | "review" | "tutor",
  ) => string;
}

function StudySetCard({
  studySet,
  index,
  getPracticeHref,
}: StudySetCardProps) {
  const available = studySet.status === "available";

  return (
    <article className="dashboard-card group relative flex min-h-[270px] flex-col overflow-hidden rounded-xl border border-[var(--dashboard-border)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#8D79FF]/50 hover:shadow-[0_10px_24px_rgba(55,40,120,0.07)]">
      {/* CARD TOP */}
      <div className="flex items-center justify-between gap-3">
        <div className="dashboard-accent-icon !h-10 !w-10">
          <BookOpen size={18} />
        </div>

        <span className="text-[10px] font-extrabold tracking-widest text-[var(--dashboard-muted)] opacity-60">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* PROGRAMME BADGE */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#E8DEFF] px-2.5 py-1 text-[9px] font-bold text-[#392576]">
          <GraduationCap size={11} />
          {studySet.programme}
        </span>

        {available ? (
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

      {/* TITLE AND DESCRIPTION */}
      <div className="mt-3 flex-1">
        <h3 className="dashboard-heading text-base font-extrabold leading-snug transition-colors group-hover:text-[#5B3DF5]">
          {studySet.title}
        </h3>

        <p className="dashboard-muted mt-1.5 line-clamp-2 text-xs leading-5">
          {studySet.description}
        </p>
      </div>

      {/* QUESTION COUNT */}
      <div className="mt-3 flex items-center gap-2">
        <FileText
          size={14}
          className="dashboard-muted shrink-0"
        />

        <span className="dashboard-muted text-xs font-medium">
          {available
            ? `${studySet.questionCount.toLocaleString()} questions`
            : "Question bank coming soon"}
        </span>
      </div>

      {/* RATINGS */}
      <div className="mt-2 flex flex-wrap items-center gap-1">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={12}
              className="fill-amber-400 text-amber-400"
            />
          ))}
        </div>

        <span className="dashboard-heading text-xs font-semibold">
          {studySet.rating.toFixed(1)}
        </span>

        <span className="dashboard-muted text-[10px]">
          ({studySet.reviews.toLocaleString()} reviews)
        </span>
      </div>

      {/* STUDY MODES */}
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[var(--dashboard-border)] pt-3">
        <StudyAction
          label="Exam"
          icon={<Play size={13} fill="currentColor" />}
          href={getPracticeHref(studySet, "exam")}
          primary
          enabled={available}
        />

        <StudyAction
          label="Review"
          icon={<Eye size={14} />}
          href={getPracticeHref(studySet, "review")}
          enabled={available}
        />

        <StudyAction
          label="Tutor"
          icon={<BookOpen size={14} />}
          href={getPracticeHref(studySet, "tutor")}
          enabled={available}
        />
      </div>

      {!available && (
        <p className="mt-2 text-center text-[10px] font-medium text-amber-600">
          This study set will be available soon.
        </p>
      )}
    </article>
  );
}

/* =========================================================
   STUDY ACTION BUTTON
========================================================= */

interface StudyActionProps {
  label: string;
  icon: ReactNode;
  href: string;
  primary?: boolean;
  enabled: boolean;
}

function StudyAction({
  label,
  icon,
  href,
  primary = false,
  enabled,
}: StudyActionProps) {
  const baseStyles =
    "flex min-h-10 items-center justify-center gap-1.5 rounded-xl border px-2 text-[11px] font-bold transition-all duration-200";

  const primaryStyles =
    "border-[#5B3DF5] bg-[#5B3DF5] text-white shadow-[0_4px_12px_rgba(91,61,245,0.18)] hover:bg-[#4930D0] hover:shadow-md";

  const secondaryStyles =
    "dashboard-heading border-[var(--dashboard-border)] hover:border-[#5B3DF5] hover:bg-[#E8DEFF]/40 hover:text-[#5B3DF5]";

  const disabledStyles =
    "cursor-not-allowed border-[var(--dashboard-border)] opacity-40";

  const className = `${baseStyles} ${
    !enabled
      ? disabledStyles
      : primary
        ? primaryStyles
        : secondaryStyles
  }`;

  if (!enabled) {
    return (
      <button
        type="button"
        disabled
        className={className}
      >
        {icon}
        {label}
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={className}
    >
      {icon}
      {label}
      <ArrowRight size={11} className="hidden sm:block" />
    </Link>
  );
}