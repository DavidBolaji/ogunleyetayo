"use client";

import Link from "next/link";
import { useState } from "react";
import { randomId } from "@/lib/admin/ids";
import { collectionKindDefinition } from "@/lib/admin/collections";
import { saveCollectionAction } from "@/app/admin/actions";
import { AdminReferenceProvider, type AdminReference } from "./AdminContext";
import { Fields } from "./FieldRenderer";
import { SaveBar, useEditor } from "./Editor";
import type { Collection } from "@/content/types";

type Values = Record<string, unknown>;

/**
 * One collection.
 *
 * The same screen serves every kind; only the item fields differ, and
 * those come from the kind's descriptor. Order here is the order on
 * the site, which is why moving an item is a first-class control
 * rather than something buried in a sort field.
 */
export function CollectionEditor({
  collection,
  reference,
}: {
  collection: Collection;
  reference: AdminReference;
}) {
  const editor = useEditor<Collection>(collection, saveCollectionAction);
  const definition = collectionKindDefinition(collection.kind);
  const [open, setOpen] = useState<number | null>(null);

  const items = editor.value.items as unknown as Values[];

  const setItems = (next: Values[]) =>
    editor.setValue((current) => ({ ...current, items: next } as Collection));

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setItems(next);
    setOpen(to);
  };

  const add = () => {
    const created = { ...definition.create(), id: `${definition.kind}-${randomId()}` };
    setItems([...items, created]);
    setOpen(items.length);
  };

  return (
    <AdminReferenceProvider value={reference}>
      <SaveBar
        editor={editor}
        title={editor.value.label}
        description={`${definition.description} · ${items.length} item${items.length === 1 ? "" : "s"}`}
        actions={
          <Link href="/admin/collections" className="adm-btn adm-btn-ghost">
            All collections
          </Link>
        }
      />

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="adm-panel overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 px-3 py-2.5">
              <button
                type="button"
                onClick={() => setOpen(open === index ? null : index)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <span aria-hidden className="adm-help !mt-0 w-3">
                  {open === index ? "▾" : "▸"}
                </span>
                <span className="truncate text-[0.8125rem] font-semibold">
                  {definition.title(item)}
                </span>
                {item.status === "draft" ? (
                  <span
                    className="adm-chip shrink-0"
                    style={{ background: "var(--a-sunken)", color: "var(--a-muted)" }}
                  >
                    draft
                  </span>
                ) : null}
              </button>

              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  className="adm-btn adm-btn-quiet"
                  disabled={index === 0}
                  onClick={() => move(index, index - 1)}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="adm-btn adm-btn-quiet"
                  disabled={index === items.length - 1}
                  onClick={() => move(index, index + 1)}
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="adm-btn adm-btn-quiet"
                  onClick={() => {
                    const copy = {
                      ...JSON.parse(JSON.stringify(item)),
                      id: `${definition.kind}-${randomId()}`,
                    };
                    const next = [...items];
                    next.splice(index + 1, 0, copy);
                    setItems(next);
                  }}
                  title="Duplicate"
                >
                  Copy
                </button>
                <button
                  type="button"
                  className="adm-btn adm-btn-quiet"
                  style={{ color: "var(--a-danger)" }}
                  onClick={() => {
                    setItems(items.filter((_, position) => position !== index));
                    setOpen(null);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>

            {open === index ? (
              <div className="border-t p-4" style={{ borderColor: "var(--a-line)" }}>
                <Fields
                  fields={definition.fields}
                  value={item}
                  onChange={(next) =>
                    setItems(items.map((entry, position) => (position === index ? next : entry)))
                  }
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <button type="button" className="adm-btn adm-btn-primary mt-4 w-full" onClick={add}>
        + Add {definition.itemLabel.toLowerCase()}
      </button>
    </AdminReferenceProvider>
  );
}
