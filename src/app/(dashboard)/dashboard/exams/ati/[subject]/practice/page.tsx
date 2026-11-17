"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  Flag,
  Lightbulb,
  RotateCcw,
  Send,
  X,
  XCircle,
} from "lucide-react";

import {
  isItemSaved,
  toggleSavedItem,
  subscribeToSavedItems,
} from "@/lib/saved-items";

import { studyCategories } from "@/data/mock/dashboard/overview";

import {
  practiceQuestions,
  type PracticeAnswer,
  type PracticeQuestion,
  type BowTieAnswer,
  type MatrixAnswer,
} from "@/data/mock/dashboard/practice-questions";
import { savePracticeAttempt } from "@/lib/practice-attempts";
import {
  getPracticeSession,
  savePracticeSession,
  removePracticeSession,
} from "@/lib/practice-sessions";
import ClinicalExhibits from "@/components/dashboard/practice/clinical-exhibits";

const EXAM_DURATION = 30 * 60;

type Answer = PracticeAnswer;

type AnswerMap = Record<number, Answer>;

const isAnswerCorrect = (
  selectedAnswer: Answer | undefined,
  question: PracticeQuestion,
): boolean => {
  if (selectedAnswer === undefined) return false;

  const correctAnswer = question.correctAnswer;

  switch (question.type) {
    case "single-choice":
    case "true-false":
      return (
        typeof selectedAnswer === "string" &&
        typeof correctAnswer === "string" &&
        selectedAnswer === correctAnswer
      );

    case "multiple-response":
    case "ordered-response": {
      if (
        !Array.isArray(selectedAnswer) ||
        !Array.isArray(correctAnswer)
      ) {
        return false;
      }

      const selected = [...selectedAnswer];
      const correct = [...correctAnswer];

      if (question.type === "multiple-response") {
        selected.sort();
        correct.sort();
      }

      return (
        selected.length === correct.length &&
        selected.every((answer, index) => answer === correct[index])
      );
    }

    case "numeric-entry": {
      if (
        typeof selectedAnswer !== "number" ||
        typeof correctAnswer !== "number"
      ) {
        return false;
      }

      const tolerance = question.numericConfig?.tolerance ?? 0;

      return Math.abs(selectedAnswer - correctAnswer) <= tolerance;
    }

    case "matrix": {
      if (
        typeof selectedAnswer !== "object" ||
        Array.isArray(selectedAnswer) ||
        typeof correctAnswer !== "object" ||
        Array.isArray(correctAnswer)
      ) {
        return false;
      }

      const selected = selectedAnswer as MatrixAnswer;
      const correct = correctAnswer as MatrixAnswer;

      const rowIds = Object.keys(correct);

      return (
        rowIds.length === Object.keys(selected).length &&
        rowIds.every((rowId) => selected[rowId] === correct[rowId])
      );
    }

    case "bow-tie": {
      if (
        typeof selectedAnswer !== "object" ||
        Array.isArray(selectedAnswer) ||
        typeof correctAnswer !== "object" ||
        Array.isArray(correctAnswer)
      ) {
        return false;
      }

      const selected = selectedAnswer as BowTieAnswer;
      const correct = correctAnswer as BowTieAnswer;

      const sameItems = (first: string[], second: string[]) => {
        return (
          first.length === second.length &&
          [...first].sort().every((item, index) => {
            return item === [...second].sort()[index];
          })
        );
      };

      return (
        selected.condition === correct.condition &&
        sameItems(selected.actions ?? [], correct.actions ?? []) &&
        sameItems(
          selected.parameters ?? [],
          correct.parameters ?? [],
        )
      );
    }

    case "cloze": {
      if (
        typeof selectedAnswer !== "object" ||
        Array.isArray(selectedAnswer) ||
        typeof correctAnswer !== "object" ||
        Array.isArray(correctAnswer)
      ) {
        return false;
      }

      const selected = selectedAnswer as Record<string, string>;
      const correct = correctAnswer as Record<string, string>;

      const blankIds = Object.keys(correct);

      return (
        blankIds.length === Object.keys(selected).length &&
        blankIds.every((blankId) => selected[blankId] === correct[blankId])
      );
    }

    default:
      return false;
  }
};

const hasAnswer = (answer: Answer | undefined): boolean => {
  if (answer === undefined || answer === null) return false;

  if (typeof answer === "string") return answer.trim().length > 0;

  if (typeof answer === "number") return Number.isFinite(answer);

  if (Array.isArray(answer)) return answer.length > 0;

  if (typeof answer === "object") {
    return Object.keys(answer).length > 0;
  }

  return false;
};

const getQuestionTypeLabel = (type: PracticeQuestion["type"]) => {
  const labels: Record<PracticeQuestion["type"], string> = {
    "single-choice": "Single Choice",
    "multiple-response": "Multiple Response",
    "true-false": "True / False",
    "ordered-response": "Ordered Response",
    "numeric-entry": "Numeric Entry",
    matrix: "Matrix / Grid",
    "bow-tie": "Bow-Tie",
    cloze: "Cloze / Drop-Down",
  };

  return labels[type];
};

type StudyMode = "exam" | "review" | "tutor";

