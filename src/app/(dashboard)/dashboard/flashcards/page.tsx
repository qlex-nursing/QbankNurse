"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  Layers,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  X,
  Zap,
} from "lucide-react";

import {
  examFlashcards,
  flashcardSubjects,
  getFlashcardsBySubject,
} from "@/data/mock/dashboard/flashcards";

import {
  getFlashcardProgress,
  markFlashcardForReview,
  markFlashcardKnown,
  toggleExamFlashcardSaved,
  type FlashcardProgress,
} from "@/lib/flashcard-progress";

import {
  getSavedItems,
  subscribeToSavedItems,
} from "@/lib/saved-items";

type FlashcardView = "study" | "saved";
type Confidence = "low" | "medium" | "high";

const CONFIDENCE_KEY = "qbanknurse-flashcard-confidence";

const confidenceOptions: {
  id: Confidence;
  label: string;
  description: string;
}[] = [
  {
    id: "low",
    label: "Not confident",
    description: "I need to study this again.",
  },
  {
    id: "medium",
    label: "Somewhat confident",
    description: "I understand part of it.",
  },
  {
    id: "high",
    label: "Very confident",
    description: "I understand this concept.",
  },
];

export default function FlashcardsPage() {
  const [subject, setSubject] = useState(flashcardSubjects[0] ?? "");
  const [view, setView] = useState<FlashcardView>("study");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [progress, setProgress] = useState<FlashcardProgress>({
    known: [],
    review: [],
  });

  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<
    Record<string, Confidence>
  >({});

  const [showSubjectMenu, setShowSubjectMenu] = useState(false);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    setProgress(getFlashcardProgress());

    try {
      const storedConfidence = localStorage.getItem(CONFIDENCE_KEY);

      if (storedConfidence) {
        setConfidence(JSON.parse(storedConfidence));
      }
    } catch {
      setConfidence({});
    }

    const syncSaved = () => {
      setSavedIds(
        getSavedItems()
          .filter((item) => item.type === "exam-flashcard")
          .map((item) => item.id),
      );
    };

    syncSaved();
    setStorageReady(true);

    return subscribeToSavedItems(syncSaved);
  }, []);

  const cards = useMemo(() => {
    if (view === "saved") {
      return examFlashcards.filter((card) =>
        savedIds.includes(card.id),
      );
    }

    return getFlashcardsBySubject(subject);
  }, [view, subject, savedIds]);

  const currentCard = cards[currentIndex];

  const knownCount = cards.filter((card) =>
    progress.known.includes(card.id),
  ).length;

  const reviewCount = cards.filter((card) =>
    progress.review.includes(card.id),
  ).length;

  const savedCount = savedIds.length;

  const highConfidenceCount = cards.filter(
    (card) => confidence[card.id] === "high",
  ).length;

  const reviewedCount = cards.filter(
    (card) =>
      progress.known.includes(card.id) ||
      progress.review.includes(card.id),
  ).length;

  const progressPercentage = cards.length
    ? Math.round((reviewedCount / cards.length) * 100)
    : 0;

  const isSaved = currentCard
    ? savedIds.includes(currentCard.id)
    : false;

  const currentConfidence = currentCard
    ? confidence[currentCard.id]
    : undefined;

  const selectSubject = (value: string) => {
    setSubject(value);
    setCurrentIndex(0);
    setRevealed(false);
    setCompleted(false);
    setShowSubjectMenu(false);
    setView("study");
  };

  const selectSavedDeck = () => {
    setView("saved");
    setCurrentIndex(0);
    setRevealed(false);
    setCompleted(false);
    setShowSubjectMenu(false);
  };

  const selectSubjectDeck = () => {
    setView("study");
    setCurrentIndex(0);
    setRevealed(false);
    setCompleted(false);
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((index) => index + 1);
      setRevealed(false);
      return;
    }

    setCompleted(true);
  };

  const previousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((index) => index - 1);
      setRevealed(false);
      setCompleted(false);
    }
  };

  const handleConfidence = (value: Confidence) => {
    if (!currentCard) return;

    const updatedConfidence = {
      ...confidence,
      [currentCard.id]: value,
    };

    setConfidence(updatedConfidence);

    try {
      localStorage.setItem(
        CONFIDENCE_KEY,
        JSON.stringify(updatedConfidence),
      );
    } catch {
      // Continue the current session if local storage is unavailable.
    }

    if (value === "high") {
      setProgress(markFlashcardKnown(currentCard.id));
    } else {
      setProgress(markFlashcardForReview(currentCard.id));
    }

    nextCard();
  };

  const handleSave = () => {
    if (!currentCard) return;

    toggleExamFlashcardSaved({
      id: currentCard.id,
      question: currentCard.question,
      answer: currentCard.answer,
      rationale: currentCard.rationale,
      subject: currentCard.subject,
      category: currentCard.category,
    });
  };

  const restartCards = () => {
    setCurrentIndex(0);
    setRevealed(false);
    setCompleted(false);
  };

  if (!storageReady) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 dashboard-muted text-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#5B3DF5] border-t-transparent" />
          Preparing your flashcards...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content mx-auto w-full min-w-0 max-w-[1440px] space-y-7 px-4 py-3 sm:px-6 lg:px-8">

      {/* HEADER */}

      <section className="relative overflow-hidden rounded-[26px] bg-[#17263F] p-6 text-white sm:p-9">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#5B3DF5]/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#C8BFFF]">
              <Zap size={14} />
              Exam preparation mode
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Exam Flashcards
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
              Challenge your nursing knowledge, reveal clinical
              explanations and build the confidence you need for
              your next examination.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold">
                <Target size={15} className="text-[#B7A7FF]" />
                Active recall
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold">
                <BookOpen size={15} className="text-[#B7A7FF]" />
                Clinical rationale
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold">
                <Trophy size={15} className="text-[#B7A7FF]" />
                Confidence tracking
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/my-library"
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20 lg:self-center"
          >
            <Layers size={17} />
            My Library
          </Link>
        </div>
      </section>

      {/* DECK SELECTOR */}

      <section className="dashboard-card rounded-2xl border p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="dashboard-section-label">
              YOUR QUESTION DECK
            </p>

            <div className="relative mt-2">
              <button
                type="button"
                onClick={() =>
                  setShowSubjectMenu((value) => !value)
                }
                className="flex min-w-[220px] items-center justify-between gap-4 rounded-xl border border-[var(--dashboard-border)] px-4 py-3 text-sm font-bold dashboard-heading transition hover:border-[#5B3DF5]/50"
              >
                <span>
                  {view === "saved" ? "My Saved Questions" : subject}
                </span>

                <ChevronDown
                  size={17}
                  className={`transition-transform ${
                    showSubjectMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showSubjectMenu && (
                <div className="absolute left-0 top-full z-30 mt-2 max-h-72 w-full min-w-[240px] overflow-y-auto rounded-xl border border-[var(--dashboard-border)] bg-[var(--dashboard-card)] p-1 shadow-xl">
                  {flashcardSubjects.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => selectSubject(item)}
                      className={`w-full rounded-lg px-3 py-3 text-left text-sm transition hover:bg-[#5B3DF5]/10 ${
                        subject === item && view === "study"
                          ? "bg-[#5B3DF5]/10 font-bold text-[#5B3DF5]"
                          : "dashboard-heading"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={selectSubjectDeck}
              className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                view === "study"
                  ? "bg-[#5B3DF5] text-white shadow-lg shadow-[#5B3DF5]/20"
                  : "border border-[var(--dashboard-border)] dashboard-heading hover:border-[#5B3DF5]/40"
              }`}
            >
              Study Questions
            </button>

            <button
              type="button"
              onClick={selectSavedDeck}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${
                view === "saved"
                  ? "border-[#5B3DF5]/30 bg-[#5B3DF5]/10 text-[#5B3DF5]"
                  : "border-[var(--dashboard-border)] dashboard-heading hover:border-[#5B3DF5]/40"
              }`}
            >
              <BookmarkCheck size={16} />
              Saved
              <span className="rounded-full bg-[#5B3DF5]/10 px-2 py-0.5 text-xs text-[#5B3DF5]">
                {savedCount}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* PERFORMANCE SUMMARY */}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="dashboard-card rounded-2xl border p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="dashboard-muted text-[10px] font-bold uppercase tracking-wider">
              Total questions
            </span>
            <BookOpen size={18} className="text-[#5B3DF5]" />
          </div>

          <p className="dashboard-heading mt-3 text-3xl font-extrabold">
            {cards.length}
          </p>

          <p className="dashboard-muted mt-1 text-xs">
            In this deck
          </p>
        </div>

        <div className="dashboard-card rounded-2xl border p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="dashboard-muted text-[10px] font-bold uppercase tracking-wider">
              Reviewed
            </span>
            <CheckCircle2 size={18} className="text-blue-500" />
          </div>

          <p className="mt-3 text-3xl font-extrabold text-blue-500">
            {reviewedCount}
          </p>

          <p className="dashboard-muted mt-1 text-xs">
            Questions attempted
          </p>
        </div>

        <div className="dashboard-card rounded-2xl border p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="dashboard-muted text-[10px] font-bold uppercase tracking-wider">
              Confident
            </span>
            <Trophy size={18} className="text-emerald-500" />
          </div>

          <p className="mt-3 text-3xl font-extrabold text-emerald-500">
            {knownCount}
          </p>

          <p className="dashboard-muted mt-1 text-xs">
            Marked as mastered
          </p>
        </div>

        <div className="dashboard-card rounded-2xl border p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="dashboard-muted text-[10px] font-bold uppercase tracking-wider">
              Review again
            </span>
            <CircleHelp size={18} className="text-amber-500" />
          </div>

          <p className="mt-3 text-3xl font-extrabold text-amber-500">
            {reviewCount}
          </p>

          <p className="dashboard-muted mt-1 text-xs">
            Need more practice
          </p>
        </div>
      </section>

      {/* PROGRESS */}

      <section className="dashboard-card rounded-2xl border p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Target size={18} className="text-[#5B3DF5]" />
              <h2 className="dashboard-heading text-sm font-extrabold">
                Deck completion
              </h2>
            </div>

            <p className="dashboard-muted mt-2 text-xs">
              {reviewedCount} of {cards.length} questions reviewed
            </p>
          </div>

          <p className="text-2xl font-extrabold text-[#5B3DF5]">
            {progressPercentage}%
          </p>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#5B3DF5]/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#5B3DF5] to-[#A78BFA] transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px]">
          <span className="flex items-center gap-2 dashboard-muted">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Mastered: {knownCount}
          </span>

          <span className="flex items-center gap-2 dashboard-muted">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Needs review: {reviewCount}
          </span>

          <span className="flex items-center gap-2 dashboard-muted">
            <span className="h-2 w-2 rounded-full bg-[#5B3DF5]" />
            High confidence: {highConfidenceCount}
          </span>
        </div>
      </section>

      {/* QUESTION EXPERIENCE */}

      {currentCard && !completed ? (
        <section className="mx-auto w-full max-w-5xl space-y-5">

          {/* Question navigation header */}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-[#5B3DF5]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#5B3DF5]">
                  {currentCard.questionType}
                </span>

                <span className="dashboard-muted text-xs">
                  {currentCard.difficulty}
                </span>

                <span className="dashboard-muted text-xs">
                  · {currentCard.category}
                </span>
              </div>

              <h2 className="dashboard-heading mt-3 text-lg font-extrabold">
                {view === "saved" ? "Saved question practice" : subject}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-[var(--dashboard-border)] px-3 py-2">
                <Clock3 size={15} className="dashboard-muted" />
                <span className="dashboard-heading text-xs font-bold">
                  {currentIndex + 1} / {cards.length}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSave}
                aria-label={isSaved ? "Remove saved question" : "Save question"}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                  isSaved
                    ? "border-[#5B3DF5]/30 bg-[#5B3DF5]/10 text-[#5B3DF5]"
                    : "border-[var(--dashboard-border)] dashboard-muted hover:border-[#5B3DF5]/40 hover:text-[#5B3DF5]"
                }`}
              >
                {isSaved ? (
                  <BookmarkCheck size={18} />
                ) : (
                  <Bookmark size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Question panel */}

          <div className="dashboard-card overflow-hidden rounded-[26px] border">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--dashboard-border)] px-5 py-4 sm:px-7">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5B3DF5]/10 text-[#5B3DF5]">
                  <BookOpen size={18} />
                </div>

                <div>
                  <p className="dashboard-heading text-xs font-extrabold">
                    EXAM QUESTION
                  </p>
                  <p className="dashboard-muted mt-0.5 text-[10px]">
                    Read carefully before revealing the answer
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-blue-500/10 px-3 py-1.5 text-[10px] font-bold text-blue-500">
                {currentCard.subject}
              </span>
            </div>

            <div className="px-5 py-9 sm:px-9 sm:py-12">
              <div className="mx-auto max-w-3xl">
                <p className="dashboard-muted mb-4 text-[10px] font-bold uppercase tracking-[0.18em]">
                  Question {currentIndex + 1}
                </p>

                <h3 className="dashboard-heading text-xl font-bold leading-[1.8] sm:text-2xl">
                  {currentCard.question}
                </h3>

                {!revealed && (
                  <div className="mt-9 rounded-2xl border border-dashed border-[#5B3DF5]/30 bg-[#5B3DF5]/[0.04] p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#5B3DF5]/10 text-[#5B3DF5]">
                        <Sparkles size={18} />
                      </div>

                      <div>
                        <p className="dashboard-heading text-sm font-bold">
                          Think it through
                        </p>

                        <p className="dashboard-muted mt-1 text-xs leading-6">
                          Take a moment to formulate your answer.
                          Consider the clinical situation and the
                          nursing principles involved.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setRevealed(true)}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#5B3DF5] px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-[#5B3DF5]/20 transition hover:-translate-y-0.5 hover:bg-[#4930D6] sm:w-auto"
                    >
                      Reveal Answer
                      <ArrowRight size={17} />
                    </button>
                  </div>
                )}

                {revealed && (
                  <div className="mt-9 space-y-6">

                    {/* Correct answer */}

                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30 sm:p-6">
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 size={19} />
                        <span className="text-xs font-extrabold uppercase tracking-wider">
                          Correct answer
                        </span>
                      </div>

                      <p className="mt-4 whitespace-pre-line text-lg font-extrabold leading-8 text-emerald-950 dark:text-emerald-200">
                        {currentCard.answer}
                      </p>
                    </div>

                    {/* Rationale */}

                    <div className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-surface)] p-5 sm:p-6">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5B3DF5]/10 text-[#5B3DF5]">
                          <Sparkles size={18} />
                        </div>

                        <div>
                          <h4 className="dashboard-heading text-sm font-extrabold">
                            Clinical Rationale
                          </h4>

                          <p className="dashboard-muted mt-0.5 text-[10px]">
                            Understand the reasoning behind the answer
                          </p>
                        </div>
                      </div>

                      <p className="dashboard-heading mt-5 whitespace-pre-line text-sm leading-8">
                        {currentCard.rationale}
                      </p>
                    </div>

                    {/* Confidence selection */}

                    <div className="rounded-2xl border border-[#5B3DF5]/20 bg-[#5B3DF5]/[0.04] p-5 sm:p-6">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5B3DF5]/10 text-[#5B3DF5]">
                          <Target size={19} />
                        </div>

                        <div>
                          <h4 className="dashboard-heading text-sm font-extrabold">
                            How confident are you?
                          </h4>

                          <p className="dashboard-muted mt-1 text-xs leading-5">
                            Be honest. Your confidence rating helps
                            identify what you should revise.
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        {confidenceOptions.map((option) => {
                          const selected =
                            currentConfidence === option.id;

                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() =>
                                handleConfidence(option.id)
                              }
                              className={`rounded-xl border p-4 text-left transition hover:-translate-y-0.5 ${
                                selected
                                  ? "border-[#5B3DF5] bg-[#5B3DF5]/10"
                                  : "border-[var(--dashboard-border)] bg-[var(--dashboard-card)] hover:border-[#5B3DF5]/40"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="dashboard-heading text-xs font-extrabold">
                                  {option.label}
                                </span>

                                {selected && (
                                  <Check
                                    size={15}
                                    className="text-[#5B3DF5]"
                                  />
                                )}
                              </div>

                              <p className="dashboard-muted mt-2 text-[10px] leading-5">
                                {option.description}
                              </p>
                            </button>
                          );
                        })}
                      </div>

                      <p className="dashboard-muted mt-4 text-[10px]">
                        Select a confidence level to save your result
                        and continue to the next question.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={previousCard}
              disabled={currentIndex === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--dashboard-border)] px-5 py-3 text-sm font-bold dashboard-heading transition hover:border-[#5B3DF5]/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft size={17} />
              Previous
            </button>

            <div className="flex items-center justify-center gap-2 dashboard-muted text-xs">
              <span className="h-2 w-2 rounded-full bg-[#5B3DF5]" />
              {revealed
                ? "Review the rationale and rate your confidence"
                : "Answer mentally before revealing"}
            </div>

            <button
              type="button"
              onClick={nextCard}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#17263F] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#263C5D]"
            >
              Skip question
              <ArrowRight size={17} />
            </button>
          </div>
        </section>
      ) : completed ? (

        /* COMPLETION SCREEN */

        <section className="dashboard-card mx-auto max-w-3xl rounded-[26px] border p-7 text-center sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#5B3DF5]/10 text-[#5B3DF5]">
            <Trophy size={36} />
          </div>

          <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-[#5B3DF5]">
            Deck completed
          </p>

          <h2 className="dashboard-heading mt-3 text-2xl font-extrabold sm:text-3xl">
            Great work. Keep going!
          </h2>

          <p className="dashboard-muted mx-auto mt-3 max-w-lg text-sm leading-7">
            You've reached the end of this question deck. Review
            your progress and revisit the questions that need more
            attention.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border p-4">
              <p className="dashboard-muted text-[10px] font-bold uppercase">
                Reviewed
              </p>
              <p className="dashboard-heading mt-2 text-2xl font-extrabold">
                {reviewedCount}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="dashboard-muted text-[10px] font-bold uppercase">
                Mastered
              </p>
              <p className="mt-2 text-2xl font-extrabold text-emerald-500">
                {knownCount}
              </p>
            </div>

            <div className="col-span-2 rounded-xl border p-4 sm:col-span-1">
              <p className="dashboard-muted text-[10px] font-bold uppercase">
                Need review
              </p>
              <p className="mt-2 text-2xl font-extrabold text-amber-500">
                {reviewCount}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={restartCards}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5B3DF5] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#4930D6]"
            >
              <RotateCcw size={17} />
              Restart deck
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentIndex(0);
                setRevealed(false);
                setCompleted(false);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--dashboard-border)] px-6 py-3 text-sm font-bold dashboard-heading transition hover:border-[#5B3DF5]/40"
            >
              Review questions
            </button>
          </div>
        </section>

      ) : (

        /* EMPTY STATE */

        <section className="dashboard-card mx-auto max-w-2xl rounded-[26px] border p-8 text-center sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5B3DF5]/10 text-[#5B3DF5]">
            <BookOpen size={28} />
          </div>

          <h2 className="dashboard-heading mt-5 text-xl font-extrabold">
            {view === "saved"
              ? "Your saved question deck is empty"
              : "No questions available yet"}
          </h2>

          <p className="dashboard-muted mx-auto mt-3 max-w-md text-sm leading-7">
            {view === "saved"
              ? "Save questions while practising. They'll be collected here for focused revision."
              : "There are currently no flashcards available for this subject."}
          </p>

          {view === "saved" && (
            <button
              type="button"
              onClick={selectSubjectDeck}
              className="mt-6 rounded-xl bg-[#5B3DF5] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#4930D6]"
            >
              Explore question decks
            </button>
          )}
        </section>
      )}

      {/* FOOTER NOTICE */}

      <div className="mx-auto flex max-w-4xl items-start gap-3 rounded-2xl border border-[#5B3DF5]/15 bg-[#5B3DF5]/[0.04] p-4">
        <Sparkles
          size={18}
          className="mt-0.5 shrink-0 text-[#5B3DF5]"
        />

        <p className="dashboard-muted text-xs leading-6">
          Exam Flashcards currently use demonstration question-bank
          content. Your saved questions, confidence ratings and
          learning progress are stored locally on this device.
          Account-based synchronization and live exam analytics
          will be connected when the backend API is integrated.
        </p>
      </div>
    </div>
  );
}