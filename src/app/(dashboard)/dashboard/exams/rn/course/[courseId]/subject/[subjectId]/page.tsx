
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock3,
  GraduationCap,
  Search,
  X,
  LoaderCircle,
  AlertCircle,
  ClipboardCheck,
  Layers3,
} from "lucide-react";

import { subjectService } from "@/lib/services/subjectService";
import { examService } from "@/lib/services/examService";

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
  year?: number;
}

interface BackendExam {
  id: number;
  guidId: string;
  title: string;
  questionsCount?: number;
  sectionsCount?: number;
  duration?: number;
  isTimed?: boolean;
  subjectId: number;
  subjectGuidId: string;
  subjectName: string;
  status?: string;
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

interface ExamApiResponse {
  success: boolean;
  message?: string;
  data?: {
    items: BackendExam[];
    skewPage: number;
    skewPerPage: number;
    skewTotal: number;
    skewTotalPages: number;
  };
}



interface SavedAnswer {
  attemptNumber?: number;
  questionOptionId?: number;
  questionContentId?: number;
  questionMatrixCellId?: number;
  questionMediaId?: number;
  userAnswerData?: string;
  userOrder?: string;
  userHotspot?: string;
  userHighlight?: string;
  openEndedAnswer?: string;
}

interface LiveExamResponse {
  data?: {
    resumeAnswers?: Record<number, SavedAnswer>;
  };
  message?: string;
  error?: string;
}

function hasSavedAnswer(answer?: SavedAnswer): boolean {
  if (!answer) return false;

  if (
    answer.questionOptionId != null ||
    answer.questionContentId != null ||
    answer.questionMatrixCellId != null ||
    answer.questionMediaId != null
  ) {
    return true;
  }

  if (
    answer.userOrder?.trim() ||
    answer.userHotspot?.trim() ||
    answer.userHighlight?.trim() ||
    answer.openEndedAnswer?.trim()
  ) {
    return true;
  }

  const rawAnswer = answer.userAnswerData?.trim();
  if (!rawAnswer) return false;

  try {
    const parsed: unknown = JSON.parse(rawAnswer);

    if (parsed == null) return false;
    if (Array.isArray(parsed)) return parsed.length > 0;

    if (typeof parsed === "object") {
      return Object.keys(parsed).length > 0;
    }

    return Boolean(parsed);
  } catch {
    // Non-JSON answer strings (for example numeric/text responses) count.
    return true;
  }
}

export default function RNSubjectExamsPage() {
  const params = useParams<{
    courseId: string;
    subjectId: string;
  }>();

  const [reviewableExams, setReviewableExams] = useState<Record<string, boolean>>({});

  const courseId = Number(params.courseId);
  const subjectId = Number(params.subjectId);

  const [subject, setSubject] = useState<BackendSubject | null>(null);
  const [exams, setExams] = useState<BackendExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSubjectExams() {
      try {
        setLoading(true);
        setError(null);

        if (
          !Number.isInteger(courseId) ||
          courseId <= 0 ||
          !Number.isInteger(subjectId) ||
          subjectId <= 0
        ) {
          throw new Error("Invalid course or subject identifier.");
        }

        // 1. Retrieve the actual subject record.
        const subjectResponse =
          await subjectService.absolute<SubjectApiResponse>({
            dynamicPage: 1,
            dynamicPerPage: 200,
            dynamicSortDirection: "asc",
          });

        if (!subjectResponse.success || !subjectResponse.data) {
          throw new Error(
            subjectResponse.message || "Unable to load subject details.",
          );
        }

        const selectedSubject = subjectResponse.data.items.find(
          (item) =>
            item.id === subjectId && item.courseId === courseId,
        );

        if (!selectedSubject) {
          throw new Error(
            "The requested subject was not found in this course.",
          );
        }

        if (!selectedSubject.guidId) {
          throw new Error(
            "The subject does not have a backend GUID.",
          );
        }

        if (cancelled) return;

        setSubject(selectedSubject);

        // 2. Retrieve actual exams using the subject GUID.
        const examResponse =
          await examService.nominal<ExamApiResponse>({
            identifier: selectedSubject.guidId,
            dynamicLearningStrataName: "subject",
            dynamicPage: 1,
            dynamicPerPage: 100,
            dynamicSortDirection: "asc",
          });

        if (!examResponse.success || !examResponse.data) {
          throw new Error(
            examResponse.message || "Unable to load subject examinations.",
          );
        }

        if (!cancelled) {
          const fetchedExams = examResponse.data.items ?? [];
          setExams(fetchedExams);

          // LiveFetch returns the saved answers for the active exam session.
          const eligibilityEntries = await Promise.all(
            fetchedExams.map(async (exam) => {
              try {
                const liveResponse =
                  await examService.live<LiveExamResponse>({
                    identifier: exam.guidId,
                    dynamicPage: 1,
                    dynamicPerPage: 100,
                    dynamicSearch: "",
                    dynamicSortDirection: "asc",
                    dynamicExamLayout: "Generic",
                    dynamicExamMode: "Exam",
                  });

                const resumeAnswers =
                  liveResponse.data?.resumeAnswers ?? {};

                const canReview = Object.values(resumeAnswers).some(
                  (answer) => hasSavedAnswer(answer),
                );

                return [exam.guidId, canReview] as const;
              } catch {
                return [exam.guidId, false] as const;
              }
            }),
          );

          if (!cancelled) {
            setReviewableExams(Object.fromEntries(eligibilityEntries));
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading examinations.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSubjectExams();

    return () => {
      cancelled = true;
    };
  }, [courseId, subjectId]);

  const filteredExams = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return exams;

    return exams.filter((exam) =>
      exam.title.toLowerCase().includes(query),
    );
  }, [exams, search]);

  const totalQuestions = exams.reduce(
    (total, exam) => total + (exam.questionsCount ?? 0),
    0,
  );

  return (
    <main className="w-full pb-8">
      {/* BREADCRUMB */}
      <div className="px-5 pb-4 pt-5 sm:px-7 lg:px-9">
        <Link
          href={`/dashboard/exams/rn/course/${courseId}`}
          className="dashboard-muted inline-flex items-center gap-2 text-sm font-semibold transition hover:text-[#5B3DF5]"
        >
          <ArrowLeft size={16} />
          Back to course subjects
        </Link>
      </div>

      {/* HERO */}
      <section className="relative isolate flex min-h-[190px] w-full items-center overflow-hidden bg-gradient-to-r from-[#17263F] via-[#202C50] to-[#30245F] px-5 py-7 text-white sm:px-8 lg:px-11">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_50%,rgba(91,61,245,0.22),transparent_55%)]" />

        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/[0.06]" />