export default function PracticePage() {
  const params = useParams<{ subject: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

const requestedMode = searchParams.get("mode");

const mode: StudyMode =
  requestedMode === "review" || requestedMode === "tutor"
    ? requestedMode
    : "exam";

  const subjectSlug = params.subject;

  const subject = studyCategories.find(
    (category) =>
      category.title.toLowerCase().replaceAll(" ", "-") === subjectSlug,
  );

  const questions = useMemo(
    () => practiceQuestions[subjectSlug] ?? [],
    [subjectSlug],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [isQuestionSaved, setIsQuestionSaved] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(EXAM_DURATION);
  const [submitted, setSubmitted] = useState(false);
  const [sessionLoaded, setSessionLoaded] = useState(false);
const [hasSavedSession, setHasSavedSession] = useState(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] =
    useState(false);
    const [tutorChecked, setTutorChecked] = useState(false);
    const [expandedRationales, setExpandedRationales] = useState<number[]>([]);

const toggleRationale = (questionId: number) => {
  setExpandedRationales((current) =>
    current.includes(questionId)
      ? current.filter((id) => id !== questionId)
      : [...current, questionId],
  );
};

  const currentQuestion = questions[currentIndex];

  // Keep the bookmark state synchronized with My Library.
useEffect(() => {
  if (!currentQuestion) {
    setIsQuestionSaved(false);
    return;
  }

  const syncSavedState = () => {
    setIsQuestionSaved(
      isItemSaved(String(currentQuestion.id), "question"),
    );
  };

  syncSavedState();

  return subscribeToSavedItems(syncSavedState);
}, [currentQuestion]);

  useEffect(() => {
  setTutorChecked(false);
}, [answers, currentIndex, mode]);

  const answeredCount = questions.filter((question) =>
    hasAnswer(answers[question.id]),
  ).length;

  const unansweredCount = questions.length - answeredCount;

  const isFlagged = currentQuestion
    ? flaggedQuestions.includes(currentQuestion.id)
    : false;

    

  const score = questions.reduce((total, question) => {
    return (
      total +
      (isAnswerCorrect(answers[question.id], question) ? 1 : 0)
    );
  }, 0);

  const percentage =
    questions.length > 0
      ? Math.round((score / questions.length) * 100)
      : 0;

   const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };



  // ----------------------------------------------------------
// RESTORE SAVED PRACTICE SESSION
// ----------------------------------------------------------

useEffect(() => {
  if (mode === "exam") {
    const savedSession = getPracticeSession(subjectSlug);

    if (savedSession) {
      const safeIndex = Math.min(
        Math.max(savedSession.currentIndex, 0),
        Math.max(questions.length - 1, 0),
      );

      const safeTime = Math.min(
        Math.max(savedSession.timeRemaining, 0),
        EXAM_DURATION,
      );

      setCurrentIndex(safeIndex);
      setAnswers(savedSession.answers as AnswerMap);
      setFlaggedQuestions(savedSession.flaggedQuestions);
      setTimeRemaining(safeTime);

      timeRemainingRef.current = safeTime;

      setHasSavedSession(true);
    }
  }

  setSessionLoaded(true);
}, [subjectSlug, questions.length, mode]);

  // ----------------------------------------------------------
  // PRACTICE ATTEMPT TRACKING
  // ----------------------------------------------------------

  const submittedRef = useRef(false);

  const timeRemainingRef = useRef(EXAM_DURATION);

  const attemptSnapshotRef = useRef({
    subject: subject?.title ?? subjectSlug,
    score,
    totalQuestions: questions.length,
    percentage,
    timeRemaining: EXAM_DURATION,
  });

  // Keep the latest exam results available when submitting.
  attemptSnapshotRef.current = {
    subject: subject?.title ?? subjectSlug,
    score,
    totalQuestions: questions.length,
    percentage,
    timeRemaining: timeRemainingRef.current,
  };


  // ----------------------------------------------------------
// AUTOMATICALLY SAVE PRACTICE SESSION
// ----------------------------------------------------------

useEffect(() => {
  if (
  mode !== "exam" ||
  !sessionLoaded ||
  submitted ||
  questions.length === 0
) {
    return;
  }

  savePracticeSession({
    subjectSlug,
    currentIndex,
    answers,
    flaggedQuestions,
    timeRemaining,
    totalQuestions: questions.length,
    updatedAt: new Date().toISOString(),
  });

}, [
  sessionLoaded,
  submitted,
  subjectSlug,
  currentIndex,
  answers,
  flaggedQuestions,
  timeRemaining,
  questions.length,
]);

  // ----------------------------------------------------------
  // SUBMIT EXAM
  // ----------------------------------------------------------

  const submitExam = useCallback(() => {

    if (mode !== "exam") return;
    // Prevent duplicate submissions.
    if (submittedRef.current) return;

    submittedRef.current = true;

    removePracticeSession(subjectSlug);

    const attempt = attemptSnapshotRef.current;

    savePracticeAttempt({
      id: `ati-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,

      examType: "ATI",

      subject: attempt.subject,

      score: attempt.score,

      totalQuestions: attempt.totalQuestions,

      percentage: attempt.percentage,

      correctAnswers: attempt.score,

      incorrectAnswers:
        attempt.totalQuestions - attempt.score,

      durationSeconds:
        EXAM_DURATION - attempt.timeRemaining,

      completedAt: new Date().toISOString(),
    });

    setSubmitted(true);
    setShowSubmitConfirmation(false);
  }, [subjectSlug, mode]);

  // ----------------------------------------------------------
  // EXAM TIMER
  // ----------------------------------------------------------

  useEffect(() => {
    if (
  mode !== "exam" ||
  !sessionLoaded ||
  submitted ||
  questions.length === 0
) return;
    const timer = window.setInterval(() => {
      const nextTime = Math.max(
        timeRemainingRef.current - 1,
        0,
      );

      timeRemainingRef.current = nextTime;

      setTimeRemaining(nextTime);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [sessionLoaded, submitted, questions.length]);

  // Automatically submit when the timer reaches zero.
  useEffect(() => {
    if (timeRemaining === 0 && !submitted) {
      submitExam();
    }
  }, [timeRemaining, submitted, submitExam]);

  // ----------------------------------------------------------
  // ANSWER HANDLERS
  // ----------------------------------------------------------

  const selectAnswer = (optionId: string) => {
    if (!currentQuestion) return;
    if (mode === "tutor" && tutorChecked) return;

    setAnswers((previous) => {
      const currentAnswer = previous[currentQuestion.id];

      if (currentQuestion.type === "multiple-response") {
        const selectedAnswers = Array.isArray(currentAnswer)
          ? currentAnswer
          : [];

        const updatedAnswers = selectedAnswers.includes(optionId)
          ? selectedAnswers.filter((answer) => answer !== optionId)
          : [...selectedAnswers, optionId];

        return {
          ...previous,
          [currentQuestion.id]: updatedAnswers,
        };
      }

      return {
        ...previous,
        [currentQuestion.id]: optionId,
      };
    });
  };

  const updateNumericAnswer = (value: string) => {
    if (!currentQuestion) return;
    if (mode === "tutor" && tutorChecked) return;

    setAnswers((previous) => {
      if (value.trim() === "") {
        const updated = { ...previous };
        delete updated[currentQuestion.id];
        return updated;
      }

      const numericValue = Number(value);

      if (!Number.isFinite(numericValue)) return previous;

      return {
        ...previous,
        [currentQuestion.id]: numericValue,
      };
    });
  };

  const moveOrderedOption = (
    optionId: string,
    direction: "up" | "down",
  ) => {
    if (!currentQuestion) return;
    if (mode === "tutor" && tutorChecked) return;

    setAnswers((previous) => {
      const existingAnswer = previous[currentQuestion.id];

      const currentOrder = Array.isArray(existingAnswer)
        ? [...existingAnswer]
        : currentQuestion.options.map((option) => option.id);

      const currentPosition = currentOrder.indexOf(optionId);

      const targetPosition =
        direction === "up"
          ? currentPosition - 1
          : currentPosition + 1;

      if (
        currentPosition === -1 ||
        targetPosition < 0 ||
        targetPosition >= currentOrder.length
      ) {
        return previous;
      }

      [currentOrder[currentPosition], currentOrder[targetPosition]] = [
        currentOrder[targetPosition],
        currentOrder[currentPosition],
      ];

      return {
        ...previous,
        [currentQuestion.id]: currentOrder,
      };
    });
  };

  const updateMatrixAnswer = (rowId: string, columnId: string) => {
    if (!currentQuestion) return;
    if (mode === "tutor" && tutorChecked) return;

    setAnswers((previous) => {
      const existing = previous[currentQuestion.id];

      const currentMatrix =
        existing &&
        typeof existing === "object" &&
        !Array.isArray(existing)
          ? { ...(existing as MatrixAnswer) }
          : {};

      return {
        ...previous,
        [currentQuestion.id]: {
          ...currentMatrix,
          [rowId]: columnId,
        },
      };
    });
  };

  const updateBowTieAnswer = (
    group: keyof BowTieAnswer,
    optionId: string,
  ) => {
    if (!currentQuestion) return;
    if (mode === "tutor" && tutorChecked) return;

    setAnswers((previous) => {
      const existing = previous[currentQuestion.id];

      const currentBowTie: BowTieAnswer =
        existing &&
        typeof existing === "object" &&
        !Array.isArray(existing)
          ? {
              ...(existing as BowTieAnswer),
              condition: (existing as BowTieAnswer).condition ?? "",
              actions: (existing as BowTieAnswer).actions ?? [],
              parameters: (existing as BowTieAnswer).parameters ?? [],
            }
          : {
              condition: "",
              actions: [],
              parameters: [],
            };

      if (group === "condition") {
        return {
          ...previous,
          [currentQuestion.id]: {
            ...currentBowTie,
            condition:
              currentBowTie.condition === optionId ? "" : optionId,
          },
        };
      }

      const selectedItems = currentBowTie[group] ?? [];

      const updatedItems = selectedItems.includes(optionId)
        ? selectedItems.filter((item) => item !== optionId)
        : [...selectedItems, optionId];

      return {
        ...previous,
        [currentQuestion.id]: {
          ...currentBowTie,
          [group]: updatedItems,
        },
      };
    });
  };

  const updateClozeAnswer = (blankId: string, optionId: string) => {
    if (!currentQuestion) return;
    if (mode === "tutor" && tutorChecked) return;

    setAnswers((previous) => {
      const existing = previous[currentQuestion.id];

      const currentCloze =
        existing &&
        typeof existing === "object" &&
        !Array.isArray(existing)
          ? { ...(existing as Record<string, string>) }
          : {};

      return {
        ...previous,
        [currentQuestion.id]: {
          ...currentCloze,
          [blankId]: optionId,
        },
      };
    });
  };

  // ----------------------------------------------------------
  // NAVIGATION
  // ----------------------------------------------------------

  const toggleFlag = () => {
    if (!currentQuestion) return;

    setFlaggedQuestions((previous) =>
      previous.includes(currentQuestion.id)
        ? previous.filter((id) => id !== currentQuestion.id)
        : [...previous, currentQuestion.id],
    );
  };

  const navigateToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
    }
  };

  const toggleQuestionBookmark = () => {
  if (!currentQuestion) return;

  const saved = toggleSavedItem({
    id: String(currentQuestion.id),
    type: "question",
    title: `Question ${currentIndex + 1}: ${currentQuestion.question}`,
    description: `${subject?.title ?? subjectSlug} • ${currentQuestion.category}`,
    href: `/dashboard/exams/ati/${subjectSlug}/practice`,
    metadata: {
      subject: subject?.title ?? subjectSlug,
      category: currentQuestion.category,
      questionId: String(currentQuestion.id),
    },
  });

  setIsQuestionSaved(saved);
};

  // ----------------------------------------------------------
  // EMPTY STATES
  // ----------------------------------------------------------

  if (!subject) {
    return (
      <div className="dashboard-content flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="dashboard-heading text-xl font-bold">
            Subject not found
          </h2>

          <Link
            href="/dashboard/study-library"
            className="dashboard-primary-button mt-5 inline-flex rounded-xl px-5 py-3 text-sm font-semibold"
          >
            Return to Study Library
          </Link>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="dashboard-content flex min-h-[60vh] items-center justify-center">
        <div className="dashboard-card max-w-lg rounded-2xl p-8 text-center">
          <BookOpen
            size={32}
            className="dashboard-accent-icon mx-auto"
          />

          <h2 className="dashboard-heading mt-4 text-xl font-bold">
            Practice questions unavailable
          </h2>

          <p className="dashboard-muted mt-2 text-sm leading-6">
            There are currently no demonstration questions available for{" "}
            {subject.title}.
          </p>

          <Link
            href={`/dashboard/exams/ati/${subjectSlug}`}
            className="dashboard-primary-button mt-6 inline-flex rounded-xl px-5 py-3 text-sm font-semibold"
          >
            Back to subject
          </Link>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------
  // RESULTS PAGE
  // ----------------------------------------------------------

  if (submitted || mode === "review"){ 
    return (
      <div className="dashboard-content mx-auto w-full max-w-5xl space-y-7 px-5 py-7 sm:px-7 lg:px-9">
        {mode === "review" && (
  <div className="relative overflow-hidden rounded-3xl border border-[#E8DEFF] bg-gradient-to-br from-white via-[#F8F6FF] to-[#EEE8FF] p-6 sm:p-8">
    <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#5B3DF5]/5 blur-3xl" />

    <div className="relative">
      <button
        type="button"
        onClick={() => router.push(`/dashboard/exams/ati/${subjectSlug}`)}
        className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#5B3DF5] transition hover:gap-3"
      >
        <ArrowLeft size={17} />
        Back to subject
      </button>

      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E8DEFF] bg-white px-3 py-1.5 text-xs font-bold text-[#5B3DF5]">
            <BookOpen size={14} />
            STUDY MODE
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#17263F] sm:text-4xl">
            Review & Learn
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            Take your time exploring each question, understanding the correct
            answers and learning the clinical reasoning behind them.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-[#E8DEFF] bg-white/80 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5B3DF5]/10 text-[#5B3DF5]">
            <BookOpen size={21} />
          </div>

          <div>
            <p className="text-2xl font-extrabold text-[#17263F]">
              {questions.length}
            </p>
            <p className="text-xs font-medium text-slate-500">
              Questions to review
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
        <div
  className={`dashboard-card rounded-3xl p-6 text-center sm:p-10 ${
    mode === "review" ? "hidden" : ""
  }`}
>
          <div className="dashboard-accent-icon mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <CheckCircle2 size={34} />
          </div>

          <p className="dashboard-muted mt-5 text-xs font-bold uppercase tracking-widest">
            Practice session completed
          </p>

          <h1 className="dashboard-heading mt-2 text-3xl font-extrabold">
            Your results are ready!
          </h1>

          <p className="dashboard-muted mt-2 text-sm">
            Here's how you performed in {subject.title}.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="dashboard-inner-card rounded-2xl p-5">
              <p className="dashboard-muted text-sm">Your score</p>
              <h2 className="dashboard-heading mt-2 text-3xl font-extrabold">
                {percentage}%
              </h2>
            </div>

            <div className="dashboard-inner-card rounded-2xl p-5">
              <p className="dashboard-muted text-sm">Correct answers</p>
              <h2 className="dashboard-heading mt-2 text-3xl font-extrabold">
                {score}/{questions.length}
              </h2>
            </div>

            <div className="dashboard-inner-card rounded-2xl p-5">
              <p className="dashboard-muted text-sm">Incorrect answers</p>
              <h2 className="dashboard-heading mt-2 text-3xl font-extrabold">
                {questions.length - score}
              </h2>
            </div>
          </div>

          <div className="dashboard-inner-card mt-6 rounded-2xl p-5 text-left">
            <h3 className="dashboard-heading font-bold">
              Performance summary
            </h3>

            <div className="dashboard-progress-track mt-4 h-3 overflow-hidden rounded-full">
              <div
                className="dashboard-progress-fill h-full rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="dashboard-muted mt-2 flex justify-between text-xs">
              <span>{score} correct</span>
              <span>{questions.length - score} incorrect</span>
            </div>
          </div>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                router.push(`/dashboard/exams/ati/${subjectSlug}`)
              }
              className="dashboard-primary-button inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
            >
              <RotateCcw size={16} />
              Back to subject
            </button>

            <Link
              href={`/dashboard/exams/ati/${subjectSlug}`}
              className="dashboard-secondary-button inline-flex items-center justify-center rounded-xl border px-6 py-3 text-sm font-semibold"
            >
              View subject
            </Link>
          </div>
        </div>

        {/* ANSWER REVIEW */}

       <section className="space-y-5">
  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
    <div>
      <h2 className="dashboard-heading text-xl font-bold">
        {mode === "review" ? "Your study questions" : "Review your answers"}
      </h2>

      <p className="dashboard-muted mt-1 text-sm">
        {mode === "review"
          ? "Explore each question and reveal its clinical rationale."
          : "Review your responses, correct answers and explanations."}
      </p>
    </div>

    <span className="w-fit rounded-full bg-[#5B3DF5]/10 px-3 py-1.5 text-xs font-bold text-[#5B3DF5]">
      {questions.length} QUESTIONS
    </span>
  </div>

          {questions.map((question, index) => {
            const selectedAnswer = answers[question.id];
            const isCorrect = isAnswerCorrect(selectedAnswer, question);

            return (
              <article
                key={question.id}
                  className="dashboard-card rounded-3xl border border-[var(--dashboard-border)] p-5 shadow-sm transition duration-200 hover:shadow-md sm:p-7">
              
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="dashboard-muted text-xs font-semibold">
                      QUESTION {index + 1}
                    </span>

                    <p className="dashboard-muted mt-1 text-xs">
                      {getQuestionTypeLabel(question.type)}
                    </p>
                  </div>

                  {mode !== "review" && (
  <span
    className={`rounded-full px-3 py-1 text-xs font-bold ${
      isCorrect
        ? "bg-emerald-100 text-emerald-700"
        : "bg-rose-100 text-rose-700"
    }`}
  >
    {isCorrect ? "Correct" : "Incorrect"}
  </span>
)}
                </div>

                <h3 className="dashboard-heading mt-4 text-sm font-semibold leading-7">
                  {question.question}
                </h3>

                {question.clinicalCase && (
                  <div className="dashboard-inner-card mt-4 rounded-xl p-4">
                    <p className="dashboard-heading text-xs font-bold">
                      {question.clinicalCase.title} · Stage{" "}
                      {question.clinicalCase.stage} of{" "}
                      {question.clinicalCase.totalStages}
                    </p>

                    <p className="dashboard-muted mt-2 text-sm">
                      {question.clinicalCase.patientDetails}
                    </p>

                    <p className="dashboard-muted mt-2 text-sm leading-6">
                      {question.clinicalCase.clinicalNotes}
                    </p>
                  </div>
                )}

                {mode === "review" && question.clinicalCase?.exhibits?.length ? (
  <div className="mt-5">
    <ClinicalExhibits
  key={`${question.clinicalCase.id}-${question.clinicalCase.stage}`}
  clinicalCase={question.clinicalCase}
/>
  </div>
) : null}

                {/* Standard option review */}

                {[
                  "single-choice",
                  "multiple-response",
                  "true-false",
                ].includes(question.type) && (
                  <div className="mt-4 space-y-2">
                    {question.options.map((option) => {
                      const correctAnswer = question.correctAnswer;

                      const correctIds = Array.isArray(correctAnswer)
                        ? correctAnswer
                        : [String(correctAnswer)];

                      const selectedIds = Array.isArray(selectedAnswer)
                        ? selectedAnswer
                        : selectedAnswer !== undefined
                          ? [String(selectedAnswer)]
                          : [];

                      const isCorrectOption = correctIds.includes(
                        option.id,
                      );

                      const isSelected = selectedIds.includes(option.id);

                      return (
                        <div
                          key={option.id}
                          className={`rounded-xl border p-3 text-sm ${
                            isCorrectOption
                              ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                              : isSelected
                                ? "border-rose-400 bg-rose-50 text-rose-800"
                                : "border-[var(--dashboard-border)]"
                          }`}
                        >
                          <span className="font-bold">{option.id}.</span>{" "}
                          {option.text}

                          {isCorrectOption && (
                            <span className="ml-2 text-xs font-bold">
                              Correct answer
                            </span>
                          )}

                          {isSelected && !isCorrectOption && (
                            <span className="ml-2 text-xs font-bold">
                              Your answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Ordered response review */}

                {question.type === "ordered-response" && (
                  <div className="mt-4 space-y-2">
                    <p className="dashboard-heading text-xs font-bold">
                      Correct sequence
                    </p>

                    {(question.correctAnswer as string[]).map(
                      (optionId, position) => {
                        const option = question.options.find(
                          (item) => item.id === optionId,
                        );

                        return (
                          <div
                            key={optionId}
                            className="dashboard-inner-card flex items-center gap-3 rounded-xl p-3 text-sm"
                          >
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#5B3DF5]/10 text-xs font-bold text-[#5B3DF5]">
                              {position + 1}
                            </span>
                            {option?.text}
                          </div>
                        );
                      },
                    )}

                    <p className="dashboard-muted mt-3 text-xs">
                      Your submitted order:{" "}
                      {Array.isArray(selectedAnswer)
                        ? selectedAnswer.join(" → ")
                        : "Not answered"}
                    </p>
                  </div>
                )}

                {/* Numeric review */}

                {question.type === "numeric-entry" && (
                  <div className="dashboard-inner-card mt-4 rounded-xl p-4">
                    <p className="dashboard-muted text-xs">
                      Your answer
                    </p>

                    <p className="dashboard-heading mt-1 font-bold">
                      {typeof selectedAnswer === "number"
                        ? `${selectedAnswer} ${question.numericConfig?.unit ?? ""}`
                        : "Not answered"}
                    </p>

                    <p className="dashboard-muted mt-3 text-xs">
                      Correct answer
                    </p>

                    <p className="dashboard-heading mt-1 font-bold">
                      {String(question.correctAnswer)}{" "}
                      {question.numericConfig?.unit}
                    </p>
                  </div>
                )}

                {/* Matrix review */}

                {question.type === "matrix" &&
                  question.matrixConfig && (
                    <div className="mt-4 space-y-3">
                      {question.matrixConfig.rows.map((row) => {
                        const correctMatrix =
                          question.correctAnswer as MatrixAnswer;

                        const selectedMatrix =
                          (selectedAnswer as MatrixAnswer) ?? {};

                        const correctColumn =
                          question.matrixConfig?.columns.find(
                            (column) =>
                              column.id === correctMatrix[row.id],
                          );

                        const selectedColumn =
                          question.matrixConfig?.columns.find(
                            (column) =>
                              column.id === selectedMatrix[row.id],
                          );

                        return (
                          <div
                            key={row.id}
                            className="dashboard-inner-card rounded-xl p-4"
                          >
                            <p className="dashboard-heading text-sm font-semibold">
                              {row.text}
                            </p>

                            <p className="dashboard-muted mt-2 text-xs">
                              Your answer:{" "}
                              {selectedColumn?.text ?? "Not answered"}
                            </p>

                            <p className="mt-1 text-xs font-semibold text-emerald-700">
                              Correct answer: {correctColumn?.text}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                {/* Bow-Tie review */}

                {question.type === "bow-tie" &&
                  question.bowTieConfig && (
                    <div className="mt-4 space-y-4">
                      {(
                        [
                          ["condition", "Condition"],
                          ["actions", "Actions"],
                          ["parameters", "Parameters to monitor"],
                        ] as const
                      ).map(([group, label]) => {
                        const correctBowTie =
                          question.correctAnswer as BowTieAnswer;

                        const selectedBowTie =
                          selectedAnswer as BowTieAnswer | undefined;

                        const correctValue = correctBowTie[group];

                        const selectedValue = selectedBowTie?.[group];

                        const optionGroup =
                          group === "condition"
                            ? question.bowTieConfig?.conditions
                            : group === "actions"
                              ? question.bowTieConfig?.actions
                              : question.bowTieConfig?.parameters;

                        const correctIds =
                          Array.isArray(correctValue)
                            ? correctValue
                            : [correctValue];

                        const selectedIds =
                          Array.isArray(selectedValue)
                            ? selectedValue
                            : selectedValue
                              ? [selectedValue]
                              : [];

                        return (
                          <div
                            key={group}
                            className="dashboard-inner-card rounded-xl p-4"
                          >
                            <p className="dashboard-heading text-sm font-bold">
                              {label}
                            </p>

                            <div className="mt-3 space-y-2">
                              {correctIds.map((id) => {
                                const option = optionGroup?.find(
                                  (item) => item.id === id,
                                );

                                return (
                                  <p
                                    key={id}
                                    className="text-sm text-emerald-700"
                                  >
                                    ✓ {option?.text}
                                  </p>
                                );
                              })}
                            </div>

                            <p className="dashboard-muted mt-3 text-xs">
                              Your selection:{" "}
                              {selectedIds.length > 0
                                ? selectedIds
                                    .map(
                                      (id) =>
                                        optionGroup?.find(
                                          (item) => item.id === id,
                                        )?.text ?? id,
                                    )
                                    .join(", ")
                                : "Not answered"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                {/* Cloze review */}

                {question.type === "cloze" &&
                  question.clozeConfig && (
                    <div className="dashboard-inner-card mt-4 rounded-xl p-4">
                      {question.clozeConfig.blanks.map((blank) => {
                        const correctCloze =
                          question.correctAnswer as Record<
                            string,
                            string
                          >;

                        const selectedCloze =
                          selectedAnswer as
                            | Record<string, string>
                            | undefined;

                        const correctOption = blank.options.find(
                          (option) =>
                            option.id === correctCloze[blank.id],
                        );

                        const selectedOption = blank.options.find(
                          (option) =>
                            option.id === selectedCloze?.[blank.id],
                        );

                        return (
                          <div key={blank.id} className="mt-3">
                            <p className="dashboard-heading text-xs font-bold">
                              {blank.label}
                            </p>

                            <p className="dashboard-muted mt-1 text-sm">
                              Your answer:{" "}
                              {selectedOption?.text ?? "Not answered"}
                            </p>

                            <p className="mt-1 text-sm font-semibold text-emerald-700">
                              Correct answer: {correctOption?.text}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                {/* Rationale */}

                <div className="dashboard-inner-card mt-5 rounded-xl p-4">
  <button
    type="button"
    onClick={() => toggleRationale(question.id)}
    aria-expanded={expandedRationales.includes(question.id)}
    className="flex w-full items-center justify-between gap-3 text-left"
  >
    <span className="flex items-center gap-2">
      <Lightbulb
        size={17}
        className="dashboard-accent-icon"
      />

      <span className="dashboard-heading text-sm font-bold">
        Rationale
      </span>
    </span>

    <span className="text-xs font-semibold text-[#5B3DF5]">
      {expandedRationales.includes(question.id)
        ? "Hide Rationale"
        : "View Rationale"}
    </span>
  </button>

  {expandedRationales.includes(question.id) && (
    <p className="dashboard-muted mt-3 text-sm leading-7">
      {question.rationale}
    </p>
  )}
</div>
              </article>
            );
          })}
        </section>
      </div>
    );
  }

  if (!currentQuestion) return null;

  // ----------------------------------------------------------
  // CURRENT ANSWERS
  // ----------------------------------------------------------

  const currentAnswer = answers[currentQuestion.id];

  const currentBowTie: BowTieAnswer =
    currentAnswer &&
    typeof currentAnswer === "object" &&
    !Array.isArray(currentAnswer)
      ? {
          ...(currentAnswer as BowTieAnswer),
          condition: (currentAnswer as BowTieAnswer).condition ?? "",
          actions: (currentAnswer as BowTieAnswer).actions ?? [],
          parameters: (currentAnswer as BowTieAnswer).parameters ?? [],
        }
      : {
          condition: "",
          actions: [],
          parameters: [],
        };

  const currentMatrix =
    currentAnswer &&
    typeof currentAnswer === "object" &&
    !Array.isArray(currentAnswer)
      ? (currentAnswer as MatrixAnswer)
      : {};

  const currentCloze =
    currentAnswer &&
    typeof currentAnswer === "object" &&
    !Array.isArray(currentAnswer)
      ? (currentAnswer as Record<string, string>)
      : {};

  const orderedIds = Array.isArray(currentAnswer)
    ? currentAnswer
    : currentQuestion.options.map((option) => option.id);

  const orderedOptions = orderedIds
    .map((id) =>
      currentQuestion.options.find((option) => option.id === id),
    )
    .filter((option) => Boolean(option));

  // ----------------------------------------------------------
  // QUESTION INTERFACE
  // ----------------------------------------------------------

  return (
    <div className="dashboard-content mx-auto w-full max-w-[1600px] space-y-6 px-5 py-6 sm:px-7 lg:px-9">
      {/* HEADER */}

      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href={`/dashboard/exams/ati/${subjectSlug}`}
            className="dashboard-muted mb-3 inline-flex items-center gap-2 text-xs font-semibold hover:opacity-70"
          >
            <ArrowLeft size={15} />
            Exit practice
          </Link>

          <h1 className="dashboard-heading text-xl font-extrabold sm:text-2xl">
            {subject.title}{" "}
{mode === "tutor"
  ? "Tutor"
  : "Practice"}
          </h1>

          <p className="dashboard-muted mt-1 text-sm">
            Demonstration examination · Multiple question formats
          </p>
        </div>

        {mode === "exam" && (
  <div
    className={`flex items-center gap-3 rounded-2xl border px-5 py-3 ${
      timeRemaining <= 60
        ? "border-rose-300 bg-rose-50 text-rose-700"
        : "border-[var(--dashboard-border)]"
    }`}
  >
    <Clock3 size={20} />

    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider">
        Time remaining
      </p>

      <p className="text-xl font-extrabold tabular-nums">
        {formatTime(timeRemaining)}
      </p>
    </div>
  </div>
)}
      </header>

      {/* CLINICAL CASE INFORMATION */}

      {currentQuestion.clinicalCase && (
        <section className="dashboard-card rounded-2xl p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="rounded-full bg-[#5B3DF5]/10 px-3 py-1 text-xs font-bold text-[#5B3DF5]">
                NGN CLINICAL CASE
              </span>

              <h2 className="dashboard-heading mt-3 text-lg font-bold">
                {currentQuestion.clinicalCase.title}
              </h2>
            </div>

            <span className="dashboard-muted text-xs font-semibold">
              Stage {currentQuestion.clinicalCase.stage} of{" "}
              {currentQuestion.clinicalCase.totalStages}
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="dashboard-inner-card rounded-xl p-4">
              <p className="dashboard-muted text-xs font-bold uppercase">
                Patient
              </p>

              <p className="dashboard-heading mt-2 font-bold">
                {currentQuestion.clinicalCase.patientName}
              </p>

              <p className="dashboard-muted mt-1 text-sm">
                {currentQuestion.clinicalCase.patientAge} years old
              </p>

              <p className="dashboard-muted mt-2 text-sm leading-6">
                {currentQuestion.clinicalCase.patientDetails}
              </p>
            </div>

            <div className="dashboard-inner-card rounded-xl p-4">
              <p className="dashboard-muted text-xs font-bold uppercase">
                Clinical notes
              </p>

              <p className="dashboard-body mt-3 text-sm leading-6">
                {currentQuestion.clinicalCase.clinicalNotes}
              </p>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            {Array.from(
              {
                length: currentQuestion.clinicalCase.totalStages,
              },
              (_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full ${
                    index + 1 <= currentQuestion.clinicalCase!.stage
                      ? "bg-[#5B3DF5]"
                      : "bg-[var(--dashboard-border)]"
                  }`}
                />
              ),
            )}
          </div>
        </section>
      )}

      {/* EXAM PROGRESS */}
