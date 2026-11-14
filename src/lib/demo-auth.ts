const DEMO_SESSION_KEY = "qnurse-demo-session";

export interface DemoUser {
  name: string;
  email: string;
}

export function createDemoSession(user: DemoUser) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    DEMO_SESSION_KEY,
    JSON.stringify({
      user,
      authenticated: true,
      createdAt: new Date().toISOString(),
    }),
  );
}

export function getDemoSession(): DemoUser | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(DEMO_SESSION_KEY);

    if (!stored) return null;

    const session = JSON.parse(stored);

    if (!session.authenticated || !session.user?.email) {
      return null;
    }

    return session.user as DemoUser;
  } catch {
    return null;
  }
}

export function clearDemoSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(DEMO_SESSION_KEY);
  }
}