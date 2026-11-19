
import { apiFetch } from "@/lib/api/api";

export interface RegisterCredentials {
  username: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
  loginMethod: "password";
  agree: boolean;
  role?: string;
  dashboardName?: string;
  provider?: string;
  challenge: string;
}

export interface RegisterResponse {
  redirect_url?: string;
  error?: string;
}

export async function registerUser(
  data: RegisterCredentials,
): Promise<RegisterResponse> {
  try {
    return await apiFetch<RegisterResponse>("/api/auth/register", {
      method: "POST",
      body: {
        username: data.username,
        email: data.email,
        phone: data.phone,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
        loginMethod: data.loginMethod,
        agree: data.agree,
        role: data.role ?? "Learner",
        dashboardName: data.dashboardName ?? "web",
        provider: data.provider ?? "email",
        challenge: data.challenge,
      },
    });
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to register. Please try again.",
    };
  }
}