<section className="dashboard-card overflow-hidden rounded-2xl p-5 sm:p-6">
  <div className="flex flex-wrap items-end justify-between gap-3">
    <div>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#5B3DF5]" />
        <p className="dashboard-heading text-sm font-bold">
          {mode === "tutor" ? "Tutor progress" : "Exam progress"}
        </p>
      </div>

      <p className="dashboard-muted mt-2 text-sm">
        Question{" "}
        <span className="font-bold text-[#5B3DF5]">
          {currentIndex + 1}
        </span>{" "}
        of {questions.length}
      </p>
    </div>

    <div className="flex gap-4 text-xs">
      <span className="font-semibold text-emerald-600">
        {answeredCount} answered
      </span>

      <span className="dashboard-muted">
        {unansweredCount} remaining
      </span>
    </div>
  </div>

  <div className="relative mt-5 h-3 overflow-hidden rounded-full bg-[#EDE9FE]">
    {/* Completed progress */}
    <div
      className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-[#5B3DF5] via-[#7957F5] to-[#A78BFA] transition-all duration-700 ease-out"
      style={{
        width: `${((currentIndex + 1) / questions.length) * 100}%`,
      }}
    >
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/25 to-transparent" />
    </div>

    {/* Subtle progress markings */}
    <div
      className="pointer-events-none absolute inset-0 opacity-30"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, transparent, transparent 5px, white 5px, white 7px)",
      }}
    />
  </div>

  <div className="dashboard-muted mt-3 flex items-center justify-between text-[11px] font-medium">
    <span>Session started</span>
    <span>
      {Math.round(((currentIndex + 1) / questions.length) * 100)}% complete
    </span>
  </div>
