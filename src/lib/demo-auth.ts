const DEMO_SESSION_KEY = "qbanknurse-demo-session";

export interface DemoUser {
  name: string;
  email: string;
}

interface DemoSession {
  user: DemoUser;
  authenticated: boolean;
  createdAt: string;
}

export function createDemoSession(user: DemoUser) {
  if (typeof window === "undefined") return;

  const session: DemoSession = {
    user,
    authenticated: true,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
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

export function updateDemoSession(user: DemoUser) {
  if (typeof window === "undefined") return false;

  try {
    const stored = localStorage.getItem(DEMO_SESSION_KEY);

    if (!stored) return false;

    const session = JSON.parse(stored);

    if (!session.authenticated) return false;

    session.user = user;

    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));

    return true;
  } catch {
    return false;
  }
}

export function clearDemoSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(DEMO_SESSION_KEY);
  }
}