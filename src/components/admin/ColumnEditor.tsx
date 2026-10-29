"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import {
  columnDefinition,
  columnDefinitions,
  describeColumn,
  nestableColumnDefinitions,
} from "@/lib/admin/columns";
import type { ColumnKind, ColumnSpec } from "@/content/types";
import type { Field } from "@/lib/admin/fields";
import { Fields } from "./FieldRenderer";

type Values = Record<string, unknown>;

/**
 * Editors for the column system.
 *
 * `split` holds exactly two columns and `stack` holds a list of them,
 * so there are two shapes rather than one generic repeater — a split
 * must never end up with one column or three.
 */

function KindMenu({
  current,
  nested,
  onPick,
}: {
  current: ColumnKind;
  nested: boolean;
  onPick: (kind: ColumnKind) => void;
}) {
  const available = nested ? nestableColumnDefinitions : columnDefinitions;

  return (
    <select
      className="adm-input !w-auto !py-1 !text-xs"
      value={current}
      onChange={(event) => onPick(event.target.value as ColumnKind)}
      title="Change what this column contains"
    >
      {available.map((definition) => (
        <option key={definition.kind} value={definition.kind}>
          {definition.label}
        </option>
      ))}
    </select>
  );
}

function ColumnBody({
  spec,
  onChange,
  nested,
}: {
  spec: Values;
  onChange: (value: Values) => void;
  nested: boolean;
}) {
  const definition = columnDefinition((spec.kind as ColumnKind) ?? "prose");

  return (
    <Fields
      fields={definition.fields}
      value={spec}
      onChange={onChange}
      renderColumns={(field, value, update) => (
        <NestedColumns field={field} value={value} onChange={update} nested={nested} />
      )}
    />
  );
}

/** One column, collapsible, with a kind switcher. */
export function ColumnCard({
  spec,
  onChange,
  title,
  nested = false,
  bar,
  defaultOpen = false,
}: {
  spec: Values;
  onChange: (value: Values) => void;
  title: string;
  nested?: boolean;
  bar?: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const kind = (spec.kind as ColumnKind) ?? "prose";
  const definition = columnDefinition(kind);

  return (
    <div className="adm-panel overflow-hidden">
      <div
        className="flex flex-wrap items-center gap-2 border-b px-3 py-2"
        style={{ borderColor: "var(--a-line)" }}
      >
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <span aria-hidden className="adm-help !mt-0 w-3">
            {open ? "▾" : "▸"}
          </span>
          <span className="adm-label !text-[0.6875rem]">{title}</span>
          <span className="adm-help !mt-0 truncate">
            {describeColumn(spec as unknown as ColumnSpec)}
          </span>
        </button>

        <KindMenu
          current={kind}
          nested={nested}
          onPick={(next) => {
            if (next === kind) return;
            // Switching kind replaces the payload: the fields of one
            // kind mean nothing to another, and carrying them over
            // would fail validation on save.
            onChange(columnDefinition(next).create());
          }}
        />

        {bar}
      </div>

      {open ? (
        <div className="p-3">
          <p className="adm-help !mt-0 mb-3">{definition.description}</p>
          <ColumnBody spec={spec} onChange={onChange} nested={nested} />
        </div>
      ) : null}
    </div>
  );
}

/** The two columns of a `split`, or the list inside a `stack`/group. */
export function NestedColumns({
  field,
  value,
  onChange,
  nested = false,
}: {
  field: Field;
  value: Values;
  onChange: (value: Values) => void;
  nested?: boolean;
}) {
  const items = (Array.isArray(value[field.name]) ? value[field.name] : []) as Values[];
  const set = (next: Values[]) => onChange({ ...value, [field.name]: next });

  const replace = (index: number, next: Values) =>
    set(items.map((entry, position) => (position === index ? next : entry)));

  if (field.kind === "columnPair") {
    return (
      <div>
        <p className="adm-label mb-1.5">{field.label}</p>
        <div className="grid gap-3 lg:grid-cols-2">
          {[0, 1].map((index) => (
            <ColumnCard
              key={index}
              title={index === 0 ? "Left column" : "Right column"}
              spec={items[index] ?? columnDefinition("prose").create()}
              onChange={(next) => replace(index, next)}
              nested={nested}
              defaultOpen={index === 0}
              bar={
                <button
                  type="button"
                  className="adm-btn adm-btn-quiet"
                  title="Swap the two columns"
                  onClick={() => set([items[1], items[0]])}
                >
                  Swap
                </button>
              }
            />
          ))}
        </div>
      </div>
    );
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    set(next);
  };

  const max = field.kind === "columnList" ? field.max : undefined;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="adm-label">{field.label}</span>
        {max === undefined || items.length < max ? (
          <button
            type="button"
            className="adm-btn adm-btn-quiet"
            onClick={() => set([...items, columnDefinition("prose").create()])}
          >
            + Part
          </button>
        ) : null}
      </div>

      <div className={cn("space-y-2", items.length === 0 && "hidden")}>
        {items.map((item, index) => (
          <ColumnCard
            key={index}
            title={`Part ${index + 1}`}
            spec={item}
            onChange={(next) => replace(index, next)}
            nested
            bar={
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
                  onClick={() =>
                    set([...items.slice(0, index + 1), { ...item }, ...items.slice(index + 1)])
                  }
                  title="Duplicate"
                >
                  Copy
                </button>
                <button
                  type="button"
                  className="adm-btn adm-btn-quiet"
                  style={{ color: "var(--a-danger)" }}
                  onClick={() => set(items.filter((_, position) => position !== index))}
                  title="Remove"
                >
                  Remove
                </button>
              </div>
            }
          />
        ))}
      </div>

      {items.length === 0 ? (
        <button
          type="button"
          className="adm-btn adm-btn-ghost w-full"
          onClick={() => set([columnDefinition("prose").create()])}
        >
          + Add a part
        </button>
      ) : null}
    </div>
  );
}
