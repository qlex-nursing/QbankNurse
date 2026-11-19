import "server-only";

export type BackendType = "dotnet" | "laravel" | "fastapi";

const DEFAULT_BACKEND_URL = "http://207.148.28.52:8008";

export const backendConfig = {
  appName: process.env.SKEW_LINE_APP_NAME || "Qlex Nursing",
  appTitle: process.env.SKEW_LINE_APP_TITLE || "Qlex Nursing",
  appDomain:
    process.env.SKEW_LINE_APP_DOMAIN || "https://qlexnursing.com",
  appKey: process.env.SKEW_LINE_APP_KEY || "WEBSITE_2",

  activeBackend: (process.env.SKEW_LINE_ACTIVE_BACKEND ||
    "dotnet") as BackendType,

  backends: {
    dotnet:
      process.env.SKEW_LINE_DOTNET_BASE_URL || DEFAULT_BACKEND_URL,
    laravel: process.env.SKEW_LINE_LARAVEL_BASE_URL || "",
    fastapi: process.env.SKEW_LINE_FASTAPI_BASE_URL || "",
  },
};

export function getActiveBackendUrl(): string {
  const backend = backendConfig.activeBackend;
  const baseUrl = backendConfig.backends[backend];

  if (!baseUrl) {
    throw new Error(`Backend URL is not configured for: ${backend}`);
  }

  return baseUrl.replace(/\/+$/, "");
}

export function getBackendConfig() {
  return {
    appName: backendConfig.appName,
    appTitle: backendConfig.appTitle,
    appDomain: backendConfig.appDomain,
    appKey: backendConfig.appKey,
    activeBackend: backendConfig.activeBackend,
    baseUrl: getActiveBackendUrl(),
  };
}
