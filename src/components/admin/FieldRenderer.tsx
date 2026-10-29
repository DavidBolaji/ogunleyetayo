"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { Field } from "@/lib/admin/fields";
import type { Action, Media, TypeStyle } from "@/content/types";
import { defaultType } from "@/lib/admin/fields";
import { ActionInput, emptyAction } from "./fields/ActionInput";
import { CollectionPicker } from "./fields/CollectionPicker";
import { MediaPicker } from "./fields/MediaPicker";
import { PalettePicker } from "./fields/PalettePicker";
import { RichTextInput } from "./fields/RichTextInput";
import { TypeInput } from "./fields/TypeInput";
import {
  ColorInput,
  ItemBar,
  Labelled,
  NumberInput,
  SelectInput,
  StringListInput,
  TextAreaInput,
  TextInput,
  ToggleInput,
} from "./fields/Inputs";

type Values = Record<string, unknown>;

interface FieldsProps {
  fields: readonly Field[];
  value: Values;
  onChange: (value: Values) => void;
  /** Renders a column editor; injected to avoid a circular import. */
  renderColumns?: (field: Field, value: Values, onChange: (value: Values) => void) => React.ReactNode;
}

/**
 * Renders a form from field descriptors.
 *
 * Every editor in the dashboard — blocks, columns, collection items,
 * settings, the theme — goes through this one component. That is what
 * makes the forms consistent without anyone maintaining a dozen of
 * them, and what makes "add a field" a one-line change.
 */
export function Fields({ fields, value, onChange, renderColumns }: FieldsProps) {
  const set = (name: string, next: unknown) => onChange({ ...value, [name]: next });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.name} className={field.half ? "sm:col-span-1" : "sm:col-span-2"}>
          <OneField
            field={field}
            value={value}
            set={set}
            onChange={onChange}
            renderColumns={renderColumns}
          />
        </div>
      ))}
    </div>
  );
}

function OneField({
  field,
  value,
  set,
  onChange,
  renderColumns,
}: {
  field: Field;
  value: Values;
  set: (name: string, next: unknown) => void;
  onChange: (value: Values) => void;
  renderColumns?: FieldsProps["renderColumns"];
}) {
  const current = value[field.name];

  switch (field.kind) {
    case "text":
      return field.rich ? (
        <Labelled label={field.label} help={field.help}>
          <RichTextInput
            value={asString(current)}
            onChange={(next) => set(field.name, next)}
            placeholder={field.placeholder}
            rows={1}
          />
        </Labelled>
      ) : (
        <TextInput
          label={field.label}
          help={field.help}
          placeholder={field.placeholder}
          value={asString(current)}
          onChange={(next) => set(field.name, next)}
        />
      );

    case "textarea":
      return field.rich ? (
        <Labelled label={field.label} help={field.help}>
          <RichTextInput
            value={asString(current)}
            onChange={(next) => set(field.name, next)}
            rows={field.rows}
          />
        </Labelled>
      ) : (
        <TextAreaInput
          label={field.label}
          help={field.help}
          rows={field.rows}
          value={asString(current)}
          onChange={(next) => set(field.name, next)}
        />
      );

    case "paragraphs":
      return (
        <ParagraphsInput
          label={field.label}
          help={field.help}
          value={asStringArray(current)}
          onChange={(next) => set(field.name, next)}
        />
      );

    case "strings":
      return (
        <StringListInput
          label={field.label}
          help={field.help}
          value={asStringArray(current)}
          onChange={(next) => set(field.name, next)}
        />
      );

    case "number":
      return (
        <NumberInput
          label={field.label}
          help={field.help}
          min={field.min}
          max={field.max}
          step={field.step}
          value={typeof current === "number" ? current : 0}
          onChange={(next) => set(field.name, next)}
        />
      );

    case "toggle":
      return (
        <ToggleInput
          label={field.label}
          help={field.help}
          value={current === true}
          onChange={(next) => set(field.name, next)}
        />
      );

    case "select":
      return (
        <SelectInput
          label={field.label}
          help={field.help}
          options={field.options}
          value={current === undefined || current === null ? "" : (current as string | number)}
          onChange={(next) =>
            set(field.name, field.numeric ? Number(next) : next === "" ? undefined : next)
          }
        />
      );

    case "color":
      return (
        <ColorInput
          label={field.label}
          help={field.help}
          value={asString(current)}
          onChange={(next) => set(field.name, next || undefined)}
        />
      );

    case "palette":
      return (
        <PalettePicker
          label={field.label}
          help={field.help}
          value={asString(current)}
          onChange={(next) => set(field.name, next || undefined)}
        />
      );

    case "media":
      return (
        <MediaPicker
          label={field.label}
          help={field.help}
          value={current as Media | undefined}
          onChange={(next) => set(field.name, next)}
          onClear={() => set(field.name, undefined)}
        />
      );

    case "mediaList":
      return (
        <MediaListInput
          label={field.label}
          help={field.help}
          max={field.max}
          value={(Array.isArray(current) ? current : []) as Media[]}
          onChange={(next) => set(field.name, next)}
        />
      );

    case "action":
      return (
        <ActionInput
          label={field.label}
          value={(current as Action) ?? emptyAction()}
          onChange={(next) => set(field.name, next)}
        />
      );

    case "actions":
      return (
        <ActionListInput
          label={field.label}
          max={field.max}
          value={(Array.isArray(current) ? current : []) as Action[]}
          onChange={(next) => set(field.name, next)}
        />
      );

    case "type":
      return (
        <TypeInput
          label={field.label}
          value={(current as TypeStyle) ?? defaultType}
          onChange={(next) => set(field.name, next)}
        />
      );

    case "collection":
      return (
        <CollectionPicker
          label={field.label}
          help={field.help}
          itemKind={field.itemKind}
          value={asString(current)}
          onChange={(next) => set(field.name, next || undefined)}
        />
      );

    case "colorTokens":
      return (
        <TokenInput
          label={field.label}
          help={field.help}
          value={(current as Record<string, string>) ?? {}}
          onChange={(next) => set(field.name, next)}
        />
      );

    case "list":
      return (
        <ListInput
          field={field}
          value={(Array.isArray(current) ? current : []) as Values[]}
          onChange={(next) => set(field.name, next)}
          renderColumns={renderColumns}
        />
      );

    case "group":
      return (
        <Section label={field.label} collapsible={field.collapsible}>
          <Fields
            fields={field.fields}
            value={(current as Values) ?? {}}
            onChange={(next) => set(field.name, next)}
            renderColumns={renderColumns}
          />
        </Section>
      );

    case "fieldset":
      return (
        <Section label={field.label} collapsible={field.collapsible}>
          <Fields
            fields={field.fields}
            value={value}
            onChange={onChange}
            renderColumns={renderColumns}
          />
        </Section>
      );

    case "columnPair":
    case "columnList":
      return <>{renderColumns?.(field, value, onChange) ?? null}</>;

    default:
      return null;
  }
}

