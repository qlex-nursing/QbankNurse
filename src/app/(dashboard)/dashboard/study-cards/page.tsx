"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  RotateCcw,
  RotateCw,
  Sparkles,
  GraduationCap,
} from "lucide-react";

import {
  studyCards,
  studyCardSubjects,
} from "@/data/mock/dashboard/study-cards";

import {
  saveItem,
  toggleSavedItem,
} from "@/lib/saved-items";

type LearningStatus = "known" | "review";
type ActiveFilter = "all" | "review" | "saved";

interface CardProgress {
  known: string[];
  review: string[];
  saved: string[];
}

const STORAGE_KEY = "qbanknurse-study-card-progress";

const emptyProgress: CardProgress = {
  known: [],
  review: [],
  saved: [],
};

export default function StudyCardsPage() {
  const [selectedSubject, setSelectedSubject] =
    useState("All subjects");

  const [activeFilter, setActiveFilter] =
    useState<ActiveFilter>("all");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [progress, setProgress] =
    useState<CardProgress>(emptyProgress);

  const [storageReady, setStorageReady] = useState(false);

  // Load saved progress and migrate previously saved cards.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored) as CardProgress;

        const loadedProgress: CardProgress = {
          known: Array.isArray(parsed.known) ? parsed.known : [],
          review: Array.isArray(parsed.review) ? parsed.review : [],
          saved: Array.isArray(parsed.saved) ? parsed.saved : [],
        };

        setProgress(loadedProgress);

        loadedProgress.saved.forEach((cardId) => {
          const card = studyCards.find(
            (item) => item.id === cardId,
          );

          if (card) {
            saveItem({
              id: card.id,
              type: "study-card",
              title: card.question,
              description: card.answer,
              href: "/dashboard/study-cards",
              metadata: {
                subject: card.subject,
                topic: card.topic,
              },
            });
          }
        });
      }
    } catch {
      setProgress(emptyProgress);
    }

    setStorageReady(true);
  }, []);

  // Persist progress.
  useEffect(() => {
    if (!storageReady) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(progress),
    );
  }, [progress, storageReady]);

  // Filter cards by subject and learning mode.
  const filteredCards = useMemo(() => {
    return studyCards.filter((card) => {
      const matchesSubject =
        selectedSubject === "All subjects" ||
        card.subject === selectedSubject;

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "review" &&
          progress.review.includes(card.id)) ||
        (activeFilter === "saved" &&
          progress.saved.includes(card.id));

      return matchesSubject && matchesFilter;
    });
  }, [selectedSubject, activeFilter, progress]);

  const currentCard = filteredCards[currentIndex];

  // Progress statistics.
  const knownCount = studyCards.filter((card) =>
    progress.known.includes(card.id),
  ).length;

  const reviewCount = studyCards.filter((card) =>
    progress.review.includes(card.id),
  ).length;

  const savedCount = studyCards.filter((card) =>
    progress.saved.includes(card.id),
  ).length;

  const progressPercentage =
    studyCards.length > 0
      ? Math.round((knownCount / studyCards.length) * 100)
      : 0;

  // Card navigation.
  const goToCard = (index: number) => {
    if (filteredCards.length === 0) return;

    setCurrentIndex(
      (index + filteredCards.length) % filteredCards.length,
    );

    setIsFlipped(false);
  };

  const changeFilter = (filter: ActiveFilter) => {
    setActiveFilter(filter);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const changeSubject = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Update learning status.
  const updateStatus = (status: LearningStatus) => {
    if (!currentCard) return;

    setProgress((previous) => {
      const known = previous.known.filter(
        (id) => id !== currentCard.id,
      );

      const review = previous.review.filter(
        (id) => id !== currentCard.id,
      );

      if (status === "known") {
        known.push(currentCard.id);
      } else {
        review.push(currentCard.id);
      }

      return {
        ...previous,
        known,
        review,
      };
    });

    if (activeFilter !== "all") {
      setIsFlipped(false);

      setCurrentIndex((index) =>
        Math.min(index, Math.max(filteredCards.length - 2, 0)),
      );
    } else {
      goToCard(currentIndex + 1);
    }
  };

  // Save or remove a card from My Library.
  const toggleSaved = () => {
    if (!currentCard) return;

    toggleSavedItem({
      id: currentCard.id,
      type: "study-card",
      title: currentCard.question,
      description: currentCard.answer,
      href: "/dashboard/study-cards",
      metadata: {
        subject: currentCard.subject,
        topic: currentCard.topic,
      },
    });

    setProgress((previous) => ({
      ...previous,
      saved: previous.saved.includes(currentCard.id)
        ? previous.saved.filter(
            (id) => id !== currentCard.id,
          )
        : [...previous.saved, currentCard.id],
    }));
  };

  // Reset learning progress.
  const resetProgress = () => {
    const confirmed = window.confirm(
      "Reset all your Study Cards progress? This will clear mastered, review and saved cards.",
    );

    if (!confirmed) return;

    setProgress(emptyProgress);
    setCurrentIndex(0);
    setIsFlipped(false);
    setActiveFilter("all");
  };

  const isKnown = currentCard
    ? progress.known.includes(currentCard.id)
    : false;

  const isSaved = currentCard
    ? progress.saved.includes(currentCard.id)
    : false;

  return (
    <main className="w-full pb-7">

      {/* =====================================================
          FULL-WIDTH HERO
      ===================================================== */}

      <section className="relative isolate flex min-h-[165px] w-full items-center overflow-hidden bg-gradient-to-r from-[#17263F] via-[#202C50] to-[#30245F] px-5 py-6 text-white">

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_50%,rgba(91,61,245,0.22),transparent_55%)]" />

        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/[0.06]" />

        <div className="pointer-events-none absolute -bottom-32 right-1/4 h-64 w-64 rounded-full border border-white/[0.05]" />

        <div className="relative z-10 w-full max-w-4xl">

          <span className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.22em] text-[#B9A9FF]">
            <GraduationCap size={13} />
            ACTIVE LEARNING
          </span>

          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Master your nursing{" "}
            <span className="text-[#B9A9FF]">
              knowledge
            </span>
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-white/60">
            Strengthen your nursing knowledge with interactive study cards.
            Review important concepts, test your memory and track what
            you have mastered.
          </p>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[11px] font-semibold text-white/70">
            <span>{studyCards.length} study cards</span>
            <span>{knownCount} mastered</span>
            <span>{savedCount} saved for later</span>
          </div>

        </div>
      </section>

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <div className="mx-auto w-full max-w-[1500px] space-y-6 px-5 pt-6 sm:px-7 lg:px-9">

        {/* =====================================================
            PROGRESS STATISTICS
        ===================================================== */}

        <section className="space-y-3">

          <div>
            <p className="dashboard-section-label">
              YOUR LEARNING ACTIVITY
            </p>

            <h2 className="dashboard-heading mt-1 text-xl font-extrabold">
              Learning overview
            </h2>

            <p className="dashboard-muted mt-1 text-sm">
              Track your progress as you master important nursing concepts.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">

            <StatCard
              label="Total cards"
              value={studyCards.length}
              icon={<BookOpen size={19} />}
            />

            <StatCard
              label="Mastered"
              value={knownCount}
              icon={<CheckCircle2 size={19} />}
              accent="green"
            />

            <StatCard
              label="Review again"
              value={reviewCount}
              icon={<RotateCcw size={19} />}
              accent="orange"
            />

            <StatCard
              label="Saved cards"
              value={savedCount}
              icon={<Bookmark size={19} />}
              accent="purple"
            />

          </div>
        </section>

        {/* =====================================================
            LEARNING PROGRESS
        ===================================================== */}

        <section className="dashboard-card rounded-xl border border-[var(--dashboard-border)] p-4 sm:p-5">

          <div className="flex flex-wrap items-center justify-between gap-3">

            <div>
              <div className="flex items-center gap-2">
                <div className="dashboard-accent-icon !h-9 !w-9">
                  <Sparkles size={17} />
                </div>

                <h2 className="dashboard-heading text-base font-extrabold">
                  Your learning progress
                </h2>
              </div>

              <p className="dashboard-muted mt-2 text-xs sm:text-sm">
                Cards you have marked as mastered.
              </p>
            </div>

            <span className="text-2xl font-extrabold tracking-tight text-[#5B3DF5]">
              {progressPercentage}%
            </span>

          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-violet-100">
            <div
              className="h-full rounded-full bg-[#5B3DF5] transition-all duration-500"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>

          <div className="dashboard-muted mt-3 flex justify-between text-[11px] font-medium sm:text-xs">
            <span>{knownCount} mastered</span>
            <span>{studyCards.length - knownCount} remaining</span>
          </div>

        </section>

        {/* =====================================================
            FILTERS AND COLLECTION
        ===================================================== */}

        <section className="space-y-4 border-t border-[var(--dashboard-border)] pt-5">

          <div className="flex flex-wrap items-center justify-between gap-3">

            <div>
              <p className="dashboard-section-label">
                ORGANIZE YOUR LEARNING
              </p>

              <h2 className="dashboard-heading mt-1 text-xl font-extrabold">
                Study Cards collection
              </h2>

              <p className="dashboard-muted mt-1 text-sm">
                Choose a subject and select your learning mode.
              </p>
            </div>

            <button
              type="button"
              onClick={resetProgress}
              className="dashboard-card dashboard-heading inline-flex min-h-9 items-center gap-2 rounded-lg border border-[var(--dashboard-border)] px-3 py-2 text-xs font-semibold transition hover:border-[#5B3DF5] hover:text-[#5B3DF5]"
            >
              <RotateCcw size={14} />
              Reset progress
            </button>

          </div>

          {/* SUBJECT SELECTOR */}

          <div className="relative max-w-md">

            <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2">
              <BookOpen size={16} className="dashboard-muted" />
            </div>

            <select
              value={selectedSubject}
              onChange={(event) =>
                changeSubject(event.target.value)
              }
              className="dashboard-search dashboard-heading h-11 w-full appearance-none rounded-xl border border-[var(--dashboard-border)] pl-11 pr-10 text-sm outline-none transition focus:border-[#5B3DF5]"
            >
              {studyCardSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="dashboard-muted pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
            />

          </div>

          {/* FILTER PILLS */}

          <div className="flex flex-wrap items-center gap-2">

            <FilterButton
              active={activeFilter === "all"}
              onClick={() => changeFilter("all")}
            >
              All cards ({studyCards.length})
            </FilterButton>

            <FilterButton
              active={activeFilter === "review"}
              onClick={() => changeFilter("review")}
            >
              <RotateCcw size={13} />
              Review again ({reviewCount})
            </FilterButton>

            <FilterButton
              active={activeFilter === "saved"}
              onClick={() => changeFilter("saved")}
            >
              <Bookmark size={13} />
              Saved ({savedCount})
            </FilterButton>

          </div>

        </section>

        {/* =====================================================
            FLASHCARD WORKSPACE
        ===================================================== */}

        <section className="space-y-4 border-t border-[var(--dashboard-border)] pt-5">

          <div className="flex flex-wrap items-center justify-between gap-3">

            <div>
              <p className="dashboard-section-label">
                TEST YOUR KNOWLEDGE
              </p>

              <h2 className="dashboard-heading mt-1 text-xl font-extrabold">
                Interactive flashcards
              </h2>

              <p className="dashboard-muted mt-1 text-sm">
                Reveal answers, review explanations and track mastery.
              </p>
            </div>

            {currentCard && (
              <span className="dashboard-count-badge">
                {currentIndex + 1} of {filteredCards.length} cards
              </span>
            )}

          </div>

          {currentCard ? (
            <div className="mx-auto w-full max-w-4xl space-y-5">

              {/* CARD INFORMATION */}

              <div className="flex flex-wrap items-center justify-between gap-3">

                <div>
                  <p className="dashboard-muted text-xs font-medium">
                    CURRENT TOPIC
                  </p>

                  <h3 className="dashboard-heading mt-1 text-sm font-extrabold sm:text-base">
                    {currentCard.topic}
                  </h3>
                </div>

                <span className="rounded-full bg-[#E8DEFF] px-3 py-1.5 text-[10px] font-bold text-[#392576]">
                  {currentCard.subject}
                </span>

              </div>

              {/* FLIP CARD */}

              <button
                type="button"
                onClick={() =>
                  setIsFlipped((value) => !value)
                }
                className="group block w-full text-left"
                aria-label={
                  isFlipped
                    ? "Show study card question"
                    : "Reveal study card answer"
                }
              >
                <div
                  className="relative min-h-[340px] w-full rounded-xl transition-transform duration-500 [transform-style:preserve-3d]"
                  style={{
                    transform: isFlipped
                      ? "rotateY(180deg)"
                      : "rotateY(0deg)",
                  }}
                >

                  {/* FRONT */}

                  <div className="dashboard-card absolute inset-0 flex flex-col items-center justify-center overflow-y-auto rounded-xl border border-[var(--dashboard-border)] bg-white p-6 text-center shadow-sm [backface-visibility:hidden] sm:p-12">

                    <div className="dashboard-accent-icon mb-6 !h-12 !w-12">
                      <BookOpen size={21} />
                    </div>

                    <span className="mb-5 rounded-full bg-[#E8DEFF] px-4 py-2 text-[10px] font-extrabold uppercase tracking-widest text-[#392576]">
                      Question
                    </span>

                    <h2 className="dashboard-heading max-w-2xl text-xl font-extrabold leading-relaxed sm:text-2xl">
                      {currentCard.question}
                    </h2>

                    <div className="dashboard-muted mt-8 flex items-center gap-2 text-xs font-medium">
                      <RotateCw size={15} />
                      Click anywhere to reveal answer
                    </div>

                  </div>

                  {/* BACK */}

                  <div className="dashboard-card absolute inset-0 flex flex-col items-center justify-center overflow-y-auto rounded-xl border border-[#8D79FF]/30 bg-[#F8F6FF] p-6 text-center shadow-sm [backface-visibility:hidden] sm:p-10 [transform:rotateY(180deg)]">

                    <span className="mb-5 rounded-full bg-emerald-100 px-4 py-2 text-[10px] font-extrabold uppercase tracking-widest text-emerald-700">
                      Answer
                    </span>

                    <h2 className="dashboard-heading max-w-2xl text-xl font-extrabold leading-relaxed sm:text-2xl">
                      {currentCard.answer}
                    </h2>

                    <div className="mt-6 w-full max-w-2xl rounded-xl border border-[#8D79FF]/20 bg-white p-4 text-left">

                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#5B3DF5]">
                        Why it matters
                      </p>

                      <p className="dashboard-muted mt-2 text-sm leading-6">
                        {currentCard.explanation}
                      </p>

                    </div>

                    <p className="dashboard-muted mt-5 text-xs">
                      Click to see the question again
                    </p>

                  </div>

                </div>
              </button>

              {/* FLIP AND SAVE ACTIONS */}

              <div className="flex flex-wrap justify-center gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setIsFlipped((value) => !value)
                  }
                  className="dashboard-card dashboard-heading inline-flex min-h-10 items-center gap-2 rounded-xl border border-[var(--dashboard-border)] px-4 py-2.5 text-xs font-bold transition hover:border-[#5B3DF5] hover:text-[#5B3DF5]"
                >
                  <RotateCw size={15} />
                  {isFlipped ? "Show question" : "Reveal answer"}
                </button>

                <button
                  type="button"
                  onClick={toggleSaved}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
                    isSaved
                      ? "border-[#5B3DF5] bg-[#E8DEFF] text-[#4B2ED0]"
                      : "dashboard-card dashboard-heading border-[var(--dashboard-border)] hover:border-[#5B3DF5] hover:text-[#5B3DF5]"
                  }`}
                >
                  <Bookmark
                    size={15}
                    fill={isSaved ? "currentColor" : "none"}
                  />

                  {isSaved ? "Saved to My Library" : "Save card"}
                </button>

              </div>

              {/* LEARNING ACTIONS */}

              {isFlipped && (
                <div className="dashboard-card rounded-xl border border-[var(--dashboard-border)] p-4 sm:p-5">

                  <div className="text-center">
                    <h3 className="dashboard-heading text-sm font-extrabold">
                      How well did you know this?
                    </h3>

                    <p className="dashboard-muted mt-1 text-xs">
                      Update your learning progress for this card.
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">

                    <button
                      type="button"
                      onClick={() => updateStatus("review")}
                      className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-xs font-bold text-orange-700 transition hover:bg-orange-100"
                    >
                      <RotateCcw size={16} />
                      Review Again
                    </button>

                    <button
                      type="button"
                      onClick={() => updateStatus("known")}
                      className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#5B3DF5] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#4930D1]"
                    >
                      <Check size={16} />
                      Know It
                    </button>

                  </div>

                  {isKnown && (
                    <p className="mt-3 text-center text-xs font-semibold text-emerald-600">
                      You've already mastered this card.
                    </p>
                  )}

                </div>
              )}

              {/* CARD NAVIGATION */}

              <div className="flex items-center justify-between gap-3 border-t border-[var(--dashboard-border)] pt-4">

                <button
                  type="button"
                  onClick={() => goToCard(currentIndex - 1)}
                  disabled={filteredCards.length <= 1}
                  className="dashboard-card dashboard-heading inline-flex min-h-10 items-center gap-2 rounded-xl border border-[var(--dashboard-border)] px-4 py-2.5 text-xs font-bold transition hover:border-[#5B3DF5] hover:text-[#5B3DF5] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft size={15} />
                  Previous
                </button>

                <span className="dashboard-muted text-xs font-semibold">
                  {currentIndex + 1} / {filteredCards.length}
                </span>

                <button
                  type="button"
                  onClick={() => goToCard(currentIndex + 1)}
                  disabled={filteredCards.length <= 1}
                  className="dashboard-primary-button inline-flex min-h-10 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ArrowRight size={15} />
                </button>

              </div>

            </div>
          ) : (

            /* EMPTY STATE */

            <div className="dashboard-card flex flex-col items-center justify-center rounded-xl border border-[var(--dashboard-border)] px-5 py-12 text-center">

              <div className="dashboard-accent-icon mb-3">
                <Sparkles size={22} />
              </div>

              <h3 className="dashboard-heading text-base font-extrabold">
                No cards found
              </h3>

              <p className="dashboard-muted mt-2 max-w-sm text-sm leading-6">
                There are no cards in this collection yet. Try another
                subject or learning filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  changeSubject("All subjects");
                  changeFilter("all");
                }}
                className="dashboard-primary-button mt-4 rounded-xl px-5 py-2.5 text-sm font-semibold"
              >
                View all cards
              </button>

            </div>

          )}

        </section>

        {/* =====================================================
            INFORMATION PANEL
        ===================================================== */}

        <section className="dashboard-inner-card flex items-center gap-3 rounded-xl p-4">

          <div className="dashboard-accent-icon shrink-0">
            <Sparkles size={18} />
          </div>

          <div>
            <h3 className="dashboard-heading text-sm font-bold">
              Your Study Cards workspace
            </h3>

            <p className="dashboard-muted mt-1 text-xs leading-5 sm:text-sm">
              This version uses demonstration study cards. Your learning
              progress and saved cards are stored in this browser.
              Backend synchronization will be added during API integration.
            </p>
          </div>

        </section>

      </div>
    </main>
  );
}

/* =========================================================
   STATISTICS CARD
========================================================= */

function StatCard({
  label,
  value,
  icon,
  accent = "default",
}: {
  label: string;
  value: number;
  icon: ReactNode;
  accent?: "default" | "green" | "orange" | "purple";
}) {
  const accentStyles = {
    default: "bg-[#E8DEFF] text-[#5B3DF5]",
    green: "bg-emerald-100 text-emerald-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-violet-100 text-violet-600",
  };

  return (
    <div className="dashboard-card flex min-h-[105px] items-center gap-3 rounded-xl border border-[var(--dashboard-border)] p-3.5 sm:p-4">

      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accentStyles[accent]}`}>
        {icon}
      </div>

      <div className="min-w-0">
        <p className="dashboard-muted text-[11px] font-medium sm:text-xs">
          {label}
        </p>

        <h3 className="dashboard-heading mt-1 text-xl font-extrabold">
          {value.toLocaleString()}
        </h3>
      </div>

    </div>
  );
}

/* =========================================================
   FILTER BUTTON
========================================================= */

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-9 items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
        active
          ? "border-[#5B3DF5] bg-[#5B3DF5] text-white shadow-[0_4px_12px_rgba(91,61,245,0.18)]"
          : "dashboard-card dashboard-heading border-[var(--dashboard-border)] hover:border-[#5B3DF5] hover:text-[#5B3DF5]"
      }`}
    >
      {children}
    </button>
  );
}