"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
import type { ReactNode } from "react";

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

  return (
    <main className="dashboard-content mx-auto w-full max-w-[1600px] space-y-8 px-5 py-7 sm:px-7 lg:px-9">

      {/* PAGE HEADER */}
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="dashboard-accent-icon">
            <BookOpen size={18} />
          </div>

          <span className="dashboard-section-label">
            LEARNING RESOURCES
          </span>
        </div>

        <h1 className="dashboard-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
          Study Library
        </h1>

        <p className="dashboard-muted text-sm sm:text-base">
          {studySets.length} study sets ·{" "}
          {totalQuestions.toLocaleString()} available questions
        </p>
      </section>

      {/* SEARCH AND FILTERS */}
      <section className="space-y-4">

        {/* SEARCH */}
        <div className="dashboard-search flex min-h-12 items-center gap-3 rounded-xl px-4">
          <Search
            size={19}
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
              <X size={18} />
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
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all duration-200 ${
                  active
                    ? "border-[#5B3DF5] bg-[#5B3DF5] text-white shadow-[0_4px_14px_rgba(91,61,245,0.2)]"
                    : "dashboard-card dashboard-heading border-[var(--dashboard-border)] hover:border-[#5B3DF5] hover:text-[#5B3DF5]"
                }`}
              >
                {index === 0 && (
                  <SlidersHorizontal size={15} />
                )}

                {filter}
              </button>
            );
          })}
        </div>
      </section>

      {/* STUDY SET LISTING */}
      <section className="space-y-5 border-t border-[var(--dashboard-border)] pt-6">

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="dashboard-heading text-xl font-bold">
              Explore study sets
            </h2>

            <p className="dashboard-muted mt-1 text-sm">
              Choose a study set and select your preferred learning mode.
            </p>
          </div>

          <span className="dashboard-count-badge">
            {filteredStudySets.length}{" "}
            {filteredStudySets.length === 1 ? "study set" : "study sets"}
          </span>
        </div>

        {filteredStudySets.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredStudySets.map((set) => (
              <StudySetCard
                key={set.id}
                studySet={set}
                getPracticeHref={getPracticeHref}
              />
            ))}
          </div>
        ) : (
          <div className="dashboard-card flex flex-col items-center justify-center rounded-2xl px-5 py-16 text-center">

            <div className="dashboard-accent-icon mb-4">
              <Search size={24} />
            </div>

            <h3 className="dashboard-heading text-lg font-bold">
              No study sets found
            </h3>

            <p className="dashboard-muted mt-2 max-w-sm text-sm leading-6">
              We couldn't find a study set matching your search.
              Try another keyword or clear your filters.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedFilter("All");
              }}
              className="dashboard-primary-button mt-5 rounded-xl px-5 py-2.5 text-sm font-semibold"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* LIBRARY INFORMATION */}
      <section className="dashboard-inner-card flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center">

        <div className="dashboard-accent-icon shrink-0">
          <Sparkles size={20} />
        </div>

        <div>
          <h3 className="dashboard-heading text-sm font-bold">
            Keep building your nursing knowledge
          </h3>

          <p className="dashboard-muted mt-1 text-sm leading-6">
            Explore examination resources, practise clinical questions
            and strengthen your understanding through guided learning.
          </p>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   STUDY SET CARD
========================================================= */

interface StudySetCardProps {
  studySet: StudySet;

  getPracticeHref: (
    set: StudySet,
    mode: "exam" | "review" | "tutor",
  ) => string;
}

function StudySetCard({
  studySet,
  getPracticeHref,
}: StudySetCardProps) {
  const available = studySet.status === "available";

  return (
    <article className="dashboard-card group flex min-h-[285px] flex-col rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(91,61,245,0.09)]">

      {/* PROGRAMME BADGE */}
      <div className="flex items-center justify-between gap-3">

        <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#5B3DF5]/10 bg-[#E8DEFF]/60 px-3 py-1.5 text-[10px] font-bold text-[#4931B5]">
          <GraduationCap size={13} />
          {studySet.programme}
        </span>

        <button
          type="button"
          title="Study set information"
          aria-label={`More information about ${studySet.title}`}
          className="dashboard-muted rounded-lg p-1.5 transition hover:bg-[#E8DEFF] hover:text-[#5B3DF5]"
        >
          <MoreHorizontal size={19} />
        </button>
      </div>

      {/* TITLE AND DESCRIPTION */}
      <div className="mt-4 flex-1">

        <h3 className="dashboard-heading text-base font-bold leading-snug transition-colors group-hover:text-[#5B3DF5]">
          {studySet.title}
        </h3>

        <p className="dashboard-muted mt-2 line-clamp-2 text-xs leading-5">
          {studySet.description}
        </p>
      </div>

      {/* QUESTION COUNT */}
      <div className="mt-4 flex items-center gap-2">
        <FileText
          size={15}
          className="dashboard-muted shrink-0"
        />

        <span className="dashboard-muted text-xs font-medium">
          {available
            ? `${studySet.questionCount} questions`
            : "Question bank coming soon"}
        </span>
      </div>

      {/* RATINGS */}
      <div className="mt-3 flex flex-wrap items-center gap-1">

        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={13}
              className="fill-amber-400 text-amber-400"
            />
          ))}
        </div>

        <span className="dashboard-heading text-xs font-semibold">
          {studySet.rating.toFixed(1)}
        </span>

        <span className="dashboard-muted text-[11px]">
          ({studySet.reviews.toLocaleString()} reviews)
        </span>
      </div>

      {/* STUDY MODES */}
      <div className="mt-5 grid grid-cols-3 gap-2">

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
        <p className="mt-3 text-center text-[11px] font-medium text-amber-600">
          Coming soon
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
    </Link>
  );
}