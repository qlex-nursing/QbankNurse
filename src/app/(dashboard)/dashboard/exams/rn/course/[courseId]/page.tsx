
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Search,
  X,
  LoaderCircle,
  AlertCircle,
  Layers3,
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
  type?: string;
  accessType?: string;
  year?: number;
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

export default function RNCourseDetailPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = Number(params.courseId);

  const [subjects, setSubjects] = useState<BackendSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSubjects() {
      try {
        setLoading(true);
        setError(null);

        if (!Number.isInteger(courseId) || courseId <= 0) {
          throw new Error("Invalid course identifier.");
        }

        const response =
          await subjectService.absolute<SubjectApiResponse>({
            dynamicPage: 1,
            dynamicPerPage: 200,
            dynamicSortDirection: "asc",
          });

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to load course subjects.",
          );
        }

        if (!cancelled) {
          const courseSubjects = (response.data.items ?? []).filter(
            (subject) => subject.courseId === courseId,
          );

          setSubjects(courseSubjects);

          if (courseSubjects.length === 0) {
            setError(
              "No subjects were found for this course in the returned catalogue.",
            );
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading subjects.",
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
  }, [courseId]);

  const courseName = subjects[0]?.courseName ?? "RN Examination Course";

  const filteredSubjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return subjects;

    return subjects.filter(
      (subject) =>
        subject.name.toLowerCase().includes(query) ||
        (subject.description ?? "").toLowerCase().includes(query),
    );
  }, [subjects, search]);

  return (
    <main className="w-full pb-8">
      {/* BREADCRUMB */}
      <div className="px-5 pb-4 pt-5 sm:px-7 lg:px-9">
        <Link
          href="/dashboard/exams/rn"
          className="dashboard-muted inline-flex items-center gap-2 text-sm font-semibold transition hover:text-[#5B3DF5]"
        >
          <ArrowLeft size={16} />
          Back to RN Courses
        </Link>
      </div>

      {/* HERO */}
      <section className="relative isolate flex min-h-[190px] w-full items-center overflow-hidden bg-gradient-to-r from-[#17263F] via-[#202C50] to-[#30245F] px-5 py-7 text-white sm:px-8 lg:px-11">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_50%,rgba(91,61,245,0.22),transparent_55%)]" />

        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/[0.06]" />

        <div className="relative z-10 w-full max-w-4xl">
          <span className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.22em] text-[#B9A9FF]">
            <GraduationCap size={14} />
            RN COURSE CATALOGUE
          </span>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {loading ? (
              "Loading course..."
            ) : (
              <>
                Explore{" "}
                <span className="text-[#B9A9FF]">{courseName}</span>
              </>
            )}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
            Explore the subjects available in this examination course
            and choose where you want to begin.
          </p>

          {!loading && subjects.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-white/75">
              <span>{subjects.length} subjects</span>
              <span>Course ID: {courseId}</span>
            </div>
          )}
        </div>
      </section>

      {/* CONTENT */}
      <div className="mx-auto w-full max-w-[1500px] space-y-6 px-5 py-7 sm:px-7 lg:px-9">
        <section className="space-y-4">
          <div>
            <p className="dashboard-section-label">
              COURSE SUBJECTS
            </p>

            <h2 className="dashboard-heading mt-1.5 text-xl font-extrabold">
              Explore subjects
            </h2>

            <p className="dashboard-muted mt-1 text-sm">
              Select a subject to view its available examinations.
            </p>
          </div>

          {/* SEARCH */}
          {!loading && subjects.length > 0 && (
            <div className="dashboard-search flex min-h-11 items-center gap-3 rounded-xl px-4">
              <Search size={18} className="dashboard-muted shrink-0" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search subjects..."
                className="dashboard-heading w-full bg-transparent text-sm outline-none placeholder:opacity-60"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="dashboard-muted transition hover:opacity-60"
                >
                  <X size={17} />
                </button>
              )}
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className="dashboard-card flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-2xl">
              <LoaderCircle
                size={30}
                className="animate-spin text-[#5B3DF5]"
              />
              <p className="dashboard-muted text-sm">
                Loading course subjects...
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
                Unable to load subjects
              </h3>

              <p className="dashboard-muted max-w-lg text-sm">
                {error}
              </p>
            </div>
          )}

          {/* EMPTY SEARCH */}
          {!loading && !error && filteredSubjects.length === 0 && (
            <div className="dashboard-card flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-2xl p-6 text-center">
              <Search size={26} className="dashboard-muted" />

              <h3 className="dashboard-heading font-bold">
                No matching subjects
              </h3>

              <p className="dashboard-muted text-sm">
                Try another subject name or search term.
              </p>
            </div>
          )}

          {/* SUBJECT CARDS */}
          {!loading && !error && filteredSubjects.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredSubjects.map((subject, index) => (
                <Link
                  key={subject.id}
                  href={`/dashboard/exams/rn/course/${courseId}/subject/${subject.id}`}
                  className="dashboard-card group relative flex min-h-[205px] flex-col overflow-hidden rounded-xl border border-[var(--dashboard-border)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#8D79FF]/50 hover:shadow-[0_10px_24px_rgba(55,40,120,0.07)]"
                >
                  {/* CARD HEADER */}
                  <div className="flex items-center justify-between">
                    <div className="dashboard-accent-icon !h-10 !w-10">
                      <BookOpen size={18} />
                    </div>

                    <span className="text-[10px] font-extrabold tracking-widest text-[var(--dashboard-muted)] opacity-60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* SUBJECT DETAILS */}
                  <div className="mt-4 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {subject.type && (
                        <span className="rounded-full bg-[#E8DEFF] px-2.5 py-1 text-[9px] font-bold text-[#392576]">
                          {subject.type}
                        </span>
                      )}

                      {subject.year != null && (
                        <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-[9px] font-bold text-sky-600">
                          {subject.year}
                        </span>
                      )}
                    </div>

                    <h3 className="dashboard-heading mt-3 text-base font-extrabold leading-snug transition-colors group-hover:text-[#5B3DF5]">
                      {subject.name}
                    </h3>

                    <p className="dashboard-muted mt-1.5 text-xs leading-5">
                      {subject.description || "Explore examinations for this subject."}
                    </p>
                  </div>

                  {/* FOOTER */}
                  <div className="mt-4 flex items-center justify-between border-t border-[var(--dashboard-border)] pt-3">
                    <span className="text-xs font-bold text-[#5B3DF5]">
                      View examinations
                    </span>

                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--dashboard-border)] bg-[var(--dashboard-surface)] transition-all duration-300 group-hover:border-[#5B3DF5] group-hover:bg-[#5B3DF5] group-hover:text-white">
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* COURSE INFORMATION */}
        <section className="dashboard-inner-card flex flex-col gap-3 rounded-xl p-4 sm:flex-row sm:items-center">
          <div className="dashboard-accent-icon shrink-0">
            <Layers3 size={19} />
          </div>

          <div>
            <h3 className="dashboard-heading text-sm font-bold">
              Explore your examination resources
            </h3>

            <p className="dashboard-muted mt-1 text-xs leading-5 sm:text-sm">
              Each subject connects to its own examination catalogue.
              Select a subject to discover the available exams.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
