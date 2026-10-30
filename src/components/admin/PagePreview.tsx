"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * A page of A4, showing what the page actually looks like.
 *
 * A block list tells you the order of a page but not how it reads, and
 * the whole point of the editor is the second thing. The frame is A4
 * so it is recognisably a page rather than a thumbnail, and the site
 * is rendered at a real desktop width and scaled down, so the layout
 * inside is the layout visitors get — not a narrow-viewport version of
 * it.
 *
 * It shows the last saved state. Rendering a block needs the server,
 * so previewing an unsaved edit would mean sending every keystroke
 * somewhere to be rendered; saving is the honest boundary, and the
 * frame refreshes itself the moment a save lands.
 */

/** Simulated viewport widths, in CSS pixels. */
const VIEWPORTS = {
  desktop: { width: 1280, label: "Desktop" },
  mobile: { width: 420, label: "Mobile" },
} as const;

type Viewport = keyof typeof VIEWPORTS;

/** A4 portrait. */
const PAGE_RATIO = 297 / 210;

export function PagePreview({
  slug,
  status,
  /** Changing this reloads the frame — bumped when a save succeeds. */
  revision,
}: {
  slug: string;
  status: "published" | "draft";
  revision: number;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [open, setOpen] = useState(true);
  const [nonce, setNonce] = useState(0);

  const width = VIEWPORTS[viewport].width;

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

  const reload = useCallback(() => setNonce((value) => value + 1), []);

  // "index" stands in for the home page: a path segment cannot be empty.
  const path = `/admin/embed/${slug === "" ? "index" : slug}`;
  const live = slug === "" ? "/" : `/${slug}`;

  return (
    <div className="adm-panel overflow-hidden">
      <div
        className="flex flex-wrap items-center gap-1.5 border-b px-3 py-2"
        style={{ borderColor: "var(--a-line)", background: "var(--a-sunken)" }}
      >
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <span aria-hidden className="adm-help !mt-0 w-3">
            {open ? "▾" : "▸"}
          </span>
          <span className="adm-label !text-[0.6875rem]">Preview</span>
        </button>

        {open ? (
          <>
            {(Object.keys(VIEWPORTS) as Viewport[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setViewport(key)}
                title={`${VIEWPORTS[key].label} — ${VIEWPORTS[key].width}px`}
                className={cn(
                  "adm-btn adm-btn-quiet !px-2 !text-[0.6875rem]",
                  viewport === key && "!text-[var(--a-accent)]",
                )}
              >
                {VIEWPORTS[key].label}
              </button>
            ))}

            <button
              type="button"
              onClick={reload}
              title="Reload the preview"
              className="adm-btn adm-btn-quiet !px-2"
            >
              ↻
            </button>
          </>
        ) : null}
      </div>

      {open ? (
        <div className="p-3">
          <div
            ref={frame}
            className="relative w-full overflow-hidden rounded border shadow-sm"
            style={{
              aspectRatio: `210 / 297`,
              borderColor: "var(--a-line-strong)",
              background: "var(--a-sunken)",
            }}
          >
            <iframe
              key={`${slug}-${revision}-${nonce}-${viewport}`}
              src={path}
              title="Page preview"
              loading="lazy"
              // Same-origin so the frame can load the site's styles and
              // fonts; scripts stay enabled so Motion settles the
              // reveal animations rather than leaving blocks invisible.
              sandbox="allow-same-origin allow-scripts"
              style={{
                width,
                height: width * PAGE_RATIO,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                border: 0,
                position: "absolute",
                top: 0,
                left: 0,
                // A preview is for looking at, not clicking through.
                pointerEvents: "none",
              }}
            />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="adm-help !mt-0 flex-1">
              Last saved state{status === "draft" ? " · draft" : ""}.
            </p>

            <Link
              href={status === "published" ? live : `/admin/preview${live}`}
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
