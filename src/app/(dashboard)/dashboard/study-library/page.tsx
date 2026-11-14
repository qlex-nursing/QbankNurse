"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Filter,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
} from "lucide-react";

import { studyCategories } from "@/data/mock/dashboard/overview";

type SortOption = "popular" | "questions" | "rating" | "alphabetical";

const accentStyles = {
  red: {
    icon: "bg-rose-100 text-rose-600",
    badge: "bg-rose-50 text-rose-700",
  },
  indigo: {
    icon: "bg-violet-100 text-violet-600",
    badge: "bg-violet-50 text-violet-700",
  },
  apricot: {
    icon: "bg-orange-100 text-orange-600",
    badge: "bg-orange-50 text-orange-700",
  },
  green: {
    icon: "bg-emerald-100 text-emerald-600",
    badge: "bg-emerald-50 text-emerald-700",
  },
};

export default function StudyLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("All programs");
  const [sortBy, setSortBy] = useState<SortOption>("popular");

  const programs = useMemo(
    () => [
      "All programs",
      ...Array.from(
        new Set(studyCategories.map((category) => category.program)),
      ),
    ],
    [],
  );

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = studyCategories.filter((category) => {
      const matchesSearch =
        category.title.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query) ||
        category.program.toLowerCase().includes(query);

      const matchesProgram =
        selectedProgram === "All programs" ||
        category.program === selectedProgram;

      return matchesSearch && matchesProgram;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "questions":
          return b.questions - a.questions;

        case "rating":
          return b.rating - a.rating;

        case "alphabetical":
          return a.title.localeCompare(b.title);

        case "popular":
        default:
          return b.reviews - a.reviews;
      }
    });
  }, [searchQuery, selectedProgram, sortBy]);

  const totalQuestions = studyCategories.reduce(
    (total, category) => total + category.questions,
    0,
  );

  return (
    <div className="dashboard-content space-y-8">
      {/* Page heading */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="dashboard-accent-icon">
            <BookOpen size={17} />
          </div>

          <span className="dashboard-section-label">
            YOUR LEARNING LIBRARY
          </span>
        </div>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="dashboard-heading text-2xl font-bold md:text-3xl">
              Study Library
            </h1>

            <p className="dashboard-muted mt-2 max-w-2xl text-sm leading-6">
              Explore nursing subjects, practise questions and strengthen your
              understanding one topic at a time.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="dashboard-muted">Library</span>
            <span className="dashboard-muted">/</span>
            <span className="dashboard-heading font-semibold">
              Study Library
            </span>
          </div>
        </div>
      </section>

      {/* Library overview */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="dashboard-card flex items-center gap-4 rounded-2xl p-5">
          <div className="dashboard-accent-icon">
            <BookOpen size={21} />
          </div>

          <div>
            <p className="dashboard-muted text-sm">Study categories</p>
            <h3 className="dashboard-heading mt-1 text-2xl font-bold">
              {studyCategories.length}
            </h3>
          </div>
        </div>

        <div className="dashboard-card flex items-center gap-4 rounded-2xl p-5">
          <div className="dashboard-accent-icon">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <p className="dashboard-muted text-sm">Available questions</p>
            <h3 className="dashboard-heading mt-1 text-2xl font-bold">
              {totalQuestions.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="dashboard-card flex items-center gap-4 rounded-2xl p-5 sm:col-span-2 xl:col-span-1">
          <div className="dashboard-accent-icon">
            <Sparkles size={21} />
          </div>

          <div>
            <p className="dashboard-muted text-sm">Available program</p>
            <h3 className="dashboard-heading mt-1 text-xl font-bold">
              RN ATI
            </h3>
          </div>
        </div>
      </section>

      {/* Search and filters */}
      <section className="dashboard-card space-y-5 rounded-2xl p-5">
        <div>
          <h2 className="dashboard-heading text-lg font-bold">
            Find your next study topic
          </h2>

          <p className="dashboard-muted mt-1 text-sm">
            Search through the available nursing categories.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="dashboard-search flex min-h-12 flex-1 items-center gap-3 rounded-xl px-4">
            <Search size={19} className="dashboard-muted shrink-0" />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search subjects, topics or programs..."
              className="dashboard-heading w-full bg-transparent text-sm outline-none placeholder:opacity-60"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="dashboard-muted text-xs hover:opacity-70"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Filter
                size={16}
                className="dashboard-muted pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
              />

              <select
                value={selectedProgram}
                onChange={(event) => setSelectedProgram(event.target.value)}
                className="dashboard-search h-12 w-full appearance-none rounded-xl pl-10 pr-10 text-sm outline-none sm:min-w-44"
              >
                {programs.map((program) => (
                  <option key={program} value={program}>
                    {program}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                className="dashboard-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
              />
            </div>

            <div className="relative">
              <SlidersHorizontal
                size={16}
                className="dashboard-muted pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
              />

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as SortOption)
                }
                className="dashboard-search h-12 w-full appearance-none rounded-xl pl-10 pr-10 text-sm outline-none sm:min-w-44"
              >
                <option value="popular">Most popular</option>
                <option value="questions">Most questions</option>
                <option value="rating">Highest rated</option>
                <option value="alphabetical">A - Z</option>
              </select>

              <ChevronDown
                size={15}
                className="dashboard-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category listing */}
      <section className="space-y-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="dashboard-heading text-xl font-bold">
              Explore nursing categories
            </h2>

            <p className="dashboard-muted mt-1 text-sm">
              Choose a subject to explore its practice questions.
            </p>
          </div>

          <span className="dashboard-count-badge w-fit">
            {filteredCategories.length}{" "}
            {filteredCategories.length === 1 ? "category" : "categories"}
          </span>
        </div>

        {filteredCategories.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCategories.map((category) => {
              const styles = accentStyles[category.accent];

              const categorySlug = category.title
                .toLowerCase()
                .replaceAll(" ", "-");

              return (
                <article
                  key={category.id}
                  className="dashboard-card group flex flex-col rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.icon}`}
                    >
                      <BookOpen size={22} />
                    </div>

                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles.badge}`}>
                      {category.program}
                    </span>
                  </div>

                  <div className="mt-5 flex-1">
                    <h3 className="dashboard-card-title text-lg font-bold">
                      {category.title}
                    </h3>

                    <p className="dashboard-card-description mt-2 min-h-12 text-sm leading-6">
                      {category.description}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-[var(--dashboard-border)] pt-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <div className="flex items-center gap-1.5">
                        <BookOpen
                          size={15}
                          className="dashboard-muted"
                        />

                        <span className="dashboard-muted text-xs font-medium">
                          {category.questions.toLocaleString()} questions
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Star
                          size={14}
                          className="fill-amber-400 text-amber-400"
                        />

                        <span className="dashboard-heading text-xs font-semibold">
                          {category.rating.toFixed(1)}
                        </span>

                        <span className="dashboard-muted text-xs">
                          ({category.reviews.toLocaleString()})
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/exams/ati/${categorySlug}`}
                    className="dashboard-primary-button mt-5 flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-transform group-hover:gap-3"
                  >
                    Explore category
                    <ArrowRight size={16} />
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="dashboard-card flex flex-col items-center justify-center rounded-2xl px-5 py-16 text-center">
            <div className="dashboard-accent-icon mb-4">
              <Search size={24} />
            </div>

            <h3 className="dashboard-heading text-lg font-bold">
              No categories found
            </h3>

            <p className="dashboard-muted mt-2 max-w-sm text-sm leading-6">
              We couldn't find a category matching your search. Try another
              subject or clear your filters.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedProgram("All programs");
              }}
              className="dashboard-primary-button mt-5 rounded-xl px-5 py-2.5 text-sm font-semibold"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* Demo notice */}
      <section className="dashboard-inner-card flex flex-col gap-3 rounded-2xl p-5 sm:flex-row sm:items-center">
        <div className="dashboard-accent-icon shrink-0">
          <Sparkles size={19} />
        </div>

        <div>
          <h3 className="dashboard-heading text-sm font-bold">
            Study Library Preview
          </h3>

          <p className="dashboard-muted mt-1 text-sm leading-6">
            This library currently uses demonstration content. Live question
            sets and learning progress will be connected when the backend
            integration is available.
          </p>
        </div>
      </section>
    </div>
  );
}