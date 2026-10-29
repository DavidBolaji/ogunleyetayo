"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Option } from "@/lib/admin/fields";

/** Label, control, help text — the shape every field shares. */
export function Labelled({
  label,
  help,
  htmlFor,
  children,
  action,
}: {
  label: string;
  help?: string;
  htmlFor?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label className="adm-label" htmlFor={htmlFor}>
          {label}
        </label>
        {action}
      </div>
      {children}
      {help ? <p className="adm-help">{help}</p> : null}
    </div>
  );
}

export function TextInput({
  label,
  help,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  help?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  const id = useId();

  return (
    <Labelled label={label} help={help} htmlFor={id}>
      <input
        id={id}
        type={type}
        className="adm-input"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </Labelled>
  );
}

export function TextAreaInput({
  label,
  help,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  help?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const id = useId();

  return (
    <Labelled label={label} help={help} htmlFor={id}>
      <textarea
        id={id}
        rows={rows}
        className="adm-input"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </Labelled>
  );
}

export function NumberInput({
  label,
  help,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  help?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  const id = useId();

  return (
    <Labelled label={label} help={help} htmlFor={id}>
      <input
        id={id}
        type="number"
        className="adm-input"
        value={Number.isFinite(value) ? value : ""}
        min={min}
        max={max}
        step={step ?? "any"}
        onChange={(event) => {
          const next = Number(event.target.value);
          onChange(Number.isFinite(next) ? next : 0);
        }}
      />
    </Labelled>
  );
}

export function ToggleInput({
  label,
  help,
  value,
  onChange,
}: {
  label: string;
  help?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-center gap-2.5">
        <input
          id={id}
          type="checkbox"
          checked={value}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 cursor-pointer accent-[var(--a-accent)]"
        />
        <span className="adm-label !normal-case !tracking-normal !text-[0.8125rem] !text-[var(--a-ink)]">
          {label}
        </span>
      </label>
      {help ? <p className="adm-help ml-6.5">{help}</p> : null}
    </div>
  );
}

export function SelectInput({
  label,
  help,
  value,
  onChange,
  options,
}: {
  label: string;
  help?: string;
  value: string | number;
  onChange: (value: string) => void;
  options: readonly Option[];
}) {
  const id = useId();

  return (
    <Labelled label={label} help={help} htmlFor={id}>
      <select
        id={id}
        className="adm-input"
        value={String(value ?? "")}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
    </Labelled>
  );
}

export function ColorInput({
  label,
  help,
  value,
  onChange,
}: {
  label: string;
  help?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const isHex = /^#[0-9a-fA-F]{3,8}$/.test(value);

  return (
    <Labelled label={label} help={help} htmlFor={id}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} colour picker`}
          value={isHex ? value : "#000000"}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 w-10 shrink-0 cursor-pointer rounded border"
          style={{ borderColor: "var(--a-line-strong)", background: "var(--a-panel)" }}
        />
        <input
          id={id}
          className="adm-input font-mono text-xs"
          value={value}
          placeholder="#000000"
          onChange={(event) => onChange(event.target.value)}
        />
        {value ? (
          <button
            type="button"
            className="adm-btn adm-btn-quiet"
            onClick={() => onChange("")}
            title="Clear"
          >
            Clear
          </button>
        ) : null}
      </div>
    </Labelled>
  );
}

/**
 * A list of plain strings.
 *
 * Edited as one line per item: a textarea is faster for a list of
 * short labels than a stack of inputs with add and remove buttons, and
 * reordering is a cut and paste.
 */
export function StringListInput({
  label,
  help,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  help?: string;
  value: readonly string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}) {
  const id = useId();

  return (
    <Labelled label={label} help={help ?? "One per line."} htmlFor={id}>
      <textarea
        id={id}
        rows={Math.min(Math.max(value.length + 1, 3), 14)}
        className="adm-input"
        placeholder={placeholder}
        value={value.join("\n")}
        onChange={(event) =>
          onChange(
            event.target.value
              .split("\n")
              .map((line) => line.trim())
              .filter((line, index, lines) => line !== "" || index < lines.length - 1),
          )
        }
      />
    </Labelled>
  );
}

/** A row of controls for an item inside a repeater. */
export function ItemBar({
  title,
  index,
  count,
  onMove,
  onRemove,
  onDuplicate,
  children,
}: {
  title: string;
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove: () => void;
  onDuplicate?: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 border-b px-3 py-2" style={{ borderColor: "var(--a-line)" }}>
      <span className="adm-label !text-[0.6875rem]">{title}</span>
      {children}
      <div className="ml-auto flex items-center gap-0.5">
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
        {onDuplicate ? (
          <button
            type="button"
            className="adm-btn adm-btn-quiet"
            onClick={onDuplicate}
            title="Duplicate"
          >
            Copy
          </button>
        ) : null}
        <button
          type="button"
          className={cn("adm-btn adm-btn-quiet")}
          style={{ color: "var(--a-danger)" }}
          onClick={onRemove}
          title="Remove"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