</section>

      {/* MAIN EXAM LAYOUT */}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="dashboard-card min-w-0 rounded-2xl p-5 sm:p-7">
          {/* QUESTION HEADER */}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="dashboard-count-badge">
                Question {currentIndex + 1}
              </span>

              <span className="dashboard-muted text-xs">
                {currentQuestion.category}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
  <button
    type="button"
    onClick={toggleQuestionBookmark}
    aria-label={
      isQuestionSaved ? "Remove saved question" : "Save question"
    }
    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
      isQuestionSaved
        ? "border-[#5B3DF5]/30 bg-[#5B3DF5]/10 text-[#5B3DF5]"
        : "border-[var(--dashboard-border)] dashboard-muted hover:border-[#5B3DF5]/40 hover:text-[#5B3DF5]"
    }`}
  >
    {isQuestionSaved ? (
      <BookmarkCheck size={15} />
    ) : (
      <Bookmark size={15} />
    )}

    {isQuestionSaved ? "Saved" : "Save question"}
  </button>

  <button
    type="button"
    onClick={toggleFlag}
    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
      isFlagged
        ? "border-amber-400 bg-amber-50 text-amber-700"
        : "border-[var(--dashboard-border)] dashboard-muted"
    }`}
  >
    <Flag size={15} />
    {isFlagged ? "Flagged" : "Flag question"}
  </button>
