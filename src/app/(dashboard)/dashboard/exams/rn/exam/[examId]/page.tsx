"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Loader2,
  Save,
} from "lucide-react";
import { examService } from "@/lib/services/examService";
import { apiFetch } from "@/lib/api/api";

// ============================================================
// QUESTION OPTIONS
// ============================================================

interface SessionQuestionOption {
  id: number;
  guidId: string;
  answerContent: string;
  description?: string;
  option: string;
  group?: number;
  data?: string;
  link?: string;
  label?: string;
  order?: string;
  explanation?: string;
}

// ============================================================
// QUESTION CONTENT
// ============================================================

interface SessionQuestionContent {
  id: number;
  guidId: string;
  title: string;
  description: string;
  link?: string;
  prerequisites?: string;
  instructions?: string;
  isFeatured: boolean;
}

// ============================================================
// QUESTION MEDIA
// ============================================================

interface SessionQuestionMedia {
  id: number;
  guidId: string;
  type: string;
  mediaPath: string;
  thumbnailPath?: string;
  description?: string;
  instructions?: string;
  mimeType?: string;
  fileSize?: number;
  width?: number;
  height?: number;
  duration?: number;
  isPrimary: boolean;
}

// ============================================================
// MATRIX QUESTIONS
// ============================================================

interface SessionQuestionMatrixCell {
  id: number;
  guidId: string;
  rowIndex: number;
  columnIndex: number;
  cellValue?: string;
  isCorrect: boolean;
  scoreWeight?: number;
  explanation?: string;
  isLocked: boolean;
}

interface SessionQuestionMatrix {
  id: number;
  guidId: string;
  title?: string;
  description?: string;
  topLeftCell?: string;
  rowCount: number;
  columnCount: number;
  rowHeaders: string;
  columnHeaders: string;
  responseType: string;
  isRequired: boolean;
  instructions?: string;
  allowPartialCredit: boolean;
  randomizeRows: boolean;
  randomizeColumns: boolean;
  cells: SessionQuestionMatrixCell[];
}

// ============================================================
// CORRECT ANSWERS
// ============================================================

interface SessionCorrectAnswer {
  id: number;
  guidId: string;
  questionId: number;
  questionOptionId?: number;
  questionContentId?: number;
  questionMatrixCellId?: number;
  questionMediaId?: number;
  correctOrder?: string;
  correctHotspot?: string;
  correctHighlight?: string;
  isCorrect: boolean;
  description?: string;
  hint?: string;
  explanationImage?: string;
  openEndedAnswer?: string;
  caseSensitive: boolean;
  scoreWeight?: number;
  allowPartialCredit: boolean;
  validationRules?: string;
}

// ============================================================
// QUESTION ACTIONS
// ============================================================

interface SessionQuestionAction {
  id: number;
  guidId: string;
  userId: number;
  actionValue: string;
  actionContent: string;
  status?: string;
  description?: string;
  createdAt: string;
}

// ============================================================
// EXAM MODES
// ============================================================

interface SessionExamModeRule {
  id: number;
  guidId: string;
  key: string;
  category: string;
  value: string;
  valueType: string;
  isEnabled: boolean;
  description?: string;
  instructions?: string;
}

interface SessionExamMode {
  id: number;
  guidId: string;
  mode: string;
  modeValue: number;
  isEnabled: boolean;
  description?: string;
  instructions?: string;
  rules: SessionExamModeRule[];
}

// ============================================================
// EXAM DESIGN
// ============================================================

interface SessionExamDesign {
  id: number;
  guidId: string;
  defaultLayout: string;
  allowLayoutSwitching: boolean;
  allowModeSwitching: boolean;
  description?: string;
  instructions?: string;
  orientation: string;
  reviewable: boolean;
}

// ============================================================
// EXAM ACTIONS
// ============================================================

interface SessionExamAction {
  id: number;
  guidId: string;
  userId: number;
  actionType: string;
  actionValue: string;
  actionContent: string;
  residualDuration?: number;
  attemptCount?: number;
  isAttempted?: boolean;
  status?: string;
  description?: string;
  createdAt: string;
}

