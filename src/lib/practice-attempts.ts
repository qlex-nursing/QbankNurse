export const PRACTICE_ATTEMPTS_STORAGE_KEY =
  "qbanknurse-practice-attempts";

export interface PracticeAttempt {
  id: string;
  examType: string;
  subject: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  correctAnswers: number;
  incorrectAnswers: number;
  durationSeconds: number;
  completedAt: string;
}

export function getPracticeAttempts(): PracticeAttempt[] {
  if (typeof window === "undefined") return [];  

  try {
    const stored = localStorage.getItem(
      PRACTICE_ATTEMPTS_STORAGE_KEY,
    );

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePracticeAttempt(
  attempt: PracticeAttempt,
): void {
  if (typeof window === "undefined") return;

  try {
    const attempts = getPracticeAttempts();

    // Prevent duplicate submissions.
    if (attempts.some((item) => item.id === attempt.id)) {
      return;
    }

    const updatedAttempts = [attempt, ...attempts];

    localStorage.setItem(
      PRACTICE_ATTEMPTS_STORAGE_KEY,
      JSON.stringify(updatedAttempts),
    );
  } catch (error) {
    console.error("Could not save practice attempt:", error);
  }
}