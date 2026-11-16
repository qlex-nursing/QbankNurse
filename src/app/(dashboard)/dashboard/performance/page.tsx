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
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-6 sm:px-6 sm:pt-8 lg:px-10">
      {/* PAGE HEADER */}
      <header className="mx-auto mb-10 max-w-3xl text-center">
        <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold tracking-wider text-indigo-600">
          <Activity size={15} />
          YOUR LEARNING JOURNEY
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          Your Performance
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
          Every practice session brings you closer to your goal. Track your
          progress, discover your strengths, and identify where to focus next.
        </p>

        <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-500 shadow-sm">
          <CalendarDays size={15} className="text-indigo-500" />
          All-time performance overview
        </div>
      </header>

      {attempts.length === 0 ? (
        <section className="mx-auto max-w-3xl rounded-3xl border border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-20 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-indigo-600 shadow-lg shadow-indigo-100">
            <ChartColumnIncreasing size={34} />
          </div>

          <h2 className="mt-7 text-2xl font-bold text-slate-900">
            Your journey starts here
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
            Complete your first practice exam to unlock your performance
            insights, track your scores, and discover your strongest nursing
            subjects.
          </p>

          <a
            href="/dashboard/exams/ati"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700"
          >
            <BookOpen size={18} />
            Start practicing
            <ArrowUpRight size={16} />
          </a>
        </section>
      ) : (
        <>
          {/* STATISTICS */}
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Exams completed"
              value={stats.totalExams.toString()}
              description="Total completed attempts"
              icon={<Award size={22} />}
              color="indigo"
            />

            <StatCard
              title="Questions practiced"
              value={stats.totalQuestions.toLocaleString()}
              description={`${stats.totalCorrect} correct answers`}
              icon={<BookOpen size={22} />}
              color="blue"
            />

            <StatCard
              title="Average score"
              value={`${stats.averageScore}%`}
              description="Across all attempts"
              icon={<Target size={22} />}
              color="purple"
            />

            <StatCard
              title="Personal best"
              value={`${stats.bestScore}%`}
              description="Your highest score"
              icon={<Trophy size={22} />}
              color="amber"
            />
          </section>

          {/* PERFORMANCE CHART */}
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <TrendingUp size={22} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Performance trend
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Follow your progress across practice exams.
                    </p>
                  </div>
                </div>
              </div>

              <span className="w-fit rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-700">
                Last {chartAttempts.length} attempts
              </span>
            </div>

            <div className="mt-10">
              <div className="relative ml-8">
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                  {[100, 75, 50, 25, 0].map((value) => (
                    <div key={value} className="flex items-center gap-3">
                      <div className="absolute -left-8 w-6 text-right text-[10px] text-slate-400">
                        {value}
                      </div>

                      <div className="h-px flex-1 border-t border-dashed border-slate-200" />
                    </div>
                  ))}
                </div>

                <div className="relative flex h-60 items-end justify-around gap-3 sm:gap-6">
                  {chartAttempts.map((attempt, index) => (
                    <div
                      key={attempt.id}
                      className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                    >
                      <span className="mb-2 text-xs font-bold text-slate-700 transition group-hover:text-indigo-600">
                        {attempt.percentage}%
                      </span>

                      <div
                        className="w-full max-w-16 rounded-t-xl bg-gradient-to-t from-indigo-600 to-violet-400 shadow-md shadow-indigo-200/50 transition duration-300 group-hover:from-indigo-700 group-hover:to-violet-500"
                        style={{
                          height: `${Math.max(attempt.percentage, 3)}%`,
                        }}
                        title={`${attempt.subject}: ${attempt.percentage}%`}
                      />

                      <span className="mt-3 text-[10px] font-medium text-slate-400">
                        #{index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
              Practice exam scores
            </div>
          </section>

          {/* SUBJECT PERFORMANCE */}
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <Target size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Subject performance
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Understand how you're performing in each subject.
                </p>
              </div>
            </div>

            <div className="space-y-7">
              {subjectPerformance.map((subject) => (
                <div key={subject.subject}>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        {subject.subject}
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        {subject.attempts}{" "}
                        {subject.attempts === 1 ? "attempt" : "attempts"}
                        {" · "}Best score: {subject.best}%
                      </p>
                    </div>

                    <span
                      className={`text-sm font-bold ${getScoreColor(subject.average)}`}
                    >
                      {subject.average}%
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-400 transition-all duration-700"
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
          <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recent attempts
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your completed practice exam history.
                </p>
              </div>

              <span className="w-fit rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600">
                {attempts.length} attempts
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {recentAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex flex-col gap-4 p-5 transition hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between sm:px-8"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                      <BookOpen size={21} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {attempt.subject}
                      </h3>

                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span>{attempt.examType}</span>

                        <span className="flex items-center gap-1">
                          <CalendarDays size={13} />
                          {formatDate(attempt.completedAt)}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock3 size={13} />
                          {formatDuration(attempt.durationSeconds)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="text-right">
                      <p
                        className={`text-xl font-bold ${getScoreColor(attempt.percentage)}`}
                      >
                        {attempt.percentage}%
                      </p>

                      <p className="text-xs text-slate-400">
                        {attempt.correctAnswers}/{attempt.totalQuestions}{" "}
                        correct
                      </p>
                    </div>

                    <span className="rounded-full bg-indigo-50 px-3 py-2 text-[11px] font-semibold text-indigo-700">
                      {getScoreMessage(attempt.percentage)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* STUDY INSIGHTS */}
          <section className="mt-8 overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-5 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                <Sparkles size={23} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Your study insights
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  A snapshot of your learning progress.
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white bg-white/80 p-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Activity size={14} />
                  Overall performance
                </div>

                <p className="mt-3 text-3xl font-extrabold text-indigo-700">
                  {stats.averageScore}%
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  {getScoreMessage(stats.averageScore)}. Keep working towards
                  your target score.
                </p>
              </div>

              <div className="rounded-2xl border border-white bg-white/80 p-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Flame size={14} />
                  Strongest subject
                </div>

                <p className="mt-3 text-xl font-extrabold text-indigo-700">
                  {subjectPerformance[0]?.subject ?? "Not available"}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Average score: {subjectPerformance[0]?.average ?? 0}%
                </p>
              </div>
            </div>

            <p className="mt-6 text-xs leading-6 text-slate-500">
              Your insights are calculated from your saved practice attempts.
              Use them to guide your revision and identify areas that deserve
              more attention. These scores do not predict your actual NCLEX
              examination result.
            </p>
          </section>
        </>
      )}
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
    <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/40">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${colors[color]}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-400">{description}</p>
    </div>
  );
}