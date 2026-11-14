"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FileQuestion,
  GraduationCap,
  Sparkles,
  Target,
} from "lucide-react";

import { practiceQuestions } from "@/data/mock/dashboard/practice-questions";

type ExamType = "All" | "RN" | "LPN" | "NCLEX" | "HESI" | "ATI";
type PracticeMode = "practice" | "exam";

const examTypes: ExamType[] = [
  "All",
  "RN",
  "LPN",
  "NCLEX",
  "HESI",
  "ATI",
];

const questionCounts = [10, 25, 50, 75];

const subjectLabels: Record<string, string> = {
  "medical-surgical": "Medical-Surgical",
  "maternal-newborn": "Maternal-Newborn",
  fundamentals: "Fundamentals",
  pharmacology: "Pharmacology",
  "obstetrics-and-pediatrics": "Obstetrics and Pediatrics",
  "mental-health": "Mental Health",
  "dosage-calculations": "Dosage Calculations",
  leadership: "Leadership",
  capstone: "Capstone",
  "community-health": "Community Health",
  "adult-health": "Adult Health",
  nutrition: "Nutrition",
  "foundations-of-nursing": "Foundations of Nursing",
  "physical-assessments": "Physical Assessments",
  "health-assessment": "Health Assessment",
};

export default function CustomPracticePage() {
  const router = useRouter();

  const [selectedExam, setSelectedExam] = useState<ExamType>("All");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [questionCount, setQuestionCount] = useState(25);
  const [mode, setMode] = useState<PracticeMode>("practice");
  const [error, setError] = useState("");

  const availableSubjects = useMemo(() => {
    return Object.keys(practiceQuestions).map((slug) => ({
      slug,
      label:
        subjectLabels[slug] ??
        slug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      questionTotal: practiceQuestions[slug].length,
    }));
  }, []);

  const selectedSubjectDetails = availableSubjects.find(
    (subject) => subject.slug === selectedSubject,
  );

  const startPractice = () => {
    if (!selectedSubject) {
      setError("Please choose a subject before starting.");
      return;
    }

    if (!selectedSubjectDetails) {
      setError("There are no practice questions available for this subject yet.");
      return;
    }

    const actualCount = Math.min(
      questionCount,
      selectedSubjectDetails.questionTotal,
    );

    const params = new URLSearchParams({
      count: String(actualCount),
      requestedCount: String(questionCount),
      mode,
      exam: selectedExam,
      source: "custom",
    });

    router.push(
      `/dashboard/exams/ati/${selectedSubject}/practice?${params.toString()}`,
    );
  };

  return (
    <div className="dashboard-content mx-auto w-full max-w-5xl space-y-7 px-5 py-7 sm:px-7 lg:px-9">
      {/* Heading */}
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="dashboard-accent-icon">
            <Target size={18} />
          </div>

          <span className="dashboard-section-label">
            PERSONALIZED PRACTICE
          </span>
        </div>

        <h1 className="dashboard-heading text-2xl font-extrabold sm:text-3xl">
          Build a practice set
        </h1>

        <p className="dashboard-muted max-w-2xl text-sm leading-6">
          Choose your exam, select a subject, decide how many questions to
          attempt, and study in the way that works best for you.
        </p>
      </section>

      {/* Builder */}
      <section className="dashboard-card mx-auto w-full max-w-3xl rounded-3xl p-5 sm:p-7">
        <div className="space-y-7">
          {/* Exam */}
          <div>
            <label className="dashboard-heading mb-3 block text-sm font-bold">
              Exam
            </label>

            <div className="flex flex-wrap gap-2">
              {examTypes.map((exam) => {
                const active = selectedExam === exam;

                return (
                  <button
                    key={exam}
                    type="button"
                    onClick={() => {
                      setSelectedExam(exam);
                      setError("");
                    }}
                    aria-pressed={active}
                    className={`rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                      active
                        ? "border-[#5B3DF5] bg-[#5B3DF5] text-white shadow-sm"
                        : "dashboard-secondary-button"
                    }`}
                  >
                    {exam}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label
              htmlFor="practice-subject"
              className="dashboard-heading mb-3 block text-sm font-bold"
            >
              Subject
            </label>

            <select
              id="practice-subject"
              value={selectedSubject}
              onChange={(event) => {
                setSelectedSubject(event.target.value);
                setError("");
              }}
              className="dashboard-search h-12 w-full rounded-xl border px-4 text-sm outline-none transition-all"
            >
              <option value="">Choose a subject...</option>

              {availableSubjects.map((subject) => (
                <option key={subject.slug} value={subject.slug}>
                  {subject.label} ({subject.questionTotal} available questions)
                </option>
              ))}
            </select>

            <p className="dashboard-muted mt-2 text-xs">
              Only subjects with available demonstration questions are
              selectable at the moment.
            </p>
          </div>

          {/* Question count */}
          <div>
            <label className="dashboard-heading mb-3 block text-sm font-bold">
              Number of questions
            </label>

            <div className="flex flex-wrap gap-2">
              {questionCounts.map((count) => {
                const active = questionCount === count;

                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    aria-pressed={active}
                    className={`flex h-11 min-w-14 items-center justify-center rounded-full border px-4 text-sm font-bold transition-all ${
                      active
                        ? "border-[#5B3DF5] bg-[#5B3DF5] text-white shadow-sm"
                        : "dashboard-secondary-button"
                    }`}
                  >
                    {count}
                  </button>
                );
              })}
            </div>

            {selectedSubjectDetails &&
              questionCount > selectedSubjectDetails.questionTotal && (
                <p className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-800">
                  <FileQuestion size={15} className="mt-0.5 shrink-0" />
                  This subject currently has{" "}
                  {selectedSubjectDetails.questionTotal} demonstration
                  questions. Your session will use the available questions
                  until the question bank is expanded.
                </p>
              )}
          </div>

          {/* Mode */}
          <div>
            <label className="dashboard-heading mb-3 block text-sm font-bold">
              Mode
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMode("practice")}
                aria-pressed={mode === "practice"}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  mode === "practice"
                    ? "border-[#5B3DF5] bg-[#5B3DF5]/5 ring-1 ring-[#5B3DF5]/20"
                    : "dashboard-secondary-button"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="dashboard-heading text-sm font-bold">
                    Practice Mode
                  </span>

                  {mode === "practice" && (
                    <CheckCircle2 size={18} className="text-[#5B3DF5]" />
                  )}
                </div>

                <p className="dashboard-muted mt-1 text-xs">
                  See the answer after each question.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode("exam")}
                aria-pressed={mode === "exam"}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  mode === "exam"
                    ? "border-[#5B3DF5] bg-[#5B3DF5]/5 ring-1 ring-[#5B3DF5]/20"
                    : "dashboard-secondary-button"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="dashboard-heading text-sm font-bold">
                    Exam Mode
                  </span>

                  {mode === "exam" && (
                    <CheckCircle2 size={18} className="text-[#5B3DF5]" />
                  )}
                </div>

                <p className="dashboard-muted mt-1 text-xs">
                  See your results at the end.
                </p>
              </button>
            </div>
          </div>

          {/* Session summary */}
          {selectedSubjectDetails && (
            <div className="dashboard-inner-card flex flex-wrap items-center justify-between gap-3 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="dashboard-accent-icon">
                  <BookOpen size={19} />
                </div>

                <div>
                  <p className="dashboard-heading text-sm font-bold">
                    Your practice set
                  </p>

                  <p className="dashboard-muted mt-1 text-xs">
                    {selectedSubjectDetails.label} · {selectedExam} ·{" "}
                    {mode === "practice" ? "Practice Mode" : "Exam Mode"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="dashboard-heading text-lg font-extrabold">
                  {Math.min(
                    questionCount,
                    selectedSubjectDetails.questionTotal,
                  )}
                </p>
                <p className="dashboard-muted text-[10px]">
                  Questions
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
            >
              {error}
            </p>
          )}

          {/* Start */}
          <button
            type="button"
            onClick={startPractice}
            className="dashboard-primary-button flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all"
          >
            <Sparkles size={17} />
            Start Practice
          </button>

          <p className="dashboard-muted text-center text-[11px]">
            <GraduationCap size={14} className="mr-1 inline-block" />
            Practice questions are currently demonstration content.
          </p>
        </div>
      </section>
    </div>
  );
}