// ============================================================
// SAVED ANSWERS
// ============================================================

interface SavedAnswer {
  id?: number;
  guidId?: string;
  userId?: number;
  examId?: number;
  questionId?: number;
  attemptNumber?: number;
  questionOptionId?: number;
  questionContentId?: number;
  questionMatrixCellId?: number;
  questionMediaId?: number;
  userAnswerData?: string;
  userOrder?: string;
  userHotspot?: string;
  userHighlight?: string;
  description?: string;
  openEndedAnswer?: string;
  caseSensitive?: boolean;
  scoreWeight?: number;
  allowPartialCredit?: boolean;
  validationRules?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================
// FULL QUESTION
// ============================================================

interface SessionQuestion {
  id: number;
  guidId: string;
  questionText: string;
  metaQuestionText?: string;
  description?: string;
  target?: string;
  type?: string;
  accessType?: string;
  accessGroup?: string;
  accessValue?: number;
  code?: string;
  status?: string;
  segment?: string;
  fragment?: string;
  link?: string;
  weight?: number;
  rating?: number;
  level?: string;
  difficulty?: string;
  year?: number;
  resources?: string;
  prerequisites?: string;
  instructions?: string;
  isFeatured?: boolean;

  questionOptions?: SessionQuestionOption[];
  questionContents?: SessionQuestionContent[];
  questionMedias?: SessionQuestionMedia[];
  questionMatrices?: SessionQuestionMatrix[];
  questionCorrectAnswers?: SessionCorrectAnswer[];
  questionActions?: SessionQuestionAction[];

  savedUserAnswer?: SavedAnswer;
}

// ============================================================
// SECTION
// ============================================================

interface SessionSection {
  id: number;
  guidId: string;
  name: string;
  description?: string;
  status?: string;
  questions: SessionQuestion[];
}

// ============================================================
// EXAM SESSION
// ============================================================

interface LiveExamSession {
  exam: {
    success?: boolean;
    message?: string;

    id?: number;
    guidId?: string;

    assessmentId?: number;
    assessmentGuidId?: string;
    assessmentName?: string;

    title?: string;
    description?: string;

    questionsCount: number;
    sectionsCount?: number;

    selectedMode?: string;
    selectedLayout?: string;

    showResultsImmediately?: boolean;
    allowReview?: boolean;
    shuffleQuestions?: boolean;

    isTimed?: boolean;
    timeLimitPerQuestion?: number;

    duration?: number;
    passMark?: number;
    totalMarks?: number;
    attemptsAllowed?: number;

    scoringType?: string;
    instructions?: string;
  };

  design?: SessionExamDesign;

  modes?: SessionExamMode[];

  examActions?: SessionExamAction[];

  sections: SessionSection[];

  resumeAnswers: Record<number, SavedAnswer>;
}

// ============================================================
// API RESPONSE
// ============================================================

interface LiveExamResponse {
  data?: LiveExamSession;
  message?: string;
  error?: string;
}

// ============================================================
// ANSWER STATE
// ============================================================

type AnswerState = Record<number, number[]>;

// ============================================================
// QUESTION TYPE HELPERS
// ============================================================

function getQuestionType(type?: string) {
  const normalized = type?.toLowerCase() ?? "";

  if (normalized.includes("multipleselect")) {
    return "multiple";
  }

  if (normalized.includes("singlechoice")) {
    return "single";
  }

  return "unsupported";
}

// ============================================================
// RESTORE SAVED ANSWERS
// ============================================================

function getSavedOptionIds(answer?: SavedAnswer): number[] {
  if (!answer) return [];

  if (answer.questionOptionId) {
    return [answer.questionOptionId];
  }

  if (!answer.userAnswerData) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(answer.userAnswerData);

    if (typeof parsed === "number") {
      return [parsed];
    }

    if (Array.isArray(parsed)) {
      return parsed.filter(
        (value): value is number => typeof value === "number",
      );
    }

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "questionOptionIds" in parsed &&
      Array.isArray(parsed.questionOptionIds)
    ) {
      return parsed.questionOptionIds.filter(
        (value): value is number => typeof value === "number",
      );
    }
  } catch {
    const parsedNumber = Number(answer.userAnswerData);

    if (Number.isFinite(parsedNumber)) {
      return [parsedNumber];
    }
  }

  return [];
}

