"use client";

import { useEffect, useRef, useState } from "react";
import { savePreviewAction } from "@/app/admin/actions";
import type { Page } from "@/content/types";

/** How long typing has to stop before the draft is parked. */
const SETTLE_MS = 600;

export interface PreviewDraft {
  /** Increments each time a new draft lands on the server. */
  revision: number;
  pending: boolean;
}

/**
 * Parks the page being edited so the server can render it.
 *
 * Blocks are Server Components, so a live preview cannot be rendered
 * in the browser — the draft has to go somewhere the server can read
 * it back. It is debounced, and skipped when nothing actually changed,
 * so holding a key down does not become one write per character.
 */
export function usePreviewDraft(page: Page): PreviewDraft {
  const [revision, setRevision] = useState(0);
  const [pending, setPending] = useState(false);

  /*
   * What the server was last told, compared as text: the editor
   * replaces objects on every keystroke whether or not the content
   * under them differs.
   */
  const parked = useRef<string | null>(null);
  const inFlight = useRef(false);
  const latest = useRef(page);
  latest.current = page;

  // Sends the newest draft, then sends again if it moved on while the
  // request was out. Without that, the last edit before a pause could
  // be the one that never arrives.
  const sync = useRef<() => Promise<void>>(async () => {});

  sync.current = async () => {
    if (inFlight.current) return;

    inFlight.current = true;

    try {
      while (true) {
        const payload = JSON.stringify(latest.current);
        if (payload === parked.current) break;

        const result = await savePreviewAction(payload);
        if (!result.ok) break;

        parked.current = payload;
        setRevision((value) => value + 1);
      }
    } catch {
      // A preview that fails to update is not worth interrupting
      // someone's writing over; the reload button is the way back.
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  };

  useEffect(() => {
    if (JSON.stringify(page) === parked.current) return;

    setPending(true);
    const timer = window.setTimeout(() => void sync.current(), SETTLE_MS);

    return () => window.clearTimeout(timer);
  }, [page]);

  return { revision, pending };
}
