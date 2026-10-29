"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { useAdminReference } from "@/components/admin/AdminContext";
import { managedImageUrl, staticImageUrl } from "@/lib/media/paths";
import { Labelled, TextInput } from "./Inputs";
import type { Media, MediaItem } from "@/content/types";

export const thumbnailUrl = (item: MediaItem): string =>
  item.storage === "managed" ? managedImageUrl(item.id) : staticImageUrl(item.id);

const EMPTY: Media = { src: "", alt: "" };

/**
 * Picks an image from the library and art-directs it.
 *
 * `focus` is a CSS `object-position`: it decides what stays in frame
 * when a photo is cropped to a block's shape, so it is edited here
 * next to the picture rather than left as a number in a settings page.
 */
export function MediaPicker({
  label,
  help,
  value,
  onChange,
  onClear,
}: {
  label: string;
  help?: string;
  value: Media | undefined;
  onChange: (value: Media) => void;
  onClear?: () => void;
}) {
  const { media } = useAdminReference();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const current = value ?? EMPTY;
  const item = media.find((candidate) => candidate.id === current.src);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return media;
    return media.filter(
      (candidate) =>
        candidate.id.includes(needle) ||
        candidate.title.toLowerCase().includes(needle) ||
        candidate.alt.toLowerCase().includes(needle),
    );
  }, [media, query]);

  const [focusX, focusY] = (current.focus ?? "50% 35%")
    .split(/\s+/)
    .map((part) => Number.parseFloat(part) || 0);

  const setFocus = (x: number, y: number) => onChange({ ...current, focus: `${x}% ${y}%` });

  return (
    <Labelled
      label={label}
      help={help}
      action={
        onClear && current.src ? (
          <button type="button" className="adm-btn adm-btn-quiet" onClick={onClear}>
            Remove
          </button>
        ) : null
      }
    >
      <div className="adm-panel p-3">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="relative h-24 w-20 shrink-0 overflow-hidden rounded border"
            style={{ borderColor: "var(--a-line-strong)", background: "var(--a-sunken)" }}
          >
            {item ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnailUrl(item)}
                alt=""
                className="h-full w-full object-cover"
                style={{ objectPosition: current.focus ?? "50% 35%" }}
              />
            ) : (
              <span className="adm-help block px-1">Choose</span>
            )}
          </button>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <p className="truncate text-[0.8125rem] font-semibold">
                {item?.title ?? current.src ?? "No image selected"}
              </p>
              <button
                type="button"
                className="adm-btn adm-btn-ghost ml-auto shrink-0"
                onClick={() => setOpen((value) => !value)}
              >
                {open ? "Close" : item ? "Change" : "Choose"}
              </button>
            </div>

            <TextInput
              label="Alt text"
              value={current.alt}
              onChange={(alt) => onChange({ ...current, alt })}
              placeholder="What the photograph shows, for screen readers"
            />

            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="adm-label">Focus across — {focusX}%</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={focusX}
                  onChange={(event) => setFocus(Number(event.target.value), focusY)}
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
                  onChange={(event) => setFocus(focusX, Number(event.target.value))}
                  className="w-full accent-[var(--a-accent)]"
                />
              </label>
            </div>
          </div>
        </div>

        {open ? (
          <div className="mt-3 border-t pt-3" style={{ borderColor: "var(--a-line)" }}>
            <input
              className="adm-input mb-2"
              placeholder="Search the library…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />

            <div className="grid max-h-72 grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-6">
              {matches.map((candidate) => (
                <button
                  key={candidate.id}
                  type="button"
                  title={candidate.title}
                  onClick={() => {
                    onChange({
                      src: candidate.id,
                      alt: current.alt || candidate.alt,
                      focus: current.focus ?? candidate.focus,
                    });
                    setOpen(false);
                  }}
                  className={cn(
                    "relative aspect-[3/4] overflow-hidden rounded border transition",
                    candidate.id === current.src ? "ring-2" : "hover:opacity-80",
                  )}
                  style={{
                    borderColor: "var(--a-line-strong)",
                    boxShadow:
                      candidate.id === current.src ? "0 0 0 2px var(--a-accent)" : undefined,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnailUrl(candidate)}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}

              {matches.length === 0 ? (
                <p className="adm-help col-span-full">
                  Nothing matches. Upload images in the Media section.
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </Labelled>
  );
}
