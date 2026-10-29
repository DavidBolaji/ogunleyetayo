import { f, type Field } from "./fields";
import type { CollectionKind } from "@/content/types";

/**
 * How each kind of collection item is edited.
 *
 * A collection is a named list of one kind, so the editor is the same
 * screen for all of them — only these descriptors differ. Adding a new
 * kind means a schema member and an entry here.
 */
export interface CollectionKindDefinition {
  readonly kind: CollectionKind;
  readonly label: string;
  readonly itemLabel: string;
  readonly description: string;
  readonly fields: readonly Field[];
  readonly create: () => Record<string, unknown>;
  /** Picks the line shown in the collapsed row. */
  readonly title: (item: Record<string, unknown>) => string;
}

const text = (value: unknown, fallback: string): string =>
  typeof value === "string" && value.trim() ? value : fallback;

const definitions: CollectionKindDefinition[] = [
  {
    kind: "expression",
    label: "Expressions",
    itemLabel: "Expression",
    description: "The strands of the work, rendered as the numbered index and in the footer.",
    create: () => ({ id: "", index: "", title: "", tagline: "", summary: "", includes: [], action: { label: "", href: "" }, media: { src: "", alt: "" } }),
    title: (item) => text(item.title, "Untitled expression"),
    fields: [
      f.text("id", "Key", { half: true, help: "Lowercase, hyphenated. Used in links." }),
      f.text("index", "Number", { half: true, placeholder: "01" }),
      f.text("title", "Title"),
      f.rich("tagline", "Tagline", { rows: 2 }),
      f.rich("summary", "Summary", { rows: 3 }),
      f.strings("includes", "What it includes"),
      f.action("action", "Button"),
      f.media("media", "Photograph"),
      { kind: "palette", name: "palette", label: "Palette" },
    ],
  },
  {
    kind: "book",
    label: "Books",
    itemLabel: "Book",
    description: "Titles and resources. Without cover art each gets a typographic cover.",
    create: () => ({ id: "", slug: "", title: "", kind: "Book", description: "", themes: [], accentIndex: 0 }),
    title: (item) => text(item.title, "Untitled book"),
    fields: [
      f.text("id", "Key", { half: true }),
      f.text("slug", "Slug", { half: true }),
      f.text("title", "Title"),
      f.text("kind", "Kind", { half: true, placeholder: "Book, Resource, Collection" }),
      f.number("accentIndex", "Cover colour", { min: 0, max: 11, step: 1 }),
      f.rich("description", "Description", { rows: 4 }),
      f.strings("themes", "Themes"),
      f.media("cover", "Cover artwork"),
      f.action("action", "Buy button"),
    ],
  },
  {
    kind: "release",
    label: "Music releases",
    itemLabel: "Release",
    description: "Songs, sessions and projects for the music archive.",
    create: () => ({ id: "", title: "", kind: "single", year: "" }),
    title: (item) => text(item.title, "Untitled release"),
    fields: [
      f.text("id", "Key", { half: true }),
      f.text("title", "Title"),
      f.text("subtitle", "Subtitle"),
      f.text("kind", "Kind", { half: true, placeholder: "single, live, album, video, project" }),
      f.text("year", "Year", { half: true }),
      f.rich("note", "Note", { rows: 2 }),
      f.media("media", "Artwork"),
      f.action("action", "Listen button"),
    ],
  },
  {
    kind: "post",
    label: "Blog posts",
    itemLabel: "Post",
    description: "Articles. Published posts appear at /blog and get their own page and share card.",
    create: () => ({
      id: "",
      slug: "",
      title: "",
      excerpt: "",
      date: new Date().toISOString().slice(0, 10),
      category: "",
      readingTime: "5 min read",
      status: "draft",
      body: [],
    }),
    title: (item) => text(item.title, "Untitled post"),
    fields: [
      f.text("title", "Title"),
      f.text("slug", "Address", { half: true, help: "The /blog/… part of the link." }),
      f.text("id", "Key", { half: true }),
      f.select("status", "Status", [
        { value: "published", label: "Published" },
        { value: "draft", label: "Draft" },
      ]),
      f.text("date", "Date", { half: true, placeholder: "2026-10-21" }),
      f.text("category", "Category", { half: true }),
      f.text("readingTime", "Reading time", { half: true, placeholder: "5 min read" }),
      f.area("excerpt", "Excerpt", {
        rows: 3,
        help: "Shown on the index, in search results and on the share card.",
      }),
      f.media("media", "Banner image", "Used at the top of the article and on the share card."),
      f.paragraphs("body", "Article"),
    ],
  },
  {
    kind: "timeline",
    label: "Timeline",
    itemLabel: "Entry",
    description: "A dated story, oldest first.",
    create: () => ({ id: "", year: "", title: "", body: "" }),
    title: (item) => text(item.title, "Untitled entry"),
    fields: [
      f.text("id", "Key", { half: true }),
      f.text("year", "Year or label", { half: true }),
      f.text("title", "Title"),
      f.rich("body", "Body", { rows: 3 }),
    ],
  },
  {
    kind: "recognition",
    label: "Recognition",
    itemLabel: "Award",
    description: "Awards and honours.",
    create: () => ({ id: "", title: "", source: "", year: "" }),
    title: (item) => text(item.title, "Untitled award"),
    fields: [
      f.text("id", "Key", { half: true }),
      f.text("title", "Title"),
      f.text("source", "Awarded by", { half: true }),
      f.text("year", "Year", { half: true }),
    ],
  },
  {
    kind: "credential",
    label: "Credentials",
    itemLabel: "Credential",
    description: "Qualifications. Also used in the site's structured data.",
    create: () => ({ id: "", qualification: "", institution: "" }),
    title: (item) => text(item.qualification, "Untitled credential"),
    fields: [
      f.text("id", "Key", { half: true }),
      f.text("qualification", "Qualification"),
      f.text("institution", "Institution"),
    ],
  },
  {
    kind: "programme",
    label: "Programmes",
    itemLabel: "Programme",
    description: "Courses, arms of a network, services — rendered as editorial rows.",
    create: () => ({ id: "", name: "", promise: "", description: "", detail: [], action: { label: "", href: "" } }),
    title: (item) => text(item.name, "Untitled programme"),
    fields: [
      f.text("id", "Key", { half: true }),
      f.text("name", "Name"),
      f.text("promise", "Promise", { help: "The small line above the name." }),
      f.rich("description", "Description", { rows: 4 }),
      f.strings("detail", "Detail pills"),
      f.action("action", "Button"),
      f.media("media", "Photograph"),
    ],
  },
  {
    kind: "enquiryRoute",
    label: "Enquiry routes",
    itemLabel: "Route",
    description: "Separate inboxes, shown on the contact page and in the footer.",
    create: () => ({ id: "", label: "", description: "", email: "" }),
    title: (item) => text(item.label, "Untitled route"),
    fields: [
      f.text("id", "Key", { half: true }),
      f.text("label", "Label"),
      f.rich("description", "Description", { rows: 2 }),
      f.text("email", "Email address"),
      { kind: "palette", name: "palette", label: "Palette" },
    ],
  },
  {
    kind: "tag",
    label: "Simple list",
    itemLabel: "Item",
    description: "A plain list of words — categories, event types, audiences.",
    create: () => ({ id: "", value: "" }),
    title: (item) => text(item.value, "Untitled item"),
    fields: [f.text("id", "Key", { half: true }), f.text("value", "Value")],
  },
];

export const collectionKindDefinitions: readonly CollectionKindDefinition[] = definitions;

const byKind = new Map(definitions.map((definition) => [definition.kind, definition]));

export const collectionKindDefinition = (kind: CollectionKind): CollectionKindDefinition =>
  byKind.get(kind) ?? definitions[0];
