import { NextRequest, NextResponse } from "next/server";
import { getActiveBackendUrl } from "@/lib/config/backend";
import { getSiteHeaders } from "@/lib/config/siteHeaders";

const BACKEND_ENDPOINT =
  "/api/castoline/strata/learning/subjects";

const FETCH_TYPES = ["absolute", "distinct", "relative"] as const;

export async function GET(request: NextRequest) {
  try {
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

    const backendUrl = new URL(
      `${BACKEND_ENDPOINT}/list/${fetchType}`,
      getActiveBackendUrl(),
    );

    // Morris's backend requires fetchtype in both the path and query.
    backendUrl.searchParams.set("fetchtype", fetchType);

    request.nextUrl.searchParams.forEach((value, key) => {
      if (key !== "fetchtype") {
        backendUrl.searchParams.append(key, value);
      }
    });

    const headers = new Headers(await getSiteHeaders());
    headers.set("Content-Type", "application/json");

    const castoLine = request.headers.get("x-casto-line");
    const castoBadge = request.headers.get("x-casto-badge");

    if (castoLine) headers.set("x-casto-line", castoLine);
    if (castoBadge) headers.set("x-casto-badge", castoBadge);

    const backendResponse = await fetch(backendUrl, {
      method: "GET",
      headers,
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
    console.error("Subject proxy error:", error);

    return NextResponse.json(
      { message: "Unable to communicate with the subject backend." },
      { status: 500 },
    );
  }
}
