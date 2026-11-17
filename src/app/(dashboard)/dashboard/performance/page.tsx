"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  Activity,
  Award,
  BookOpen,
  CalendarDays,
  ChartColumnIncreasing,
  Clock3,
  Flame,
  Target,
  TrendingUp,
  Trophy,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import {
  getPracticeAttempts,
  type PracticeAttempt,
} from "@/lib/practice-attempts";

export default function PerformancePage() {
  const [attempts, setAttempts] = useState<PracticeAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAttempts(getPracticeAttempts());
    setIsLoading(false);
  }, []);

  const stats = useMemo(() => {
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

  const subjectPerformance = useMemo(() => {
    const subjects = new Map<
      string,
      { total: number; count: number; best: number }
    >();

    attempts.forEach((attempt) => {
      const existing = subjects.get(attempt.subject) ?? {
        total: 0,
        count: 0,
        best: 0,
      };

      existing.total += attempt.percentage;
      existing.count += 1;
      existing.best = Math.max(existing.best, attempt.percentage);

      subjects.set(attempt.subject, existing);
    });

    return Array.from(subjects.entries())
      .map(([subject, data]) => ({
        subject,
        average: Math.round(data.total / data.count),
        best: data.best,
        attempts: data.count,
      }))
      .sort((a, b) => b.average - a.average);
  }, [attempts]);

  const recentAttempts = useMemo(
    () =>
      [...attempts].sort(
        (a, b) =>
          new Date(b.completedAt).getTime() -
          new Date(a.completedAt).getTime(),
      ),
    [attempts],
  );

  const chartAttempts = useMemo(
    () => [...recentAttempts].slice(0, 7).reverse(),
    [recentAttempts],
  );

  const formatDate = (date: string) => {
    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "Unknown date";

    return parsed.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}m ${remainingSeconds}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-rose-500";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Excellent performance";
    if (score >= 80) return "Great progress";
    if (score >= 60) return "Room to improve";
    return "Keep practicing";
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <main className="w-full pb-8">
      {/* SLIM PERFORMANCE HERO */}
      <section className="relative isolate flex min-h-[175px] w-full items-center overflow-hidden bg-[#17263F] px-5 py-6 text-white sm:px-8 lg:px-11">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(91,61,245,0.22),transparent_55%)]" />

        <div className="pointer-events-none absolute -right-16 -top-28 h-64 w-64 rounded-full border border-white/[0.05]" />

        <div className="pointer-events-none absolute -right-4 -bottom-32 h-56 w-56 rounded-full border border-white/[0.04]" />

        <div className="relative z-10 w-full max-w-4xl">
          <span className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.2em] text-[#B9A9FF]">
            <Activity size={13} />
            YOUR LEARNING JOURNEY
          </span>

          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Your Performance
            <span className="text-[#B9A9FF]"> overview</span>
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-white/65">
            Track your progress, discover your strengths and identify where
            to focus next.
          </p>

          <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-white/65">
            <CalendarDays size={13} className="text-[#B9A9FF]" />
            All-time performance overview
          </div>
        </div>
      </section>

      {/* PAGE CONTENT */}
      <div className="dashboard-content mx-auto w-full max-w-[1600px] space-y-7 px-5 py-7 sm:px-7 lg:px-9">
        {attempts.length === 0 ? (
          /* EMPTY STATE */
          <section className="dashboard-card mx-auto max-w-3xl rounded-xl border border-dashed px-6 py-12 text-center">
            <div className="dashboard-accent-icon mx-auto flex h-12 w-12 items-center justify-center rounded-xl">
              <ChartColumnIncreasing size={23} />
            </div>

            <h2 className="dashboard-heading mt-4 text-xl font-extrabold">
              Your journey starts here
            </h2>

            <p className="dashboard-muted mx-auto mt-2 max-w-md text-sm leading-6">
              Complete your first practice exam to unlock your performance
              insights, track your scores and discover your strongest nursing
              subjects.
            </p>

            <a
              href="/dashboard/exams/ati"
              className="dashboard-primary-button mt-5 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold transition hover:-translate-y-0.5"
            >
              <BookOpen size={15} />
              Start practicing
              <ArrowUpRight size={14} />
            </a>
          </section>
        ) : (
          <>
            {/* STATISTICS */}
            <section>
              <div className="mb-4">
                <h2 className="dashboard-heading text-lg font-extrabold sm:text-xl">
                  Performance summary
                </h2>

                <p className="dashboard-muted mt-1 text-xs">
                  A quick overview of your practice activity and results.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Exams completed"
                  value={stats.totalExams.toString()}
                  description="Total completed attempts"
                  icon={<Award size={18} />}
                  color="indigo"
                />

                <StatCard
                  title="Questions practiced"
                  value={stats.totalQuestions.toLocaleString()}
                  description={`${stats.totalCorrect.toLocaleString()} correct answers`}
                  icon={<BookOpen size={18} />}
                  color="blue"
                />

                <StatCard
                  title="Average score"
                  value={`${stats.averageScore}%`}
                  description="Across all attempts"
                  icon={<Target size={18} />}
                  color="purple"
                />

                <StatCard
                  title="Personal best"
                  value={`${stats.bestScore}%`}
                  description="Your highest score"
                  icon={<Trophy size={18} />}
                  color="amber"
                />
              </div>
            </section>

            {/* PERFORMANCE CHART */}
            <section className="dashboard-card rounded-xl border p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="dashboard-accent-icon flex h-9 w-9 items-center justify-center rounded-lg">
                    <TrendingUp size={17} />
                  </div>

                  <div>
                    <h2 className="dashboard-heading text-base font-extrabold">
                      Performance trend
                    </h2>

                    <p className="dashboard-muted mt-1 text-xs">
                      Follow your progress across practice exams.
                    </p>
                  </div>
                </div>

                <span className="dashboard-count-badge rounded-full px-3 py-1.5 text-[10px] font-semibold">
                  Last {chartAttempts.length} attempts
                </span>
              </div>

              <div className="mt-7">
                <div className="relative ml-8">
                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                    {[100, 75, 50, 25, 0].map((value) => (
                      <div key={value} className="flex items-center gap-3">
                        <div className="absolute -left-8 w-6 text-right text-[10px] text-[var(--dashboard-muted)]">
                          {value}
                        </div>

                        <div className="h-px flex-1 border-t border-dashed border-[var(--dashboard-border)]" />
                      </div>
                    ))}
                  </div>

                  <div className="relative flex h-52 items-end justify-around gap-3 sm:gap-6">
                    {chartAttempts.map((attempt, index) => (
                      <div
                        key={attempt.id}
                        className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                      >
                        <span className="mb-2 text-[10px] font-bold text-[var(--dashboard-text)] transition group-hover:text-[#5B3DF5]">
                          {attempt.percentage}%
                        </span>

                        <div
                          className="w-full max-w-14 rounded-t-lg bg-gradient-to-t from-[#5B3DF5] to-[#A99AFF] transition duration-300 group-hover:from-indigo-700 group-hover:to-violet-500"
                          style={{
                            height: `${Math.max(attempt.percentage, 3)}%`,
                          }}
                          title={`${attempt.subject}: ${attempt.percentage}%`}
                        />

                        <span className="mt-2.5 text-[10px] font-medium text-[var(--dashboard-muted)]">
                          #{index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-[var(--dashboard-muted)]">
                <span className="h-2 w-2 rounded-full bg-[#5B3DF5]" />
                Practice exam scores
              </div>
            </section>

            {/* SUBJECT PERFORMANCE */}
            <section className="dashboard-card rounded-xl border p-4 sm:p-5">
              <div className="mb-5 flex items-center gap-3">
                <div className="dashboard-accent-icon flex h-9 w-9 items-center justify-center rounded-lg">
                  <Target size={17} />
                </div>

                <div>
                  <h2 className="dashboard-heading text-base font-extrabold">
                    Subject performance
                  </h2>

                  <p className="dashboard-muted mt-1 text-xs">
                    Understand how you're performing in each subject.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {subjectPerformance.map((subject) => (
                  <div key={subject.subject}>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="dashboard-heading text-sm font-semibold">
                          {subject.subject}
                        </h3>

                        <p className="dashboard-muted mt-1 text-[10px]">
                          {subject.attempts}{" "}
                          {subject.attempts === 1 ? "attempt" : "attempts"}
                          {" · "}Best score: {subject.best}%
                        </p>
                      </div>

                      <span
                        className={`text-sm font-extrabold ${getScoreColor(subject.average)}`}
                      >
                        {subject.average}%
                      </span>
                    </div>

                    <div className="dashboard-progress-track h-2 overflow-hidden rounded-full">
                      <div
                        className="dashboard-progress-fill h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(subject.average, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* RECENT ATTEMPTS */}
            <section className="dashboard-card overflow-hidden rounded-xl border">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--dashboard-border)] p-4 sm:p-5">
                <div>
                  <h2 className="dashboard-heading text-base font-extrabold">
                    Recent attempts
                  </h2>

                  <p className="dashboard-muted mt-1 text-xs">
                    Your completed practice exam history.
                  </p>
                </div>

                <span className="dashboard-count-badge rounded-full px-3 py-1.5 text-[10px] font-semibold">
                  {attempts.length} attempts
                </span>
              </div>

              <div className="divide-y divide-[var(--dashboard-border)]">
                {recentAttempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="flex flex-col gap-3 p-4 transition hover:bg-[var(--dashboard-hover)] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="dashboard-soft-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                        <BookOpen size={17} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="dashboard-heading truncate text-sm font-semibold">
                          {attempt.subject}
                        </h3>

                        <div className="dashboard-muted mt-1 flex flex-wrap items-center gap-3 text-[10px]">
                          <span>{attempt.examType}</span>

                          <span className="flex items-center gap-1">
                            <CalendarDays size={11} />
                            {formatDate(attempt.completedAt)}
                          </span>

                          <span className="flex items-center gap-1">
                            <Clock3 size={11} />
                            {formatDuration(attempt.durationSeconds)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <div className="text-right">
                        <p
                          className={`text-base font-extrabold ${getScoreColor(attempt.percentage)}`}
                        >
                          {attempt.percentage}%
                        </p>

                        <p className="dashboard-muted text-[10px]">
                          {attempt.correctAnswers}/{attempt.totalQuestions}{" "}
                          correct
                        </p>
                      </div>

                      <span className="rounded-full bg-[#E8DEFF] px-2.5 py-1.5 text-[9px] font-bold text-[#392576]">
                        {getScoreMessage(attempt.percentage)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* STUDY INSIGHTS */}
            <section className="dashboard-inner-card rounded-xl border p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="dashboard-accent-icon flex h-9 w-9 items-center justify-center rounded-lg">
                  <Sparkles size={17} />
                </div>

                <div>
                  <h2 className="dashboard-heading text-base font-extrabold">
                    Your study insights
                  </h2>

                  <p className="dashboard-muted mt-1 text-xs">
                    A snapshot of your learning progress.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-[var(--dashboard-border)] bg-[var(--dashboard-surface)] p-3.5">
                  <div className="dashboard-muted flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                    <Activity size={13} />
                    Overall performance
                  </div>

                  <p className="dashboard-heading mt-2 text-2xl font-extrabold text-[#5B3DF5]">
                    {stats.averageScore}%
                  </p>

                  <p className="dashboard-muted mt-1.5 text-xs leading-5">
                    {getScoreMessage(stats.averageScore)}. Keep working towards
                    your target score.
                  </p>
                </div>

                <div className="rounded-lg border border-[var(--dashboard-border)] bg-[var(--dashboard-surface)] p-3.5">
                  <div className="dashboard-muted flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                    <Flame size={13} />
                    Strongest subject
                  </div>

                  <p className="dashboard-heading mt-2 text-lg font-extrabold text-[#5B3DF5]">
                    {subjectPerformance[0]?.subject ?? "Not available"}
                  </p>

                  <p className="dashboard-muted mt-1.5 text-xs">
                    Average score: {subjectPerformance[0]?.average ?? 0}%
                  </p>
                </div>
              </div>

              <p className="dashboard-muted mt-4 text-[11px] leading-5">
                Your insights are calculated from your saved practice attempts.
                Use them to guide your revision and identify areas that deserve
                more attention. These scores do not predict your actual NCLEX
                examination result.
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

// ----------------------------------------------------------
// REUSABLE STAT CARD
// ----------------------------------------------------------

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  color: "indigo" | "blue" | "purple" | "amber";
};

function StatCard({
  title,
  value,
  description,
  icon,
  color,
}: StatCardProps) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="dashboard-card group rounded-xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <p className="dashboard-muted text-xs font-semibold">{title}</p>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colors[color]}`}
        >
          {icon}
        </div>
      </div>

      <p className="dashboard-heading mt-3 text-2xl font-extrabold tracking-tight">
        {value}
      </p>

      <p className="dashboard-muted mt-1 text-[11px]">
        {description}
      </p>
    </div>
  );
}