function hasSavedAnswer(answer?: SavedAnswer): boolean {
  if (!answer) return false;

  // Structured answer references
  if (
    answer.questionOptionId != null ||
    answer.questionContentId != null ||
    answer.questionMatrixCellId != null ||
    answer.questionMediaId != null
  ) {
    return true;
  }

  // Other supported answer formats
  if (
    answer.userOrder?.trim() ||
    answer.userHotspot?.trim() ||
    answer.userHighlight?.trim() ||
    answer.openEndedAnswer?.trim()
  ) {
    return true;
  }

  // Generic answer data
  if (answer.userAnswerData?.trim()) {
    const value = answer.userAnswerData.trim();

    return value !== "null" && value !== "undefined" && value !== "[]";
  }

  return false;
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function RNLiveExamPage() {
  const params = useParams<{ examId: string }>();
  const searchParams = useSearchParams();

  const [session, setSession] = useState<LiveExamSession | null>(null);

  const [answers, setAnswers] = useState<AnswerState>({});

  const [savingQuestions, setSavingQuestions] = useState<number[]>([]);

  const [saveErrors, setSaveErrors] = useState<Record<number, string>>({});

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  // ==========================================================
  // EXAM MODE
  // ==========================================================

  const examMode = (
    searchParams.get("mode") ||
    session?.exam.selectedMode ||
    "Exam"
  ).toLowerCase();

  // QLex mode visibility rules:
  //
  // Practice: hints + correct answers
  // Exam: no hints or correct answers
  // Test: hints only
  // Review: correct answers only
  // Tutor: hints + correct answers
  // Adaptive: no feedback rules assumed here

  const canShowHint = [
    "practice",
    "test",
    "tutor",
  ].includes(examMode);

  const canShowCorrectAnswer = [
    "practice",
    "review",
  ].includes(examMode);

  // ==========================================================
  // LOAD EXAM
  // ==========================================================

  useEffect(() => {
    let cancelled = false;

    async function loadExam() {
      try {
        setLoading(true);
        setError(null);

        const result = await examService.live<LiveExamResponse>({
          identifier: params.examId,
          dynamicPage: 1,
          dynamicPerPage: 100,
          dynamicSearch: "",
          dynamicSortDirection: "asc",
          dynamicExamLayout: searchParams.get("layout") || "Generic",
          dynamicExamMode: searchParams.get("mode") || "Exam",
        });

        if (!result.data) {
          throw new Error(
            result.message ||
              result.error ||
              "No exam session was returned.",
          );
        }

        if (!cancelled) {
          setSession(result.data);

          const restoredAnswers: AnswerState = {};

          for (const section of result.data.sections ?? []) {
            for (const question of section.questions ?? []) {
              const saved =
                result.data.resumeAnswers?.[question.id] ??
                question.savedUserAnswer;

              restoredAnswers[question.id] =
                getSavedOptionIds(saved);
            }
          }

          setAnswers(restoredAnswers);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load this examination.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (params.examId) {
      void loadExam();
    }

    return () => {
      cancelled = true;
    };
  }, [params.examId, searchParams]);

  // ==========================================================
  // SAVE ANSWER
  // ==========================================================

  async function selectAnswer(
    section: SessionSection,
    question: SessionQuestion,
    optionId: number,
  ) {
    if (!session) return;

    const answerType = getQuestionType(question.type);

    if (answerType === "unsupported") return;

    const previousAnswer = answers[question.id] ?? [];

    const nextAnswer =
      answerType === "multiple"
        ? previousAnswer.includes(optionId)
          ? previousAnswer.filter((id) => id !== optionId)
          : [...previousAnswer, optionId]
        : [optionId];

    // Optimistic UI update.
    setAnswers((current) => ({
      ...current,
      [question.id]: nextAnswer,
    }));

    setSavingQuestions((current) =>
      current.includes(question.id)
        ? current
        : [...current, question.id],
    );

    setSaveErrors((current) => ({
      ...current,
      [question.id]: "",
    }));

    const submissionType =
      answerType === "multiple"
        ? question.type?.toLowerCase().includes("casebased")
          ? "ActionCaseBasedMultipleSelect"
          : "ActionMultipleSelect"
        : question.type?.toLowerCase().includes("casebased")
          ? "ActionCaseBasedSingleChoice"
          : "ActionSingleChoice";

    try {
      await apiFetch("/api/nexus/strata/assessment/exam/upserts", {
        method: "POST",
        body: {
          actionGroup: "ExamAnswers",
          submissionType,

          examId: session.exam.id,
          examGuidId: session.exam.guidId,

          sectionId: section.id,
          sectionGuidId: section.guidId,

          questionId: question.id,
          questionGuidId: question.guidId,

          answer:
            answerType === "multiple"
              ? nextAnswer
              : nextAnswer[0] ?? null,
        },
      });
    } catch (err) {
      // Roll back optimistic update on failure.
      setAnswers((current) => ({
        ...current,
        [question.id]: previousAnswer,
      }));

      setSaveErrors((current) => ({
        ...current,
        [question.id]:
          err instanceof Error
            ? err.message
            : "Unable to save your answer.",
      }));
    } finally {
      setSavingQuestions((current) =>
        current.filter((id) => id !== question.id),
      );
    }
  }

  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 dashboard-muted">
          <Loader2 className="animate-spin" size={22} />
          Loading examination...
        </div>
      </main>
    );
  }

  // ==========================================================
  // ERROR STATE
  // ==========================================================

  if (error || !session) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <div className="dashboard-card rounded-2xl p-6">
          <AlertCircle className="mb-3 text-red-500" size={26} />

          <h1 className="dashboard-heading text-lg font-bold">
            Unable to load examination
          </h1>

          <p className="dashboard-muted mt-2 text-sm">
            {error}
          </p>
        </div>
      </main>
    );
  }

  // ==========================================================
  // EXAM UI
  // ==========================================================

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">

      {/* EXAM HEADER */}

      <header className="dashboard-card rounded-2xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="dashboard-heading text-2xl font-extrabold">
              {session.exam.title || "RN Examination"}
            </h1>

            {session.exam.description && (
              <p className="dashboard-muted mt-2 text-sm">
                {session.exam.description}
              </p>
            )}

            <p className="dashboard-muted mt-3 text-sm">
              {session.exam.questionsCount} questions ·{" "}
              {session.sections.length} sections
            </p>
          </div>

          <span className="rounded-full border border-[#8D79FF]/30 bg-[#8D79FF]/10 px-4 py-2 text-xs font-bold capitalize text-[#8D79FF]">
            {examMode} Mode
          </span>
        </div>

        {session.exam.instructions && (
          <div className="mt-5 rounded-xl border border-[var(--dashboard-border)] p-4">
            <h3 className="dashboard-heading text-sm font-bold">
              Examination Instructions
            </h3>

            <p className="dashboard-muted mt-2 whitespace-pre-wrap text-sm">
              {session.exam.instructions}
            </p>
          </div>
        )}
      </header>

      {/* EXAM SECTIONS */}

     {session.sections.map((section, sectionIndex) => {
  const visibleQuestions =
    examMode === "review"
      ? section.questions.filter((question) => {
          const saved =
            session.resumeAnswers?.[question.id] ??
            question.savedUserAnswer;

          return hasSavedAnswer(saved);
        })
      : section.questions;

  if (visibleQuestions.length === 0) {
    return null;
  }

  return (
    <section
      key={section.guidId || section.id}
      className="space-y-4"
    >
      <div>
        <h2 className="dashboard-heading text-lg font-bold">
          {sectionIndex + 1}. {section.name}
        </h2>

        {section.description && (
          <p className="dashboard-muted mt-1 text-sm">
            {section.description}
          </p>
        )}
      </div>

      {visibleQuestions.map((question, questionIndex) => {
            const answerType = getQuestionType(question.type);

            const selectedOptions = answers[question.id] ?? [];
            const hasAnswered =
  selectedOptions.length > 0 &&
  !savingQuestions.includes(question.id) &&
  !saveErrors[question.id];

const canRevealQuestionAnswer =
  canShowCorrectAnswer ||
  (examMode === "tutor" && hasAnswered);

            const isSaving = savingQuestions.includes(question.id);

            const saveError = saveErrors[question.id];

            const correctAnswers =
              question.questionCorrectAnswers ?? [];

            const correctOptionIds = correctAnswers
              .filter(
                (answer) =>
                  answer.isCorrect &&
                  answer.questionOptionId !== undefined,
              )
              .map((answer) => answer.questionOptionId as number);

            const hints = [
              ...new Set(
                correctAnswers
                  .map((answer) => answer.hint)
                  .filter((hint): hint is string => Boolean(hint)),
              ),
            ];

            const rationales = correctAnswers.filter(
              (answer) =>
                answer.isCorrect && Boolean(answer.description),
            );

            return (
              <article
                key={question.guidId || question.id}
                className="dashboard-card rounded-2xl p-5"
              >
                {/* QUESTION HEADER */}

                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <p className="dashboard-muted text-xs font-bold">
                    QUESTION {questionIndex + 1}
                    {question.type ? ` · ${question.type}` : ""}
                  </p>

                  {isSaving ? (
                    <span className="flex items-center gap-1.5 text-xs text-[#8D79FF]">
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />
                      Saving...
                    </span>
                  ) : selectedOptions.length > 0 && !saveError ? (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600">
                      <CheckCircle2 size={14} />
                      Answer saved
                    </span>
                  ) : null}
                </div>

                {/* QUESTION TEXT */}

                <div
                  className="dashboard-heading whitespace-pre-wrap font-semibold"
                  dangerouslySetInnerHTML={{
                    __html: question.questionText,
                  }}
                />

                {question.metaQuestionText && (
                  <div
                    className="dashboard-muted mt-3 text-sm"
                    dangerouslySetInnerHTML={{
                      __html: question.metaQuestionText,
                    }}
                  />
                )}

                {question.instructions && (
                  <p className="dashboard-muted mt-3 text-sm">
                    {question.instructions}
                  </p>
                )}

                {/* SUPPORTING QUESTION CONTENT */}

                {question.questionContents?.map((content) => (
                  <div
                    key={content.guidId || content.id}
                    className="mt-4 rounded-xl border border-[var(--dashboard-border)] p-4"
                  >
                    <h3 className="dashboard-heading font-bold">
                      {content.title}
                    </h3>

                    <div
                      className="dashboard-muted mt-2 text-sm"
                      dangerouslySetInnerHTML={{
                        __html: content.description,
                      }}
                    />
                  </div>
                ))}

                {/* QUESTION MEDIA */}

                {question.questionMedias?.map((media) => (
                  <div
                    key={media.guidId || media.id}
                    className="mt-4"
                  >
                    {media.type.toLowerCase().includes("image") ? (
                      <img
                        src={media.mediaPath}
                        alt={media.description || "Question media"}
                        className="max-h-[420px] max-w-full rounded-xl object-contain"
                      />
                    ) : (
                      <a
                        href={media.mediaPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-[#8D79FF] underline"
                      >
                        {media.description || "View question resource"}
                      </a>
                    )}

                    {media.instructions && (
                      <p className="dashboard-muted mt-2 text-xs">
                        {media.instructions}
                      </p>
                    )}
                  </div>
                ))}

                {/* UNSUPPORTED QUESTION TYPES */}

                {answerType === "unsupported" && (
                  <div className="dashboard-muted mt-5 rounded-xl border border-[var(--dashboard-border)] p-4 text-sm">
                    This question type is not interactive yet.
                  </div>
                )}

                {/* ANSWER OPTIONS */}

                {answerType !== "unsupported" &&
                  question.questionOptions &&
                  question.questionOptions.length > 0 && (
                    <div className="mt-5 space-y-3">
                      {question.questionOptions.map((option) => {
                        const selected = selectedOptions.includes(
                          option.id,
                        );

                        const isCorrect =
                          correctOptionIds.includes(option.id);

                       const showCorrect =
  canRevealQuestionAnswer && isCorrect;

                        return (
                          <button
                            key={option.guidId || option.id}
                            type="button"
                            disabled={isSaving}
                            aria-pressed={selected}
                            onClick={() =>
                              void selectAnswer(
                                section,
                                question,
                                option.id,
                              )
                            }
                            className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                              showCorrect
                                ? "border-emerald-500 bg-emerald-500/10"
                                : selected
                                  ? "border-[#8D79FF] bg-[#8D79FF]/10"
                                  : "border-[var(--dashboard-border)] hover:border-[#8D79FF]/60"
                            } disabled:cursor-wait disabled:opacity-70`}
                          >
                            <span
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-${
                                answerType === "multiple"
                                  ? "md"
                                  : "full"
                              } border ${
                                showCorrect
                                  ? "border-emerald-500 bg-emerald-500 text-white"
                                  : selected
                                    ? "border-[#8D79FF] bg-[#8D79FF] text-white"
                                    : "border-[var(--dashboard-muted)]"
                              }`}
                            >
                              {(selected || showCorrect) && (
                                <CheckCircle2 size={14} />
                              )}
                            </span>

                            <span className="dashboard-heading min-w-0 flex-1">
                              <span className="mr-2 font-bold">
                                {option.option}.
                              </span>

                              <span
                                dangerouslySetInnerHTML={{
                                  __html: option.answerContent,
                                }}
                              />

                              {showCorrect && (
                                <span className="ml-2 text-xs font-bold text-emerald-600">
                                  Correct answer
                                </span>
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                {/* MATRIX INFORMATION */}

                {question.questionMatrices?.map((matrix) => (
                  <div
                    key={matrix.guidId || matrix.id}
                    className="dashboard-muted mt-5 rounded-xl border border-[var(--dashboard-border)] p-4 text-sm"
                  >
                    <h3 className="dashboard-heading font-bold">
                      {matrix.title || "Matrix question"}
                    </h3>

                    {matrix.description && (
                      <p className="mt-2">
                        {matrix.description}
                      </p>
                    )}

                    {matrix.instructions && (
                      <p className="mt-2">
                        {matrix.instructions}
                      </p>
                    )}

                    <p className="mt-3 text-xs">
                      Matrix response is not interactive yet.
                    </p>
                  </div>
                ))}

                {/* HINTS */}

                {canShowHint && hints.length > 0 && (
                  <div className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-amber-600">
                      <Lightbulb size={17} />
                      Hint
                    </h3>

                    <div className="mt-2 space-y-2">
                      {hints.map((hint, index) => (
                        <p
                          key={index}
                          className="dashboard-muted text-sm"
                        >
                          {hint}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* CORRECT ANSWERS AND RATIONALES */}

          {canRevealQuestionAnswer && rationales.length > 0 && (
                  <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                    <h3 className="text-sm font-bold text-emerald-600">
                      Answer Rationale
                    </h3>

                    <div className="mt-3 space-y-4">
                      {rationales.map((answer) => (
                        <div
                          key={answer.guidId || answer.id}
                          className="space-y-2"
                        >
                          <div
  className="dashboard-muted text-sm"
  dangerouslySetInnerHTML={{
    __html: answer.description || "",
  }}
/>

                          {answer.explanationImage && (
                            <img
                              src={answer.explanationImage}
                              alt="Answer explanation"
                              className="max-h-[360px] max-w-full rounded-xl object-contain"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SAVE ERROR */}

                {saveError && (
                  <p className="mt-3 flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle size={15} />
                    {saveError}
                  </p>
                )}

                {/* MULTIPLE SELECT INSTRUCTIONS */}

                {answerType === "multiple" && (
                  <p className="dashboard-muted mt-4 text-xs">
                    Select all answers that apply.
                  </p>
                )}
              </article>
            );
          })}
        </section>
      );
      })}
    </main>
  );
}