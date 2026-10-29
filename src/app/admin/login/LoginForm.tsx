"use client";

import { useActionState } from "react";
import { signInAction, type ActionResult } from "@/app/admin/actions";

/**
 * `next` arrives as a prop rather than from `useSearchParams`, which
 * would push the whole form behind a Suspense boundary and leave the
 * sign-in page showing a loading state until hydration.
 */
export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<ActionResult | undefined, FormData>(
    signInAction,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      <div>
        <label className="adm-label mb-1.5" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          autoFocus
          required
          className="adm-input"
        />
      </div>

      <div>
        <label className="adm-label mb-1.5" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="adm-input"
        />
      </div>

      {state && !state.ok ? (
        <p
          className="rounded px-3 py-2 text-[0.8125rem]"
          style={{ background: "var(--a-danger-soft)", color: "var(--a-danger)" }}
          role="alert"
        >
          {state.message}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="adm-btn adm-btn-primary w-full">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