/* ------------------------------------------------------------------ *
 * Composite inputs
 * ------------------------------------------------------------------ */

function Section({
  label,
  collapsible,
  children,
}: {
  label: string;
  collapsible?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(!collapsible);

  return (
    <div className="adm-sunken p-3">
      <button
        type="button"
        onClick={() => collapsible && setOpen((value) => !value)}
        className={cn("flex w-full items-center justify-between", collapsible && "cursor-pointer")}
      >
        <span className="adm-label">{label}</span>
        {collapsible ? (
          <span aria-hidden className="adm-help !mt-0">
            {open ? "Hide" : "Show"}
          </span>
        ) : null}
      </button>
      {open ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}

/** Paragraphs: formatted text, one editor per paragraph. */
function ParagraphsInput({
  label,
  help,
  value,
  onChange,
}: {
  label: string;
  help?: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const replace = (index: number, next: string) =>
    onChange(value.map((entry, position) => (position === index ? next : entry)));

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <Labelled
      label={label}
      help={help ?? "A line starting with ## becomes a sub-heading on article pages."}
      action={
        <button type="button" className="adm-btn adm-btn-quiet" onClick={() => onChange([...value, ""])}>
          + Paragraph
        </button>
      }
    >
      <div className="space-y-2">
        {value.map((paragraph, index) => (
          <div key={index} className="adm-panel overflow-hidden">
            <ItemBar
              title={`¶ ${index + 1}`}
              index={index}
              count={value.length}
              onMove={(to) => move(index, to)}
              onRemove={() => onChange(value.filter((_, position) => position !== index))}
            />
            <div className="p-2">
              <RichTextInput value={paragraph} onChange={(next) => replace(index, next)} rows={3} />
            </div>
          </div>
        ))}

        {value.length === 0 ? (
          <button
            type="button"
            className="adm-btn adm-btn-ghost w-full"
            onClick={() => onChange([""])}
          >
            + Add a paragraph
          </button>
        ) : null}
      </div>
    </Labelled>
  );
}

function MediaListInput({
  label,
  help,
  value,
  onChange,
  max,
}: {
  label: string;
  help?: string;
  value: Media[];
  onChange: (value: Media[]) => void;
  max?: number;
}) {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <Labelled
      label={label}
      help={help}
      action={
        max === undefined || value.length < max ? (
          <button
            type="button"
            className="adm-btn adm-btn-quiet"
            onClick={() => onChange([...value, { src: "", alt: "" }])}
          >
            + Image
          </button>
        ) : null
      }
    >
      <div className="space-y-2">
        {value.map((item, index) => (
          <div key={index} className="adm-panel overflow-hidden">
            <ItemBar
              title={`Image ${index + 1}`}
              index={index}
              count={value.length}
              onMove={(to) => move(index, to)}
              onRemove={() => onChange(value.filter((_, position) => position !== index))}
            />
            <div className="p-2">
              <MediaPicker
                label="Image"
                value={item}
                onChange={(next) =>
                  onChange(value.map((entry, position) => (position === index ? next : entry)))
                }
              />
            </div>
          </div>
        ))}

        {value.length === 0 ? (
          <button
            type="button"
            className="adm-btn adm-btn-ghost w-full"
            onClick={() => onChange([{ src: "", alt: "" }])}
          >
            + Add an image
          </button>
        ) : null}
      </div>
    </Labelled>
  );
}

function ActionListInput({
  label,
  value,
  onChange,
  max,
}: {
  label: string;
  value: Action[];
  onChange: (value: Action[]) => void;
  max?: number;
}) {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <Labelled
      label={label}
      help="The first button takes the block's primary treatment."
      action={
        max === undefined || value.length < max ? (
          <button
            type="button"
            className="adm-btn adm-btn-quiet"
            onClick={() => onChange([...value, emptyAction()])}
          >
            + Button
          </button>
        ) : null
      }
    >
      <div className="space-y-2">
        {value.map((action, index) => (
          <div key={index} className="adm-panel overflow-hidden">
            <ItemBar
              title={action.label || `Button ${index + 1}`}
              index={index}
              count={value.length}
              onMove={(to) => move(index, to)}
              onRemove={() => onChange(value.filter((_, position) => position !== index))}
              onDuplicate={() => onChange([...value.slice(0, index + 1), { ...action }, ...value.slice(index + 1)])}
            />
            <div className="p-2">
              <ActionInput
                label="Button"
                value={action}
                onChange={(next) =>
                  onChange(value.map((entry, position) => (position === index ? next : entry)))
                }
              />
            </div>
          </div>
        ))}
      </div>
    </Labelled>
  );
}

function ListInput({
  field,
  value,
  onChange,
  renderColumns,
}: {
  field: Extract<Field, { kind: "list" }>;
  value: Values[];
  onChange: (value: Values[]) => void;
  renderColumns?: FieldsProps["renderColumns"];
}) {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const label = (item: Values, index: number): string => {
    const candidate = item.title ?? item.label ?? item.name ?? item.value;
    return typeof candidate === "string" && candidate.trim()
      ? candidate
      : `${field.itemLabel} ${index + 1}`;
  };

  return (
    <Labelled
      label={field.label}
      help={field.help}
      action={
        field.max === undefined || value.length < field.max ? (
          <button
            type="button"
            className="adm-btn adm-btn-quiet"
            onClick={() => onChange([...value, { ...(field.defaults ?? {}) }])}
          >
            + {field.itemLabel}
          </button>
        ) : null
      }
    >
      <div className="space-y-2">
        {value.map((item, index) => (
          <div key={index} className="adm-panel overflow-hidden">
            <ItemBar
              title={label(item, index)}
              index={index}
              count={value.length}
              onMove={(to) => move(index, to)}
              onRemove={() => onChange(value.filter((_, position) => position !== index))}
              onDuplicate={() =>
                onChange([...value.slice(0, index + 1), { ...item }, ...value.slice(index + 1)])
              }
            />
            <div className="p-3">
              <Fields
                fields={field.fields}
                value={item}
                onChange={(next) =>
                  onChange(value.map((entry, position) => (position === index ? next : entry)))
                }
                renderColumns={renderColumns}
              />
            </div>
          </div>
        ))}

        {value.length === 0 ? (
          <button
            type="button"
            className="adm-btn adm-btn-ghost w-full"
            onClick={() => onChange([{ ...(field.defaults ?? {}) }])}
          >
            + Add {field.itemLabel.toLowerCase()}
          </button>
        ) : null}
      </div>
    </Labelled>
  );
}

/** Free-form colour tokens — used by the palette editor. */
function TokenInput({
  label,
  help,
  value,
  onChange,
}: {
  label: string;
  help?: string;
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}) {
  return (
    <Labelled label={label} help={help}>
      <div className="grid gap-3 sm:grid-cols-2">
        {Object.entries(value).map(([token, colour]) => (
          <ColorInput
            key={token}
            label={token}
            value={colour}
            onChange={(next) => onChange({ ...value, [token]: next })}
          />
        ))}
      </div>
    </Labelled>
  );
}

const asString = (value: unknown): string => (typeof value === "string" ? value : "");

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
