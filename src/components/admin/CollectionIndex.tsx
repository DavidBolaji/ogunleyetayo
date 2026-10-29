"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  createCollectionAction,
  deleteCollectionAction,
  type ActionResult,
} from "@/app/admin/actions";
import { collectionKindDefinitions } from "@/lib/admin/collections";
import { DangerButton } from "./Editor";
import type { CollectionKind } from "@/content/types";

interface Summary {
  name: string;
  label: string;
  kind: CollectionKind;
  description?: string;
  system: boolean;
  count: number;
}

/**
 * Collections are the site's reusable lists — books, posts,
 * programmes, the pills in a form. Blocks point at them by name, so a
 * second set of programmes is a new collection rather than new code.
 */
export function CollectionIndex({ collections }: { collections: readonly Summary[] }) {
  const [message, setMessage] = useState("");
  const [removed, setRemoved] = useState<string[]>([]);

  const [state, action, pending] = useActionState<ActionResult | undefined, FormData>(
    createCollectionAction,
    undefined,
  );

  const visible = collections.filter((collection) => !removed.includes(collection.name));

  return (
    <>
      <header className="mb-6">
        <h1 className="text-lg">Collections</h1>
        <p className="adm-help">
          Reusable lists. A block points at one by name, so changing what a section shows is a
          matter of pointing it somewhere else.
        </p>
      </header>

      <ul className="space-y-2">
        {visible.map((collection) => (
          <li key={collection.name} className="adm-panel flex flex-wrap items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/admin/collections/${collection.name}`}
                  className="text-[0.9375rem] font-semibold hover:underline"
                >
                  {collection.label}
                </Link>
                <span
                  className="adm-chip"
                  style={{ background: "var(--a-sunken)", color: "var(--a-muted)" }}
                >
                  {collection.count} item{collection.count === 1 ? "" : "s"}
                </span>
                {collection.system ? (
                  <span
                    className="adm-chip"
                    style={{ background: "var(--a-accent-soft)", color: "var(--a-accent-ink)" }}
                  >
                    in use
                  </span>
                ) : null}
              </div>
              <p className="adm-help !mt-0.5">
                {collection.description ?? `A list of ${collection.kind} items.`}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Link href={`/admin/collections/${collection.name}`} className="adm-btn adm-btn-ghost">
                Edit
              </Link>
              <DangerButton
                label="Delete"
                confirmLabel="Really delete?"
                disabled={collection.system}
                title={collection.system ? "This collection is referenced across the site." : undefined}
                onConfirm={async () => {
                  const result = await deleteCollectionAction(collection.name);
                  setMessage(result.message);
                  if (result.ok) setRemoved((current) => [...current, collection.name]);
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

      <form action={action} className="adm-panel mt-6 space-y-3 p-4">
        <h2 className="text-sm">New collection</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="adm-label mb-1.5" htmlFor="collection-label">
              Name
            </label>
            <input id="collection-label" name="label" required className="adm-input" />
          </div>

          <div>
            <label className="adm-label mb-1.5" htmlFor="collection-kind">
              What it holds
            </label>
            <select id="collection-kind" name="kind" className="adm-input" defaultValue="tag">
              {collectionKindDefinitions.map((definition) => (
                <option key={definition.kind} value={definition.kind}>
                  {definition.label} — {definition.description}
                </option>
              ))}
            </select>
          </div>
        </div>

        {state && !state.ok ? (
          <p
            className="rounded px-3 py-2 text-[0.8125rem]"
            style={{ background: "var(--a-danger-soft)", color: "var(--a-danger)" }}
          >
            {state.message}
          </p>
        ) : null}

        <button type="submit" disabled={pending} className="adm-btn adm-btn-primary">
          {pending ? "Creating…" : "Create collection"}
        </button>
      </form>
    </>
  );
}
