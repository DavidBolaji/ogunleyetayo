import type { CollectionKind, TypeStyle } from "@/content/types";

/**
 * Field descriptors.
 *
 * The dashboard has no hand-written forms. Each block type, column
 * kind and collection kind declares the shape of its editor here, and
 * one renderer turns that into inputs. Adding a field to a block is a
 * line in a descriptor, not a new form — which is the only way a
 * catalogue this size stays consistent and stays correct.
 */

export interface Option {
  readonly value: string | number;
  readonly label: string;
}

interface Base {
  /** Key within the object being edited. Dots are not used; nest with `group`. */
  readonly name: string;
  readonly label: string;
  readonly help?: string;
  /** Lays the field out beside its neighbour on wide screens. */
  readonly half?: boolean;
}

export type Field =
  | (Base & { kind: "text"; placeholder?: string; rich?: boolean })
  | (Base & { kind: "textarea"; rows?: number; rich?: boolean })
  | (Base & { kind: "paragraphs"; itemLabel?: string })
  | (Base & { kind: "strings"; placeholder?: string })
  | (Base & { kind: "number"; min?: number; max?: number; step?: number })
  | (Base & { kind: "toggle" })
  | (Base & { kind: "select"; options: readonly Option[]; numeric?: boolean })
  | (Base & { kind: "palette" })
  | (Base & { kind: "color" })
  | (Base & { kind: "colorTokens" })
  | (Base & { kind: "media" })
  | (Base & { kind: "mediaList"; max?: number })
  | (Base & { kind: "action" })
  | (Base & { kind: "actions"; max?: number })
  | (Base & { kind: "type" })
  | (Base & { kind: "collection"; itemKind: CollectionKind })
  | (Base & { kind: "list"; itemLabel: string; fields: readonly Field[]; max?: number; defaults?: Record<string, unknown> })
  | (Base & { kind: "group"; fields: readonly Field[]; collapsible?: boolean })
  /** Groups fields visually without nesting them under a key. */
  | (Base & { kind: "fieldset"; fields: readonly Field[]; collapsible?: boolean })
  | (Base & { kind: "columnPair" })
  | (Base & { kind: "columnList"; max?: number });

/** Shorthands, so the descriptor tables below read as tables. */
export const f = {
  text: (name: string, label: string, extra: Partial<Extract<Field, { kind: "text" }>> = {}): Field => ({
    kind: "text",
    name,
    label,
    ...extra,
  }),
  rich: (name: string, label: string, extra: Partial<Extract<Field, { kind: "textarea" }>> = {}): Field => ({
    kind: "textarea",
    name,
    label,
    rich: true,
    rows: 3,
    ...extra,
  }),
  area: (name: string, label: string, extra: Partial<Extract<Field, { kind: "textarea" }>> = {}): Field => ({
    kind: "textarea",
    name,
    label,
    rows: 4,
    ...extra,
  }),
  paragraphs: (name: string, label: string, help?: string): Field => ({
    kind: "paragraphs",
    name,
    label,
    help,
  }),
  strings: (name: string, label: string, help?: string): Field => ({
    kind: "strings",
    name,
    label,
    help,
  }),
  number: (name: string, label: string, extra: Partial<Extract<Field, { kind: "number" }>> = {}): Field => ({
    kind: "number",
    name,
    label,
    half: true,
    ...extra,
  }),
  toggle: (name: string, label: string, help?: string): Field => ({
    kind: "toggle",
    name,
    label,
    help,
  }),
  select: (name: string, label: string, options: readonly Option[], extra: Partial<Extract<Field, { kind: "select" }>> = {}): Field => ({
    kind: "select",
    name,
    label,
    options,
    half: true,
    ...extra,
  }),
  color: (name: string, label: string, help?: string): Field => ({
    kind: "color",
    name,
    label,
    help,
    half: true,
  }),
  media: (name: string, label: string, help?: string): Field => ({
    kind: "media",
    name,
    label,
    help,
  }),
  mediaList: (name: string, label: string, max?: number): Field => ({
    kind: "mediaList",
    name,
    label,
    max,
  }),
  action: (name: string, label: string): Field => ({ kind: "action", name, label }),
  actions: (name: string, label: string, max?: number): Field => ({
    kind: "actions",
    name,
    label,
    max,
  }),
  type: (name: string, label: string): Field => ({ kind: "type", name, label }),
  collection: (name: string, label: string, itemKind: CollectionKind, help?: string): Field => ({
    kind: "collection",
    name,
    label,
    itemKind,
    help,
  }),
  list: (
    name: string,
    label: string,
    itemLabel: string,
    fields: readonly Field[],
    extra: { max?: number; help?: string; defaults?: Record<string, unknown> } = {},
  ): Field => ({ kind: "list", name, label, itemLabel, fields, ...extra }),
  group: (name: string, label: string, fields: readonly Field[], collapsible = false): Field => ({
    kind: "group",
    name,
    label,
    fields,
    collapsible,
  }),
  fieldset: (label: string, fields: readonly Field[], collapsible = false): Field => ({
    kind: "fieldset",
    name: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    label,
    fields,
    collapsible,
  }),
} as const;

