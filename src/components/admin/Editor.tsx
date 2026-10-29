"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { ActionResult } from "@/app/admin/actions";

type Status = "idle" | "saving" | "saved" | "error";

export interface EditorState<T> {
  value: T;
  setValue: (next: T | ((current: T) => T)) => void;
  dirty: boolean;
  status: Status;
  message: string;
  save: () => Promise<void>;
  reset: () => void;
}

/**
 * The editing loop every dashboard screen shares.
 *
 * A document is held in local state, validated server-side on save,
 * and the result reported. Nothing is written until the editor asks:
 * autosaving a page builder means a half-finished block can reach the
 * live site, which is the wrong default for a published site.
 */
export function useEditor<T>(
  initial: T,
  onSave: (payload: string) => Promise<ActionResult>,
): EditorState<T> {
  const [value, setValue] = useState<T>(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const baseline = useRef(JSON.stringify(initial));

  const dirty = useMemo(() => JSON.stringify(value) !== baseline.current, [value]);

  const save = useCallback(async () => {
    setStatus("saving");
    setMessage("");

    const payload = JSON.stringify(value);
    const result = await onSave(payload);

    if (result.ok) {
      baseline.current = payload;
      setStatus("saved");
    } else {
      setStatus("error");
    }

    setMessage(result.message);
  }, [onSave, value]);

  const reset = useCallback(() => {
    setValue(JSON.parse(baseline.current) as T);
    setStatus("idle");
    setMessage("");
  }, []);

  // Leaving with unsaved work should be deliberate.
  useEffect(() => {
    if (!dirty) return;

    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // Ctrl/Cmd+S saves, as it does everywhere else.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (dirty) void save();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dirty, save]);

  return { value, setValue, dirty, status, message, save, reset };
}

/** The sticky bar that reports state and holds the save button. */
export function SaveBar<T>({
  editor,
  title,
  description,
  actions,
}: {
  editor: EditorState<T>;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  const { dirty, status, message, save, reset } = editor;

  return (
    <div
      className="sticky top-0 z-30 -mx-4 mb-6 border-b px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8"
      style={{ borderColor: "var(--a-line)", background: "color-mix(in srgb, var(--a-bg) 88%, transparent)" }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg">{title}</h1>
          {description ? <p className="adm-help !mt-0.5">{description}</p> : null}
        </div>

        {actions}

        {dirty ? (
          <button type="button" className="adm-btn adm-btn-ghost" onClick={reset}>
            Discard
          </button>
        ) : null}

        <button
          type="button"
          className="adm-btn adm-btn-primary"
          onClick={() => void save()}
          disabled={!dirty || status === "saving"}
        >
          {status === "saving" ? "Saving…" : dirty ? "Save changes" : "Saved"}
        </button>
      </div>

      {message ? (
        <p
          role="status"
          className={cn("mt-2 rounded px-3 py-1.5 text-[0.8125rem]")}
          style={
            status === "error"
              ? { background: "var(--a-danger-soft)", color: "var(--a-danger)" }
              : { background: "var(--a-ok-soft)", color: "var(--a-ok)" }
          }
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

/** A confirm-then-act button for destructive operations. */
export function DangerButton({
  label,
  confirmLabel,
  onConfirm,
  disabled,
  title,
}: {
  label: string;
  confirmLabel: string;
  onConfirm: () => Promise<ActionResult> | void;
  disabled?: boolean;
  title?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const timer = window.setTimeout(() => setConfirming(false), 5000);
    return () => window.clearTimeout(timer);
  }, [confirming]);

  return (
    <button
      type="button"
      title={title}
      disabled={disabled || busy}
      className="adm-btn adm-btn-danger"
      onClick={async () => {
        if (!confirming) {
          setConfirming(true);
          return;
        }

        setBusy(true);
        try {
          await onConfirm();
        } finally {
          setBusy(false);
          setConfirming(false);
        }
      }}
    >
      {busy ? "Working…" : confirming ? confirmLabel : label}
    </button>
  );
}
