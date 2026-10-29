import { f, options, type Field } from "./fields";
import type { ColumnKind, ColumnSpec } from "@/content/types";

/**
 * The column catalogue.
 *
 * One entry per column kind: what to call it, what a new one contains,
 * and the fields that edit it. The renderer and the dashboard read the
 * same catalogue, so a column kind cannot exist in one and not the
 * other.
 */
export interface ColumnDefinition {
  readonly kind: ColumnKind;
  readonly label: string;
  readonly description: string;
  readonly fields: readonly Field[];
  readonly create: () => Record<string, unknown>;
}

const typeStyle = (
  min: number,
  vw: number,
  max: number,
  leading = 1.05,
  extra: Record<string, unknown> = {},
) => ({ min, vw, max, leading, tracking: "", case: "normal", italic: false, ...extra });

const definitions: ColumnDefinition[] = [
  {
    kind: "prose",
    label: "Text",
    description: "Eyebrow, heading, paragraphs, a pull-quote and buttons.",
    create: () => ({
      kind: "prose",
      title: "A new heading",
      titleType: typeStyle(1.875, 4.2, 3.25),
      paragraphs: [],
      actions: [],
      chips: [],
    }),
    fields: [
      f.text("eyebrow", "Eyebrow", { placeholder: "Small label above the heading" }),
      f.rich("title", "Heading", { rows: 2, help: "Use Shift+Enter for a line break." }),
      f.type("titleType", "Heading type"),
      f.select("titleTag", "Heading level", [
        { value: "h2", label: "Heading (h2) — normal" },
        { value: "h3", label: "Sub-heading (h3)" },
        { value: "h1", label: "Page heading (h1) — one per page" },
        { value: "p", label: "Statement — display type, not a heading" },
      ]),
      f.rich("note", "Accent line", {
        rows: 2,
        help: "Display type under the heading — a theme, a promise.",
      }),
      f.type("noteType", "Accent line type"),
      f.select("noteMaxWidth", "Accent line measure", options.maxWidth),
      f.rich("lede", "Standfirst", { rows: 3 }),
      f.select("ledeSize", "Standfirst size", [
        { value: "", label: "Match body" },
        ...options.bodySize,
      ]),
      f.select("ledeMaxWidth", "Standfirst measure", options.maxWidth),
      f.paragraphs("paragraphs", "Paragraphs"),
      f.select("bodySize", "Body size", options.bodySize),
      f.select("bodyTone", "Body contrast", [
        { value: "body", label: "Normal" },
        { value: "muted", label: "Muted" },
        { value: "strong", label: "Strong" },
      ]),
      f.group("quote", "Pull-quote", [
        f.rich("text", "Quote", { rows: 3 }),
        f.text("caption", "Caption"),
        f.type("type", "Quote type"),
        f.select("style", "Treatment", [
          { value: "rule", label: "Accent rule on the left" },
          { value: "plain", label: "No rule" },
        ]),
        f.select("face", "Typeface", [
          { value: "display", label: "Display" },
          { value: "sans", label: "Body" },
        ]),
        f.select("tone", "Colour", [
          { value: "heading", label: "Heading" },
          { value: "accent", label: "Accent" },
          { value: "body", label: "Body" },
        ]),
        f.toggle("quoted", "Wrap in quotation marks"),
      ], true),
      f.strings("chips", "Pill list"),
      f.text("chipsLabel", "Pill list label"),
      f.actions("actions", "Buttons", 6),
      f.select("align", "Alignment", [{ value: "", label: "Inherit" }, ...options.align]),
      f.select("maxWidth", "Column measure", options.maxWidth),
      f.select("offsetTop", "Optical top offset", [
        { value: "none", label: "None" },
        { value: "sm", label: "Small" },
        { value: "md", label: "Medium" },
      ]),
    ],
  },
  {
    kind: "media",
    label: "Image",
    description: "One photograph, a pair, or a stack.",
    create: () => ({ kind: "media", items: [{ src: "", alt: "" }], ratio: "portrait" }),
    fields: [
      f.mediaList("items", "Images", 4),
      f.select("layout", "Layout", [
        { value: "single", label: "Single frame" },
        { value: "offsetPair", label: "Offset pair — small frame breaking the corner" },
        { value: "stack", label: "Stacked" },
      ]),
      f.select("ratio", "Shape", options.ratio),
      f.text("aspect", "Exact ratio", {
        half: true,
        placeholder: "4/5",
        help: "Overrides the shape. Width/height, e.g. 4/5.",
      }),
      f.select("scrim", "Darkening overlay", [
        { value: "none", label: "None" },
        { value: "soft", label: "Soft" },
        { value: "strong", label: "Strong" },
      ]),
      f.text("caption", "Caption"),
      f.select("reveal", "Entrance", options.reveal),
      f.select("gapTop", "Space above", options.space),
      f.toggle("parallax", "Drift slightly on scroll"),
      f.toggle("priority", "Load immediately", "For an image above the fold."),
      f.toggle("hideOnMobile", "Hide on small screens"),
      f.text("sizes", "Image sizes hint", { help: "Advanced. Leave blank unless tuning." }),
    ],
  },
  {
    kind: "pillars",
    label: "Idea grid",
    description: "A grid of short titled ideas on hairline dividers.",
    create: () => ({ kind: "pillars", items: [{ title: "" }], columns: 4 }),
    fields: [
      f.paragraphs("intro", "Intro paragraphs"),
      f.list("items", "Cells", "Cell", [
        f.text("title", "Title"),
        f.rich("body", "Body", { rows: 2 }),
        f.text("label", "Counter override", { half: true, placeholder: "01" }),
      ]),
      f.select("columns", "Columns", options.columns, { numeric: true }),
      f.select("cellTone", "Cell background", [
        { value: "inherit", label: "Match the section" },
        ...options.tone.filter((option) => option.value !== "none"),
      ]),
      f.toggle("numbered", "Number the cells"),
      f.toggle("selfStart", "Align to the top of the row"),
    ],
  },
  {
    kind: "stats",
    label: "Statistics",
    description: "Large numerals with captions.",
    create: () => ({ kind: "stats", items: [{ value: "", label: "" }], columns: 3 }),
    fields: [
      f.list("items", "Figures", "Figure", [
        f.text("value", "Figure", { half: true }),
        f.text("label", "Caption"),
      ]),
      f.select("columns", "Columns", options.columns, { numeric: true }),
      f.type("valueType", "Numeral type"),
      f.toggle("framed", "Draw a frame"),
      f.toggle("selfStart", "Align to the top of the row"),
    ],
  },
  {
    kind: "chips",
    label: "Pill list",
    description: "Hairline pills — audiences, categories, who it is for.",
    create: () => ({ kind: "chips", items: [] }),
    fields: [
      f.text("label", "Label"),
      f.strings("items", "Pills"),
      f.select("size", "Size", [
        { value: "sm", label: "Small" },
        { value: "md", label: "Medium" },
      ]),
      f.select("variant", "Treatment", [
        { value: "outline", label: "Outline" },
        { value: "filled", label: "Filled" },
      ]),
      f.toggle("interactive", "Highlight on hover"),
    ],
  },
  {
    kind: "years",
    label: "Years",
    description: "A row of display numerals — the editions of a gathering.",
    create: () => ({ kind: "years", items: [] }),
    fields: [
      f.text("label", "Label"),
      f.strings("items", "Years"),
      f.type("type", "Numeral type"),
      f.toggle("dividerTop", "Rule above"),
    ],
  },
  {
    kind: "indexList",
    label: "Numbered ledger",
    description: "Numbered rows of display type on hairlines.",
    create: () => ({ kind: "indexList", items: [{ title: "" }] }),
    fields: [
      f.list("items", "Rows", "Row", [
        f.rich("title", "Row"),
        f.rich("body", "Note", { rows: 2 }),
      ]),
      f.type("type", "Row type"),
      f.toggle("numbered", "Number the rows"),
      f.action("action", "Button below"),
    ],
  },
  {
    kind: "embeds",
    label: "Video / audio",
    description: "YouTube, Vimeo or Spotify embeds, with marked slots for the rest.",
    create: () => ({ kind: "embeds", items: [{ label: "", url: "" }], columns: 2 }),
    fields: [
      f.list("items", "Embeds", "Embed", [
        f.text("label", "Label", { help: "Shown when no address is set yet." }),
        f.text("url", "Address", { placeholder: "https://youtube.com/watch?v=…" }),
      ]),
      f.select("columns", "Columns", options.columns.slice(0, 2), { numeric: true }),
    ],
  },
  {
    kind: "newsletter",
    label: "Newsletter form",
    description: "The email sign-up.",
    create: () => ({ kind: "newsletter" }),
    fields: [
      f.rich("note", "Note above the form", { rows: 2 }),
      f.select("tone", "Treatment", [
        { value: "light", label: "Light" },
        { value: "deep", label: "On a dark ground" },
      ]),
      f.select("maxWidth", "Measure", options.maxWidth.slice(0, 4)),
    ],
  },
  {
    kind: "enquiryForm",
    label: "Enquiry form",
    description: "The contact or speaking-request form.",
    create: () => ({ kind: "enquiryForm", intent: "general" }),
    fields: [
      f.select("intent", "Form", [
        { value: "general", label: "General enquiry" },
        { value: "speaking", label: "Speaking request" },
      ]),
      f.collection("eventTypesCollection", "Event type options", "tag", "Speaking form only."),
      f.toggle("framed", "Draw a frame around it"),
      f.select("frameTone", "Frame background", [
        { value: "canvas", label: "Canvas" },
        { value: "surface", label: "Surface" },
      ]),
    ],
  },
  {
    kind: "contactDetails",
    label: "Contact details",
    description: "A definition list of ways to reach you.",
    create: () => ({ kind: "contactDetails", items: [] }),
    fields: [
      f.list("items", "Details", "Detail", [
        f.text("label", "Label", { half: true }),
        f.text("value", "Value", { help: "Tokens such as {site.email} resolve from Settings." }),
        f.text("href", "Links to"),
      ]),
      f.text("socialsLabel", "Socials label", { help: "Leave blank to hide the social links." }),
    ],
  },
  {
    kind: "gallery",
    label: "Photo grid",
    description: "A masonry-ish grid of photographs.",
    create: () => ({ kind: "gallery", items: [] }),
    fields: [
      f.mediaList("items", "Photographs"),
      f.select("ratio", "Shape", [{ value: "", label: "Alternate automatically" }, ...options.ratio]),
    ],
  },
  {
    kind: "spacer",
    label: "Space",
    description: "Vertical breathing room.",
    create: () => ({ kind: "spacer", height: "md" }),
    fields: [f.select("height", "Height", options.space)],
  },
  {
    kind: "group",
    label: "Group",
    description: "Two or more columns nested inside one — a heading above a grid, say.",
    create: () => ({ kind: "group", layout: "stack", items: [] }),
    fields: [
      f.select("layout", "Arrangement", [
        { value: "stack", label: "Stacked" },
        { value: "split", label: "Side by side" },
      ]),
      f.text("ratio", "Split ratio", { half: true, placeholder: "1/1" }),
      f.select("gap", "Gap", [
        { value: "none", label: "None" },
        { value: "sm", label: "Small" },
        { value: "md", label: "Medium" },
        { value: "lg", label: "Large" },
        { value: "xl", label: "Extra large" },
      ]),
      f.select("verticalAlign", "Vertical alignment", [
        { value: "start", label: "Top" },
        { value: "center", label: "Middle" },
        { value: "end", label: "Bottom" },
      ]),
      f.select("breakpoint", "Splits from", [
        { value: "sm", label: "Small screens up" },
        { value: "lg", label: "Large screens up" },
      ]),
      { kind: "columnList", name: "items", label: "Columns", max: 6 },
    ],
  },
];