/** Options reused across descriptors. */
export const options = {
  tone: [
    { value: "canvas", label: "Canvas — page background" },
    { value: "surface", label: "Surface — raised white" },
    { value: "sand", label: "Sand — warm band" },
    { value: "deep", label: "Deep — dark section" },
    { value: "none", label: "None — transparent" },
  ],
  size: [
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
  ],
  space: [
    { value: "none", label: "None" },
    { value: "xs", label: "Extra small" },
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
    { value: "xl", label: "Extra large" },
  ],
  width: [
    { value: "narrow", label: "Narrow" },
    { value: "default", label: "Default" },
    { value: "wide", label: "Wide" },
    { value: "full", label: "Full bleed" },
  ],
  align: [
    { value: "left", label: "Left" },
    { value: "center", label: "Centre" },
    { value: "right", label: "Right" },
  ],
  bodySize: [
    { value: "xs", label: "Extra small" },
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
    { value: "xl", label: "Extra large" },
    { value: "2xl", label: "2XL" },
    { value: "3xl", label: "3XL" },
    { value: "display", label: "Display" },
  ],
  maxWidth: [
    { value: "none", label: "Full column" },
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
    { value: "xl", label: "Extra large" },
    { value: "2xl", label: "2XL" },
    { value: "3xl", label: "3XL" },
  ],
  ratio: [
    { value: "portrait", label: "Portrait 3:4" },
    { value: "tall", label: "Tall 4:6" },
    { value: "square", label: "Square" },
    { value: "wide", label: "Wide 4:3" },
    { value: "cinema", label: "Cinema 16:10" },
    { value: "auto", label: "Auto" },
  ],
  columns: [
    { value: 1, label: "1 column" },
    { value: 2, label: "2 columns" },
    { value: 3, label: "3 columns" },
    { value: 4, label: "4 columns" },
  ],
  variant: [
    { value: "", label: "Block default" },
    { value: "solid", label: "Solid" },
    { value: "outline", label: "Outline" },
    { value: "outlineLight", label: "Outline (on dark)" },
    { value: "accent", label: "Accent" },
    { value: "ghost", label: "Ghost" },
    { value: "link", label: "Text link" },
  ],
  actionSize: [
    { value: "", label: "Block default" },
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
  ],
  reveal: [
    { value: "up", label: "Up" },
    { value: "down", label: "Down" },
    { value: "left", label: "From left" },
    { value: "right", label: "From right" },
    { value: "none", label: "Fade only" },
  ],
} as const;

/** The default type style a new field starts from. */
export const defaultType: TypeStyle = {
  min: 1.875,
  vw: 4.2,
  max: 3.25,
  leading: 1.05,
  tracking: "",
  case: "normal",
  italic: false,
};
