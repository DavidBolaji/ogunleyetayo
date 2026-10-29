"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { blockDefinition, describeBlock } from "@/lib/admin/blocks";
import { blockStyleFields } from "@/lib/admin/style-fields";
import { Fields } from "./FieldRenderer";
import { NestedColumns } from "./ColumnEditor";
import type { Block } from "@/content/types";

type Values = Record<string, unknown>;

/**
 * One block in the page editor.
 *
 * Content and appearance are separate tabs because they are separate
 * jobs: most edits are a sentence or an image, and the ground, rhythm
 * and palette controls should not be in the way of those.
 */
export function BlockEditor({
  block,
  onChange,
  index,
  count,
  onMove,
  onRemove,
  onDuplicate,
}: {
  block: Block;
  onChange: (next: Values) => void;
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"content" | "appearance">("content");

  const definition = blockDefinition(block.type);
  const record = block as unknown as Values;

  const setPart = (key: "data" | "style" | "name" | "visible", value: unknown) =>
    onChange({ ...record, [key]: value });

  return (
    <div
      className={cn("adm-panel overflow-hidden transition-opacity", !block.visible && "opacity-55")}
    >
      <div
        className="flex flex-wrap items-center gap-2 px-3 py-2.5"
        style={{ background: open ? "var(--a-sunken)" : undefined }}
      >
        <span
          className="adm-chip shrink-0"
          style={{ background: "var(--a-accent-soft)", color: "var(--a-accent-ink)" }}
        >
          {definition.label}
        </span>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <span aria-hidden className="adm-help !mt-0 w-3">
            {open ? "▾" : "▸"}
          </span>
          <span className="truncate text-[0.8125rem]">{describeBlock(block) || "Untitled"}</span>
        </button>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            className="adm-btn adm-btn-quiet"
            title={block.visible ? "Hide from the page" : "Show on the page"}
            onClick={() => setPart("visible", !block.visible)}
          >
            {block.visible ? "Visible" : "Hidden"}
          </button>
          <button
            type="button"
            className="adm-btn adm-btn-quiet"
            disabled={index === 0}
            onClick={() => onMove(index - 1)}
            title="Move up"
          >
            ↑
          </button>
          <button
            type="button"
            className="adm-btn adm-btn-quiet"
            disabled={index === count - 1}
            onClick={() => onMove(index + 1)}
            title="Move down"
          >
            ↓
          </button>
          <button
            type="button"
            className="adm-btn adm-btn-quiet"
            onClick={onDuplicate}
            title="Duplicate"
          >
            Copy
          </button>
          <button
            type="button"
            className="adm-btn adm-btn-quiet"
            style={{ color: "var(--a-danger)" }}
            onClick={onRemove}
            title="Remove"
          >
            Remove
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t p-4" style={{ borderColor: "var(--a-line)" }}>
          <p className="adm-help !mt-0">{definition.description}</p>

          <div className="mt-3 flex items-center gap-1.5">
            {(["content", "appearance"] as const).map((entry) => (
              <button
                key={entry}
                type="button"
                onClick={() => setTab(entry)}
                className={cn("adm-btn", tab === entry ? "adm-btn-primary" : "adm-btn-ghost")}
              >
                {entry === "content" ? "Content" : "Appearance"}
              </button>
            ))}

            <input
              className="adm-input ml-auto !w-48 !py-1 !text-xs"
              placeholder="Label for this block"
              value={block.name ?? ""}
              onChange={(event) => setPart("name", event.target.value || undefined)}
              title="Only shown here, to help you find a block"
            />
          </div>

          <div className="mt-4">
            {tab === "content" ? (
              <Fields
                fields={definition.fields}
                value={block.data as unknown as Values}
                onChange={(next) => setPart("data", next)}
                renderColumns={(field, value, update) => (
                  <NestedColumns field={field} value={value} onChange={update} />
                )}
              />
            ) : (
              <Fields
                fields={blockStyleFields}
                value={block.style as unknown as Values}
                onChange={(next) => setPart("style", next)}
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
