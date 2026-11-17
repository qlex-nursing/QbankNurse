"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
  Clock3,
  FileQuestion,
  Search,
  Sparkles,
  Star,
  Award,
  Target,
  TrendingUp,
  CalendarDays,
  Trash2,
} from "lucide-react";

import {
  getPracticeAttempts,
  type PracticeAttempt,
} from "@/lib/practice-attempts";

import {
  studyCategories,
} from "@/data/mock/dashboard/overview";

import {
  getPracticeSessions,
  removePracticeSession,
  type PracticeSession,
} from "@/lib/practice-sessions";

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
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [attempts, setAttempts] = useState<PracticeAttempt[]>([]);
  const [attemptsLoaded, setAttemptsLoaded] = useState(false);

  useEffect(() => {
    setAttempts(getPracticeAttempts());
    setSessions(getPracticeSessions());
    setAttemptsLoaded(true);
  }, []);

  const progressStats = useMemo(() => {
    const totalExams = attempts.length;

    const totalQuestions = attempts.reduce(
      (total, attempt) => total + attempt.totalQuestions,
      0,
    );

    const totalCorrect = attempts.reduce(
      (total, attempt) => total + attempt.correctAnswers,
      0,
    );

    const averageScore =
      totalExams > 0
        ? Math.round(
            attempts.reduce(
              (total, attempt) => total + attempt.percentage,
              0,
            ) / totalExams,
          )
        : 0;

    const bestScore =
      totalExams > 0
        ? Math.max(...attempts.map((attempt) => attempt.percentage))
        : 0;

    return {
      totalExams,
      totalQuestions,
      totalCorrect,
      averageScore,
      bestScore,
    };
  }, [attempts]);

  const latestAttempts = useMemo(
    () =>
      [...attempts]
        .sort(
          (a, b) =>
            new Date(b.completedAt).getTime() -
            new Date(a.completedAt).getTime(),
        )
        .slice(0, 3),
    [attempts],
  );

  const formatAttemptDate = (date: string) => {
    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "Unknown date";

    return parsed.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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

  const countAnsweredQuestions = (
    answers: Record<string, unknown>,
  ): number => {
    const isAnswered = (value: unknown): boolean => {
      if (typeof value === "string") {
        return value.trim().length > 0;
      }

      if (typeof value === "number") {
        return Number.isFinite(value);
      }

      if (Array.isArray(value)) {
        return value.length > 0;
      }

      if (value && typeof value === "object") {
        return Object.values(value).some(isAnswered);
      }

      return false;
    };

    return Object.values(answers).filter(isAnswered).length;
  };

  const discardSession = (subjectSlug: string) => {
    removePracticeSession(subjectSlug);

    setSessions((previous) =>
      previous.filter(
        (session) => session.subjectSlug !== subjectSlug,
      ),
    );
  };

  return (
    <main className="w-full pb-8">
      {/* SLIM DASHBOARD HERO */}
      <section className="relative isolate flex min-h-[185px] w-full items-center overflow-hidden bg-[#17263F] px-5 py-6 text-white sm:px-8 lg:px-11">
        {/* Subtle indigo lighting */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(91,61,245,0.22),transparent_55%)]" />

        <div className="pointer-events-none absolute -right-16 -top-28 h-64 w-64 rounded-full border border-white/[0.05]" />

        <div className="pointer-events-none absolute -right-4 -bottom-32 h-56 w-56 rounded-full border border-white/[0.04]" />

        <div className="relative z-10 w-full max-w-5xl">
          <span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#B9A9FF]">
            <Sparkles size={13} />
            Study Library
          </span>

          <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
            Everything you need{" "}
            <span className="text-[#B9A9FF]">
              to prepare with confidence.
            </span>
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-white/65">
            Explore nursing question banks, practise at your own pace,
            and understand the reasoning behind every answer.
          </p>

          <div className="mt-4 flex max-w-2xl flex-col gap-2.5 sm:flex-row">
            <label className="relative min-w-0 flex-1">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#77718C]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search study categories..."
                className="dashboard-banner-search h-10 w-full rounded-lg border px-11 pr-4 text-sm outline-none transition focus:ring-4 focus:ring-[#E8DEFF]/30"
              />
            </label>

            <a
              href="#study-categories"
              className="dashboard-banner-button inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-5 text-xs font-bold transition-all"
            >
              Explore library
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* DASHBOARD CONTENT */}
      <div className="dashboard-content mx-auto w-full max-w-[1600px] space-y-7 px-5 py-7 sm:px-7 lg:px-9">

        {/* MY STUDY PROGRESS */}
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="dashboard-heading text-lg font-extrabold sm:text-xl">
                My study progress
              </h2>

              <p className="dashboard-muted mt-1 text-xs">
                Your learning activity and practice performance at a glance.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/dashboard/my-library"
                className="dashboard-secondary-button inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-bold transition-all"
              >
                My Library
              </Link>

              <Link
                href="/dashboard/performance"
                className="dashboard-primary-button inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all"
              >
                View performance
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {!attemptsLoaded ? (
            <div className="dashboard-card rounded-xl border p-6 text-center">
              <p className="dashboard-muted text-sm">
                Loading your progress...
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

              {/* Exams completed */}
              <div className="dashboard-card rounded-xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="dashboard-muted text-xs font-semibold">
                    Exams completed
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Award size={18} />
                  </span>
                </div>

                <p className="dashboard-heading mt-3 text-2xl font-extrabold">
                  {progressStats.totalExams}
                </p>

                <p className="dashboard-muted mt-1 text-[11px]">
                  Completed practice attempts
                </p>
              </div>

              {/* Questions practiced */}
              <div className="dashboard-card rounded-xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="dashboard-muted text-xs font-semibold">
                    Questions practiced
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <BookOpen size={18} />
                  </span>
                </div>

                <p className="dashboard-heading mt-3 text-2xl font-extrabold">
                  {progressStats.totalQuestions.toLocaleString()}
                </p>

                <p className="dashboard-muted mt-1 text-[11px]">
                  {progressStats.totalCorrect.toLocaleString()} correct answers
                </p>
              </div>

              {/* Average score */}
              <div className="dashboard-card rounded-xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="dashboard-muted text-xs font-semibold">
                    Average score
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                    <Target size={18} />
                  </span>
                </div>

                <p className="dashboard-heading mt-3 text-2xl font-extrabold">
                  {progressStats.averageScore}%
                </p>

                <p className="dashboard-muted mt-1 text-[11px]">
                  Across all completed attempts
                </p>
              </div>

              {/* Best score */}
              <div className="dashboard-card rounded-xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="dashboard-muted text-xs font-semibold">
                    Personal best
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <TrendingUp size={18} />
                  </span>
                </div>

                <p className="dashboard-heading mt-3 text-2xl font-extrabold">
                  {progressStats.bestScore}%
                </p>

                <p className="dashboard-muted mt-1 text-[11px]">
                  Your highest practice score
                </p>
              </div>

            </div>
          )}
        </section>

        {/* RECENT PRACTICE ATTEMPTS */}
        <section className="dashboard-card rounded-xl border p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="dashboard-heading text-base font-extrabold">
                Recent practice attempts
              </h2>

              <p className="dashboard-muted mt-1 text-xs">
                Your latest completed practice exams.
              </p>
            </div>

            <Link
              href="/dashboard/performance"
              className="dashboard-primary-button inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold"
            >
              View all
              <ArrowRight size={14} />
            </Link>
          </div>

          {!attemptsLoaded ? (
            <p className="dashboard-muted py-5 text-center text-sm">
              Loading practice history...
            </p>
          ) : latestAttempts.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <FileQuestion
                size={25}
                className="dashboard-muted mx-auto"
              />

              <p className="dashboard-body mt-2 text-sm font-bold">
                No completed practice exams yet
              </p>

              <p className="dashboard-muted mt-1 text-xs">
                Your completed exams will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {latestAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="dashboard-list-row flex flex-col gap-3 rounded-lg px-3 py-3 transition-colors sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="dashboard-soft-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                      <BookOpen size={17} />
                    </span>

                    <div className="min-w-0">
                      <p className="dashboard-body truncate text-sm font-semibold">
                        {attempt.subject}
                      </p>

                      <p className="dashboard-muted mt-1 flex flex-wrap items-center gap-2 text-[10px]">
                        <span>{attempt.examType}</span>

                        <span>·</span>

                        <span className="inline-flex items-center gap-1">
                          <CalendarDays size={11} />
                          {formatAttemptDate(attempt.completedAt)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <span className="dashboard-muted text-xs">
                      {attempt.correctAnswers}/{attempt.totalQuestions} correct
                    </span>

                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-extrabold ${
                        attempt.percentage >= 80
                          ? "bg-emerald-50 text-emerald-600"
                          : attempt.percentage >= 60
                            ? "bg-amber-50 text-amber-600"
                            : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {attempt.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CONTINUE WHERE YOU LEFT OFF */}
        <section className="dashboard-card rounded-xl border p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="dashboard-icon-red flex h-9 w-9 items-center justify-center rounded-lg">
                <Clock3 size={18} />
              </span>

              <div>
                <h2 className="dashboard-heading text-base font-extrabold">
                  Continue where you left off
                </h2>

                <p className="dashboard-muted mt-1 text-xs">
                  Resume your unfinished practice sessions.
                </p>
              </div>
            </div>

            <span className="dashboard-demo-badge rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide">
              {sessions.length} saved {sessions.length === 1 ? "session" : "sessions"}
            </span>
          </div>

          {!attemptsLoaded ? (
            <div className="py-6 text-center">
              <p className="dashboard-muted text-sm">
                Loading saved sessions...
              </p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <BookOpen
                size={26}
                className="dashboard-muted mx-auto"
              />

              <p className="dashboard-body mt-2 text-sm font-bold">
                No unfinished sessions
              </p>

              <p className="dashboard-muted mt-1 text-xs">
                When you leave a practice exam unfinished, you can resume it here.
              </p>

              <Link
                href="/dashboard/study-library"
                className="dashboard-primary-button mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold"
              >
                Explore study library
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {sessions.map((session) => {
                const answered = countAnsweredQuestions(session.answers);
                const totalQuestions = session.totalQuestions ?? 0;

                const progress =
                  totalQuestions > 0
                    ? Math.min(
                        Math.round((answered / totalQuestions) * 100),
                        100,
                      )
                    : 0;

                const remaining = Math.max(totalQuestions - answered, 0);

                const lastSaved = new Date(session.updatedAt);

                const formattedDate = Number.isNaN(lastSaved.getTime())
                  ? "Recently saved"
                  : lastSaved.toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    });

                const resumeUrl = `/dashboard/exams/ati/${encodeURIComponent(
                  session.subjectSlug,
                )}/practice`;

                return (
                  <div
                    key={session.subjectSlug}
                    className="dashboard-inner-card rounded-xl border p-4 transition-all hover:border-indigo-200 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="dashboard-soft-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                          <FileQuestion size={17} />
                        </span>

                        <div className="min-w-0">
                          <h3 className="dashboard-body truncate text-sm font-bold capitalize">
                            {session.subjectSlug.replaceAll("-", " ")}
                          </h3>

                          <p className="dashboard-muted mt-1 text-[10px]">
                            ATI practice exam
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => discardSession(session.subjectSlug)}
                        title="Discard saved session"
                        aria-label={`Discard ${session.subjectSlug} session`}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-slate-50 p-2.5">
                        <p className="dashboard-muted text-[9px] font-semibold uppercase">
                          Questions answered
                        </p>

                        <p className="dashboard-heading mt-1 text-base font-extrabold">
                          {answered}/{totalQuestions || "—"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-slate-50 p-2.5">
                        <p className="dashboard-muted text-[9px] font-semibold uppercase">
                          Time remaining
                        </p>

                        <p className="dashboard-heading mt-1 text-base font-extrabold">
                          {Math.floor(session.timeRemaining / 60)}m{" "}
                          {session.timeRemaining % 60}s
                        </p>
                      </div>
                    </div>

                    {/* SESSION COMPLETION */}
                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="dashboard-muted text-[11px] font-semibold">
                          Completion progress
                        </span>

                        <span className="dashboard-heading text-xs font-extrabold">
                          {totalQuestions > 0 ? `${progress}%` : "Unavailable"}
                        </span>
                      </div>

                      <div className="dashboard-progress-track h-1.5 overflow-hidden rounded-full">
                        <div
                          className="dashboard-progress-fill h-full rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <p className="dashboard-muted mt-2 text-[10px]">
                        {totalQuestions > 0
                          ? `${remaining} questions remaining`
                          : "Progress information unavailable"}
                      </p>

                      {/* RESUME PRACTICE BUTTON */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <span className="dashboard-muted text-[10px]">
                          Last saved: {formattedDate}
                        </span>

                        <Link
                          href={resumeUrl}
                          className="dashboard-primary-button inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all hover:-translate-y-0.5"
                        >
                          Resume Practice
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* STUDY CATEGORIES */}
        <section id="study-categories" className="scroll-mt-28">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="dashboard-section-label text-[10px] font-extrabold uppercase tracking-[0.18em]">
                Find your next study set
              </span>

              <h2 className="dashboard-heading mt-1.5 text-xl font-extrabold sm:text-2xl">
                Explore popular study categories
              </h2>

              <p className="dashboard-muted mt-1.5 max-w-xl text-xs leading-5 sm:text-sm">
                Choose a nursing subject and discover practice questions
                designed to strengthen your understanding.
              </p>
            </div>

            <span className="dashboard-count-badge rounded-full px-3 py-1.5 text-[10px] font-bold">
              {filteredCategories.length} categories
            </span>
          </div>

          {filteredCategories.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredCategories.map((category) => {
                const accent = accentStyles[category.accent];

                return (
                  <article
                    key={category.id}
                    className={`dashboard-category-card group flex min-h-[205px] h-full flex-col rounded-xl border p-4 shadow-[0_3px_12px_rgba(45,27,104,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(45,27,104,0.07)] ${accent.border}`}
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

                    <h3 className="dashboard-card-title mt-3 text-sm font-extrabold transition-colors group-hover:text-[#5B3DF5]">
                      {category.title}
                    </h3>

                    <div className="dashboard-muted mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px]">
                      <span className="inline-flex items-center gap-1 font-bold text-[#D58A42]">
                        <Star size={11} fill="currentColor" />
                        {category.rating.toFixed(1)}
                      </span>

                      <span>
                        ({category.reviews.toLocaleString()} reviews)
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <FileQuestion size={11} />
                        Question bank
                      </span>
                    </div>

                    <p className="dashboard-card-description mt-2.5 flex-1 text-xs leading-5">
                      {category.description}
                    </p>

                    <Link
                      href={`/dashboard/exams/ati/${category.title
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                      className="dashboard-primary-button mt-3 inline-flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-xs font-bold transition-all"
                    >
                      Browse sets
                      <ArrowRight size={14} />
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="dashboard-card rounded-xl border border-dashed px-5 py-10 text-center">
              <Search
                size={24}
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
    </main>
  );
}