import { renderSystemSessionHeaders } from "@/lib/auth/session";
export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  // Requests must go through our own Next.js API routes.
  if (!path.startsWith("/api/")) {
    throw new Error(
      "API requests must use an internal /api/ route.",
    );
  }

  const { body, headers: customHeaders, ...requestOptions } = options;

 const headers = new Headers({
  ...renderSystemSessionHeaders(),
  ...(customHeaders instanceof Headers
    ? Object.fromEntries(customHeaders.entries())
    : customHeaders),
});

  let requestBody: BodyInit | undefined;

  if (body instanceof FormData) {
    requestBody = body;
  } else if (body !== undefined) {
    headers.set("Content-Type", "application/json");
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(path, {
    ...requestOptions,
    headers,
    body: requestBody,
    credentials: "include",
  });

  const contentType = response.headers.get("content-type");

  let data: unknown;

  if (contentType?.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }
if (!response.ok) {
  let message = `Request failed with status ${response.status}`;

  if (typeof data === "string" && data.trim()) {
    message = data;
  } else if (typeof data === "object" && data !== null) {
    const responseData = data as Record<string, unknown>;

    if (typeof responseData.message === "string") {
      message = responseData.message;
    } else if (typeof responseData.error === "string") {
      message = responseData.error;
    }
  }

  throw new ApiError(message, response.status, data);
}

  return data as T;
}