</div>
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#5B3DF5]/10 px-3 py-1 text-xs font-bold text-[#5B3DF5]">
                {getQuestionTypeLabel(currentQuestion.type)}
              </span>

              <span className="dashboard-muted text-xs">
                {currentQuestion.difficulty}
              </span>
            </div>

            <p className="dashboard-muted mt-4 text-xs font-bold uppercase tracking-wider">
              {currentQuestion.type === "multiple-response"
                ? "Select all that apply"
                : currentQuestion.type === "true-false"
                  ? "Select True or False"
                  : currentQuestion.type === "ordered-response"
                    ? "Arrange the options in the correct order"
                    : currentQuestion.type === "numeric-entry"
                      ? "Enter your numerical answer"
                      : currentQuestion.type === "matrix"
                        ? "Select one response for each row"
                        : currentQuestion.type === "bow-tie"
                          ? "Complete all three sections"
                          : currentQuestion.type === "cloze"
                            ? "Complete each blank"
                            : "Select the best answer"}
            </p>

            <h2 className="dashboard-heading mt-3 text-base font-bold leading-8 sm:text-lg">
              {currentQuestion.question}
            </h2>
          </div>

          {/* SINGLE CHOICE / SATA / TRUE FALSE */}

          {[
            "single-choice",
            "multiple-response",
            "true-false",
          ].includes(currentQuestion.type) && (
            <div className="mt-7 space-y-3">
              {currentQuestion.options.map((option) => {
                const selected = Array.isArray(currentAnswer)
                  ? currentAnswer.includes(option.id)
                  : currentAnswer === option.id;

                const multipleResponse =
                  currentQuestion.type === "multiple-response";

                return (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => selectAnswer(option.id)}
                    aria-pressed={selected}
                    className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition ${
                      selected
                        ? "border-[#5B3DF5] bg-[#5B3DF5]/5 ring-2 ring-[#5B3DF5]/10"
                        : "border-[var(--dashboard-border)] hover:border-[#5B3DF5]/50"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        selected
                          ? "bg-[#5B3DF5] text-white"
                          : "bg-[var(--dash-surface-soft)] dashboard-heading"
                      }`}
                    >
                      {option.id}
                    </span>

                    <span className="dashboard-body flex-1 pt-1 text-sm leading-6">
                      {option.text}
                    </span>

                    <span className="pt-1">
                      {multipleResponse ? (
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded border ${
                            selected
                              ? "border-[#5B3DF5] bg-[#5B3DF5] text-white"
                              : "border-[var(--dashboard-border)]"
                          }`}
                        >
                          {selected && <Check size={13} />}
                        </span>
                      ) : selected ? (
                        <CheckCircle2
                          size={19}
                          className="text-[#5B3DF5]"
                        />
                      ) : (
                        <Circle
                          size={19}
                          className="dashboard-muted"
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ORDERED RESPONSE */}

          {currentQuestion.type === "ordered-response" && (
            <div className="mt-7 space-y-3">
              <div className="dashboard-inner-card rounded-xl p-4">
                <p className="dashboard-muted text-xs leading-5">
                  Use the arrows to arrange the options in the correct
                  sequence. Your current order is your submitted answer.
                </p>
              </div>

              {orderedOptions.map((option, index) => (
                <div
                  key={option!.id}
                  className="flex items-center gap-3 rounded-xl border border-[var(--dashboard-border)] p-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#5B3DF5]/10 text-sm font-bold text-[#5B3DF5]">
                    {index + 1}
                  </span>

                  <span className="dashboard-body flex-1 text-sm leading-6">
                    {option!.text}
                  </span>

                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        moveOrderedOption(option!.id, "up")
                      }
                      disabled={index === 0}
                      aria-label={`Move ${option!.text} up`}
                      className="dashboard-secondary-button rounded-lg border p-2 disabled:opacity-30"
                    >
                      <ArrowUp size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        moveOrderedOption(option!.id, "down")
                      }
                      disabled={index === orderedOptions.length - 1}
                      aria-label={`Move ${option!.text} down`}
                      className="dashboard-secondary-button rounded-lg border p-2 disabled:opacity-30"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* NUMERIC ENTRY */}

          {currentQuestion.type === "numeric-entry" && (
            <div className="mt-7">
              <div className="dashboard-inner-card rounded-xl p-5">
                <label
                  htmlFor="numeric-answer"
                  className="dashboard-heading text-sm font-bold"
                >
                  Your numerical answer
                </label>

                <div className="mt-3 flex items-center gap-3">
                  <input
                    id="numeric-answer"
                    type="number"
                    step="any"
                    value={
                      typeof currentAnswer === "number"
                        ? currentAnswer
                        : ""
                    }
                    onChange={(event) =>
                      updateNumericAnswer(event.target.value)
                    }
                    placeholder={
                      currentQuestion.numericConfig?.placeholder ??
                      "Enter your answer"
                    }
                    className="dashboard-input min-w-0 flex-1 rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#5B3DF5]"
                  />

                  {currentQuestion.numericConfig?.unit && (
                    <span className="dashboard-heading text-sm font-semibold">
                      {currentQuestion.numericConfig.unit}
                    </span>
                  )}
                </div>

                <p className="dashboard-muted mt-3 text-xs">
                  Enter your answer using numbers only.
                </p>
              </div>
            </div>
          )}

          {/* MATRIX / GRID */}

          {currentQuestion.type === "matrix" &&
            currentQuestion.matrixConfig && (
              <div className="mt-7 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] border-collapse text-sm">
                    <thead>
                      <tr>
                        <th className="border border-[var(--dashboard-border)] p-3 text-left">
                          <span className="dashboard-heading text-xs font-bold">
                            Finding
                          </span>
                        </th>

                        {currentQuestion.matrixConfig.columns.map(
                          (column) => (
                            <th
                              key={column.id}
                              className="border border-[var(--dashboard-border)] p-3 text-center"
                            >
                              <span className="dashboard-heading text-xs font-bold">
                                {column.text}
                              </span>
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {currentQuestion.matrixConfig.rows.map((row) => (
                        <tr key={row.id}>
                          <td className="dashboard-body border border-[var(--dashboard-border)] p-3 text-sm leading-6">
                            {row.text}
                          </td>

                          {currentQuestion.matrixConfig!.columns.map(
                            (column) => {
                              const selected =
                                currentMatrix[row.id] === column.id;

                              return (
                                <td
                                  key={column.id}
                                  className="border border-[var(--dashboard-border)] p-3 text-center"
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateMatrixAnswer(
                                        row.id,
                                        column.id,
                                      )
                                    }
                                    aria-label={`${row.text}: ${column.text}`}
                                    aria-pressed={selected}
                                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition ${
                                      selected
                                        ? "border-[#5B3DF5] bg-[#5B3DF5] text-white"
                                        : "border-[var(--dashboard-border)] hover:border-[#5B3DF5]"
                                    }`}
                                  >
                                    {selected && <Check size={15} />}
                                  </button>
                                </td>
                              );
                            },
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          {/* BOW-TIE */}

          {currentQuestion.type === "bow-tie" &&
            currentQuestion.bowTieConfig && (
              <div className="mt-7 space-y-6">
                {/* Condition */}

                <div className="dashboard-inner-card rounded-xl p-4">
                  <div className="mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5B3DF5]">
                      01 · Most likely condition
                    </span>

                    <p className="dashboard-heading mt-1 text-sm font-bold">
                      Select one condition.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {currentQuestion.bowTieConfig.conditions.map(
                      (option) => {
                        const selected =
                          currentBowTie.condition === option.id;

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              updateBowTieAnswer(
                                "condition",
                                option.id,
                              )
                            }
                            aria-pressed={selected}
                            className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition ${
                              selected
                                ? "border-[#5B3DF5] bg-[#5B3DF5]/5"
                                : "border-[var(--dashboard-border)]"
                            }`}
                          >
                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                selected
                                  ? "border-[#5B3DF5] bg-[#5B3DF5] text-white"
                                  : "border-[var(--dashboard-border)]"
                              }`}
                            >
                              {selected && <Check size={12} />}
                            </span>

                            <span className="dashboard-body">
                              {option.text}
                            </span>
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>

                {/* Actions */}

                <div className="dashboard-inner-card rounded-xl p-4">
                  <div className="mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5B3DF5]">
                      02 · Nursing actions
                    </span>

                    <p className="dashboard-heading mt-1 text-sm font-bold">
                      Select two appropriate actions.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {currentQuestion.bowTieConfig.actions.map(
                      (option) => {
                        const selected =
                          currentBowTie.actions.includes(option.id);

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              updateBowTieAnswer("actions", option.id)
                            }
                            aria-pressed={selected}
                            className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition ${
                              selected
                                ? "border-[#5B3DF5] bg-[#5B3DF5]/5"
                                : "border-[var(--dashboard-border)]"
                            }`}
                          >
                            <span
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                                selected
                                  ? "border-[#5B3DF5] bg-[#5B3DF5] text-white"
                                  : "border-[var(--dashboard-border)]"
                              }`}
                            >
                              {selected && <Check size={12} />}
                            </span>

                            <span className="dashboard-body">
                              {option.text}
                            </span>
                          </button>
                        );
                      },
                    )}
                  </div>

                  <p className="dashboard-muted mt-3 text-xs">
                    Selected: {currentBowTie.actions.length} / 2
                  </p>
                </div>

                {/* Parameters */}

                <div className="dashboard-inner-card rounded-xl p-4">
                  <div className="mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5B3DF5]">
                      03 · Parameters to monitor
                    </span>

                    <p className="dashboard-heading mt-1 text-sm font-bold">
                      Select two parameters.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {currentQuestion.bowTieConfig.parameters.map(
                      (option) => {
                        const selected =
                          currentBowTie.parameters.includes(option.id);

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              updateBowTieAnswer(
                                "parameters",
                                option.id,
                              )
                            }
                            aria-pressed={selected}
                            className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition ${
                              selected
                                ? "border-[#5B3DF5] bg-[#5B3DF5]/5"
                                : "border-[var(--dashboard-border)]"
                            }`}
                          >
                            <span
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                                selected
                                  ? "border-[#5B3DF5] bg-[#5B3DF5] text-white"
                                  : "border-[var(--dashboard-border)]"
                              }`}
                            >
                              {selected && <Check size={12} />}
                            </span>

                            <span className="dashboard-body">
                              {option.text}
                            </span>
                          </button>
                        );
                      },
                    )}
                  </div>

                  <p className="dashboard-muted mt-3 text-xs">
                    Selected: {currentBowTie.parameters.length} / 2
                  </p>
                </div>
              </div>
            )}

          {/* CLOZE / DROP-DOWN */}

          {currentQuestion.type === "cloze" &&
            currentQuestion.clozeConfig && (
              <div className="dashboard-inner-card mt-7 rounded-xl p-5">
                <p className="dashboard-body text-sm leading-8">
                  {currentQuestion.clozeConfig.textBefore}
                </p>

                <div className="my-5 space-y-5">
                  {currentQuestion.clozeConfig.blanks.map((blank) => (
                    <div key={blank.id}>
                      <label
                        htmlFor={`cloze-${blank.id}`}
                        className="dashboard-heading mb-2 block text-xs font-bold"
                      >
                        {blank.label}
                      </label>

                      <select
                        id={`cloze-${blank.id}`}
                        value={currentCloze[blank.id] ?? ""}
                        onChange={(event) =>
                          updateClozeAnswer(
                            blank.id,
                            event.target.value,
                          )
                        }
                        className="dashboard-input w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#5B3DF5]"
                      >
                        <option value="">Select an answer</option>

                        {blank.options.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.text}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                <p className="dashboard-body text-sm leading-8">
                  {currentQuestion.clozeConfig.textAfter}
                </p>
              </div>
            )}

            {/* TUTOR MODE FEEDBACK */}

{mode === "tutor" && (
  <div className="mt-8">
    {!tutorChecked ? (
      <button
        type="button"
        onClick={() => {
          if (hasAnswer(currentAnswer)) {
            setTutorChecked(true);
          }
        }}
        disabled={!hasAnswer(currentAnswer)}
        className="dashboard-primary-button inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Lightbulb size={17} />
        Check Answer
      </button>
    ) : (
      <div
        className={`rounded-2xl border p-5 ${
          isAnswerCorrect(currentAnswer, currentQuestion)
            ? "border-emerald-300 bg-emerald-50"
            : "border-rose-300 bg-rose-50"
        }`}
      >
        <div className="flex items-center gap-3">
          {isAnswerCorrect(currentAnswer, currentQuestion) ? (
            <CheckCircle2
              size={25}
              className="text-emerald-600"
            />
          ) : (
            <XCircle
              size={25}
              className="text-rose-600"
            />
          )}

          <div>
            <h3
              className={`font-bold ${
                isAnswerCorrect(currentAnswer, currentQuestion)
                  ? "text-emerald-700"
                  : "text-rose-700"
              }`}
            >
              {isAnswerCorrect(currentAnswer, currentQuestion)
                ? "Correct answer!"
                : "Not quite. Keep learning!"}
            </h3>

            <p className="mt-1 text-xs text-gray-600">
              {isAnswerCorrect(currentAnswer, currentQuestion)
                ? "Excellent work. You selected the correct response."
                : "Review the explanation below to understand the correct response."}
            </p>
          </div>
        </div>

        

        <div className="mt-5 rounded-xl border border-white/70 bg-white/80 p-4">
          <div className="flex items-center gap-2">
            <Lightbulb
              size={17}
              className="text-[#5B3DF5]"
            />

            <h4 className="text-sm font-bold text-gray-900">
              Rationale
            </h4>
          </div>

          <p className="mt-2 text-sm leading-7 text-gray-700">
            {currentQuestion.rationale}
          </p>
        </div>
      </div>
    )}
  </div>
)}

          {/* NAVIGATION */}

          <div className="mt-8 flex flex-col justify-between gap-3 border-t border-[var(--dashboard-border)] pt-5 sm:flex-row">
            <button
              type="button"
              onClick={() => navigateToQuestion(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="dashboard-secondary-button inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft size={16} />
              Previous
            </button>

           {currentIndex < questions.length - 1 ? (
  <button
    type="button"
    onClick={() => navigateToQuestion(currentIndex + 1)}
    className="dashboard-primary-button inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
  >
    Next question
    <ArrowRight size={16} />
  </button>
) : mode === "tutor" ? (
  <Link
    href="/dashboard/study-library"
    className="dashboard-primary-button inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
  >
    Finish tutoring
    <CheckCircle2 size={16} />
  </Link>
) : (
  <button
    type="button"
    onClick={() => setShowSubmitConfirmation(true)}
    className="dashboard-primary-button inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
  >
    Submit practice
    <Send size={16} />
  </button>
)}
          </div>
        </section>

        {/* QUESTION NAVIGATOR */}

        <aside className="dashboard-card rounded-2xl p-5 lg:sticky lg:top-24">
          <h3 className="dashboard-heading font-bold">
            Question navigator
          </h3>

          <p className="dashboard-muted mt-1 text-xs">
            Select a question to jump to it.
          </p>

          <div className="mt-5 grid grid-cols-5 gap-2">
            {questions.map((question, index) => {
              const answered = hasAnswer(answers[question.id]);
              const flagged = flaggedQuestions.includes(question.id);
              const active = currentIndex === index;

              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => navigateToQuestion(index)}
                  aria-label={`Go to question ${index + 1}`}
                  className={`relative flex h-10 items-center justify-center rounded-lg border text-xs font-bold transition ${
                    active
                      ? "border-[#5B3DF5] bg-[#5B3DF5] text-white"
                      : answered
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : "border-[var(--dashboard-border)] dashboard-heading"
                  }`}
                >
                  {index + 1}

                  {flagged && (
                    <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-white bg-amber-500" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 space-y-3 border-t border-[var(--dashboard-border)] pt-5">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-[#5B3DF5]" />
              <span className="dashboard-muted text-xs">
                Current question
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-emerald-400" />
              <span className="dashboard-muted text-xs">Answered</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded border border-[var(--dashboard-border)]" />
              <span className="dashboard-muted text-xs">
                Unanswered
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="dashboard-muted text-xs">Flagged</span>
            </div>
          </div>

          <div className="dashboard-inner-card mt-6 rounded-xl p-4">
            <p className="dashboard-heading text-sm font-bold">
              Session summary
            </p>

            <div className="mt-3 flex justify-between text-xs">
              <span className="dashboard-muted">Answered</span>
              <strong className="dashboard-heading">
                {answeredCount}
              </strong>
            </div>

            <div className="mt-2 flex justify-between text-xs">
              <span className="dashboard-muted">Unanswered</span>
              <strong className="dashboard-heading">
                {unansweredCount}
              </strong>
            </div>

            <div className="mt-2 flex justify-between text-xs">
              <span className="dashboard-muted">Flagged</span>
              <strong className="dashboard-heading">
                {flaggedQuestions.length}
              </strong>
            </div>
          </div>

{mode === "exam" && (
          <button
            type="button"
            onClick={() => setShowSubmitConfirmation(true)}
            className="dashboard-primary-button mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
          >
            Submit exam
            <Send size={15} />
          
          </button>
)}
        </aside>
      </div>

      {/* SUBMIT CONFIRMATION */}

      {showSubmitConfirmation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-dialog-title"
            className="dashboard-card w-full max-w-md rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="dashboard-accent-icon">
                <Send size={22} />
              </div>


{mode === "exam" && (
              <button
                type="button"
                onClick={() => setShowSubmitConfirmation(false)}
                aria-label="Close confirmation"
                className="dashboard-muted rounded-lg p-2 hover:opacity-70"
              >
                <X size={19} />
              </button>
)}
            </div>

            <h2
              id="submit-dialog-title"
              className="dashboard-heading mt-5 text-xl font-bold"
            >
              Submit your practice?
            </h2>

            <p className="dashboard-muted mt-2 text-sm leading-6">
              Once submitted, you won't be able to change your answers in
              this session.
            </p>

            <div className="dashboard-inner-card mt-5 rounded-xl p-4">
              <div className="flex justify-between text-sm">
                <span className="dashboard-muted">Answered</span>
                <strong className="dashboard-heading">
                  {answeredCount}
                </strong>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="dashboard-muted">Unanswered</span>
                <strong className="dashboard-heading">
                  {unansweredCount}
                </strong>
              </div>
            </div>

            {unansweredCount > 0 && (
              <p className="mt-4 text-xs font-medium text-amber-600">
                You still have {unansweredCount} unanswered questions.
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowSubmitConfirmation(false)}
                className="dashboard-secondary-button flex-1 rounded-xl border px-4 py-3 text-sm font-semibold"
              >
                Continue exam
              </button>

              <button
                type="button"
                onClick={submitExam}
                className="dashboard-primary-button flex-1 rounded-xl px-4 py-3 text-sm font-semibold"
              >
                Submit now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}