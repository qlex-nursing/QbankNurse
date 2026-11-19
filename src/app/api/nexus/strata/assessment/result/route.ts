import { NextRequest, NextResponse } from "next/server";
import { getActiveBackendUrl } from "@/lib/config/backend";
import { getSiteHeaders } from "@/lib/config/siteHeaders";

const BACKEND_ENDPOINT =
  "/api/castoline/strata/assessment/result";

async function proxyRequest(
  request: NextRequest,
  method: "GET" | "POST" | "PUT" | "DELETE",
) {
  try {
    const backendBaseUrl = getActiveBackendUrl();
    const backendUrl = new URL(BACKEND_ENDPOINT, backendBaseUrl);

    // Preserve all query parameters.
    request.nextUrl.searchParams.forEach((value, key) => {
      backendUrl.searchParams.append(key, value);
    });

    const siteHeaders = await getSiteHeaders();
    const headers = new Headers(siteHeaders);

    const originalContentType =
      request.headers.get("content-type");

    if (originalContentType) {
      headers.set("Content-Type", originalContentType);
    }

    // Forward session headers when present.
    const castoLine = request.headers.get("x-casto-line");
    const castoBadge = request.headers.get("x-casto-badge");

    if (castoLine) {
      headers.set("x-casto-line", castoLine);
    }

    if (castoBadge) {
      headers.set("x-casto-badge", castoBadge);
    }

    let body: ArrayBuffer | undefined;

    if (method !== "GET" && method !== "DELETE") {
      body = await request.arrayBuffer();
    }

    const backendResponse = await fetch(backendUrl, {
      method,
      headers,
      body,
      cache: "no-store",
    });

    const responseText = await backendResponse.text();

    return new NextResponse(responseText, {
      status: backendResponse.status,
      headers: {
        "Content-Type":
          backendResponse.headers.get("content-type") ??
          "application/json",
      },
    });
  } catch (error) {
    console.error("Assessment proxy error:", error);

    return NextResponse.json(
      {
        message: "Unable to communicate with the assessment backend.",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  return proxyRequest(request, "GET");
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, "POST");
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request, "PUT");
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request, "DELETE");
}
