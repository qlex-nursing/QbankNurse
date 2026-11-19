import "server-only";

import { headers } from "next/headers";
import { backendConfig } from "./backend";

export async function getSiteHeaders(): Promise<Record<string, string>> {
  const requestHeaders = await headers();

  return {
    "x-site-key": backendConfig.appKey,
    "x-site-domain": backendConfig.appDomain,
    "x-site-name": backendConfig.appName,

    "x-site-path": requestHeaders.get("x-current-path") ?? "",
    "x-site-ip-address": requestHeaders.get("x-current-ip") ?? "",
    "x-site-location": requestHeaders.get("x-current-location") ?? "",
    "x-site-country": requestHeaders.get("x-current-country") ?? "",
    "x-site-brouser": requestHeaders.get("x-current-ua") ?? "",
    "x-site-time": new Date().toISOString(),
    "x-site-referrer": requestHeaders.get("x-current-referrer") ?? "",
    "x-site-mobile": requestHeaders.get("x-current-mobile") ?? "",
    "x-site-request-id":
      requestHeaders.get("x-current-request-id") ?? crypto.randomUUID(),
    "x-site-session-id":
      requestHeaders.get("x-current-session-id") ?? "",
  };
}
