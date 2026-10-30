"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * A page of A4, showing the page as it is being written.
 *
 * A block list tells you the order of a page but not how it reads, and
 * how it reads is the thing being edited. The frame renders the site
 * at a real desktop width and scales it down, so the layout inside is
 * the layout a visitor gets rather than a narrow-viewport version of
 * it — which is also why this has to be an iframe: CSS breakpoints key
 * off the viewport, and no amount of scaling a div will fool them.
 *
 * It scrolls, and it follows the editor. Blocks are Server Components,
 * so an unsaved page has to reach the server to be rendered: the
 * editor parks its draft and the frame reloads from it, holding the
 * scroll position so the page does not jump back to the top every time
 * a word changes.
 */

/** Simulated viewport widths, in CSS pixels. */
const VIEWPORTS = {
  desktop: { width: 1280, label: "Desktop" },
  mobile: { width: 420, label: "Mobile" },
} as const;

type Viewport = keyof typeof VIEWPORTS;

/** A4 portrait, and how much taller the frame may be stretched. */
const PAGE_RATIO = 297 / 210;

const HEIGHTS = {
  a4: { ratio: PAGE_RATIO, label: "A4" },
  tall: { ratio: PAGE_RATIO * 1.9, label: "Tall" },
} as const;

type Height = keyof typeof HEIGHTS;

export interface PreviewTarget {
  /** Page id, for the draft route. */
  id: string;
  /** Last saved address, for the full-size link. */
  slug: string;
  status: "published" | "draft";
}

export function PagePreview({
  target,
  /** Bumped whenever the parked draft changes. */
  revision,
  pending,
}: {
  target: PreviewTarget;
  revision: number;
  pending: boolean;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const iframe = useRef<HTMLIFrameElement>(null);
  const scrollTop = useRef(0);

  const [scale, setScale] = useState(0.25);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [height, setHeight] = useState<Height>("a4");
  const [open, setOpen] = useState(true);

  const width = VIEWPORTS[viewport].width;
  const ratio = HEIGHTS[height].ratio;

  // The frame is as wide as the column it sits in, so the scale that
  // fits a desktop viewport into it has to be measured, not assumed.
  useEffect(() => {
    const element = frame.current;
    if (!element) return;

    const measure = () => setScale(element.clientWidth / width);

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [width, open]);

  /** Remembers where the reader was, so a reload does not lose it. */
  const rememberScroll = useCallback(() => {
    try {
      scrollTop.current = iframe.current?.contentWindow?.scrollY ?? scrollTop.current;
    } catch {
      /* cross-origin should be impossible here, but never throw over a preview */
    }
  }, []);

  const restoreScroll = useCallback(() => {
    try {
      iframe.current?.contentWindow?.scrollTo(0, scrollTop.current);
    } catch {
      /* as above */
    }
  }, []);

  const reload = useCallback(() => {
    rememberScroll();

    const element = iframe.current;
    if (!element) return;

    try {
      element.contentWindow?.location.reload();
    } catch {
      // Reassigning src is the fallback; it loses nothing but speed.
      element.src = element.src;
    }
  }, [rememberScroll]);

  // A new draft has been parked — pull it in without losing the reader's place.
  useEffect(() => {
    if (revision === 0) return;
    reload();
  }, [revision, reload]);

  const src = `/admin/embed/draft/${encodeURIComponent(target.id)}`;
  const live = target.slug === "" ? "/" : `/${target.slug}`;

  return (
    <div className="adm-panel overflow-hidden">
      <div
        className="flex flex-wrap items-center gap-1.5 border-b px-3 py-2"
        style={{ borderColor: "var(--a-line)", background: "var(--a-sunken)" }}
      >
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex min-w-0 items-center gap-2 text-left"
        >
          <span aria-hidden className="adm-help !mt-0 w-3">
            {open ? "▾" : "▸"}
          </span>
          <span className="adm-label !text-[0.6875rem]">Preview</span>
        </button>

        {pending ? (
          <span className="adm-help !mt-0 text-[0.6875rem]" role="status">
            updating…
          </span>
        ) : null}

        {open ? (
          <div className="ml-auto flex items-center gap-0.5">
            {(Object.keys(VIEWPORTS) as Viewport[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setViewport(key)}
                title={`${VIEWPORTS[key].label} — ${VIEWPORTS[key].width}px wide`}
                className={cn(
                  "adm-btn adm-btn-quiet !px-1.5 !text-[0.6875rem]",
                  viewport === key && "!text-[var(--a-accent)]",
                )}
              >
                {VIEWPORTS[key].label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setHeight((value) => (value === "a4" ? "tall" : "a4"))}
              title="Taller frame"
              className={cn(
                "adm-btn adm-btn-quiet !px-1.5 !text-[0.6875rem]",
                height === "tall" && "!text-[var(--a-accent)]",
              )}
            >
              {HEIGHTS[height].label}
            </button>

            <button
              type="button"
              onClick={reload}
              title="Reload the preview"
              className="adm-btn adm-btn-quiet !px-1.5"
            >
              ↻
            </button>
          </div>
        ) : null}
      </div>

      {open ? (
        <div className="p-3">
          <div
            ref={frame}
            className="relative w-full overflow-hidden rounded border shadow-sm"
            style={{
              aspectRatio: `1 / ${ratio}`,
              borderColor: "var(--a-line-strong)",
              background: "var(--a-sunken)",
            }}
          >
            <iframe
              ref={iframe}
              src={src}
              title="Page preview"
              onLoad={restoreScroll}
              // Same-origin so the frame can load the site's styles and
              // read back its scroll position; scripts stay on so the
              // reveal animations settle rather than leaving blocks
              // invisible.
              sandbox="allow-same-origin allow-scripts"
              style={{
                width,
                // Divide back out the scale so the frame's own viewport
                // is exactly as tall as the box it is painted into.
                height: `${(width * ratio).toFixed(0)}px`,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                border: 0,
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="adm-help !mt-0 flex-1">
              Live, including unsaved edits. Scroll inside it.
            </p>

            <Link
              href={target.status === "published" ? live : `/admin/preview${live}`}
              target="_blank"
              className="adm-btn adm-btn-quiet !py-1 !text-[0.6875rem]"
            >
              Full size ↗
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
