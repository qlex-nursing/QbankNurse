
import { apiFetch } from "@/lib/api/api";

import {
  getOrCreateFingerprint,
  getStoredIPAddress,
  resolveAndStoreIPAddress,
  writeAuthSessionCookies,
} from "@/lib/auth/session";

interface LoginResponse {
  error?: string;
  redirect_url?: string;
  casto_badge?: string;
  casto_line?: string;
}

export async function login(email: string, password: string) {
  const fingerprint = getOrCreateFingerprint();

  const ipAddress =
    getStoredIPAddress() ?? (await resolveAndStoreIPAddress());

  const result = await apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: {
      email,
      password,
      pin: "",
      loginMethod: "password",
      LoginProvider: "email",
      loginProviderPayload: "Void",
      dashboardName: "web",
      role: "Learner",
      challenge: "learner.login.skew8lancasto",
      remember: true,
      fingerprint,
      ipAddress: ipAddress ?? undefined,
    },
  });

  if (result.error) {
    throw new Error(result.error);
  }

  if (!result.casto_badge || !result.casto_line) {
    throw new Error(
      "Login succeeded but the backend did not return a valid session.",
    );
  }

  writeAuthSessionCookies(result.casto_badge, result.casto_line);

  return result;
}
