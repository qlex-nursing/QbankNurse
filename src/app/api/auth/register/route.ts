
import { NextRequest, NextResponse } from "next/server";
import { getActiveBackendUrl } from "@/lib/config/backend";
import { getSiteHeaders } from "@/lib/config/siteHeaders";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendUrl =
      `${getActiveBackendUrl()}/api/castoline/auth/register`;

    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        ...(await getSiteHeaders()),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: body.username,
        email: body.email,
        phone: body.phone,
        password: body.password,
        passwordConfirmation: body.passwordConfirmation,
        pin: body.pin,
        pinConfirmation: body.pinConfirmation,
        loginMethod: body.loginMethod,
        agree: body.agree,
        role: body.role || "Learner",
        dashboardName: body.dashboardName || "web",
        provider: body.provider || "email",
        challenge: body.challenge,
      }),
      cache: "no-store",
    });

    const responseText = await backendResponse.text();

    let responseData: Record<string, unknown>;

    try {
      responseData = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        { error: "The registration backend returned an invalid response." },
        { status: backendResponse.status || 502 },
      );
    }

    return NextResponse.json(responseData, {
      status: backendResponse.status,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to communicate with the registration backend." },
      { status: 500 },
    );
  }
}
