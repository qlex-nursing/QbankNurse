"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  RotateCcw,
  Sparkles,
  RotateCw,
} from "lucide-react";

import {
  studyCards,
  studyCardSubjects,
} from "@/data/mock/dashboard/study-cards";

type LearningStatus = "known" | "review";

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

  const [activeFilter, setActiveFilter] = useState<
    "all" | "review" | "saved"
  >("all");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] =
    useState<CardProgress>(emptyProgress);

  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored) as CardProgress;

        setProgress({
          known: Array.isArray(parsed.known) ? parsed.known : [],
          review: Array.isArray(parsed.review) ? parsed.review : [],
          saved: Array.isArray(parsed.saved) ? parsed.saved : [],
        });
      }
    } catch {
      setProgress(emptyProgress);
    }

    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress, storageReady]);

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

  const knownCount = studyCards.filter((card) =>
    progress.known.includes(card.id),
  ).length;

  const reviewCount = studyCards.filter((card) =>
    progress.review.includes(card.id),
  ).length;

  const savedCount = studyCards.filter((card) =>
    progress.saved.includes(card.id),
  ).length;

  const progressPercentage = Math.round(
    (knownCount / studyCards.length) * 100,
  );

  const goToCard = (index: number) => {
    if (filteredCards.length === 0) return;

    setCurrentIndex(
      (index + filteredCards.length) % filteredCards.length,
    );

    setIsFlipped(false);
  };

  const changeFilter = (
    filter: "all" | "review" | "saved",
  ) => {
    setActiveFilter(filter);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const changeSubject = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

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

  const toggleSaved = () => {
    if (!currentCard) return;

    setProgress((previous) => ({
      ...previous,
      saved: previous.saved.includes(currentCard.id)
        ? previous.saved.filter((id) => id !== currentCard.id)
        : [...previous.saved, currentCard.id],
    }));
  };

  const resetProgress = () => {
    if (
      !window.confirm(
        "Reset all your Study Cards progress? This will clear mastered, review and saved cards.",
      )
    ) {
      return;
    }

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
    <div className="dashboard-content space-y-8">
      {/* Heading */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="dashboard-accent-icon">
            <BookOpen size={18} />
          </div>

          <span className="dashboard-section-label">
            ACTIVE LEARNING
          </span>
        </div>

        <div>
          <h1 className="dashboard-heading text-2xl font-bold md:text-3xl">
            Study Cards
          </h1>

          <p className="dashboard-muted mt-2 max-w-2xl text-sm leading-6">
            Strengthen your nursing knowledge with interactive
            flashcards. Review important concepts, test your memory
            and track what you have mastered.
          </p>
        </div>
      </section>

      {/* Progress overview */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total cards"
          value={studyCards.length}
          icon={<BookOpen size={20} />}
        />

        <StatCard
          label="Mastered"
          value={knownCount}
          icon={<CheckCircle2 size={20} />}
        />

        <StatCard
          label="Review again"
          value={reviewCount}
          icon={<RotateCcw size={20} />}
        />

        <StatCard
          label="Saved cards"
          value={savedCount}
          icon={<Bookmark size={20} />}
        />
      </section>

      {/* Learning progress */}
      <section className="dashboard-card rounded-2xl p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="dashboard-heading font-bold">
              Your learning progress
            </h2>

            <p className="dashboard-muted mt-1 text-sm">
              Cards you have marked as mastered.
            </p>
          </div>

          <span className="dashboard-heading text-2xl font-bold">
            {progressPercentage}%
          </span>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-violet-100">
          <div
            className="h-full rounded-full bg-[#5B3DF5] transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="dashboard-muted mt-2 flex justify-between text-xs">
          <span>{knownCount} mastered</span>
          <span>{studyCards.length - knownCount} remaining</span>
        </div>
      </section>

      {/* Filters */}
      <section className="dashboard-card space-y-5 rounded-2xl p-5">
        <div>
          <h2 className="dashboard-heading font-bold">
            Your flashcard collection
          </h2>

          <p className="dashboard-muted mt-1 text-sm">
            Choose a subject and learning mode.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <select
              value={selectedSubject}
              onChange={(event) =>
                changeSubject(event.target.value)
              }
              className="dashboard-search h-12 w-full appearance-none rounded-xl px-4 pr-10 text-sm outline-none"
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

          <button
            type="button"
            onClick={resetProgress}
            className="dashboard-search flex h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition hover:opacity-80"
          >
            <RotateCcw size={16} />
            Reset progress
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
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
            Review again ({reviewCount})
          </FilterButton>

          <FilterButton
            active={activeFilter === "saved"}
            onClick={() => changeFilter("saved")}
          >
            Saved ({savedCount})
          </FilterButton>
        </div>
      </section>

      {/* Flashcard workspace */}
      <section className="mx-auto w-full max-w-3xl space-y-5">
        {currentCard ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="dashboard-muted text-sm">
                  Card {currentIndex + 1} of {filteredCards.length}
                </p>

                <h3 className="dashboard-heading mt-1 font-semibold">
                  {currentCard.topic}
                </h3>
              </div>

              <span className="rounded-full bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-700">
                {currentCard.subject}
              </span>
            </div>

            {/* Flip card */}
            <button
              type="button"
              onClick={() => setIsFlipped((value) => !value)}
              className="group w-full text-left"
              aria-label={
                isFlipped
                  ? "Show flashcard question"
                  : "Reveal flashcard answer"
              }
            >
              <div
                className="relative min-h-[340px] w-full rounded-3xl transition-transform duration-500 [transform-style:preserve-3d]"
                style={{
                  transform: isFlipped
                    ? "rotateY(180deg)"
                    : "rotateY(0deg)",
                }}
              >
                {/* Front */}
                <div className="dashboard-card absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-violet-200 bg-white p-7 text-center shadow-sm [backface-visibility:hidden] sm:p-12">
                  <span className="mb-6 rounded-full bg-violet-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-violet-700">
                    Question
                  </span>

                  <h2 className="dashboard-heading max-w-xl text-xl font-bold leading-relaxed sm:text-2xl">
                    {currentCard.question}
                  </h2>

                  <div className="dashboard-muted mt-9 flex items-center gap-2 text-sm">
                    <RotateCw size={16} />
                    Click to reveal answer
                  </div>
                </div>

                {/* Back */}
                <div className="dashboard-card absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-violet-200 bg-violet-50 p-7 text-center shadow-sm [backface-visibility:hidden] sm:p-12 [transform:rotateY(180deg)]">
                  <span className="mb-6 rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Answer
                  </span>

                  <h2 className="dashboard-heading max-w-xl text-xl font-bold leading-relaxed sm:text-2xl">
                    {currentCard.answer}
                  </h2>

                  <div className="mt-7 max-w-xl rounded-xl border border-violet-200 bg-white p-4 text-left">
                    <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
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

            {/* Flip and save */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsFlipped((value) => !value)}
                className="dashboard-search flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition hover:opacity-80"
              >
                <RotateCw size={16} />
                {isFlipped ? "Show question" : "Reveal answer"}
              </button>

              <button
                type="button"
                onClick={toggleSaved}
                className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition ${
                  isSaved
                    ? "border-violet-300 bg-violet-100 text-violet-700"
                    : "dashboard-search"
                }`}
              >
                <Bookmark
                  size={16}
                  fill={isSaved ? "currentColor" : "none"}
                />
                {isSaved ? "Saved" : "Save card"}
              </button>
            </div>

            {/* Learning actions */}
            {isFlipped && (
              <div className="dashboard-card rounded-2xl p-5">
                <p className="dashboard-heading text-center text-sm font-bold">
                  How well did you know this?
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => updateStatus("review")}
                    className="flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
                  >
                    <RotateCcw size={17} />
                    Review Again
                  </button>

                  <button
                    type="button"
                    onClick={() => updateStatus("known")}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#5B3DF5] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4930D1]"
                  >
                    <Check size={17} />
                    Know It
                  </button>
                </div>

                {isKnown && (
                  <p className="mt-3 text-center text-xs font-medium text-emerald-600">
                    You've already mastered this card.
                  </p>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => goToCard(currentIndex - 1)}
                disabled={filteredCards.length <= 1}
                className="dashboard-search flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft size={16} />
                Previous
              </button>

              <span className="dashboard-muted text-xs">
                {currentIndex + 1} / {filteredCards.length}
              </span>

              <button
                type="button"
                onClick={() => goToCard(currentIndex + 1)}
                disabled={filteredCards.length <= 1}
                className="dashboard-primary-button flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
              >
                Next
                <ArrowRight size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="dashboard-card rounded-2xl p-10 text-center">
            <div className="dashboard-accent-icon mx-auto">
              <Sparkles size={23} />
            </div>

            <h2 className="dashboard-heading mt-5 text-xl font-bold">
              No cards found
            </h2>

            <p className="dashboard-muted mt-2 text-sm">
              There are no cards in this collection yet. Try another
              subject or learning filter.
            </p>

            <button
              type="button"
              onClick={() => {
                changeSubject("All subjects");
                changeFilter("all");
              }}
              className="dashboard-primary-button mt-5 rounded-xl px-5 py-3 text-sm font-semibold"
            >
              View all cards
            </button>
          </div>
        )}
      </section>

      {/* Demo notice */}
      <section className="dashboard-card flex items-start gap-3 rounded-2xl border border-violet-200 bg-violet-50/70 p-5">
        <Sparkles size={20} className="mt-0.5 shrink-0 text-violet-600" />

        <div>
          <h3 className="dashboard-heading text-sm font-bold">
            Your Study Cards workspace
          </h3>

          <p className="dashboard-muted mt-1 text-sm leading-6">
            This version uses demonstration flashcards. Your learning
            progress and saved cards are stored in this browser.
            Backend synchronization will be added during API integration.
          </p>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="dashboard-card flex items-center gap-4 rounded-2xl p-5">
      <div className="dashboard-accent-icon">{icon}</div>

      <div>
        <p className="dashboard-muted text-sm">{label}</p>
        <h3 className="dashboard-heading mt-1 text-2xl font-bold">
          {value}
        </h3>
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-[#5B3DF5] text-white"
          : "dashboard-search dashboard-heading hover:opacity-80"
      }`}
    >
      {children}
    </button>
  );
}