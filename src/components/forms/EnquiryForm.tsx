"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { submitForm, type SubmitState } from "@/lib/submit";
import { SelectField, TextAreaField, TextField } from "./Field";

interface EnquiryFormProps {
  /** Distinguishes submissions so they can be routed to the right inbox. */
  intent: string;
  eventTypes?: readonly string[];
  className?: string;
}

export function EnquiryForm({ intent, eventTypes, className }: EnquiryFormProps) {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setState("submitting");

    const result = await submitForm(intent, Object.fromEntries(new FormData(form)));

    setState(result.state);
    setMessage(result.message);
    if (result.state === "success") form.reset();
  };

  return (
    <form onSubmit={onSubmit} className={cn("relative grid gap-5 sm:grid-cols-2", className)} noValidate={false}>
      {/* Honeypot — hidden from people, irresistible to bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-px w-px opacity-0"
      />

      <TextField label="Name" name="name" required placeholder="Your full name" />
      <TextField label="Organisation" name="organisation" placeholder="Church, company or community" />
      <TextField label="Email" name="email" type="email" required placeholder="your@email.com" />
      <TextField label="Phone / WhatsApp" name="phone" type="tel" placeholder="+234 …" />

      {eventTypes ? (
        <SelectField label="Event type" name="eventType" options={eventTypes} required />
      ) : (
        <TextField label="Subject" name="subject" placeholder="What is this about?" />
      )}

      <TextField label="Proposed date" name="date" type="date" />

      <TextField
        label="Topic / brief"
        name="topic"
        className="sm:col-span-2"
        placeholder="What would you like Ebahi to speak on?"
      />

      <TextAreaField
        label="Message"
        name="message"
        required
        className="sm:col-span-2"
        placeholder="Tell us about the gathering — who is coming, what you are hoping for, and anything else that helps."
      />

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={state === "submitting"}
          className="inline-flex items-center justify-center gap-2.5 rounded-full bg-deep px-8 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-on-deep transition-all duration-300 hover:-translate-y-0.5 hover:bg-deep-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "submitting" ? "Sending…" : "Send enquiry"}
          <span aria-hidden>→</span>
        </button>

        {message ? (
          <p
            role="status"
            className={cn("text-sm", state === "error" ? "text-red-600" : "text-accent-ink")}
          >
            {message}
          </p>
        ) : (
          <p className="text-xs text-muted">Typical response within 3–5 working days.</p>
        )}
      </div>
    </form>
  );
}
