import { f, options, type Field } from "./fields";
import { columnDefinition } from "./columns";
import type { Block, BlockType } from "@/content/types";

/**
 * The block catalogue.
 *
 * Each entry says what a block is called, what it is for, what a new
 * one contains and how it is edited. The "Add block" menu, every block
 * form and the summary shown in a collapsed row all read from here, so
 * adding a block type to the dashboard is one entry rather than a new
 * screen.
 */
export interface BlockDefinition {
  readonly type: BlockType;
  readonly label: string;
  readonly description: string;
  /** Groups the block in the "Add block" menu. */
  readonly group: "Openers" | "Layout" | "Collections" | "Features" | "Closers";
  readonly fields: readonly Field[];
  readonly create: () => { data: Record<string, unknown>; style?: Record<string, unknown> };
}

const type = (
  min: number,
  vw: number,
  max: number,
  leading: number,
  extra: Record<string, unknown> = {},
) => ({ min, vw, max, leading, tracking: "", case: "normal", italic: false, ...extra });

/** The optional opening heading every collection block shares. */
const headingFields: readonly Field[] = [
  f.text("eyebrow", "Eyebrow"),
  f.rich("title", "Heading", { rows: 2 }),
  f.rich("lede", "Standfirst", { rows: 3 }),
  f.select("align", "Alignment", options.align),
  f.select("size", "Heading size", [
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
  ]),
  f.select("gap", "Space below", options.space),
];

const heading = () => f.group("heading", "Opening heading", headingFields, true);

const emptyHeading = { align: "left", size: "md", gap: "lg" };

