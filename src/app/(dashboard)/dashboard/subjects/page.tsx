"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  GraduationCap,
  Layers3,
  Play,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
} from "lucide-react";

import { studyCategories } from "@/data/mock/dashboard/overview";
import { practiceQuestions } from "@/data/mock/dashboard/practice-questions";
import {
  getSavedItems,
  toggleSavedItem,
  subscribeToSavedItems,
} from "@/lib/saved-items";

type SubjectFilter = "all" | "available" | "coming-soon";

function getSubjectSlug(title: string) {
  return title.toLowerCase().replaceAll(" ", "-");
}

function getSubjectPracticeCount(slug: string) {
  return (
    practiceQuestions[slug as keyof typeof practiceQuestions]?.length ?? 0
  );
}

export default function SubjectsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<SubjectFilter>("all");
  const [savedSubjectIds, setSavedSubjectIds] = useState<string[]>([]);

  useEffect(() => {
    const syncSavedSubjects = () => {
      const saved = getSavedItems()
        .filter((item) => item.type === "study-topic")
        .map((item) => item.id);

      setSavedSubjectIds(saved);
    };

    syncSavedSubjects();

    return subscribeToSavedItems(syncSavedSubjects);
  }, []);

  const subjects = useMemo(() => {
    return studyCategories.map((subject) => {
      const slug = getSubjectSlug(subject.title);
      const practiceCount = getSubjectPracticeCount(slug);

      return {
        ...subject,
        slug,
        practiceCount,
        available: practiceCount > 0,
      };
    });
  }, []);

  const filteredSubjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return subjects.filter((subject) => {
      const matchesSearch =
        !query ||
        subject.title.toLowerCase().includes(query) ||
        subject.description.toLowerCase().includes(query) ||
        subject.program.toLowerCase().includes(query);

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

  const handleBookmark = (subject: (typeof subjects)[number]) => {
    toggleSavedItem({
      id: String(subject.id),
      type: "study-topic",
      title: subject.title,
      description: subject.description,
      href: `/dashboard/exams/ati/${subject.slug}`,
      metadata: {
        program: subject.program,
        subjectId: String(subject.id),
      },
    });

    const updatedSavedIds = getSavedItems()
      .filter((item) => item.type === "study-topic")
      .map((item) => item.id);

    setSavedSubjectIds(updatedSavedIds);
  };

  const clearFilters = () => {
    setSearch("");
    setFilter("all");
  };

  return (
    <div className="dashboard-content mx-auto w-full min-w-0 max-w-[1500px] space-y-6 px-5 pb-8 pt-6 sm:px-7 lg:px-9">

      {/* HERO */}
      <section className="relative isolate min-h-[165px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#17263F] via-[#202C50] to-[#30245F] px-5 py-6 sm:px-8 lg:px-11">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-16 -top-28 h-72 w-72 rounded-full border border-white/[0.06]" />
          <div className="absolute -right-8 -top-20 h-56 w-56 rounded-full border border-white/[0.08]" />
          <div className="absolute right-16 top-10 h-32 w-32 rounded-full bg-[#8B5CF6]/15 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-[#5B3DF5]/10 blur-3xl" />
        </div>

        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#B9A9FF]">
              <GraduationCap size={15} />
              Your learning library
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Explore All Subjects
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
              Explore nursing subjects, discover important study topics,
              and build your confidence one subject at a time.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B9A9FF]/15 text-[#B9A9FF]">
              <BookOpen size={20} />
            </div>

            <div>
              <p className="text-xs font-semibold text-white/60">
                Your subject library
              </p>
              <p className="mt-1 text-sm font-bold text-white">
                {subjects.length} subjects to explore
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OVERVIEW STATS */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={<Layers3 size={21} />}
          label="Total subjects"
          value={subjects.length.toString()}
          detail="Across your learning catalogue"
          iconClass="bg-[#E8DEFF] text-[#5B3DF5]"
        />

        <SummaryCard
          icon={<CheckCircle2 size={21} />}
          label="Available for practice"
          value={availableCount.toString()}
          detail="Subjects with practice questions"
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <SummaryCard
          icon={<BookOpen size={21} />}
          label="Catalogue questions"
          value={totalQuestions.toLocaleString()}
          detail="Questions across all subjects"
          iconClass="bg-blue-50 text-blue-600"
        />
      </section>

      {/* SEARCH AND FILTERS */}
      <section className="dashboard-card rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative w-full lg:max-w-md">
            <Search
              size={17}
              className="dashboard-muted absolute left-4 top-1/2 -translate-y-1/2"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search nursing subjects..."
              className="dashboard-input min-h-12 w-full rounded-xl pl-11 pr-4 text-sm outline-none transition focus:border-[#5B3DF5]"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="dashboard-muted mr-1 inline-flex items-center gap-2 text-xs font-semibold">
              <SlidersHorizontal size={15} />
              Filter
            </span>

            {[
              { value: "all", label: "All subjects" },
              { value: "available", label: "Available" },
              { value: "coming-soon", label: "Coming soon" },
            ].map((option) => {
              const active = filter === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setFilter(option.value as SubjectFilter)
                  }
                  className={`rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
                    active
                      ? "border-[#5B3DF5] bg-[#5B3DF5] text-white shadow-sm"
                      : "dashboard-heading border-[var(--dash-border)] hover:border-[#5B3DF5] hover:text-[#5B3DF5]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* RESULTS INFORMATION */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--dash-border)] pt-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="dashboard-heading text-lg font-bold">
                Nursing Subjects
              </h2>

              <span className="dashboard-count-badge">
                {filteredSubjects.length}
              </span>
            </div>

            <p className="dashboard-muted mt-1 text-xs">
              Showing {filteredSubjects.length} of {subjects.length} subjects
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-[#E8DEFF]/50 px-3 py-2">
            <BookmarkCheck size={14} className="text-[#5B3DF5]" />

            <span className="text-xs font-semibold text-[#5B3DF5]">
              {savedSubjectIds.length} saved topics
            </span>
          </div>
        </div>
      </section>

      {/* SUBJECT GRID */}
      {filteredSubjects.length > 0 ? (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredSubjects.map((subject) => {
            const isSaved = savedSubjectIds.includes(
              String(subject.id),
            );

            return (
              <article
                key={subject.id}
                className="dashboard-card group flex min-h-[290px] flex-col rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(91,61,245,0.09)]"
              >
                {/* CARD HEADER */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8DEFF] text-[#5B3DF5] transition group-hover:bg-[#5B3DF5] group-hover:text-white">
                    <BookOpen size={22} />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBookmark(subject)}
                    aria-label={
                      isSaved
                        ? `Remove ${subject.title} from My Library`
                        : `Save ${subject.title} to My Library`
                    }
                    title={
                      isSaved
                        ? "Remove from My Library"
                        : "Save to My Library"
                    }
                    className={`rounded-xl p-2.5 transition ${
                      isSaved
                        ? "bg-[#E8DEFF] text-[#5B3DF5]"
                        : "dashboard-muted hover:bg-[#E8DEFF] hover:text-[#5B3DF5]"
                    }`}
                  >
                    {isSaved ? (
                      <BookmarkCheck size={19} />
                    ) : (
                      <Bookmark size={19} />
                    )}
                  </button>
                </div>

                {/* SUBJECT INFORMATION */}
                <div className="mt-5 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-lg border border-[#5B3DF5]/10 bg-[#E8DEFF]/60 px-2.5 py-1 text-[10px] font-bold text-[#4931B5]">
                      {subject.program}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-bold ${
                        subject.available
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          subject.available
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        }`}
                      />

                      {subject.available
                        ? "Practice available"
                        : "Coming soon"}
                    </span>
                  </div>

                  <h3 className="dashboard-heading text-lg font-bold leading-snug transition-colors group-hover:text-[#5B3DF5]">
                    {subject.title}
                  </h3>

                  <p className="dashboard-muted mt-2 line-clamp-2 text-xs leading-6">
                    {subject.description}
                  </p>

                  {/* SUBJECT STATS */}
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex items-center gap-1.5">
                      <BookOpen
                        size={14}
                        className="dashboard-muted"
                      />

                      <span className="dashboard-heading text-xs font-semibold">
                        {subject.questions.toLocaleString()}
                      </span>

                      <span className="dashboard-muted text-[11px]">
                        catalogue
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Star
                        size={13}
                        className="fill-amber-400 text-amber-400"
                      />

                      <span className="dashboard-heading text-xs font-semibold">
                        {subject.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <p className="dashboard-muted mt-2 text-[11px]">
                    {subject.practiceCount > 0
                      ? `${subject.practiceCount} practice questions currently available`
                      : "Practice question bank is being prepared"}
                  </p>
                </div>

                {/* CARD ACTIONS */}
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Link
                    href={`/dashboard/exams/ati/${subject.slug}`}
                    className="dashboard-heading flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--dash-border)] px-3 text-xs font-bold transition hover:border-[#5B3DF5] hover:bg-[#E8DEFF]/40 hover:text-[#5B3DF5]"
                  >
                    Explore
                    <ArrowRight size={14} />
                  </Link>

                  {subject.available ? (
                    <Link
                      href={`/dashboard/exams/ati/${subject.slug}/practice`}
                      className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#5B3DF5] px-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#4930D0]"
                    >
                      <Play size={14} fill="currentColor" />
                      Practise
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[var(--dash-border)] px-3 text-xs font-bold opacity-45"
                    >
                      <Play size={14} />
                      Coming soon
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        /* EMPTY STATE */
        <section className="dashboard-card flex flex-col items-center justify-center rounded-2xl px-5 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8DEFF] text-[#5B3DF5]">
            <Search size={25} />
          </div>

          <h3 className="dashboard-heading mt-5 text-lg font-bold">
            No subjects found
          </h3>

          <p className="dashboard-muted mt-2 max-w-sm text-sm leading-6">
            We couldn't find any subjects matching your search.
            Try a different search term or change your filters.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-xl bg-[#5B3DF5] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#4930D0]"
          >
            Clear filters
          </button>
        </section>
      )}

      {/* BOTTOM INFORMATION */}
      <section className="relative overflow-hidden rounded-2xl border border-[#5B3DF5]/15 bg-[#E8DEFF]/30 p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border border-[#5B3DF5]/10" />

        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#5B3DF5]">
            <Sparkles size={21} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#392576]">
              Build your nursing knowledge
            </h3>

            <p className="mt-1 text-xs leading-6 text-[#62558A]">
              Save subjects to your personal library and return to
              important topics whenever you need them. More practice
              question banks will become available as the platform grows.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  detail,
  iconClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  iconClass: string;
}) {
  return (
    <div className="dashboard-card rounded-2xl p-5 transition hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="dashboard-muted text-xs font-medium">
            {label}
          </p>

          <p className="dashboard-heading mt-1 text-xl font-extrabold">
            {value}
          </p>
        </div>
      </div>

      <p className="dashboard-muted mt-4 text-[10px]">
        {detail}
      </p>
    </div>
  );
}