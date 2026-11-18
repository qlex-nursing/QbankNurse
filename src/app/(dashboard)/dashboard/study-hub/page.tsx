"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  Bookmark,
  Check,
  BookOpen,
  Compass,
  GraduationCap,
  LockKeyhole,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { studyCategories } from "@/data/mock/dashboard/overview";

import {
  examPreparationOptions,
  studyTools,
} from "@/data/mock/dashboard/study-hub";

import {
  saveItem,
  toggleSavedItem,
} from "@/lib/saved-items";

const STORAGE_KEY = "qbanknurse-study-hub-saved-subjects";

const subjectDescriptions: Record<string, string> = {
  Fundamentals:
    "Build a strong foundation in essential nursing concepts and patient care.",
  Pharmacology:
    "Understand medications, drug classifications and nursing implications.",
  "Medical-Surgical":
    "Explore adult health conditions, clinical management and nursing care.",
  "Maternal-Newborn":
    "Study pregnancy, childbirth, postpartum and newborn nursing.",
  "Obstetrics and Pediatrics":
    "Explore obstetric care, pediatric health and family-centred nursing.",
  "Mental Health":
    "Understand psychiatric conditions and therapeutic communication.",
  "Community Health":
    "Explore population health, prevention and community-based nursing.",
  Leadership:
    "Develop knowledge of delegation, management and professional practice.",
  Capstone:
    "Bring together core nursing knowledge through integrated review.",
  "Adult Health":
    "Strengthen your understanding of adult health across the lifespan.",
  Nutrition:
    "Explore nutrition principles, therapeutic diets and patient education.",
  "Dosage Calculations":
    "Practise medication calculations and safe dosage administration.",
};