const definitions: BlockDefinition[] = [
  {
    type: "hero",
    label: "Home masthead",
    group: "Openers",
    description: "The full-width opening: headline words, a portrait running off the edge.",
    create: () => ({
      data: {
        headlineWords: ["Faith.", "Creativity.", "Impact."],
        accentWordIndex: 1,
        actions: [],
        media: { src: "", alt: "" },
        titleType: type(2.75, 7.6, 6.5, 0.86, { tracking: "-0.03em", case: "upper" }),
      },
    }),
    fields: [
      f.text("eyebrow", "Eyebrow"),
      f.strings("headlineWords", "Headline words", "One word or phrase per line."),
      f.number("accentWordIndex", "Accent word", { min: -1, max: 5, step: 1 }),
      f.text("headlineLabel", "Accessible heading", {
        help: "The real h1, read by screen readers and search engines.",
      }),
      f.type("titleType", "Headline type"),
      f.rich("support", "Supporting line", { rows: 2 }),
      f.actions("actions", "Buttons", 4),
      f.media("media", "Portrait"),
      f.group("badge", "Corner badge", [f.text("label", "Label"), f.rich("text", "Text", { rows: 2 })], true),
    ],
  },
  {
    type: "pageHero",
    label: "Page opener",
    group: "Openers",
    description: "The opening block of an inner page.",
    create: () => ({
      data: {
        eyebrow: "Eyebrow",
        title: "Page title",
        tone: "canvas",
        actions: [],
        titleType: type(2.5, 7, 5.5, 0.92, { tracking: "-0.03em", case: "upper" }),
      },
    }),
    fields: [
      f.text("eyebrow", "Eyebrow"),
      f.rich("title", "Title", { rows: 2 }),
      f.type("titleType", "Title type"),
      f.rich("lede", "Standfirst", { rows: 3 }),
      f.rich("note", "Accent line", { rows: 2 }),
      f.select("tone", "Background", [
        { value: "canvas", label: "Canvas — light" },
        { value: "deep", label: "Deep — dark" },
      ]),
      f.media("media", "Photograph"),
      f.actions("actions", "Buttons", 5),
    ],
  },
  {
    type: "marquee",
    label: "Scrolling band",
    group: "Features",
    description: "A continuous band of display type between sections.",
    create: () => ({
      data: {
        items: ["Faith", "Formation", "Creativity", "Impact"],
        separator: "→",
        duration: 32,
        type: type(1.75, 4.5, 3.25, 1, { tracking: "-0.01em", case: "upper" }),
      },
      style: {
        tone: "sand",
        width: "full",
        grain: true,
        borderTop: true,
        borderBottom: true,
        paddingTop: "xs",
        paddingBottom: "xs",
      },
    }),
    fields: [
      f.strings("items", "Words"),
      f.text("separator", "Separator", { half: true, placeholder: "→" }),
      f.number("duration", "Seconds per pass", { min: 8, max: 120, step: 1 }),
      f.type("type", "Type"),
    ],
  },
  {
    type: "split",
    label: "Two columns",
    group: "Layout",
    description: "Anything beside anything — copy and a portrait, a heading and a grid.",
    create: () => ({
      data: {
        ratio: "1/1",
        gap: "lg",
        columns: [columnDefinition("prose").create(), columnDefinition("media").create()],
      },
    }),
    fields: [
      { kind: "columnPair", name: "columns", label: "Columns" },
      f.text("ratio", "Column ratio", {
        half: true,
        placeholder: "1/1",
        help: "Left/right, e.g. 1.1/0.9.",
      }),
      f.select("gap", "Gap", [
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
      f.toggle("reverseOnMobile", "Right column first on small screens"),
      f.toggle("reverseOnDesktop", "Swap the columns on wide screens"),
    ],
  },
  {
    type: "stack",
    label: "Single column",
    group: "Layout",
    description: "One column of parts — a heading above a grid, a centred statement.",
    create: () => ({ data: { items: [columnDefinition("prose").create()], gap: "md" } }),
    fields: [
      { kind: "columnList", name: "items", label: "Parts", max: 8 },
      f.select("maxWidth", "Measure", options.maxWidth),
      f.select("gap", "Gap between parts", [
        { value: "none", label: "None" },
        { value: "sm", label: "Small" },
        { value: "md", label: "Medium" },
        { value: "lg", label: "Large" },
        { value: "xl", label: "Extra large" },
      ]),
      f.toggle("centered", "Centre the column"),
    ],
  },
  {
    type: "expressionIndex",
    label: "Expression index",
    group: "Collections",
    description: "The numbered ledger with a preview that swaps as you move down it.",
    create: () => ({
      data: { collection: "expressions", heading: emptyHeading },
      style: { tone: "surface", size: "lg", width: "wide" },
    }),
    fields: [f.collection("collection", "Collection", "expression"), heading()],
  },
  {
    type: "programmeList",
    label: "Programme rows",
    group: "Collections",
    description: "Alternating editorial rows with a photograph each.",
    create: () => ({
      data: { collection: "", heading: emptyHeading },
      style: { tone: "canvas", size: "lg", width: "wide" },
    }),
    fields: [f.collection("collection", "Collection", "programme"), heading()],
  },
  {
    type: "bookShelf",
    label: "Bookshelf",
    group: "Collections",
    description: "Books with covers and descriptions.",
    create: () => ({
      data: { collection: "books", heading: emptyHeading },
      style: { tone: "canvas", size: "lg", width: "wide" },
    }),
    fields: [f.collection("collection", "Collection", "book"), heading()],
  },
  {
    type: "releaseGrid",
    label: "Release grid",
    group: "Collections",
    description: "Square cards for releases, sessions and projects.",
    create: () => ({
      data: { collection: "releases", columns: 4, heading: emptyHeading },
      style: { tone: "canvas", size: "lg", width: "wide" },
    }),
    fields: [
      f.collection("collection", "Collection", "release"),
      f.select("columns", "Columns", options.columns.slice(1), { numeric: true }),
      heading(),
    ],
  },
  {
    type: "postGrid",
    label: "Blog index",
    group: "Collections",
    description: "Published posts, newest first, with an empty state.",
    create: () => ({
      data: { collection: "posts", columns: 3, heading: emptyHeading, emptyNewsletter: true },
      style: { tone: "canvas", size: "lg", width: "wide" },
    }),
    fields: [
      f.collection("collection", "Collection", "post"),
      f.select("columns", "Columns", options.columns.slice(1, 3), { numeric: true }),
      f.number("limit", "Maximum shown", { min: 0, max: 60, step: 1, help: "0 shows all." }),
      heading(),
      f.fieldset(
        "When there are no posts yet",
        [
          f.rich("emptyHeadline", "Headline", { rows: 2 }),
          f.rich("emptyNote", "Note above the form", { rows: 2 }),
          f.collection("emptyCategoriesCollection", "Categories to show", "tag"),
          f.toggle("emptyNewsletter", "Show the newsletter form"),
        ],
        true,
      ),
    ],
  },
  {
    type: "timeline",
    label: "Timeline",
    group: "Collections",
    description: "A dated vertical story.",
    create: () => ({
      data: { collection: "timeline", heading: emptyHeading },
      style: { tone: "surface", size: "lg", width: "default" },
    }),
    fields: [f.collection("collection", "Collection", "timeline"), heading()],
  },
  {
    type: "gallery",
    label: "Photo grid",
    group: "Features",
    description: "A grid of photographs with its own heading.",
    create: () => ({
      data: { items: [], heading: emptyHeading },
      style: { tone: "canvas", size: "lg", width: "wide" },
    }),
    fields: [
      f.mediaList("items", "Photographs"),
      f.select("ratio", "Shape", [
        { value: "", label: "Alternate automatically" },
        ...options.ratio,
      ]),
      heading(),
    ],
  },
  {
    type: "featuredRelease",
    label: "Featured project",
    group: "Features",
    description: "A project on the full stage, in the largest type on the site.",
    create: () => ({
      data: {
        eyebrow: "Featured project",
        title: "Project",
        facts: [],
        actions: [],
        media: { src: "", alt: "" },
        titleType: type(3.5, 12, 9, 0.82, { tracking: "-0.04em", case: "upper" }),
      },
    }),
    fields: [
      f.text("eyebrow", "Eyebrow"),
      f.text("title", "Title"),
      f.type("titleType", "Title type"),
      f.text("meaning", "Subtitle", { help: "A translation, or what the title means." }),
      f.rich("quote", "Quotation", { rows: 2 }),
      f.rich("description", "Description", { rows: 4 }),
      f.toggle("showDescription", "Show the description"),
      f.list("facts", "Facts", "Fact", [
        f.text("label", "Label", { half: true }),
        f.text("value", "Value"),
        f.toggle("accent", "Accent colour"),
      ], { max: 4 }),
      f.actions("actions", "Buttons", 4),
      f.media("media", "Photograph"),
    ],
  },
  {
    type: "recognitionStrip",
    label: "Recognition",
    group: "Features",
    description: "Awards and qualifications, noted briefly.",
    create: () => ({
      data: {
        collection: "recognitions",
        credentialsCollection: "credentials",
        heading: emptyHeading,
      },
      style: { tone: "canvas", size: "md", width: "wide" },
    }),
    fields: [
      f.collection("collection", "Awards collection", "recognition"),
      f.collection("credentialsCollection", "Credentials collection", "credential"),
      f.rich("note", "Note", { rows: 2 }),
      heading(),
    ],
  },
  {
    type: "enquiryRoutes",
    label: "Enquiry doors",
    group: "Features",
    description: "Separate inboxes, each with its own palette.",
    create: () => ({
      data: { collection: "enquiry-routes", columns: 3, heading: emptyHeading },
      style: { tone: "canvas", size: "md", width: "wide" },
    }),
    fields: [
      f.collection("collection", "Collection", "enquiryRoute"),
      f.select("columns", "Columns", options.columns.slice(0, 3), { numeric: true }),
      heading(),
    ],
  },
  {
    type: "engageBanner",
    label: "Closing call to action",
    group: "Closers",
    description: "The banner at the foot of a page.",
    create: () => ({
      data: {
        eyebrow: "How can I engage?",
        title: "Let us build something together.",
        actions: [{ label: "Get in touch", href: "/contact" }],
        titleType: type(1.875, 4.5, 3.25, 1.05),
      },
      style: { tone: "sand", size: "md", width: "wide", grain: true },
    }),
    fields: [
      f.text("eyebrow", "Eyebrow"),
      f.rich("title", "Heading", { rows: 2 }),
      f.type("titleType", "Heading type"),
      f.rich("body", "Body", { rows: 3 }),
      f.actions("actions", "Buttons", 5),
    ],
  },
];

export const blockDefinitions: readonly BlockDefinition[] = definitions;

const byType = new Map(definitions.map((definition) => [definition.type, definition]));

export const blockDefinition = (type: BlockType): BlockDefinition =>
  byType.get(type) ?? definitions[0];

export const blockGroups = [
  "Openers",
  "Layout",
  "Collections",
  "Features",
  "Closers",
] as const;

/** A one-line summary for a collapsed block row. */
export function describeBlock(block: Block): string {
  if (block.name) return block.name;

  switch (block.type) {
    case "hero":
      return block.data.headlineWords.join(" ");
    case "pageHero":
      return block.data.title;
    case "marquee":
      return block.data.items.join(" · ");
    case "split":
      return block.data.columns.map((column) => column.kind).join(" + ");
    case "stack":
      return block.data.items.map((item) => item.kind).join(" + ");
    case "featuredRelease":
      return block.data.title;
    case "engageBanner":
      return block.data.title;
    case "gallery":
      return block.data.heading?.title || `${block.data.items.length} photographs`;
    default:
      return "collection" in block.data ? `From “${block.data.collection}”` : "";
  }
}
