"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { randomId } from "@/lib/admin/ids";
import { blockDefinition, blockDefinitions, blockGroups } from "@/lib/admin/blocks";
import { savePageAction } from "@/app/admin/actions";
import { AdminReferenceProvider, type AdminReference } from "./AdminContext";
import { BlockEditor } from "./BlockEditor";
import { PagePreview } from "./PagePreview";
import { Fields } from "./FieldRenderer";
import { SaveBar, useEditor } from "./Editor";
import { f } from "@/lib/admin/fields";
import type { Block, BlockType, Page } from "@/content/types";

type Values = Record<string, unknown>;

const settingsFields = [
  f.text("title", "Page name", { help: "Shown in the dashboard and used as a fallback title." }),
  f.text("slug", "Address", {
    half: true,
    placeholder: "ministry/summit",
    help: "Leave blank for the home page. No leading slash.",
  }),
  f.select("status", "Status", [
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft — hidden from the site" },
  ]),
  { kind: "palette" as const, name: "palette", label: "Page palette" },
  f.toggle("inSitemap", "Include in the sitemap"),
  f.group(
    "seo",
    "Search & sharing",
    [
      f.text("title", "Title tag", { help: "Defaults to the page name." }),
      f.area("description", "Description", {
        rows: 3,
        help: "Shown under the title in search results and on the share card.",
      }),
      f.media("image", "Share image"),
      f.strings("keywords", "Keywords"),
      f.toggle("noIndex", "Ask search engines not to index this page"),
    ],
    true,
  ),
];

/**
 * The page builder.
 *
 * A page is an ordered list of blocks, so the editor is a list: add,
 * reorder, hide, duplicate, remove. Each block opens in place rather
 * than on its own screen, because moving a section and editing it are
 * usually the same piece of work.
 */
export function PageEditor({ page, reference }: { page: Page; reference: AdminReference }) {
  const editor = useEditor<Page>(page, savePageAction);
  const [adding, setAdding] = useState(false);

  /*
   * The preview renders the saved page, so it follows the address the
   * page was last saved at — not the one being typed into the settings
   * panel — and reloads when a save lands.
   */
  const [saved, setSaved] = useState({ slug: page.slug, status: page.status, revision: 0 });
  const status = editor.status;
  const savedRef = useRef(editor.value);
  savedRef.current = editor.value;

  useEffect(() => {
    if (status !== "saved") return;

    setSaved((current) => ({
      slug: savedRef.current.slug,
      status: savedRef.current.status,
      revision: current.revision + 1,
    }));
  }, [status]);

  const blocks = editor.value.blocks;

  const setBlocks = (next: Block[]) =>
    editor.setValue((current) => ({ ...current, blocks: next }));

  const move = (from: number, to: number) => {
    if (to < 0 || to >= blocks.length) return;
    const next = [...blocks];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setBlocks(next);
  };

  const add = (type: BlockType, at: number) => {
    const definition = blockDefinition(type);
    const created = definition.create();

    const block = {
      id: `${type}-${randomId()}`,
      type,
      visible: true,
      style: {
        tone: "canvas",
        size: "md",
        width: "default",
        align: "left",
        grain: false,
        borderTop: false,
        borderBottom: false,
        colors: {},
        ...created.style,
      },
      data: created.data,
    } as unknown as Block;

    const next = [...blocks];
    next.splice(at, 0, block);
    setBlocks(next);
    setAdding(false);
  };

  const preview = editor.value.slug ? `/${editor.value.slug}` : "/";

  return (
    <AdminReferenceProvider value={reference}>
      <SaveBar
        editor={editor}
        title={editor.value.title || "Untitled page"}
        description={
          <>
            {editor.value.status === "draft" ? "Draft · " : ""}
            {preview} · {blocks.length} block{blocks.length === 1 ? "" : "s"}
          </>
        }
        actions={
          <>
            <Link href="/admin/pages" className="adm-btn adm-btn-ghost">
              All pages
            </Link>
            <Link
              href={editor.value.status === "published" ? preview : `/admin/preview${preview}`}
              target="_blank"
              className="adm-btn adm-btn-ghost"
            >
              Preview ↗
            </Link>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-3">
          {blocks.map((block, index) => (
            <div key={block.id}>
              <InsertHere onAdd={(type) => add(type, index)} />
              <BlockEditor
                block={block}
                index={index}
                count={blocks.length}
                onChange={(next) =>
                  setBlocks(
                    blocks.map((entry, position) =>
                      position === index ? (next as unknown as Block) : entry,
                    ),
                  )
                }
                onMove={(to) => move(index, to)}
                onRemove={() => setBlocks(blocks.filter((_, position) => position !== index))}
                onDuplicate={() => {
                  const copy = {
                    ...JSON.parse(JSON.stringify(block)),
                    id: `${block.type}-${randomId()}`,
                  } as Block;
                  const next = [...blocks];
                  next.splice(index + 1, 0, copy);
                  setBlocks(next);
                }}
              />
            </div>
          ))}

          <div className="pt-2">
            {adding ? (
              <AddBlockMenu onAdd={(type) => add(type, blocks.length)} onClose={() => setAdding(false)} />
            ) : (
              <button
                type="button"
                className="adm-btn adm-btn-primary w-full"
                onClick={() => setAdding(true)}
              >
                + Add a block
              </button>
            )}
          </div>
        </div>

        <aside className="min-w-0">
          <div className="space-y-4 xl:sticky xl:top-28">
            <PagePreview
              slug={saved.slug}
              status={saved.status}
              revision={saved.revision}
            />

            <div className="adm-panel p-4">
              <h2 className="mb-3 text-sm">Page settings</h2>
              <Fields
                fields={settingsFields}
                value={editor.value as unknown as Values}
                onChange={(next) => editor.setValue(next as unknown as Page)}
              />
            </div>
          </div>
        </aside>
      </div>
    </AdminReferenceProvider>
  );
}

/** A quiet insertion point between two blocks. */
function InsertHere({ onAdd }: { onAdd: (type: BlockType) => void }) {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <div className="pb-3">
        <AddBlockMenu onAdd={onAdd} onClose={() => setOpen(false)} />
      </div>
    );
  }

  return (
    <div className="group flex h-6 items-center justify-center">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="adm-btn adm-btn-quiet opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
        title="Insert a block here"
      >
        + Insert
      </button>
    </div>
  );
}

function AddBlockMenu({
  onAdd,
  onClose,
}: {
  onAdd: (type: BlockType) => void;
  onClose: () => void;
}) {
  return (
    <div className="adm-panel p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm">Add a block</h3>
        <button type="button" className="adm-btn adm-btn-quiet" onClick={onClose}>
          Cancel
        </button>
      </div>

      <div className="space-y-4">
        {blockGroups.map((group) => {
          const entries = blockDefinitions.filter((definition) => definition.group === group);
          if (entries.length === 0) return null;

          return (
            <div key={group}>
              <p className="adm-label mb-2">{group}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {entries.map((definition) => (
                  <button
                    key={definition.type}
                    type="button"
                    onClick={() => onAdd(definition.type)}
                    className="adm-sunken p-3 text-left transition-colors hover:border-[var(--a-accent)]"
                  >
                    <p className="text-[0.8125rem] font-semibold">{definition.label}</p>
                    <p className="adm-help">{definition.description}</p>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
