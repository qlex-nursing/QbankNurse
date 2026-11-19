
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Layers3,
  Sparkles,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

import { subjectService } from "@/lib/services/subjectService";

interface BackendSubject {
  id: number;
  guidId: string;
  courseId: number;
  courseName: string;
  name: string;
  description?: string | null;
  status?: string;
  rating?: number;
}

interface SubjectApiResponse {
  success: boolean;
  message?: string;
  data?: {
    items: BackendSubject[];
    skewPage: number;
    skewPerPage: number;
    skewTotal: number;
    skewTotalPages: number;
  };
}

const RN_COURSE_IDS = [
  27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17,
];

interface Course {
  id: number;
  name: string;
  subjects: BackendSubject[];
}

export default function RNCourseLanding() {
  const [subjects, setSubjects] = useState<BackendSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSubjects() {
      try {
        setLoading(true);
        setError(null);

        const response =
          await subjectService.absolute<SubjectApiResponse>({
            dynamicPage: 1,
            dynamicPerPage: 200,
            dynamicSortDirection: "asc",
          });

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to load the course catalogue.",
          );
        }

        if (!cancelled) {
          setSubjects(response.data.items ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading courses.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSubjects();

    return () => {
      cancelled = true;
    };
  }, []);

  const courses = useMemo<Course[]>(() => {
    const grouped = new Map<number, Course>();

    for (const subject of subjects) {
      if (!RN_COURSE_IDS.includes(subject.courseId)) continue;

      const existing = grouped.get(subject.courseId);

      if (existing) {
        existing.subjects.push(subject);
      } else {
        grouped.set(subject.courseId, {
          id: subject.courseId,
          name: subject.courseName,
          subjects: [subject],
        });
      }
    }

    return RN_COURSE_IDS
      .map((id) => grouped.get(id))
      .filter((course): course is Course => Boolean(course));
  }, [subjects]);

  const totalSubjects = courses.reduce(
    (total, course) => total + course.subjects.length,
    0,
  );

  return (
    <main className="w-full pb-8">
      {/* HERO */}
      <section className="relative isolate flex min-h-[190px] w-full items-center overflow-hidden bg-[#17263F] px-5 py-7 text-white sm:px-8 lg:px-11">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(91,61,245,0.2),transparent_55%)]" />

        <div className="pointer-events-none absolute -right-16 -top-28 h-64 w-64 rounded-full border border-white/[0.05]" />

        <div className="pointer-events-none absolute -right-4 -bottom-32 h-56 w-56 rounded-full border border-white/[0.04]" />

        <div className="relative z-10 w-full max-w-4xl">
          <div className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.2em] text-[#B9A9FF]">
            <GraduationCap size={14} />
            REGISTERED NURSE EXAM PREPARATION
          </div>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Explore RN{" "}
            <span className="text-[#B9A9FF]">examination resources</span>
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
            Explore available nursing examination courses, select a subject
            and discover its examination resources.
          </p>

          {!loading && !error && (
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-white/75">
              <span>{courses.length} courses</span>
              <span>{totalSubjects} subjects</span>
            </div>
          )}
        </div>
      </section>

      {/* COURSE CATALOGUE */}
      <div className="mx-auto w-full max-w-[1500px] space-y-6 px-5 py-7 sm:px-7 lg:px-9">
        <section className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="dashboard-section-label">
                RN LEARNING CATALOGUE
              </p>

              <h2 className="dashboard-heading mt-1.5 text-xl font-extrabold sm:text-2xl">
                Explore examination courses
              </h2>

              <p className="dashboard-muted mt-1 text-sm">
                Select a course to explore its available subjects.
              </p>
            </div>

            {!loading && !error && (
              <span className="dashboard-count-badge">
                {courses.length} courses
              </span>
            )}
          </div>

          {/* LOADING */}
          {loading && (
            <div className="dashboard-card flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-2xl">
              <LoaderCircle
                size={30}
                className="animate-spin text-[#5B3DF5]"
              />
              <p className="dashboard-muted text-sm">
                Loading examination courses...
              </p>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="dashboard-card flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl p-6 text-center">
              <div className="dashboard-accent-icon">
                <AlertCircle size={22} />
              </div>

              <h3 className="dashboard-heading font-bold">
                Unable to load courses
              </h3>

              <p className="dashboard-muted max-w-lg text-sm">
                {error}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="dashboard-primary-button rounded-xl px-5 py-2.5 text-sm font-semibold"
              >
                Try again
              </button>
            </div>
          )}

          {/* EMPTY */}
          {!loading && !error && courses.length === 0 && (
            <div className="dashboard-card flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl p-6 text-center">
              <BookOpen
                size={30}
                className="dashboard-muted"
              />

              <h3 className="dashboard-heading font-bold">
                No RN courses found
              </h3>

              <p className="dashboard-muted text-sm">
                The backend did not return subjects belonging to the
                configured RN courses.
              </p>
            </div>
          )}

          {/* COURSE CARDS */}
          {!loading && !error && courses.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {courses.map((course, index) => (
                <Link
                  key={course.id}
                  href={`/dashboard/exams/rn/course/${course.id}`}
                  className="dashboard-card group relative flex min-h-[215px] flex-col overflow-hidden rounded-xl border border-[var(--dashboard-border)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#8D79FF]/50 hover:shadow-[0_10px_25px_rgba(55,40,120,0.08)]"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/[0.08] to-indigo-500/[0.02] opacity-70" />

                  <div className="relative flex flex-1 flex-col">
                    {/* CARD HEADER */}
                    <div className="flex items-center justify-between">
                      <div className="dashboard-accent-icon !h-11 !w-11">
                        <Layers3 size={20} />
                      </div>

                      <span className="text-[10px] font-extrabold tracking-widest text-[var(--dashboard-muted)] opacity-60">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* COURSE DETAILS */}
                    <div className="mt-5 flex-1">
                      <p className="text-[9px] font-extrabold tracking-[0.15em] text-[#7663C9]">
                        RN EXAMINATION COURSE
                      </p>

                      <h3 className="dashboard-heading mt-1.5 text-base font-extrabold leading-snug transition-colors group-hover:text-[#5B3DF5]">
                        {course.name}
                      </h3>

                      <div className="dashboard-muted mt-3 flex items-center gap-2 text-xs">
                        <BookOpen size={14} />
                        {course.subjects.length}{" "}
                        {course.subjects.length === 1
                          ? "subject"
                          : "subjects"}
                      </div>
                    </div>

                    {/* FOOTER */}
                    <div className="mt-5 flex items-center justify-between border-t border-[var(--dashboard-border)] pt-3">
                      <span className="text-xs font-bold text-[#5B3DF5]">
                        Explore subjects
                      </span>

                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--dashboard-border)] bg-[var(--dashboard-surface)] transition-all duration-300 group-hover:border-[#5B3DF5] group-hover:bg-[#5B3DF5] group-hover:text-white">
                        <ArrowRight
                          size={15}
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* INFORMATION */}
        <section className="dashboard-inner-card flex flex-col gap-3 rounded-xl p-4 sm:flex-row sm:items-center">
          <div className="dashboard-accent-icon shrink-0">
            <Sparkles size={19} />
          </div>

          <div>
            <h3 className="dashboard-heading text-sm font-bold">
              Your nursing preparation starts here
            </h3>

            <p className="dashboard-muted mt-1 text-xs leading-5 sm:text-sm">
              Browse the available courses and explore their subjects
              to find the examinations you want to practise.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
