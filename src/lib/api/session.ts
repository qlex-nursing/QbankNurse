
"use client";

const BADGE_COOKIE = "skew_blanc_session_badge";
const LINE_COOKIE = "skew_blanc_session_line";
const FINGERPRINT_COOKIE = "skew_blanc_session_fingerprint";

const COOKIE_DAYS = 1;

function setCookie(name: string, value: string) {
  const expires = new Date(
    Date.now() + COOKIE_DAYS * 86400000,
  ).toUTCString();

  document.cookie =
    `${name}=${encodeURIComponent(value)}; ` +
    `expires=${expires}; path=/; ` +
    `${process.env.NODE_ENV === "production" ? "Secure; " : ""}` +
    "SameSite=Strict";
}

function getCookie(name: string): string | null {
  const entry = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`));

  return entry
    ? decodeURIComponent(entry.slice(name.length + 1))
    : null;
}

export function writeAuthSessionCookies(
  badge: string,
  line: string,
) {
  clearAuthSessionCookies();

  setCookie(BADGE_COOKIE, badge);
  setCookie(LINE_COOKIE, JSON.stringify({ [badge]: line }));
}

export function clearAuthSessionCookies() {
  for (const name of [BADGE_COOKIE, LINE_COOKIE]) {
    document.cookie =
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
  }
}

export function getAuthSession() {
  const badge = getCookie(BADGE_COOKIE);
  const rawSessions = getCookie(LINE_COOKIE);

  if (!badge || !rawSessions) return null;

  try {
    const sessions = JSON.parse(rawSessions) as Record<string, string>;
    const line = sessions[badge];

    return line ? { badge, line } : null;
  } catch {
    return null;
  }
}

export function renderSystemSessionHeaders(): Record<string, string> {
  const session = getAuthSession();

  if (!session) return {};

  return {
    "x-casto-badge": session.badge,
    "x-casto-line": session.line,
  };
}

export function getOrCreateFingerprint(): string {
  const existing = getCookie(FINGERPRINT_COOKIE);

  if (existing) return existing;

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const values = crypto.getRandomValues(new Uint8Array(64));

  const fingerprint = Array.from(values)
    .map((value) => chars[value % chars.length])
    .join("");

  setCookie(FINGERPRINT_COOKIE, fingerprint);

  return fingerprint;
}
