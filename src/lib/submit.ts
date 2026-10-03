export type SubmitState = "idle" | "submitting" | "success" | "error";

export interface SubmitResult {
  state: Extract<SubmitState, "success" | "error">;
  message: string;
}

/**
 * Single transport for every form on the site. Swapping the backend
 * (Resend, Formspree, a CRM) means changing this function only.
 */
export async function submitForm(
  intent: string,
  data: Record<string, FormDataEntryValue>,
): Promise<SubmitResult> {
  try {
    const response = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intent, data }),
    });

    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      return {
        state: "error",
        message: payload.message ?? "Something went wrong. Please try again.",
      };
    }

    return { state: "success", message: payload.message ?? "Thank you — your message is in." };
  } catch {
    return {
      state: "error",
      message: "We could not reach the server. Please check your connection and try again.",
    };
  }
}
