"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { submitForm, type SubmitState } from "@/lib/submit";

interface NewsletterFormProps {
  className?: string;
  tone?: "deep" | "light";
}

export function NewsletterForm({ className, tone = "light" }: NewsletterFormProps) {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setState("submitting");

    const result = await submitForm("newsletter", Object.fromEntries(new FormData(form)));

    setState(result.state);
    setMessage(result.message);
    if (result.state === "success") form.reset();
  };

  const onDeep = tone === "deep";

  return (
    <form onSubmit={onSubmit} className={cn("relative flex flex-col gap-3", className)}>
      <div
        className={cn(
          "flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:border sm:p-1.5",
          onDeep ? "sm:border-white/20 sm:bg-white/5" : "sm:border-line sm:bg-surface",
        )}
      >
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-px w-px opacity-0"
        />
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          className={cn(
            "w-full rounded-full px-5 py-3 text-sm outline-none",
            onDeep
              ? "bg-white/5 text-on-deep placeholder:text-on-deep-muted sm:bg-transparent"
              : "bg-surface text-ink placeholder:text-muted/70 sm:bg-transparent",
          )}
        />
        <button
          type="submit"
          disabled={state === "submitting"}
          className={cn(
            "shrink-0 rounded-full px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60",
            onDeep ? "bg-accent text-white" : "bg-deep text-on-deep",
          )}
        >
          {state === "submitting" ? "Sending…" : "Join the letter"}
        </button>
      </div>

      {message ? (
        <p
          role="status"
          className={cn(
            "text-xs",
            state === "error" ? "text-red-400" : onDeep ? "text-accent" : "text-accent-ink",
          )}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