        <div className="relative z-10 w-full max-w-4xl">
          <span className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.22em] text-[#B9A9FF]">
            <GraduationCap size={14} />
            RN SUBJECT EXAMINATIONS
          </span>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {loading ? (
              "Loading examinations..."
            ) : (
              <>
                {subject?.name ?? "Subject"}{" "}
                <span className="text-[#B9A9FF]">Exams</span>
              </>
            )}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
            Explore available examinations for this subject and choose
            an assessment to begin.
          </p>

          {!loading && !error && (
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-white/75">
              <span>{exams.length} examinations</span>
              <span>{totalQuestions.toLocaleString()} catalogue questions</span>
            </div>
          )}
        </div>
      </section>

      {/* CONTENT */}
      <div className="mx-auto w-full max-w-[1500px] space-y-6 px-5 py-7 sm:px-7 lg:px-9">
        <section className="space-y-4">
          <div>
            <p className="dashboard-section-label">
              AVAILABLE EXAMINATIONS
            </p>

            <h2 className="dashboard-heading mt-1.5 text-xl font-extrabold">
              Choose an examination
            </h2>

            <p className="dashboard-muted mt-1 text-sm">
              These examinations are retrieved from the backend catalogue.
            </p>
          </div>

          {/* SEARCH */}
          {!loading && exams.length > 0 && (
            <div className="dashboard-search flex min-h-11 items-center gap-3 rounded-xl px-4">
              <Search size={18} className="dashboard-muted shrink-0" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search examinations..."
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
                Loading real examinations...
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
                Unable to load examinations
              </h3>

              <p className="dashboard-muted max-w-lg text-sm">
                {error}
              </p>
            </div>
          )}

          {/* EMPTY */}
          {!loading && !error && filteredExams.length === 0 && (
            <div className="dashboard-card flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-2xl p-6 text-center">
              <ClipboardCheck
                size={28}
                className="dashboard-muted"
              />

              <h3 className="dashboard-heading font-bold">
                {exams.length === 0
                  ? "No examinations available"
                  : "No matching examinations"}
              </h3>

              <p className="dashboard-muted text-sm">
                {exams.length === 0
                  ? "The backend has not returned any examinations for this subject."
                  : "Try another examination search term."}
              </p>
            </div>
          )}

         {/* EXAM CARDS */}
{!loading && !error && filteredExams.length > 0 && (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
    {filteredExams.map((exam, index) => {
      const examIdentifier = encodeURIComponent(
        exam.guidId || String(exam.id),
      );

      const canReview = reviewableExams[exam.guidId] === true;

const modes = [
  { label: "Exam", value: "Exam" },
  ...(canReview
    ? [{ label: "Review", value: "Review" }]
    : []),
  { label: "Tutor", value: "Tutor" },
];

      return (
        <article
          key={exam.guidId || exam.id}
          className="dashboard-card group relative flex min-h-[220px] flex-col overflow-hidden rounded-xl border border-[var(--dashboard-border)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#8D79FF]/50 hover:shadow-[0_10px_24px_rgba(55,40,120,0.07)]"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div className="dashboard-accent-icon !h-10 !w-10">
              <ClipboardCheck size={18} />
            </div>

            <span className="text-[10px] font-extrabold tracking-widest text-[var(--dashboard-muted)] opacity-60">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* DETAILS */}
          <div className="mt-4 flex-1">
            <h3 className="dashboard-heading text-base font-extrabold leading-snug">
              {exam.title}
            </h3>

            <div className="dashboard-muted mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <span className="inline-flex items-center gap-1.5">
                <BookOpen size={14} />
                {exam.questionsCount ?? 0} questions
              </span>

              {exam.sectionsCount != null && (
                <span className="inline-flex items-center gap-1.5">
                  <Layers3 size={14} />
                  {exam.sectionsCount} sections
                </span>
              )}

              {exam.duration != null && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={14} />
                  {exam.duration} minutes
                </span>
              )}
            </div>
          </div>

          {/* STUDY MODES */}
        <div
  className={`mt-4 grid gap-2 border-t border-[var(--dashboard-border)] pt-3 ${
    canReview ? "grid-cols-3" : "grid-cols-2"
  }`}
>
            {modes.map((mode) => (
              <Link
                key={mode.value}
                href={`/dashboard/exams/rn/exam/${examIdentifier}?mode=${mode.value}&layout=Generic`}
                className={`flex items-center justify-center rounded-lg border px-2 py-2 text-xs font-bold transition-colors ${
  mode.value === "Exam"
    ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-400/30 dark:bg-blue-500/15 dark:text-blue-300 dark:hover:bg-blue-500/25"
    : mode.value === "Review"
      ? "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 dark:border-violet-400/30 dark:bg-violet-500/15 dark:text-violet-300 dark:hover:bg-violet-500/25"
      : "border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 dark:border-teal-400/30 dark:bg-teal-500/15 dark:text-teal-300 dark:hover:bg-teal-500/25"
}`}
              >
                {mode.label}
              </Link>
            ))}
          </div>
        </article>
      );
    })}
  </div>
)}
        </section>
      </div>
    </main>
  );
}