export default function StudyHubPage() {
  const [savedSubjects, setSavedSubjects] = useState<number[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Load existing saved subjects and migrate them to shared storage.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          const validIds = parsed.filter(
            (id): id is number => typeof id === "number",
          );

          setSavedSubjects(validIds);

          validIds.forEach((subjectId) => {
            const subject = studyCategories.find(
              (item) => item.id === subjectId,
            );

            if (subject) {
              saveItem({
                id: String(subject.id),
                type: "study-topic",
                title: subject.title,
                description: subject.description,
                href: "/dashboard/study-library",
                metadata: {
                  program: subject.program,
                  subjectId: String(subject.id),
                },
              });
            }
          });
        }
      }
    } catch {
      setSavedSubjects([]);
    }

    setStorageReady(true);
  }, []);

  // Preserve the original Study Hub saved-subject storage.
  useEffect(() => {
    if (!storageReady) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(savedSubjects),
    );
  }, [savedSubjects, storageReady]);

  const displayedSubjects = useMemo(() => {
    if (!showSavedOnly) return studyCategories;

    return studyCategories.filter((subject) =>
      savedSubjects.includes(subject.id),
    );
  }, [showSavedOnly, savedSubjects]);

  // Synchronize subject bookmarks with My Library.
  const toggleSaved = (subjectId: number) => {
    const subject = studyCategories.find(
      (item) => item.id === subjectId,
    );

    if (!subject) return;

    toggleSavedItem({
      id: String(subject.id),
      type: "study-topic",
      title: subject.title,
      description: subject.description,
      href: "/dashboard/study-library",
      metadata: {
        program: subject.program,
        subjectId: String(subject.id),
      },
    });

    setSavedSubjects((previous) =>
      previous.includes(subjectId)
        ? previous.filter((id) => id !== subjectId)
        : [...previous, subjectId],
    );
  };

  const totalQuestions = studyCategories.reduce(
    (total, subject) => total + subject.questions,
    0,
  );

  const availableExams = examPreparationOptions.filter(
    (exam) => exam.available,
  ).length;

  const availableTools = studyTools.filter(
    (tool) => tool.available,
  ).length;

  return (
    <main className="w-full pb-7">

      {/* =====================================================
          FULL-WIDTH HERO
      ===================================================== */}

      <section className="relative isolate flex min-h-[165px] w-full items-center overflow-hidden bg-gradient-to-r from-[#17263F] via-[#202C50] to-[#30245F] px-5 py-6 text-white sm:px-8 lg:px-11">

        {/* BACKGROUND EFFECTS */}

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_50%,rgba(91,61,245,0.22),transparent_55%)]" />

        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/[0.06]" />

        <div className="pointer-events-none absolute -bottom-32 right-1/4 h-64 w-64 rounded-full border border-white/[0.05]" />

        {/* HERO CONTENT */}

        <div className="relative z-10 w-full max-w-4xl">

          <span className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.22em] text-[#B9A9FF]">
            <Compass size={13} />
            YOUR LEARNING SPACE
          </span>

          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Welcome to your{" "}
            <span className="text-[#B9A9FF]">
              Study Hub
            </span>
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-white/60">
            Everything you need to strengthen your nursing knowledge,
            prepare for exams and make progress in your studies.
          </p>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[11px] font-semibold text-white/70">
            <span>
              {studyCategories.length} nursing subjects
            </span>

            <span>
              {totalQuestions.toLocaleString()} catalogue questions
            </span>

            <span>
              {availableExams} available exam pathways
            </span>
          </div>

        </div>
      </section>

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <div className="mx-auto w-full max-w-[1500px] space-y-6 px-5 pt-6 sm:px-7 lg:px-9">

        {/* =====================================================
            STUDY BY SUBJECT
        ===================================================== */}

        <section className="space-y-4">

          {/* SECTION HEADER */}

          <div className="flex flex-wrap items-center justify-between gap-3">

            <div>
              <p className="dashboard-section-label">
                BUILD YOUR KNOWLEDGE
              </p>

              <h2 className="dashboard-heading mt-1 text-xl font-extrabold">
                Study by subject
              </h2>

              <p className="dashboard-muted mt-1 text-sm">
                Choose a nursing subject and explore its learning resources.
              </p>
            </div>

            {/* SAVED SUBJECTS FILTER */}

            <button
              type="button"
              onClick={() =>
                setShowSavedOnly((previous) => !previous)
              }
              className={`inline-flex items-center justify-center gap-2 self-start rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all ${
                showSavedOnly
                  ? "border-[#5B3DF5] bg-[#5B3DF5] text-white shadow-[0_4px_12px_rgba(91,61,245,0.18)]"
                  : "dashboard-card dashboard-heading border-[var(--dashboard-border)] hover:border-[#5B3DF5] hover:text-[#5B3DF5]"
              }`}
            >
              <Bookmark size={14} />

              {showSavedOnly ? "Show all subjects" : "Saved subjects"}

              <span className="rounded-full bg-black/10 px-2 py-0.5 text-[10px]">
                {savedSubjects.length}
              </span>
            </button>

          </div>

          {/* SUBJECT CARDS */}

          {displayedSubjects.length > 0 ? (

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">

              {displayedSubjects.map((subject, index) => {
                const isSaved = savedSubjects.includes(subject.id);

                return (
                  <article
                    key={subject.id}
                    className="dashboard-card group relative flex min-h-[205px] min-w-0 flex-col overflow-hidden rounded-xl border border-[var(--dashboard-border)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#8D79FF]/50 hover:shadow-[0_10px_24px_rgba(55,40,120,0.07)]"
                  >

                    {/* CARD TOP */}

                    <div className="flex items-center justify-between gap-3">

                      <div className="dashboard-accent-icon !h-10 !w-10">
                        <BookOpen size={18} />
                      </div>

                      <div className="flex items-center gap-2">

                        <span className="text-[10px] font-extrabold tracking-widest text-[var(--dashboard-muted)] opacity-60">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        {/* SAVE BUTTON */}

                        <button
                          type="button"
                          onClick={() => toggleSaved(subject.id)}
                          aria-label={
                            isSaved
                              ? `Remove ${subject.title} from saved subjects`
                              : `Save ${subject.title}`
                          }
                          title={
                            isSaved
                              ? "Remove from saved subjects"
                              : "Save subject"
                          }
                          className={`flex h-8 items-center gap-1.5 rounded-lg border px-2 transition-all ${
                            isSaved
                              ? "border-[#5B3DF5] bg-[#E8DEFF] text-[#4B2ED0]"
                              : "border-[var(--dashboard-border)] dashboard-heading hover:border-[#5B3DF5] hover:text-[#5B3DF5]"
                          }`}
                        >
                          {isSaved ? (
                            <Check size={13} />
                          ) : (
                            <Bookmark size={13} />
                          )}

                          <span className="text-[10px] font-bold">
                            {isSaved ? "Saved" : "Save"}
                          </span>
                        </button>

                      </div>

                    </div>

                    {/* SUBJECT BADGES */}

                    <div className="mt-3 flex flex-wrap items-center gap-1.5">

                      <span className="rounded-full bg-[#E8DEFF] px-2.5 py-1 text-[9px] font-bold text-[#392576]">
                        {subject.program}
                      </span>

                      {isSaved && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[9px] font-bold text-emerald-600">
                          <CheckCircle2 size={10} />
                          Saved
                        </span>
                      )}

                    </div>

                    {/* SUBJECT DETAILS */}

                    <div className="mt-3 flex-1">

                      <h3 className="dashboard-heading text-base font-extrabold leading-snug transition-colors group-hover:text-[#5B3DF5]">
                        {subject.title}
                      </h3>

                      <p className="dashboard-muted mt-1.5 text-xs leading-5">
                        {subjectDescriptions[subject.title] ??
                          subject.description}
                      </p>

                    </div>

                    {/* CARD FOOTER */}

                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--dashboard-border)] pt-3">

                      <div>
                        <p className="dashboard-heading text-sm font-bold">
                          {subject.questions.toLocaleString()}
                        </p>

                        <p className="dashboard-muted text-[10px]">
                          Practice questions
                        </p>
                      </div>

                      <Link
                        href="/dashboard/study-library"
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[var(--dashboard-border)] px-3 text-[11px] font-bold text-[#8B78F8] transition hover:border-[#5B3DF5] hover:bg-[#5B3DF5] hover:text-white"
                      >
                        Practice exams
                        <ArrowRight size={13} />
                      </Link>

                    </div>

                  </article>
                );
              })}

            </div>

          ) : (

            /* EMPTY STATE */

            <div className="dashboard-card flex flex-col items-center justify-center rounded-xl px-5 py-12 text-center">

              <div className="dashboard-accent-icon mb-3">
                <Bookmark size={22} />
              </div>

              <h3 className="dashboard-heading text-base font-bold">
                No saved subjects yet
              </h3>

              <p className="dashboard-muted mt-2 max-w-sm text-sm leading-6">
                Save a subject to find it quickly next time.
              </p>

              <button
                type="button"
                onClick={() => setShowSavedOnly(false)}
                className="dashboard-primary-button mt-4 rounded-xl px-5 py-2.5 text-sm font-semibold"
              >
                Explore subjects
              </button>

            </div>

          )}

        </section>

        {/* =====================================================
            EXAM PREPARATION
        ===================================================== */}

        <section className="space-y-4 border-t border-[var(--dashboard-border)] pt-5">

          {/* SECTION HEADER */}

          <div>
            <p className="dashboard-section-label">
              PREPARE WITH CONFIDENCE
            </p>

            <h2 className="dashboard-heading mt-1 text-xl font-extrabold">
              Exam preparation
            </h2>

            <p className="dashboard-muted mt-1 text-sm">
              Explore resources for your nursing and entrance examinations.
            </p>
          </div>

          {/* EXAM CARDS */}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">

            {examPreparationOptions.map((exam, index) => (

              <Link
                key={exam.title}
                href={exam.href}
                onClick={(event) => {
                  if (!exam.available) event.preventDefault();
                }}
                aria-disabled={!exam.available}
                className={`dashboard-card group relative flex min-h-[155px] flex-col rounded-xl border border-[var(--dashboard-border)] p-4 transition-all duration-300 ${
                  exam.available
                    ? "hover:-translate-y-0.5 hover:border-[#8D79FF]/50 hover:shadow-[0_10px_24px_rgba(55,40,120,0.07)]"
                    : "cursor-not-allowed opacity-75"
                }`}
              >

                {/* CARD TOP */}

                <div className="flex items-center justify-between">

                  <div className="dashboard-accent-icon !h-9 !w-9">
                    <GraduationCap size={17} />
                  </div>

                  <span className="text-[10px] font-extrabold tracking-widest text-[var(--dashboard-muted)] opacity-60">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                </div>

                {/* EXAM DETAILS */}

                <div className="mt-3 flex-1">

                  <div className="flex items-center justify-between gap-2">

                    <h3 className="dashboard-heading text-base font-extrabold">
                      {exam.title}
                    </h3>

                    {exam.available ? (
                      <CheckCircle2
                        size={15}
                        className="shrink-0 text-emerald-500"
                      />
                    ) : (
                      <LockKeyhole
                        size={14}
                        className="dashboard-muted shrink-0"
                      />
                    )}

                  </div>

                  <p className="dashboard-muted mt-1.5 text-xs leading-5">
                    {exam.description}
                  </p>

                </div>

                {/* CARD FOOTER */}

                <div className="mt-3 flex items-center justify-between border-t border-[var(--dashboard-border)] pt-3">

                  <span
                    className={`text-[10px] font-bold ${
                      exam.available
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}
                  >
                    {exam.available ? "Available now" : "Coming soon"}
                  </span>

                  {exam.available && (
                    <ArrowRight
                      size={15}
                      className="text-[#8B78F8] transition group-hover:translate-x-1 group-hover:text-[#5B3DF5]"
                    />
                  )}

                </div>

              </Link>

            ))}

          </div>

        </section>

        {/* =====================================================
            STUDY TOOLS
        ===================================================== */}

        <section className="space-y-4 border-t border-[var(--dashboard-border)] pt-5">

          {/* SECTION HEADER */}

          <div>

            <div className="flex items-center gap-2">

              <div className="dashboard-accent-icon !h-9 !w-9">
                <Sparkles size={16} />
              </div>

              <span className="dashboard-section-label">
                LEARNING RESOURCES
              </span>

            </div>

            <h2 className="dashboard-heading mt-3 text-xl font-extrabold">
              Study tools
            </h2>

            <p className="dashboard-muted mt-1 text-sm">
              Use these tools to practise, review and organize your learning.
            </p>

          </div>

          {/* STUDY TOOL CARDS */}

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">

            {studyTools.map((tool, index) => {
              const Icon = tool.icon;

              const content = (
                <div
                  className={`dashboard-card flex min-h-[120px] h-full min-w-0 items-center justify-between gap-4 rounded-xl border border-[var(--dashboard-border)] p-4 transition-all duration-300 ${
                    tool.available
                      ? "group hover:-translate-y-0.5 hover:border-[#8D79FF]/50 hover:shadow-[0_10px_24px_rgba(55,40,120,0.07)]"
                      : "cursor-not-allowed opacity-75"
                  }`}
                >

                  {/* TOOL DETAILS */}

                  <div className="flex min-w-0 items-center gap-4">

                    <div className="dashboard-accent-icon shrink-0">
                      <Icon size={20} />
                    </div>

                    <div className="min-w-0">

                      <h3 className="dashboard-heading text-sm font-extrabold">
                        {tool.title}
                      </h3>

                      <p className="dashboard-muted mt-1 text-xs leading-5">
                        {tool.description}
                      </p>

                      {!tool.available && (
                        <span className="mt-2 inline-block rounded-full bg-amber-500/10 px-2.5 py-1 text-[9px] font-bold text-amber-600">
                          Coming soon
                        </span>
                      )}

                    </div>

                  </div>

                  {/* ACTION INDICATOR */}

                  {tool.available ? (
                    <ArrowRight
                      size={18}
                      className="shrink-0 text-[#8B78F8] transition group-hover:translate-x-1 group-hover:text-[#5B3DF5]"
                    />
                  ) : (
                    <LockKeyhole
                      size={16}
                      className="dashboard-muted shrink-0"
                    />
                  )}

                </div>
              );

              return tool.available ? (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="block h-full"
                >
                  {content}
                </Link>
              ) : (
                <div
                  key={tool.title}
                  aria-disabled="true"
                  className="h-full"
                >
                  {content}
                </div>
              );
            })}

          </div>

        </section>

        {/* =====================================================
            INFORMATION PANEL
        ===================================================== */}

        <section className="dashboard-inner-card flex items-center gap-3 rounded-xl p-4">

          <div className="dashboard-accent-icon shrink-0">
            <Sparkles size={18} />
          </div>

          <div>

            <h3 className="dashboard-heading text-sm font-bold">
              Your learning journey starts here
            </h3>

            <p className="dashboard-muted mt-1 text-xs leading-5 sm:text-sm">
              Explore examination resources, practise clinical questions
              and organize your learning. Available tools will open directly,
              while upcoming features will become accessible as they are developed.
            </p>

          </div>

        </section>

      </div>
    </main>
  );
}