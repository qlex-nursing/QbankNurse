import { NextRequest, NextResponse } from "next/server";
import { getActiveBackendUrl } from "@/lib/config/backend";
import { getSiteHeaders } from "@/lib/config/siteHeaders";

const ACTION_GROUPS = {
  ExamAnswers: "user/answers",
  ExamActions: "actions",
  QuestionActions: "question/actions",
  ExamLifecycle: "lifecycle",
  ExamPreferences: "preferences",
} as const;

type ActionGroup = keyof typeof ACTION_GROUPS;

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("actionGroup" in body) ||
      !("submissionType" in body)
    ) {
      return NextResponse.json(
        { message: "actionGroup and submissionType are required." },
        { status: 400 },
      );
    }

    const payload = body as Record<string, unknown>;

    const actionGroup = payload.actionGroup;

    if (
      typeof actionGroup !== "string" ||
      !(actionGroup in ACTION_GROUPS)
    ) {
      return NextResponse.json(
        {
          message: "Invalid actionGroup.",
          supportedActionGroups: Object.keys(ACTION_GROUPS),
        },
        { status: 400 },
      );
    }

    const backendBaseUrl = getActiveBackendUrl();

    const backendPath = `/api/castoline/strata/assessment/exams/upsert/${
      ACTION_GROUPS[actionGroup as ActionGroup]
    }`;

    const backendUrl = new URL(backendPath, backendBaseUrl);

    const siteHeaders = await getSiteHeaders();
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

    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
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
    console.error("Exam upserts proxy error:", error);

    return NextResponse.json(
      {
        message: "Unable to communicate with the exam backend.",
      },
      { status: 500 },
    );
  }
}
