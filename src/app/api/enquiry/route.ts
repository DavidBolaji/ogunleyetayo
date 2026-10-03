import { NextResponse } from "next/server";

interface EnquiryPayload {
  intent?: string;
  data?: Record<string, unknown>;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REQUIRED_BY_INTENT: Record<string, readonly string[]> = {
  newsletter: ["email"],
  speaking: ["name", "email", "message"],
  general: ["name", "email", "message"],
};

const asTrimmedString = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

/**
 * Single submission endpoint for every form on the site.
 *
 * It validates here and then hands off to a delivery provider. Wire a
 * provider by setting the env vars below; until then submissions are
 * logged so nothing is silently lost in development.
 */
export async function POST(request: Request) {
  let payload: EnquiryPayload;

  try {
    payload = (await request.json()) as EnquiryPayload;
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const intent = asTrimmedString(payload.intent) || "general";
  const data = payload.data ?? {};

  // Honeypot: real people leave this empty.
  if (asTrimmedString(data.company)) {
    return NextResponse.json({ message: "Thank you — your message is in." });
  }

  const required = REQUIRED_BY_INTENT[intent] ?? REQUIRED_BY_INTENT.general;
  const missing = required.filter((field) => !asTrimmedString(data[field]));

  if (missing.length > 0) {
    return NextResponse.json(
      { message: `Please complete: ${missing.join(", ")}.` },
      { status: 422 },
    );
  }

  const email = asTrimmedString(data.email);
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 422 });
  }

  const endpoint = process.env.ENQUIRY_WEBHOOK_URL;

  if (endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.ENQUIRY_WEBHOOK_TOKEN
            ? { Authorization: `Bearer ${process.env.ENQUIRY_WEBHOOK_TOKEN}` }
            : {}),
        },
        body: JSON.stringify({ intent, submittedAt: new Date().toISOString(), data }),
      });

      if (!response.ok) throw new Error(`Provider responded ${response.status}`);
    } catch {
      return NextResponse.json(
        { message: "We could not send that just now. Please email us directly." },
        { status: 502 },
      );
    }
  } else {
    console.info("[enquiry] no ENQUIRY_WEBHOOK_URL configured — submission logged", {
      intent,
      data,
    });
  }

  return NextResponse.json({
    message:
      intent === "newsletter"
        ? "You're on the list. Watch your inbox."
        : "Thank you — your message is in. You'll hear back shortly.",
  });
}
