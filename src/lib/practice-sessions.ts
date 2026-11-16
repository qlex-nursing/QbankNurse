export const PRACTICE_SESSIONS_STORAGE_KEY =
  "qbanknurse-practice-sessions";


  export interface PracticeSession {
  subjectSlug: string;
  currentIndex: number;
  answers: Record<string, unknown>;
  flaggedQuestions: number[];
  timeRemaining: number;
  totalQuestions: number;
  updatedAt: string;
}
export function getPracticeSessions(): PracticeSession[] {
  return getAllSessions();
}

function getAllSessions(): PracticeSession[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(
      PRACTICE_SESSIONS_STORAGE_KEY,
    );

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getPracticeSession(
  subjectSlug: string,
): PracticeSession | null {
  const sessions = getAllSessions();

  return (
    sessions.find(
      (session) => session.subjectSlug === subjectSlug,
    ) ?? null
  );
}

export function savePracticeSession(
  session: PracticeSession,
): void {
  if (typeof window === "undefined") return;

  try {
    const sessions = getAllSessions();

    const updatedSessions = sessions.filter(
      (item) => item.subjectSlug !== session.subjectSlug,
    );

    localStorage.setItem(
      PRACTICE_SESSIONS_STORAGE_KEY,
      JSON.stringify([session, ...updatedSessions]),
    );
  } catch (error) {
    console.error("Could not save practice session:", error);
  }
}

export function removePracticeSession(
  subjectSlug: string,
): void {
  if (typeof window === "undefined") return;

  try {
    const sessions = getAllSessions();

    const updatedSessions = sessions.filter(
      (session) => session.subjectSlug !== subjectSlug,
    );

    localStorage.setItem(
      PRACTICE_SESSIONS_STORAGE_KEY,
      JSON.stringify(updatedSessions),
    );
  } catch (error) {
    console.error("Could not remove practice session:", error);
  }
}