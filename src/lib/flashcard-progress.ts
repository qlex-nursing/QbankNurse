import {
  getSavedItems,
  toggleSavedItem,
  type SavedItem,
} from "@/lib/saved-items";

const STORAGE_KEY = "qbanknurse-flashcard-progress";

export interface FlashcardProgress {
  known: string[];
  review: string[];
}

const emptyProgress: FlashcardProgress = {
  known: [],
  review: [],
};

export function getFlashcardProgress(): FlashcardProgress {
  if (typeof window === "undefined") return emptyProgress;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return emptyProgress;

    const parsed = JSON.parse(stored) as Partial<FlashcardProgress>;

    return {
      known: Array.isArray(parsed.known) ? parsed.known : [],
      review: Array.isArray(parsed.review) ? parsed.review : [],
    };
  } catch {
    return emptyProgress;
  }
}

export function saveFlashcardProgress(
  progress: FlashcardProgress,
): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function markFlashcardKnown(id: string): FlashcardProgress {
  const progress = getFlashcardProgress();

  const updated: FlashcardProgress = {
    known: [...new Set([...progress.known, id])],
    review: progress.review.filter((item) => item !== id),
  };

  saveFlashcardProgress(updated);

  return updated;
}

export function markFlashcardForReview(id: string): FlashcardProgress {
  const progress = getFlashcardProgress();

  const updated: FlashcardProgress = {
    known: progress.known.filter((item) => item !== id),
    review: [...new Set([...progress.review, id])],
  };

  saveFlashcardProgress(updated);

  return updated;
}

export function resetFlashcardProgress(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY);
}

export function getSavedExamFlashcards(): SavedItem[] {
  return getSavedItems().filter(
    (item) => item.type === "exam-flashcard",
  );
}

export function toggleExamFlashcardSaved(card: {
  id: string;
  question: string;
  answer: string;
  rationale: string;
  subject: string;
  category: string;
}): boolean {
  return toggleSavedItem({
    id: card.id,
    type: "exam-flashcard",
    title: card.question,
    description: card.answer,
    href: "/dashboard/flashcards",
    metadata: {
      subject: card.subject,
      category: card.category,
      rationale: card.rationale,
    },
  });
}