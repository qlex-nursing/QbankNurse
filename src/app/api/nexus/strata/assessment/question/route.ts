import { NextRequest, NextResponse } from "next/server";
import { getActiveBackendUrl } from "@/lib/config/backend";
import { getSiteHeaders } from "@/lib/config/siteHeaders";

const BACKEND_ENDPOINT =
  "/api/castoline/strata/assessment/questions";

const FETCH_TYPES = ["absolute", "distinct", "relative"] as const;

async function proxyRequest(
  request: NextRequest,
  method: "GET" | "POST" | "PUT" | "DELETE",
) {
  try {
    const backendBaseUrl = getActiveBackendUrl();
    const siteHeaders = await getSiteHeaders();

    let backendPath = BACKEND_ENDPOINT;

    if (method === "GET") {
      const fetchType = request.nextUrl.searchParams.get("fetchtype");

      if (
        !fetchType ||
        !FETCH_TYPES.includes(fetchType as (typeof FETCH_TYPES)[number])
      ) {
        return NextResponse.json(
          {
            message: "A valid fetchtype is required.",
            supportedFetchTypes: FETCH_TYPES,
          },
          { status: 400 },
        );
      }

      backendPath = `${BACKEND_ENDPOINT}/list/${fetchType}`;
    } else if (method === "POST") {
      backendPath = `${BACKEND_ENDPOINT}/store`;
    } else if (method === "PUT") {
      backendPath = `${BACKEND_ENDPOINT}/update`;
    } else if (method === "DELETE") {
      backendPath = `${BACKEND_ENDPOINT}/delete`;
    }

    const backendUrl = new URL(backendPath, backendBaseUrl);

    if (method === "GET") {
  const fetchType = request.nextUrl.searchParams.get("fetchtype");

  if (fetchType) {
    backendUrl.searchParams.set("fetchtype", fetchType);
  }
}

    request.nextUrl.searchParams.forEach((value, key) => {
      if (key !== "fetchtype") {
        backendUrl.searchParams.append(key, value);
      }
    });

    const headers = new Headers(siteHeaders);

    headers.set("Content-Type", "application/json");

    const castoLine = request.headers.get("x-casto-line");
    const castoBadge = request.headers.get("x-casto-badge");

    if (castoLine) {
      headers.set("x-casto-line", castoLine);
    }

    if (castoBadge) {
      headers.set("x-casto-badge", castoBadge);
    }

    const body =
      method === "GET" ? undefined : await request.text();

    const backendResponse = await fetch(backendUrl, {
      method,
      headers,
      body: body || undefined,
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
    console.error("Question proxy error:", error);

    return NextResponse.json(
      {
        message: "Unable to communicate with the question backend.",
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
