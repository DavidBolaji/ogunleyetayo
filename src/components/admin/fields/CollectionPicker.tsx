"use client";

import Link from "next/link";
import { useAdminReference } from "@/components/admin/AdminContext";
import { Labelled } from "./Inputs";
import type { CollectionKind } from "@/content/types";

/**
 * Points a block at a collection.
 *
 * Only collections of the kind the block renders are offered, so a
 * programme list cannot be aimed at the blog and fail silently at
 * render time.
 */
export function CollectionPicker({
  label,
  help,
  itemKind,
  value,
  onChange,
}: {
  label: string;
  help?: string;
  itemKind: CollectionKind;
  value: string;
  onChange: (value: string) => void;
}) {
  const { collections } = useAdminReference();
  const matches = collections.filter((collection) => collection.kind === itemKind);
  const selected = matches.find((collection) => collection.name === value);

  return (
    <Labelled
      label={label}
      help={help}
      action={
        selected ? (
          <Link
            href={`/admin/collections/${selected.name}`}
            className="adm-btn adm-btn-quiet !py-1 !text-[0.6875rem]"
          >
            Edit items →
          </Link>
        ) : null
      }
    >
      <select
        className="adm-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">None</option>
        {matches.map((collection) => (
          <option key={collection.name} value={collection.name}>
            {collection.label}
          </option>
        ))}
      </select>

      {value && !selected ? (
        <p className="adm-help" style={{ color: "var(--a-danger)" }}>
          “{value}” is not a {itemKind} collection. This block will render nothing.
        </p>
      ) : null}
    </Labelled>
  );
}
