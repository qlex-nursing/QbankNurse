"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Layers3,
  Lightbulb,
  LockKeyhole,
  Play,
  Sparkles,
  Star,
} from "lucide-react";

import { studyCategories } from "@/data/mock/dashboard/overview";
import { subjectTopics } from "@/data/mock/dashboard/subject-details";
import React from "react";


interface SubjectPageProps {
  params: Promise<{
    subject: string;
  }>;
}

export default function SubjectDetailPage({
  params,
}: SubjectPageProps) {
  const [subjectSlug, setSubjectSlug] = React.useState<string | null>(null);

  React.useEffect(() => {
    params.then((resolvedParams) => {
      setSubjectSlug(resolvedParams.subject);
    });
  }, [params]);

  if (!subjectSlug) {
    return (
      <div className="dashboard-content flex min-h-[50vh] items-center justify-center">
        <p className="dashboard-muted text-sm">Loading subject...</p>
      </div>
    );
  }

  const subject = studyCategories.find(
    (category) =>
      category.title.toLowerCase().replaceAll(" ", "-") === subjectSlug,
  );

  if (!subject) {
    notFound();
  }

  const topics = subjectTopics[subjectSlug] ?? [];

  const formattedQuestions = subject.questions.toLocaleString();

  return (
    <div className="dashboard-content mx-auto w-full max-w-[1600px] space-y-8 px-5 py-7 sm:px-7 lg:px-9">
      {/* Breadcrumb */}
      <Link
        href="/dashboard/study-library"
        className="dashboard-muted inline-flex items-center gap-2 text-sm font-semibold transition hover:opacity-70"
      >
        <ArrowLeft size={17} />
        Back to Study Library
      </Link>

      {/* Subject hero */}
      <section className="dashboard-library-banner relative overflow-hidden rounded-3xl p-6 sm:p-9">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border-[40px] border-white/[0.06]" />

        <div className="relative max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#E8DEFF] px-3 py-1.5 text-xs font-bold text-[#392576]">
              <GraduationCap size={15} />
              {subject.program}
            </span>

            <span className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/90">
              Study category
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {subject.title}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
            {subject.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-5 text-sm text-white/90">
            <div className="flex items-center gap-2">
              <BookOpen size={17} />
              {formattedQuestions} questions
            </div>

            <div className="flex items-center gap-2">
              <Star size={16} className="fill-amber-300 text-amber-300" />
              {subject.rating.toFixed(1)} rating
            </div>

            <div className="flex items-center gap-2">
              <Layers3 size={17} />
              {topics.length} topics
            </div>
          </div>
        </div>
      </section>

      {/* Subject overview */}
      <section>
        <div className="mb-5">
          <h2 className="dashboard-heading text-xl font-bold">
            Your study overview
          </h2>

          <p className="dashboard-muted mt-1 text-sm">
            Everything you need to get started with this subject.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="dashboard-card rounded-2xl p-5">
            <div className="dashboard-accent-icon">
              <BookOpen size={21} />
            </div>

            <p className="dashboard-muted mt-4 text-sm">
              Available questions
            </p>

            <h3 className="dashboard-heading mt-1 text-2xl font-bold">
              {formattedQuestions}
            </h3>
          </div>

          <div className="dashboard-card rounded-2xl p-5">
            <div className="dashboard-accent-icon">
              <Layers3 size={21} />
            </div>

            <p className="dashboard-muted mt-4 text-sm">
              Study topics
            </p>

            <h3 className="dashboard-heading mt-1 text-2xl font-bold">
              {topics.length}
            </h3>
          </div>

          <div className="dashboard-card rounded-2xl p-5 sm:col-span-2 xl:col-span-1">
            <div className="dashboard-accent-icon">
              <CheckCircle2 size={21} />
            </div>

            <p className="dashboard-muted mt-4 text-sm">
              Your progress
            </p>

            <h3 className="dashboard-heading mt-1 text-2xl font-bold">
              Not started
            </h3>
          </div>
        </div>
      </section>

      {/* Practice options */}
      <section className="space-y-5">
        <div>
          <h2 className="dashboard-heading text-xl font-bold">
            Choose how you want to study
          </h2>

          <p className="dashboard-muted mt-1 text-sm">
            Practice options will become available as the question engine is
            integrated.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="dashboard-card rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div className="dashboard-accent-icon">
                <Play size={22} />
              </div>

              <span className="dashboard-demo-badge rounded-full px-3 py-1 text-xs font-semibold">
                Coming soon
              </span>
            </div>

            <h3 className="dashboard-heading mt-5 text-lg font-bold">
              Practice Questions
            </h3>

            <p className="dashboard-muted mt-2 text-sm leading-6">
              Test your knowledge with subject-specific questions and
              explanations.
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs">
              <CheckCircle2 size={15} className="dashboard-muted" />
              <span className="dashboard-muted">
                Review answers and rationales
              </span>
            </div>

            <Link
  href={`/dashboard/exams/ati/${subjectSlug}/practice`}
  className="dashboard-primary-button mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
>
  <Play size={16} />
  Start Practising
  <ArrowRight size={16} />
</Link>
          </div>

          <div className="dashboard-card rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div className="dashboard-accent-icon">
                <Clock3 size={22} />
              </div>

              <span className="dashboard-demo-badge rounded-full px-3 py-1 text-xs font-semibold">
                Coming soon
              </span>
            </div>

            <h3 className="dashboard-heading mt-5 text-lg font-bold">
              Timed Practice
            </h3>

            <p className="dashboard-muted mt-2 text-sm leading-6">
              Simulate exam conditions and practise managing your time while
              answering questions.
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs">
              <CheckCircle2 size={15} className="dashboard-muted" />
              <span className="dashboard-muted">
                Timed question sessions
              </span>
            </div>

            <button
              type="button"
              disabled
              className="dashboard-disabled-action mt-6 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
            >
              <LockKeyhole size={16} />
              Practice unavailable
            </button>
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="space-y-5">
        <div>
          <h2 className="dashboard-heading text-xl font-bold">
            Topics covered
          </h2>

          <p className="dashboard-muted mt-1 text-sm">
            Explore the main areas covered within {subject.title}.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {topics.map((topic, index) => (
            <div
              key={topic.id}
              className="dashboard-card flex items-start gap-4 rounded-2xl p-5"
            >
              <div className="dashboard-accent-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--dash-surface-soft)] text-sm font-bold">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="dashboard-heading text-sm font-bold">
                  {topic.title}
                </h3>

                <p className="dashboard-muted mt-1 text-sm leading-6">
                  {topic.description}
                </p>
              </div>

              <ArrowRight
                size={17}
                className="dashboard-muted mt-1 shrink-0"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Demo notice */}
      <section className="dashboard-inner-card flex items-start gap-3 rounded-2xl p-5">
        <div className="dashboard-accent-icon shrink-0">
          <Lightbulb size={20} />
        </div>

        <div>
          <h3 className="dashboard-heading text-sm font-bold">
            Subject preview
          </h3>

          <p className="dashboard-muted mt-1 text-sm leading-6">
            This page currently displays demonstration subject information.
            Actual questions, topic content, progress and practice sessions
            will be provided through the backend API.
          </p>
        </div>
      </section>

      <div className="flex justify-end">
        <Link
          href="/dashboard/study-library"
          className="dashboard-secondary-button inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold"
        >
          Explore other subjects
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}