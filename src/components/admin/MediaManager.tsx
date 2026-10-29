"use client";

import { useActionState, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import {
  deleteMediaAction,
  updateMediaAction,
  uploadMediaAction,
  type ActionResult,
} from "@/app/admin/actions";
import { thumbnailUrl } from "./fields/MediaPicker";
import { DangerButton, SaveBar, useEditor } from "./Editor";
import { TextInput } from "./fields/Inputs";
import type { MediaItem, MediaLibrary } from "@/content/types";

const formatBytes = (bytes: number): string =>
  bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)}MB` : `${Math.round(bytes / 1024)}KB`;

/**
 * The media library.
 *
 * Uploads are re-encoded to WebP at the site's maximum size and given
 * a blur placeholder, exactly as the offline pipeline does — so an
 * image added here behaves identically to one added by a designer.
 *
 * Alt text and the focus point live with the image rather than with
 * each use of it, so a photo is described once and crops sensibly
 * wherever it is placed.
 */
export function MediaManager({ library }: { library: MediaLibrary }) {
  const editor = useEditor<MediaLibrary>(library, updateMediaAction);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const [uploadState, upload, uploading] = useActionState<ActionResult | undefined, FormData>(
    uploadMediaAction,
    undefined,
  );

  const items = editor.value.items;

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter(
      (item) =>
        item.id.includes(needle) ||
        item.title.toLowerCase().includes(needle) ||
        item.alt.toLowerCase().includes(needle),
    );
  }, [items, query]);

  const current = items.find((item) => item.id === selected);

  const update = (id: string, patch: Partial<MediaItem>) =>
    editor.setValue((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));

  const [focusX, focusY] = (current?.focus ?? "50% 35%")
    .split(/\s+/)
    .map((part) => Number.parseFloat(part) || 0);

  return (
    <>
      <SaveBar
        editor={editor}
        title="Media"
        description={`${items.length} image${items.length === 1 ? "" : "s"}. Alt text and focus are saved with the library.`}
      />

      <form action={upload} className="adm-panel mb-6 space-y-3 p-4">
        <h2 className="text-sm">Upload images</h2>
        <p className="adm-help !mt-0">
          JPEG, PNG, WebP, AVIF or TIFF, up to 12MB each. Every upload is resized and re-encoded as
          WebP with a blur placeholder.
        </p>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            type="file"
            name="files"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif,image/tiff"
            required
            className="adm-input"
          />
          <button type="submit" disabled={uploading} className="adm-btn adm-btn-primary">
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </div>

        {uploadState ? (
          <p
            className="rounded px-3 py-2 text-[0.8125rem]"
            style={
              uploadState.ok
                ? { background: "var(--a-ok-soft)", color: "var(--a-ok)" }
                : { background: "var(--a-danger-soft)", color: "var(--a-danger)" }
            }
          >
            {uploadState.message}
          </p>
        ) : null}
      </form>

      <input
        className="adm-input mb-4"
        placeholder="Search by name or description…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-5">
          {matches.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item.id === selected ? null : item.id)}
              className={cn("relative aspect-[3/4] overflow-hidden rounded border text-left")}
              style={{
                borderColor: item.id === selected ? "var(--a-accent)" : "var(--a-line-strong)",
                boxShadow: item.id === selected ? "0 0 0 2px var(--a-accent)" : undefined,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnailUrl(item)}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
                style={{ objectPosition: item.focus }}
              />
              {!item.alt ? (
                <span
                  className="absolute left-1 top-1 adm-chip"
                  style={{ background: "var(--a-danger-soft)", color: "var(--a-danger)" }}
                  title="This image has no alt text"
                >
                  alt
                </span>
              ) : null}
            </button>
          ))}

          {matches.length === 0 ? (
            <p className="adm-help col-span-full">No images match.</p>
          ) : null}
        </div>

        <aside className="min-w-0">
          {current ? (
            <div className="adm-panel p-4 lg:sticky lg:top-28">
              <div
                className="mb-3 aspect-[4/3] overflow-hidden rounded"
                style={{ background: "var(--a-sunken)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnailUrl(current)}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ objectPosition: current.focus }}
                />
              </div>

              <p className="adm-help !mt-0">
                {current.width}×{current.height} · {formatBytes(current.bytes)} ·{" "}
                {current.storage === "managed" ? "uploaded" : "from the image pipeline"}
              </p>
              <p className="adm-help font-mono text-[0.6875rem]">{current.id}</p>

              <div className="mt-3 space-y-3">
                <TextInput
                  label="Name"
                  value={current.title}
                  onChange={(title) => update(current.id, { title })}
                />

                <TextInput
                  label="Alt text"
                  help="What the photograph shows. Read aloud by screen readers."
                  value={current.alt}
                  onChange={(alt) => update(current.id, { alt })}
                />

                <div className="grid grid-cols-2 gap-2">
                  <label className="block">
                    <span className="adm-label">Focus across — {focusX}%</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={focusX}
                      onChange={(event) =>
                        update(current.id, { focus: `${event.target.value}% ${focusY}%` })
                      }
                      className="w-full accent-[var(--a-accent)]"
                    />
                  </label>
                  <label className="block">
                    <span className="adm-label">Focus down — {focusY}%</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={focusY}
                      onChange={(event) =>
                        update(current.id, { focus: `${focusX}% ${event.target.value}%` })
                      }
                      className="w-full accent-[var(--a-accent)]"
                    />
                  </label>
                </div>

                <DangerButton
                  label="Delete image"
                  confirmLabel="Really delete?"
                  onConfirm={async () => {
                    const result = await deleteMediaAction(current.id);
                    if (result.ok) {
                      editor.setValue((state) => ({
                        items: state.items.filter((item) => item.id !== current.id),
                      }));
                      setSelected(null);
                    }
                    return result;
                  }}
                />
              </div>
            </div>
          ) : (
            <p className="adm-help">Select an image to describe it and set its focus point.</p>
          )}
        </aside>
      </div>
    </>
  );
}
