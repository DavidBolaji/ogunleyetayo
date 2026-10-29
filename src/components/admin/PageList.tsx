"use client";

import Link from "next/link";
import { useActionState, useState, useTransition } from "react";
import { cn } from "@/lib/cn";
import {
  createPageAction,
  deletePageAction,
  reorderPagesAction,
  type ActionResult,
} from "@/app/admin/actions";
import { DangerButton } from "./Editor";
import type { Page } from "@/content/types";

/**
 * The page index.
 *
 * Reordering saves immediately — it is one number per page and there
 * is nothing to review — while everything that changes what a page
 * says happens in the editor behind an explicit save.
 */
export function PageList({ pages }: { pages: readonly Page[] }) {
  const [order, setOrder] = useState<Page[]>([...pages]);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const [createState, createAction, creating] = useActionState<ActionResult | undefined, FormData>(
    createPageAction,
    undefined,
  );

  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return;

    const next = [...order];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setOrder(next);

    startTransition(async () => {
      const result = await reorderPagesAction(next.map((page) => page.id));
      setMessage(result.message);
    });
  };

  return (
    <div className="space-y-6">
      <ul className="space-y-2">
        {order.map((page, index) => (
          <li key={page.id} className="adm-panel flex flex-wrap items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/admin/pages/${page.id}`}
                  className="text-[0.9375rem] font-semibold hover:underline"
                >
                  {page.title}
                </Link>

                <span
                  className="adm-chip"
                  style={
                    page.status === "published"
                      ? { background: "var(--a-ok-soft)", color: "var(--a-ok)" }
                      : { background: "var(--a-sunken)", color: "var(--a-muted)" }
                  }
                >
                  {page.status}
                </span>

                {page.system ? (
                  <span
                    className="adm-chip"
                    style={{ background: "var(--a-accent-soft)", color: "var(--a-accent-ink)" }}
                  >
                    system
                  </span>
                ) : null}
              </div>

              <p className="adm-help !mt-0.5">
                /{page.slug} · {page.blocks.length} block{page.blocks.length === 1 ? "" : "s"}
                {page.updatedAt
                  ? ` · updated ${new Date(page.updatedAt).toLocaleDateString("en-GB")}`
                  : ""}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                className="adm-btn adm-btn-quiet"
                disabled={index === 0 || pending}
                onClick={() => move(index, index - 1)}
                title="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                className="adm-btn adm-btn-quiet"
                disabled={index === order.length - 1 || pending}
                onClick={() => move(index, index + 1)}
                title="Move down"
              >
                ↓
              </button>

              <Link href={`/admin/pages/${page.id}`} className="adm-btn adm-btn-ghost">
                Edit
              </Link>

              <DangerButton
                label="Delete"
                confirmLabel="Really delete?"
                disabled={page.system}
                title={page.system ? "System pages cannot be deleted." : undefined}
                onConfirm={async () => {
                  const result = await deletePageAction(page.id);
                  setMessage(result.message);
                  if (result.ok) setOrder((current) => current.filter((entry) => entry.id !== page.id));
                  return result;
                }}
              />
            </div>
          </li>
        ))}
      </ul>

      {message ? (
        <p className="adm-help" role="status">
          {message}
        </p>
      ) : null}

      <form id="new" action={createAction} className="adm-panel space-y-3 p-4">
        <h2 className="text-sm">New page</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="adm-label mb-1.5" htmlFor="new-title">
              Name
            </label>
            <input id="new-title" name="title" required className="adm-input" placeholder="Events" />
          </div>

          <div>
            <label className="adm-label mb-1.5" htmlFor="new-slug">
              Address
            </label>
            <input id="new-slug" name="slug" className="adm-input" placeholder="events" />
          </div>
        </div>

        <p className="adm-help !mt-0">
          New pages start as drafts with no blocks. Add blocks in the editor, then publish.
        </p>

        {createState && !createState.ok ? (
          <p
            className={cn("rounded px-3 py-2 text-[0.8125rem]")}
            style={{ background: "var(--a-danger-soft)", color: "var(--a-danger)" }}
          >
            {createState.message}
          </p>
        ) : null}

        <button type="submit" disabled={creating} className="adm-btn adm-btn-primary">
          {creating ? "Creating…" : "Create page"}
        </button>
      </form>
    </div>
  );
}
