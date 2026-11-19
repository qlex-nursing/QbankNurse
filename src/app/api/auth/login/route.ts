
import { NextRequest, NextResponse } from "next/server";
import { getActiveBackendUrl } from "@/lib/config/backend";
import { getSiteHeaders } from "@/lib/config/siteHeaders";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendUrl =
      `${getActiveBackendUrl()}/api/castoline/auth/login`;

    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        ...(await getSiteHeaders()),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const responseText = await backendResponse.text();

    let responseData: Record<string, unknown>;

    try {
      responseData = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        { error: "The login backend returned an invalid response." },
        { status: backendResponse.status || 502 },
      );
    }

    const user = responseData.user as
      | { castoBadge?: string; castoLine?: string }
      | undefined;

    const { user: _user, ...rest } = responseData;

    return NextResponse.json(
      {
        ...rest,
        casto_badge: user?.castoBadge,
        casto_line: user?.castoLine,
      },
      { status: backendResponse.status },
    );
  } catch (error) {
    console.error("Login proxy error:", error);

    return NextResponse.json(
      { error: "Unable to communicate with the login backend." },
      { status: 500 },
    );
  }
}