export const columnDefinitions: readonly ColumnDefinition[] = definitions;

const byKind = new Map(definitions.map((definition) => [definition.kind, definition]));

export const columnDefinition = (kind: ColumnKind): ColumnDefinition =>
  byKind.get(kind) ?? definitions[0];

/** Kinds offered inside a group — a group may not contain a group. */
export const nestableColumnDefinitions = definitions.filter(
  (definition) => definition.kind !== "group",
);

/** A one-line summary of a column, for collapsed rows in the editor. */
export function describeColumn(spec: ColumnSpec): string {
  switch (spec.kind) {
    case "prose":
      return spec.title || spec.eyebrow || spec.lede || "Text";
    case "media":
      return spec.items[0]?.alt || spec.items[0]?.src || "Image";
    case "pillars":
      return `${spec.items.length} cell${spec.items.length === 1 ? "" : "s"}`;
    case "stats":
      return `${spec.items.length} figure${spec.items.length === 1 ? "" : "s"}`;
    case "chips":
      return spec.label || `${spec.items.length} pills`;
    case "years":
      return spec.items.join(" · ") || "Years";
    case "indexList":
      return `${spec.items.length} row${spec.items.length === 1 ? "" : "s"}`;
    case "embeds":
      return `${spec.items.length} embed${spec.items.length === 1 ? "" : "s"}`;
    case "gallery":
      return `${spec.items.length} photograph${spec.items.length === 1 ? "" : "s"}`;
    case "enquiryForm":
      return spec.intent === "speaking" ? "Speaking request form" : "Enquiry form";
    case "contactDetails":
      return `${spec.items.length} detail${spec.items.length === 1 ? "" : "s"}`;
    case "group":
      return `${spec.items.length} nested column${spec.items.length === 1 ? "" : "s"}`;
    default:
      return columnDefinition(spec.kind).label;
  }
}
