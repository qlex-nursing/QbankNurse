
"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Save,
} from "lucide-react";
import { examService } from "@/lib/services/examService";
import { apiFetch } from "@/lib/api/api";

interface SessionQuestionOption {
  id: number;
  guidId: string;
  answerContent: string;
  option: string;
  description?: string;
}

interface SavedAnswer {
  questionOptionId?: number;
  userAnswerData?: string;
}

interface SessionQuestion {
  id: number;
  guidId: string;
  questionText: string;
  type?: string;
  instructions?: string;
  questionOptions: SessionQuestionOption[];
  savedUserAnswer?: SavedAnswer;
}

interface SessionSection {
  id: number;
  guidId: string;
  name: string;
  questions: SessionQuestion[];
}

interface LiveExamSession {
  exam: {
    id?: number;
    guidId?: string;
    title?: string;
    description?: string;
    questionsCount: number;
  };
  sections: SessionSection[];
  resumeAnswers: Record<number, SavedAnswer>;
}

interface LiveExamResponse {
  data?: LiveExamSession;
  message?: string;
  error?: string;
}

type AnswerState = Record<number, number[]>;

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

    if (typeof parsed === "number") return [parsed];

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

export default function RNLiveExamPage() {
  const params = useParams<{ examId: string }>();
  const searchParams = useSearchParams();

  const [session, setSession] = useState<LiveExamSession | null>(null);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [savingQuestions, setSavingQuestions] = useState<number[]>([]);
  const [saveErrors, setSaveErrors] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

          for (const section of result.data.sections) {
            for (const question of section.questions) {
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

  if (error || !session) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <div className="dashboard-card rounded-2xl p-6">
          <AlertCircle className="mb-3 text-red-500" size={26} />
          <h1 className="dashboard-heading text-lg font-bold">
            Unable to load examination
          </h1>
          <p className="dashboard-muted mt-2 text-sm">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <header className="dashboard-card rounded-2xl p-6">
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
      </header>

      {session.sections.map((section, sectionIndex) => (
        <section
          key={section.guidId || section.id}
          className="space-y-4"
        >
          <h2 className="dashboard-heading text-lg font-bold">
            {sectionIndex + 1}. {section.name}
          </h2>

          {section.questions.map((question, questionIndex) => {
            const answerType = getQuestionType(question.type);
            const selectedOptions = answers[question.id] ?? [];
            const isSaving = savingQuestions.includes(question.id);
            const saveError = saveErrors[question.id];

            return (
              <article
                key={question.guidId || question.id}
                className="dashboard-card rounded-2xl p-5"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <p className="dashboard-muted text-xs font-bold">
                    QUESTION {questionIndex + 1}
                    {question.type ? ` · ${question.type}` : ""}
                  </p>

                  {isSaving ? (
                    <span className="flex items-center gap-1.5 text-xs text-[#8D79FF]">
                      <Loader2 size={14} className="animate-spin" />
                      Saving...
                    </span>
                  ) : selectedOptions.length > 0 && !saveError ? (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600">
                      <CheckCircle2 size={14} />
                      Answer saved
                    </span>
                  ) : null}
                </div>

                <div
                  className="dashboard-heading whitespace-pre-wrap font-semibold"
                  dangerouslySetInnerHTML={{
                    __html: question.questionText,
                  }}
                />

                {question.instructions && (
                  <p className="dashboard-muted mt-3 text-sm">
                    {question.instructions}
                  </p>
                )}

                {answerType === "unsupported" && (
                  <div className="dashboard-muted mt-5 rounded-xl border border-[var(--dashboard-border)] p-4 text-sm">
                    This question type is not interactive yet.
                  </div>
                )}

                {answerType !== "unsupported" &&
                  question.questionOptions?.length > 0 && (
                    <div className="mt-5 space-y-3">
                      {question.questionOptions.map((option) => {
                        const selected = selectedOptions.includes(
                          option.id,
                        );

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
                              selected
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
                                selected
                                  ? "border-[#8D79FF] bg-[#8D79FF] text-white"
                                  : "border-[var(--dashboard-muted)]"
                              }`}
                            >
                              {selected && (
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
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                {saveError && (
                  <p className="mt-3 flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle size={15} />
                    {saveError}
                  </p>
                )}

                {answerType === "multiple" && (
                  <p className="dashboard-muted mt-4 text-xs">
                    Select all answers that apply.
                  </p>
                )}
              </article>
            );
          })}
        </section>
      ))}
    </main>
  );
}
