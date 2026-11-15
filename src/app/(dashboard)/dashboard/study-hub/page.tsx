"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  Compass,
  GraduationCap,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

import { studyCategories } from "@/data/mock/dashboard/overview";

import {
  examPreparationOptions,
  studyTools,
} from "@/data/mock/dashboard/study-hub";

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

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setSavedSubjects(
            parsed.filter((id) => typeof id === "number"),
          );
        }
      }
    } catch {
      setSavedSubjects([]);
    }

    setStorageReady(true);
  }, []);

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

  const toggleSaved = (subjectId: number) => {
    setSavedSubjects((previous) =>
      previous.includes(subjectId)
        ? previous.filter((id) => id !== subjectId)
        : [...previous, subjectId],
    );
  };

  return (
    <div className="dashboard-content space-y-10">
      {/* Page heading */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="dashboard-accent-icon">
            <Compass size={17} />
          </div>

          <span className="dashboard-section-label">
            YOUR LEARNING SPACE
          </span>
        </div>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="dashboard-heading text-2xl font-bold md:text-3xl">
              Study Hub
            </h1>

            <p className="dashboard-muted mt-2 max-w-2xl text-sm leading-6">
              Everything you need to strengthen your nursing knowledge,
              prepare for exams and make progress in your studies.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="dashboard-muted">Resources</span>
            <span className="dashboard-muted">/</span>
            <span className="dashboard-heading font-semibold">
              Study Hub
            </span>
          </div>
        </div>
      </section>

      {/* Study by subject */}
      <section className="space-y-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="dashboard-heading text-xl font-bold">
              Study by subject
            </h2>

            <p className="dashboard-muted mt-1 text-sm">
              Choose a subject and explore its learning resources.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowSavedOnly((previous) => !previous)}
            className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
              showSavedOnly
                ? "border-transparent bg-[#5B3DF5] text-white"
                : "dashboard-card dashboard-heading"
            }`}
          >
            <Bookmark size={16} />

            {showSavedOnly ? "Show all subjects" : "Saved subjects"}

            <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs">
              {savedSubjects.length}
            </span>
          </button>
        </div>

        {displayedSubjects.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {displayedSubjects.map((subject) => {
              const isSaved = savedSubjects.includes(subject.id);

              return (
                <article
                  key={subject.id}
                  className="dashboard-card group flex min-h-[145px] flex-col justify-between rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:border-[#8B78F8]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="dashboard-heading text-base font-bold">
                        {subject.title}
                      </h3>

                      <p className="dashboard-muted mt-2 text-sm leading-5">
                        {subjectDescriptions[subject.title] ??
                          subject.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSaved(subject.id)}
                      aria-label={
                        isSaved
                          ? `Remove ${subject.title} from saved subjects`
                          : `Save ${subject.title}`
                      }
                      className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                        isSaved
                          ? "border-[#5B3DF5] bg-[#E8DEFF] text-[#4B2ED0]"
                          : "dashboard-heading hover:border-[#8B78F8]"
                      }`}
                    >
                      {isSaved ? (
                        <Check size={13} />
                      ) : (
                        <Bookmark size={13} />
                      )}

                      {isSaved ? "Saved" : "Save"}
                    </button>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="dashboard-muted text-xs">
                      {subject.questions.toLocaleString()} practice questions
                    </span>

                    <Link
                      href="/dashboard/study-library"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#8B78F8] transition hover:text-[#5B3DF5]"
                    >
                      Practice exams
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="dashboard-card rounded-2xl border border-dashed p-10 text-center">
            <Bookmark
              size={28}
              className="mx-auto text-[#8B78F8]"
            />

            <h3 className="dashboard-heading mt-3 font-semibold">
              No saved subjects yet
            </h3>

            <p className="dashboard-muted mt-1 text-sm">
              Save a subject to find it quickly next time.
            </p>

            <button
              type="button"
              onClick={() => setShowSavedOnly(false)}
              className="mt-4 rounded-xl bg-[#5B3DF5] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4930D0]"
            >
              Explore subjects
            </button>
          </div>
        )}
      </section>

      {/* Exam preparation */}
      <section className="space-y-5">
        <div>
          <h2 className="dashboard-heading text-xl font-bold">
            Exam preparation
          </h2>

          <p className="dashboard-muted mt-1 text-sm">
            Explore resources for your nursing and entrance examinations.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {examPreparationOptions.map((exam) => (
            <Link
              key={exam.title}
              href={exam.href}
              onClick={(event) => {
                if (!exam.available) event.preventDefault();
              }}
              aria-disabled={!exam.available}
              className={`dashboard-card group rounded-2xl border p-5 transition ${
                exam.available
                  ? "hover:-translate-y-0.5 hover:border-[#8B78F8]"
                  : "cursor-not-allowed opacity-75"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="dashboard-heading font-bold">
                  {exam.title}
                </h3>

                {exam.available ? (
                  <ArrowRight
                    size={17}
                    className="text-[#8B78F8] transition group-hover:translate-x-1"
                  />
                ) : (
                  <LockKeyhole
                    size={15}
                    className="dashboard-muted"
                  />
                )}
              </div>

              <p className="dashboard-muted mt-2 text-sm">
                {exam.description}
              </p>

              {!exam.available && (
                <span className="mt-3 inline-block rounded-full bg-[#E8DEFF] px-2.5 py-1 text-xs font-semibold text-[#4B2ED0]">
                  Coming soon
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Study tools */}
      <section className="space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="dashboard-accent-icon">
              <Sparkles size={16} />
            </div>

            <span className="dashboard-section-label">
              LEARNING RESOURCES
            </span>
          </div>

          <h2 className="dashboard-heading mt-2 text-xl font-bold">
            Study tools
          </h2>

          <p className="dashboard-muted mt-1 text-sm">
            Use these tools to practise, review and organize your learning.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {studyTools.map((tool) => {
            const Icon = tool.icon;

            const content = (
              <div
                className={`dashboard-card flex h-full items-center justify-between gap-4 rounded-2xl border p-5 transition ${
                  tool.available
                    ? "group hover:-translate-y-0.5 hover:border-[#8B78F8]"
                    : "cursor-not-allowed opacity-75"
                }`}
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="dashboard-accent-icon shrink-0">
                    <Icon size={21} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="dashboard-heading font-bold">
                      {tool.title}
                    </h3>

                    <p className="dashboard-muted mt-1 text-sm leading-5">
                      {tool.description}
                    </p>

                    {!tool.available && (
                      <span className="mt-2 inline-block rounded-full bg-[#E8DEFF] px-2.5 py-1 text-xs font-semibold text-[#4B2ED0]">
                        Coming soon
                      </span>
                    )}
                  </div>
                </div>

                {tool.available ? (
                  <ArrowRight
                    size={19}
                    className="shrink-0 text-[#8B78F8] transition group-hover:translate-x-1"
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
              <Link key={tool.title} href={tool.href}>
                {content}
              </Link>
            ) : (
              <div key={tool.title} aria-disabled="true">
                {content}
              </div>
            );
          })}
        </div>
      </section>

      {/* Demo notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-[#8B78F8]/20 bg-[#E8DEFF]/40 p-4">
        <div className="mt-0.5 rounded-lg bg-[#5B3DF5]/10 p-2 text-[#5B3DF5]">
          <GraduationCap size={19} />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[#39258F]">
            Your learning journey starts here
          </h3>

          <p className="mt-1 text-sm leading-5 text-[#514477]">
            Some resources are still being prepared. Available tools will
            open directly, while upcoming features will become accessible
            as they are developed.
          </p>
        </div>
      </div>
    </div>
  );
}