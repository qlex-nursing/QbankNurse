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

  /* =====================================================
     AVAILABLE SUBJECTS
  ===================================================== */

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

  const actualQuestionCount = selectedSubjectDetails
    ? Math.min(questionCount, selectedSubjectDetails.questionTotal)
    : questionCount;

  /* =====================================================
     START PRACTICE
  ===================================================== */

  const startPractice = () => {
    if (!selectedSubject) {
      setError("Please choose a subject before starting.");
      return;
    }

    if (!selectedSubjectDetails) {
      setError(
        "There are no practice questions available for this subject yet.",
      );
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

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="space-y-6">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative isolate min-h-[165px] overflow-hidden bg-gradient-to-r from-[#17263F] via-[#202C50] to-[#30245F] px-5 py-6 text-white sm:px-8 lg:px-11">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute -right-20 -top-32 -z-10 h-80 w-80 rounded-full bg-[#8B75FF]/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-36 left-1/3 -z-10 h-72 w-72 rounded-full bg-[#5B3DF5]/20 blur-3xl" />

        <div className="pointer-events-none absolute right-16 top-1/2 hidden h-64 w-64 -translate-y-1/2 rounded-full border border-white/[0.06] lg:block" />

        <div className="pointer-events-none absolute right-28 top-1/2 hidden h-44 w-44 -translate-y-1/2 rounded-full border border-white/[0.07] lg:block" />

        <div className="relative z-10 max-w-4xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#C9BEFF]">
            <Sparkles size={13} />
            Personalized practice
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] text-[#C8BBFF]">
              <Target size={23} strokeWidth={1.8} />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Custom Practice
            </h1>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
            Build your own practice session. Choose an exam, focus on a
            subject, customize your question count, and study at your own pace.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <HeroStat icon={ClipboardList} label="Flexible question sets" />
            <HeroStat icon={BookOpen} label="Multiple nursing subjects" />
            <HeroStat icon={GraduationCap} label="Two study modes" />
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-2 right-10 hidden text-white/[0.05] lg:block">
          <Target size={150} strokeWidth={0.8} />
        </div>
      </section>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="mx-auto max-w-[1500px] px-5 pb-8 sm:px-7 lg:px-9">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Intro */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8065E8]">
              Practice session builder
            </p>

            <h2 className="dashboard-heading mt-1.5 text-xl font-extrabold sm:text-2xl">
              Configure your practice set
            </h2>

            <p className="dashboard-muted mt-2 text-sm leading-6">
              Customize the session to match your learning goals. Your choices
              will determine how your practice questions are presented.
            </p>
          </div>

          {/* =================================================
              BUILDER CARD
          ================================================= */}

          <section className="dashboard-card overflow-hidden rounded-2xl">
            {/* Card header */}
            <div className="border-b border-[var(--dash-border)] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="dashboard-soft-icon flex h-10 w-10 items-center justify-center rounded-xl">
                  <Target size={20} />
                </div>

                <div>
                  <h3 className="dashboard-heading text-base font-extrabold">
                    Practice configuration
                  </h3>

                  <p className="dashboard-muted mt-1 text-xs">
                    Set up your next nursing practice session.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-7 p-5 sm:p-7">
              {/* =================================================
                  01 - EXAM TYPE
              ================================================= */}

              <BuilderSection
                number="01"
                title="Choose your exam"
                description="Select the examination pathway you want to focus on."
              >
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
                        className={`rounded-xl border px-4 py-2.5 text-xs font-bold transition-all ${
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
              </BuilderSection>

              {/* Divider */}
              <div className="h-px bg-[var(--dash-border)]" />

              {/* =================================================
                  02 - SUBJECT
              ================================================= */}

              <BuilderSection
                number="02"
                title="Select a subject"
                description="Choose the nursing subject you want to practice."
              >
                <div className="space-y-3">
                  <select
                    id="practice-subject"
                    value={selectedSubject}
                    onChange={(event) => {
                      setSelectedSubject(event.target.value);
                      setError("");
                    }}
                    className="dashboard-search h-12 w-full rounded-xl border px-4 text-sm outline-none transition-all focus:border-[#9B88F5] focus:ring-2 focus:ring-[#8065E8]/10"
                  >
                    <option value="">Choose a subject...</option>

                    {availableSubjects.map((subject) => (
                      <option key={subject.slug} value={subject.slug}>
                        {subject.label} ({subject.questionTotal} available
                        questions)
                      </option>
                    ))}
                  </select>

                  <div className="flex items-start gap-2 rounded-xl bg-[var(--dash-surface-soft)] px-3 py-3">
                    <FileQuestion
                      size={15}
                      className="mt-0.5 shrink-0 text-[#8065E8]"
                    />

                    <p className="dashboard-muted text-xs leading-5">
                      Only subjects with available demonstration questions are
                      selectable at the moment.
                    </p>
                  </div>

                  {selectedSubjectDetails && (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#DCD3FA] bg-[#F4F0FF] px-4 py-3">
                      <div className="flex items-center gap-2 text-[#5141A5]">
                        <BookOpen size={16} />

                        <span className="text-xs font-bold">
                          {selectedSubjectDetails.label}
                        </span>
                      </div>

                      <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-[#5B3DF5]">
                        {selectedSubjectDetails.questionTotal} questions
                        available
                      </span>
                    </div>
                  )}
                </div>
              </BuilderSection>

              {/* Divider */}
              <div className="h-px bg-[var(--dash-border)]" />

              {/* =================================================
                  03 - QUESTION COUNT
              ================================================= */}

              <BuilderSection
                number="03"
                title="Set your question count"
                description="Decide how many questions you want in this session."
              >
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {questionCounts.map((count) => {
                    const active = questionCount === count;

                    return (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setQuestionCount(count)}
                        aria-pressed={active}
                        className={`flex min-h-[76px] flex-col items-center justify-center gap-1 rounded-xl border transition-all ${
                          active
                            ? "border-[#5B3DF5] bg-[#5B3DF5]/[0.06] ring-1 ring-[#5B3DF5]/20"
                            : "dashboard-secondary-button"
                        }`}
                      >
                        <span
                          className={`text-xl font-extrabold ${
                            active
                              ? "text-[#5B3DF5]"
                              : "dashboard-heading"
                          }`}
                        >
                          {count}
                        </span>

                        <span className="text-[10px] font-semibold text-[var(--dash-muted)]">
                          Questions
                        </span>
                      </button>
                    );
                  })}
                </div>

                {selectedSubjectDetails &&
                  questionCount > selectedSubjectDetails.questionTotal && (
                    <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                      <FileQuestion
                        size={17}
                        className="mt-0.5 shrink-0"
                      />

                      <p className="text-xs leading-5">
                        This subject currently has{" "}
                        <strong>
                          {selectedSubjectDetails.questionTotal}
                        </strong>{" "}
                        demonstration questions. Your session will use the
                        available questions until the question bank is
                        expanded.
                      </p>
                    </div>
                  )}
              </BuilderSection>

              {/* Divider */}
              <div className="h-px bg-[var(--dash-border)]" />

              {/* =================================================
                  04 - MODE
              ================================================= */}

              <BuilderSection
                number="04"
                title="Choose your study mode"
                description="Decide when you want to see your answers and results."
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* Practice mode */}
                  <ModeCard
                    title="Practice Mode"
                    description="See the answer after each question."
                    selected={mode === "practice"}
                    onClick={() => setMode("practice")}
                    icon={BookOpen}
                    badge="Immediate feedback"
                  />

                  {/* Exam mode */}
                  <ModeCard
                    title="Exam Mode"
                    description="Complete your session and see your results at the end."
                    selected={mode === "exam"}
                    onClick={() => setMode("exam")}
                    icon={ClipboardList}
                    badge="Exam simulation"
                  />
                </div>
              </BuilderSection>

              {/* =================================================
                  SESSION SUMMARY
              ================================================= */}

              {selectedSubjectDetails && (
                <div className="dashboard-inner-card overflow-hidden rounded-xl">
                  <div className="flex items-center gap-2 border-b border-[var(--dash-border)] px-4 py-3">
                    <Sparkles size={15} className="text-[#8065E8]" />

                    <p className="dashboard-heading text-xs font-extrabold">
                      Your practice session
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h4 className="dashboard-heading text-base font-extrabold">
                        {selectedSubjectDetails.label}
                      </h4>

                      <p className="dashboard-muted mt-1 text-xs">
                        {selectedExam} ·{" "}
                        {mode === "practice"
                          ? "Practice Mode"
                          : "Exam Mode"}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <SummaryTag
                          icon={Target}
                          label={`${actualQuestionCount} questions`}
                        />

                        <SummaryTag
                          icon={GraduationCap}
                          label={
                            mode === "practice"
                              ? "Instant feedback"
                              : "Final results"
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] px-4 py-3 sm:min-w-[125px] sm:flex-col sm:gap-0 sm:text-center">
                      <span className="text-2xl font-extrabold text-[#5B3DF5]">
                        {actualQuestionCount}
                      </span>

                      <span className="dashboard-muted text-xs font-semibold">
                        Questions
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  ERROR MESSAGE
              ================================================= */}

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
                >
                  {error}
                </p>
              )}

              {/* =================================================
                  START BUTTON
              ================================================= */}

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={startPractice}
                  className="dashboard-primary-button flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all hover:-translate-y-0.5"
                >
                  <Sparkles size={17} />
                  Start Practice
                </button>

                <p className="dashboard-muted text-center text-[11px]">
                  <GraduationCap
                    size={14}
                    className="mr-1 inline-block"
                  />
                  Practice questions are currently demonstration content.
                </p>
              </div>
            </div>
          </section>

          {/* =================================================
              BOTTOM INFORMATION
          ================================================= */}

          <div className="dashboard-inner-card flex items-start gap-3 rounded-xl p-4">
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0 text-[#8065E8]"
            />

            <div>
              <p className="dashboard-heading text-xs font-bold">
                Make every practice session count
              </p>

              <p className="dashboard-muted mt-1 text-xs leading-5">
                Focus on understanding the rationale behind each answer.
                Consistent practice and reviewing your mistakes can help
                strengthen your clinical judgment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   HERO STAT
========================================================= */

function HeroStat({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[10px] font-semibold text-white/80 sm:text-xs">
      <Icon size={13} className="text-[#C8BBFF]" />
      {label}
    </div>
  );
}

/* =========================================================
   BUILDER SECTION
========================================================= */

function BuilderSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8DEFF] text-[10px] font-extrabold text-[#5B3DF5]">
          {number}
        </span>

        <div className="min-w-0">
          <h3 className="dashboard-heading text-sm font-extrabold sm:text-base">
            {title}
          </h3>

          <p className="dashboard-muted mt-1 text-xs leading-5">
            {description}
          </p>
        </div>
      </div>

      <div className="pl-0 sm:pl-11">{children}</div>
    </section>
  );
}

/* =========================================================
   MODE CARD
========================================================= */

function ModeCard({
  title,
  description,
  selected,
  onClick,
  icon: Icon,
  badge,
}: {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  icon: React.ElementType;
  badge: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative flex min-h-[150px] flex-col rounded-xl border p-4 text-left transition-all duration-200 ${
        selected
          ? "border-[#5B3DF5] bg-[#5B3DF5]/[0.045] ring-1 ring-[#5B3DF5]/20"
          : "dashboard-secondary-button hover:border-[#A99AFF]"
      }`}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            selected
              ? "bg-[#E8DEFF] text-[#5B3DF5]"
              : "bg-[var(--dash-surface-soft)] text-[var(--dash-muted)]"
          }`}
        >
          <Icon size={20} />
        </div>

        {selected && (
          <CheckCircle2
            size={19}
            className="shrink-0 text-[#5B3DF5]"
          />
        )}
      </div>

      <div className="mt-4">
        <h4 className="dashboard-heading text-sm font-extrabold">
          {title}
        </h4>

        <p className="dashboard-muted mt-1 text-xs leading-5">
          {description}
        </p>
      </div>

      <span
        className={`mt-3 inline-flex self-start rounded-full px-2.5 py-1 text-[9px] font-bold ${
          selected
            ? "bg-[#E8DEFF] text-[#5B3DF5]"
            : "bg-[var(--dash-surface-soft)] text-[var(--dash-muted)]"
        }`}
      >
        {badge}
      </span>
    </button>
  );
}

/* =========================================================
   SESSION SUMMARY TAG
========================================================= */

function SummaryTag({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface)] px-2.5 py-1.5 text-[10px] font-semibold text-[var(--dash-muted)]">
      <Icon size={12} className="text-[#8065E8]" />
      {label}
    </span>
  );
}