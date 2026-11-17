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
  RotateCcw,
  Sparkles,
  Layers,
  X,
} from "lucide-react";

import {
  examFlashcards,
  flashcardSubjects,
  getFlashcardsBySubject,
  type ExamFlashcard,
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

export default function FlashcardsPage() {
  const [subject, setSubject] = useState(flashcardSubjects[0] ?? "");
  const [view, setView] = useState<FlashcardView>("study");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState<FlashcardProgress>({
    known: [],
    review: [],
  });
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [showSubjectMenu, setShowSubjectMenu] = useState(false);

  useEffect(() => {
    setProgress(getFlashcardProgress());

    const syncSaved = () => {
      setSavedIds(
        getSavedItems()
          .filter((item) => item.type === "exam-flashcard")
          .map((item) => item.id),
      );
    };

    syncSaved();

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

  const isSaved = currentCard
    ? savedIds.includes(currentCard.id)
    : false;

  const progressPercentage = cards.length
    ? Math.round((knownCount / cards.length) * 100)
    : 0;

  const selectSubject = (value: string) => {
    setSubject(value);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowSubjectMenu(false);
    setView("study");
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((index) => index + 1);
      setIsFlipped(false);
    }
  };

  const previousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((index) => index - 1);
      setIsFlipped(false);
    }
  };

  const handleKnowIt = () => {
    if (!currentCard) return;

    const updated = markFlashcardKnown(currentCard.id);

    setProgress(updated);
    nextCard();
  };

  const handleReview = () => {
    if (!currentCard) return;

    const updated = markFlashcardForReview(currentCard.id);

    setProgress(updated);
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
    setIsFlipped(false);
  };

  return (
    <div className="dashboard-content mx-auto w-full min-w-0 max-w-[1440px] space-y-8 px-4 py-2 sm:px-6 lg:px-8">

      {/* PAGE HEADER */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#5B3DF5]">
            <Sparkles size={15} />
            <span>ACTIVE LEARNING</span>
          </div>

          <h1 className="dashboard-heading text-3xl font-bold tracking-tight">
            Flashcards
          </h1>

          <p className="dashboard-muted mt-2 max-w-xl text-sm leading-6">
            Strengthen your nursing knowledge with active recall.
            Flip each card, test yourself and track your progress.
          </p>
        </div>

        <Link
          href="/dashboard/my-library"
          className="inline-flex items-center gap-2 self-start rounded-xl border border-[var(--dashboard-border)] px-4 py-3 text-sm font-semibold dashboard-heading transition hover:border-[#5B3DF5]/40 hover:text-[#5B3DF5] sm:self-center"
        >
          <Layers size={17} />
          My Library
        </Link>

      </div>

      {/* SUBJECT SELECTOR AND SAVED DECK */}

      <section className="dashboard-card rounded-2xl p-4 sm:p-5">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

            <span className="dashboard-muted text-xs font-semibold uppercase tracking-wider">
              Select subject
            </span>

            <div className="relative">

              <button
                type="button"
                onClick={() => setShowSubjectMenu((value) => !value)}
                className="flex w-full min-w-[210px] items-center justify-between gap-4 rounded-xl border border-[var(--dashboard-border)] px-4 py-3 text-sm font-semibold dashboard-heading transition hover:border-[#5B3DF5]/40 sm:w-auto"
              >
                <span>{view === "saved" ? "Saved Deck" : subject}</span>

                <ChevronDown size={17} />
              </button>

              {showSubjectMenu && (
                <div className="absolute left-0 top-full z-30 mt-2 w-full min-w-[230px] overflow-hidden rounded-xl border border-[var(--dashboard-border)] bg-[var(--dashboard-card)] p-1 shadow-xl">

                  {flashcardSubjects.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => selectSubject(item)}
                      className={`w-full rounded-lg px-3 py-3 text-left text-sm transition hover:bg-[#5B3DF5]/10 ${
                        subject === item && view === "study"
                          ? "bg-[#5B3DF5]/10 font-semibold text-[#5B3DF5]"
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

          <div className="flex flex-wrap items-center gap-3">

            <button
              type="button"
              onClick={() => {
                setView("saved");
                setCurrentIndex(0);
                setIsFlipped(false);
                setShowSubjectMenu(false);
              }}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                view === "saved"
                  ? "border-[#5B3DF5]/30 bg-[#5B3DF5]/10 text-[#5B3DF5]"
                  : "border-[var(--dashboard-border)] dashboard-heading hover:border-[#5B3DF5]/40"
              }`}
            >
              <BookmarkCheck size={17} />
              Saved Deck
              <span className="rounded-full bg-[#5B3DF5]/10 px-2 py-0.5 text-xs text-[#5B3DF5]">
                {savedIds.length}
              </span>
            </button>

            {view === "saved" && (
              <button
                type="button"
                onClick={() => {
                  setView("study");
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className="rounded-xl border border-[var(--dashboard-border)] px-4 py-3 text-sm font-semibold dashboard-muted transition hover:text-[#5B3DF5]"
              >
                Back to subjects
              </button>
            )}

          </div>

        </div>

      </section>

      {/* PROGRESS SUMMARY */}

      <section className="grid gap-4 sm:grid-cols-3">

        <div className="dashboard-card rounded-2xl p-5">

          <div className="flex items-center justify-between">
            <span className="dashboard-muted text-xs font-semibold">
              TOTAL CARDS
            </span>

            <BookOpen size={18} className="text-[#5B3DF5]" />
          </div>

          <p className="dashboard-heading mt-3 text-3xl font-bold">
            {cards.length}
          </p>

          <p className="dashboard-muted mt-1 text-xs">
            Available for revision
          </p>

        </div>

        <div className="dashboard-card rounded-2xl p-5">

          <div className="flex items-center justify-between">
            <span className="dashboard-muted text-xs font-semibold">
              KNOWN
            </span>

            <CheckCircle2 size={18} className="text-emerald-500" />
          </div>

          <p className="mt-3 text-3xl font-bold text-emerald-500">
            {knownCount}
          </p>

          <p className="dashboard-muted mt-1 text-xs">
            Cards mastered
          </p>

        </div>

        <div className="dashboard-card rounded-2xl p-5">

          <div className="flex items-center justify-between">
            <span className="dashboard-muted text-xs font-semibold">
              NEED REVIEW
            </span>

            <CircleHelp size={18} className="text-amber-500" />
          </div>

          <p className="mt-3 text-3xl font-bold text-amber-500">
            {reviewCount}
          </p>

          <p className="dashboard-muted mt-1 text-xs">
            Cards to practise again
          </p>

        </div>

      </section>

      {/* PROGRESS BAR */}

      <section className="dashboard-card rounded-2xl p-5">

        <div className="flex items-center justify-between gap-3">

          <div>
            <p className="dashboard-heading text-sm font-bold">
              Your learning progress
            </p>

            <p className="dashboard-muted mt-1 text-xs">
              {knownCount} of {cards.length} cards mastered
            </p>
          </div>

          <span className="text-sm font-bold text-[#5B3DF5]">
            {progressPercentage}%
          </span>

        </div>

        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#5B3DF5]/10">

          <div
            className="h-full rounded-full bg-gradient-to-r from-[#5B3DF5] to-[#A78BFA] transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />

        </div>

      </section>

      {/* FLASHCARD */}

      {currentCard ? (

        <section className="mx-auto w-full max-w-4xl space-y-5">

          <div className="flex items-center justify-between gap-3">

            <div>
              <p className="dashboard-heading text-sm font-bold">
                {view === "saved" ? "Your saved flashcards" : subject}
              </p>

              <p className="dashboard-muted mt-1 text-xs">
                {currentCard.category} · {currentCard.difficulty}
              </p>
            </div>

            <span className="rounded-full bg-[#5B3DF5]/10 px-3 py-2 text-xs font-bold text-[#5B3DF5]">
              Card {currentIndex + 1} of {cards.length}
            </span>

          </div>

          <button
            type="button"
            onClick={() => setIsFlipped((value) => !value)}
            className="group block w-full text-left [perspective:1400px]"
            aria-label={isFlipped ? "Show question" : "Reveal answer"}
          >

            <div
              className={`relative min-h-[440px] w-full transition-transform duration-700 [transform-style:preserve-3d] ${
                isFlipped ? "[transform:rotateY(180deg)]" : ""
              }`}
            >

              {/* FRONT */}

              <div className="absolute inset-0 flex flex-col rounded-[28px] border border-[var(--dashboard-border)] bg-[var(--dashboard-card)] p-6 shadow-sm [backface-visibility:hidden] sm:p-10">

                <div className="flex items-center justify-between gap-3">

                  <span className="rounded-full bg-[#5B3DF5]/10 px-3 py-2 text-xs font-bold text-[#5B3DF5]">
                    {currentCard.questionType}
                  </span>

                  <span className="dashboard-muted text-xs font-semibold">
                    QUESTION
                  </span>

                </div>

                <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">

                  <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5B3DF5]/10 text-[#5B3DF5]">
                    <BookOpen size={25} />
                  </span>

                  <h2 className="dashboard-heading max-w-2xl text-xl font-bold leading-relaxed sm:text-2xl">
                    {currentCard.question}
                  </h2>

                  <p className="dashboard-muted mt-8 text-sm">
                    Think about your answer before revealing it.
                  </p>

                </div>

                <div className="flex items-center justify-center gap-2 border-t border-[var(--dashboard-border)] pt-5 text-sm font-semibold text-[#5B3DF5]">

                  <RotateCcw size={16} />
                  Click to reveal answer

                </div>

              </div>

              {/* BACK */}

              <div className="absolute inset-0 flex flex-col overflow-y-auto rounded-[28px] border border-emerald-200 bg-emerald-50 p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-10">

                <div className="flex items-center justify-between gap-3">

                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700">

                    <CheckCircle2 size={15} />
                    CORRECT ANSWER

                  </span>

                  <span className="text-xs font-semibold text-emerald-700">
                    ANSWER
                  </span>

                </div>

                <div className="flex-1 py-7">

                  <h2 className="whitespace-pre-line text-lg font-bold leading-relaxed text-emerald-900 sm:text-xl">
                    {currentCard.answer}
                  </h2>

                  <div className="mt-8 rounded-2xl border border-emerald-200 bg-white/80 p-5">

                    <div className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-800">

                      <Sparkles size={17} />
                      Rationale

                    </div>

                    <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                      {currentCard.rationale}
                    </p>

                  </div>

                </div>

                <div className="flex items-center justify-center gap-2 border-t border-emerald-200 pt-5 text-sm font-semibold text-emerald-700">

                  <RotateCcw size={16} />
                  Click to see question

                </div>

              </div>

            </div>

          </button>

          {/* SAVE */}

          <div className="flex justify-center">

            <button
              type="button"
              onClick={handleSave}
              className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition ${
                isSaved
                  ? "border-[#5B3DF5]/30 bg-[#5B3DF5]/10 text-[#5B3DF5]"
                  : "border-[var(--dashboard-border)] dashboard-heading hover:border-[#5B3DF5]/40 hover:text-[#5B3DF5]"
              }`}
            >

              {isSaved ? (
                <BookmarkCheck size={17} />
              ) : (
                <Bookmark size={17} />
              )}

              {isSaved ? "Saved to My Library" : "Save flashcard"}

            </button>

          </div>

          {/* NAVIGATION */}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <button
              type="button"
              onClick={previousCard}
              disabled={currentIndex === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--dashboard-border)] px-5 py-3 text-sm font-semibold dashboard-heading transition hover:border-[#5B3DF5]/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft size={17} />
              Back
            </button>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-1 sm:justify-center">

              <button
                type="button"
                onClick={handleReview}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
              >
                <X size={16} />
                Don't know
              </button>

              <button
                type="button"
                onClick={handleKnowIt}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <Check size={16} />
                Know it
              </button>

            </div>

            <button
              type="button"
              onClick={nextCard}
              disabled={currentIndex === cards.length - 1}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--dashboard-border)] px-5 py-3 text-sm font-semibold dashboard-heading transition hover:border-[#5B3DF5]/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Skip
              <ArrowRight size={17} />
            </button>

          </div>

          {currentIndex === cards.length - 1 && (
            <div className="rounded-2xl border border-[#5B3DF5]/20 bg-[#5B3DF5]/5 p-5 text-center">

              <p className="dashboard-heading text-sm font-bold">
                You've reached the end of this deck.
              </p>

              <button
                type="button"
                onClick={restartCards}
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#5B3DF5]"
              >
                <RotateCcw size={15} />
                Start again
              </button>

            </div>
          )}

        </section>

      ) : (

        <section className="dashboard-card mx-auto max-w-2xl rounded-2xl p-10 text-center">

          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5B3DF5]/10 text-[#5B3DF5]">
            <Bookmark size={27} />
          </span>

          <h2 className="dashboard-heading mt-5 text-xl font-bold">
            {view === "saved"
              ? "Your saved deck is empty"
              : "No flashcards available"}
          </h2>

          <p className="dashboard-muted mx-auto mt-3 max-w-md text-sm leading-6">
            {view === "saved"
              ? "Save flashcards while studying and they'll appear here for quick revision."
              : "There are no flashcards available for this subject yet."}
          </p>

          {view === "saved" && (
            <button
              type="button"
              onClick={() => {
                setView("study");
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className="mt-6 rounded-xl bg-[#5B3DF5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4930D0]"
            >
              Explore flashcards
            </button>
          )}

        </section>

      )}

      {/* DEMO NOTICE */}

      <div className="mx-auto flex max-w-4xl items-start gap-3 rounded-xl border border-[#5B3DF5]/15 bg-[#5B3DF5]/5 p-4">

        <Sparkles size={18} className="mt-0.5 shrink-0 text-[#5B3DF5]" />

        <p className="dashboard-muted text-xs leading-6">
          Flashcards currently use demonstration question-bank content.
          Your saved cards and learning progress are stored locally on
          this device until account-based synchronization is connected.
        </p>

      </div>

    </div>
  );
}