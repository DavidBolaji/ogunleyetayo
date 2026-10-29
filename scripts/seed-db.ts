#!/usr/bin/env node
/**
 * Seeds the file database from the original content modules.
 *
 *   npm run db:seed          # writes data/ only where it is missing
 *   npm run db:seed -- --force   # overwrites every document
 *
 * The site's copy is read from src/content/seed rather than retyped
 * here, so the seeded database says exactly what the hand-built pages
 * said. What this script adds is *composition*: each page's ordered
 * list of blocks, which is the part that used to live in JSX.
 *
 * Every document is validated against the real schema before it is
 * written, so a seed that would not have loaded fails here instead.
 */
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { z } from "zod";

import {
  collectionSchema,
  mediaLibrarySchema,
  navigationSchema,
  pageSchema,
  parseCollection,
  settingsSchema,
  themeSchema,
  type Action,
  type Block,
  type BlockType,
  type ColumnSpec,
  type CollectionKind,
  type Media,
  type TypeStyle,
} from "../src/content/schema";

import { imageBlurData } from "../src/lib/image-blur";
import { site } from "../src/content/seed/site";
import { profile, fullBio, mission, storyIntro, timeline, recognitions, credentials, gallery } from "../src/content/seed/profile";
import { expressions } from "../src/content/seed/expressions";
import { books, booksIntro } from "../src/content/seed/books";
import { featuredProject, musicArchiveNote, musicIntro, releases } from "../src/content/seed/music";
import { blogCategories, blogIntro, posts } from "../src/content/seed/posts";
import { powerOf90, teachingIntro, teachingProgrammes, teachingRoadmap } from "../src/content/seed/teaching";
import { speaking } from "../src/content/seed/speaking";
import { edwoltz, environment } from "../src/content/seed/edwoltz";
import {
  fiveAmTribe,
  silentshout,
  silentshoutArms,
  silentshoutProgrammes,
  summit,
  weEvangelise,
  wush,
} from "../src/content/seed/silentshout";

const DATA_ROOT = path.resolve("data");
const PUBLIC_IMAGES = path.resolve("public/images");
const FORCE = process.argv.includes("--force");

/* ------------------------------------------------------------------ *
 * Writing
 * ------------------------------------------------------------------ */

const written: string[] = [];
const skipped: string[] = [];

async function writeDocument<S extends z.ZodTypeAny>(
  key: string,
  schema: S,
  value: z.input<S>,
): Promise<void> {
  const file = path.join(DATA_ROOT, `${key}.json`);

  if (!FORCE) {
    try {
      await stat(file);
      skipped.push(key);
      return;
    } catch {
      /* not present — fall through and write it */
    }
  }

  let parsed: unknown;

  try {
    parsed = schema.parse(value);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`\n✗ ${key} failed validation:`);
      for (const issue of error.issues) {
        console.error(`   ${issue.path.join(".") || "(root)"}: ${issue.message}`);
      }
    }
    throw error;
  }

  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
  written.push(key);
}

/* ------------------------------------------------------------------ *
 * Authoring helpers
 *
 * These exist so the page compositions below read as compositions
 * rather than as nested object literals.
 * ------------------------------------------------------------------ */

const slug = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100) || "item";

/** Stable ids, so re-seeding does not churn the committed JSON. */
const counters = new Map<string, number>();
const blockId = (type: string): string => {
  const next = (counters.get(type) ?? 0) + 1;
  counters.set(type, next);
  return `${type}-${next}`;
};

type Style = Partial<Block["style"]>;
type DataOf<T extends BlockType> = Extract<Block, { type: T }>["data"];

const block = <T extends BlockType>(
  type: T,
  data: unknown,
  style: Style = {},
): Record<string, unknown> => ({
  id: blockId(type),
  type,
  visible: true,
  style,
  data,
});

const media = (src: string, alt: string, focus?: string): Media =>
  focus ? { src, alt, focus } : { src, alt };

const action = (
  label: string,
  href: string,
  extra: Partial<Action> = {},
): Record<string, unknown> => ({ label, href, ...extra });

/** Named type steps, mirroring the values the hand-built pages used. */
const type = {
  masthead: { min: 2.75, vw: 7.6, max: 6.5, leading: 0.86, tracking: "-0.03em", case: "upper" },
  pageTitle: { min: 2.5, vw: 7, max: 5.5, leading: 0.92, tracking: "-0.03em", case: "upper" },
  giant: { min: 3.5, vw: 12, max: 9, leading: 0.82, tracking: "-0.04em", case: "upper" },
  huge: { min: 3, vw: 9, max: 7, leading: 0.85, tracking: "-0.04em", case: "upper" },
  section2xl: { min: 2.25, vw: 6, max: 4.5, leading: 1.05 },
  sectionXlUpper: { min: 2, vw: 5.5, max: 4, leading: 0.95, case: "upper" },
  sectionLgUpper: { min: 2, vw: 4.6, max: 3.5, leading: 1.02, case: "upper" },
  sectionLg: { min: 1.875, vw: 4.5, max: 3.25, leading: 1.05 },
  sectionMd: { min: 1.875, vw: 4.2, max: 3.25, leading: 1.05 },
  sectionSm: { min: 1.75, vw: 4.5, max: 3, leading: 1.15 },
  rowTitle: { min: 1.75, vw: 3.5, max: 2.75, leading: 1, case: "upper" },
  statement: { min: 1.5, vw: 3.6, max: 2.6, leading: 1.25 },
  statementBand: {
    min: 1.5,
    vw: 4.5,
    max: 3.25,
    leading: 1.05,
    tracking: "-0.02em",
    case: "upper",
  },
  cardLg: { min: 1.5, vw: 3.5, max: 2.25, leading: 1.15 },
  cardMd: { min: 1.35, vw: 2.6, max: 2, leading: 1.15 },
  indexRow: { min: 1.25, vw: 2.6, max: 2, leading: 1.25 },
  quote: { min: 1.25, vw: 2.4, max: 1.5, leading: 1.375, italic: true },
  noteFlat: { min: 1.25, vw: 0, max: 1.25, leading: 1.4, italic: true },
  quoteLg: { min: 1.35, vw: 3, max: 2, leading: 1.25, italic: true },
  numeral: { min: 2.5, vw: 6, max: 4, leading: 1 },
  numeralLg: { min: 2.25, vw: 7, max: 5, leading: 1, tracking: "-0.03em" },
  marquee: { min: 1.75, vw: 4.5, max: 3.25, leading: 1, tracking: "-0.01em", case: "upper" },
} satisfies Record<string, Partial<TypeStyle> & Pick<TypeStyle, "min" | "vw" | "max">>;

/* ------------------------------------------------------------------ *
 * Media library
 *
 * Indexes what the offline pipeline already produced: the .webp files
 * in public/images and the LQIPs in src/lib/image-blur.ts. Those stay
 * `static` and keep being served straight from /public; anything
 * uploaded through the dashboard later is added as `managed`.
 * ------------------------------------------------------------------ */

const titleCase = (id: string): string =>
  id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/** Alt text already written for a photo somewhere in the content. */
function collectAltText(): Map<string, string> {
  const alts = new Map<string, string>();

  const walk = (value: unknown): void => {
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }

    if (value !== null && typeof value === "object") {
      const candidate = value as { src?: unknown; alt?: unknown };

      if (typeof candidate.src === "string" && typeof candidate.alt === "string") {
        if (!alts.has(candidate.src)) alts.set(candidate.src, candidate.alt);
      }

      Object.values(value).forEach(walk);
    }
  };

  walk([
    profile,
    gallery,
    expressions,
    featuredProject,
    releases,
    posts,
    teachingProgrammes,
    edwoltz,
    environment,
    wush,
  ]);

  return alts;
}

async function seedMediaLibrary(): Promise<void> {
  const files = (await readdir(PUBLIC_IMAGES)).filter((name) => name.endsWith(".webp")).sort();
  const alts = collectAltText();
  const createdAt = new Date("2026-10-28T00:00:00.000Z").toISOString();

  const items = await Promise.all(
    files.map(async (file) => {
      const id = file.slice(0, -".webp".length);
      const full = path.join(PUBLIC_IMAGES, file);
      const [info, stats] = await Promise.all([sharp(full).metadata(), stat(full)]);

      return {
        id,
        title: titleCase(id),
        alt: alts.get(id) ?? "",
        focus: "50% 35%",
        width: info.width ?? 1600,
        height: info.height ?? 2000,
        blurDataURL: imageBlurData[id] ?? "",
        bytes: stats.size,
        storage: "static" as const,
        createdAt,
        tags: [id.split("-")[0]],
      };
    }),
  );

  await writeDocument("media", mediaLibrarySchema, { items });
}

/* ------------------------------------------------------------------ *
 * Theme
 *
 * The palettes and the two palette modes that used to be hardcoded in
 * globals.css. "unified" suppresses the sub-brand palettes so the whole
 * site speaks in purple type; "brands" lets them paint their pages
 * again. Switching is a dashboard setting.
 * ------------------------------------------------------------------ */

async function seedTheme(): Promise<void> {
  await writeDocument("theme", themeSchema, {
    basePalette: "ebahi",
    activeMode: "unified",
    palettes: [
      {
        id: "ebahi",
        label: "Ebahi — purple & gold",
        tokens: {
          canvas: "#fbf7f3",
          surface: "#ffffff",
          sand: "#f1e7dc",
          deep: "#2a1030",
          deepSoft: "#43204c",
          ink: "#191217",
          muted: "#6f6169",
          line: "#e3d8cd",
          accent: "#c98f1e",
          accentSoft: "#f6e9cf",
          accentInk: "#7a5407",
          onDeep: "#f6ecdb",
          onDeepMuted: "#c3aec6",
          headingLight: "#43204c",
        },
      },
      {
        id: "silentshout",
        label: "SilentShout — royal blue & burnt orange",
        tokens: {
          canvas: "#f6f7fb",
          surface: "#ffffff",
          sand: "#e7ecf8",
          deep: "#11265f",
          deepSoft: "#1c3b8c",
          ink: "#10152a",
          muted: "#5c6580",
          line: "#d3dbee",
          accent: "#c4551f",
          accentSoft: "#fbe6da",
          accentInk: "#8f3a12",
          onDeep: "#eef2fd",
          onDeepMuted: "#a9b8dd",
          headingLight: "#10152a",
        },
      },
      {
        id: "edwoltz",
        label: "Edwoltz — black, brown & orange-gold",
        tokens: {
          canvas: "#faf7f4",
          surface: "#ffffff",
          sand: "#efe6dc",
          deep: "#14100e",
          deepSoft: "#3b2a20",
          ink: "#14100e",
          muted: "#6d5f54",
          line: "#e0d5c9",
          accent: "#d98324",
          accentSoft: "#fbead6",
          accentInk: "#92530d",
          onDeep: "#f7f0e8",
          onDeepMuted: "#b6a696",
          headingLight: "#14100e",
        },
      },
    ],
    modes: [
      {
        id: "unified",
        label: "Unified — one palette, brand in the type",
        description:
          "One purple-and-gold palette across the whole site, so the personal brand stays consistent. A sub-brand is spoken in purple display type rather than painted onto the page.",
        suppress: ["silentshout", "edwoltz"],
      },
      {
        id: "brands",
        label: "Per-brand palettes",
        description:
          "Restores the original sub-brand palettes: royal-blue SilentShout and black-and-brown Edwoltz. Every block already carries its palette, so nothing else changes.",
        suppress: [],
      },
    ],
    fonts: { display: "fraunces", sans: "manrope" },
    typography: {
      scale: 1,
      headingTracking: "-0.02em",
      headingWeight: 400,
      bodySize: "1rem",
    },
  });
}

/* ------------------------------------------------------------------ *
 * Settings & navigation
 * ------------------------------------------------------------------ */

async function seedSettings(): Promise<void> {
  await writeDocument("settings", settingsSchema, {
    site: {
      name: site.name,
      shortName: site.shortName,
      descriptor: site.descriptor,
      tagline: site.tagline,
      positioning: site.positioning,
      url: site.url,
      email: site.email,
      phone: site.phone,
      whatsapp: site.whatsapp,
      location: site.location,
      church: site.church,
      wordmarkTagline: "Faith · Creativity · Impact",
    },
    seo: {
      titleTemplate: `%s — ${site.name}`,
      keywords: [
        site.name,
        "music minister",
        "worship leader",
        "SilentShout",
        "Young Music Ministers Summit",
        "Edwoltz Hair City",
        "VisionCraft Academy",
        "Christian author",
      ],
      ogImage: "portrait-open-hands",
      themeColor: "#2a1030",
      locale: "en_NG",
    },
    socials: [
      { id: "instagram", platform: "Instagram", handle: "@ebahitayo", href: "https://instagram.com/ebahitayo" },
      { id: "youtube", platform: "YouTube", handle: site.name, href: "https://youtube.com/@ebahitayo" },
      { id: "tiktok", platform: "TikTok", handle: "@ebahitayo", href: "https://tiktok.com/@ebahitayo" },
    ],
    footer: {
      eyebrow: "Stay close to the work",
      title: "A letter for people building something that outlives them.",
      body: "New music, teaching, resources and dates — sent occasionally, never carelessly.",
      navLabel: "Navigate",
      exploreLabel: "Explore my work",
      exploreCollection: "expressions",
      connectLabel: "Connect with Ebahi",
      rights: "All Rights Reserved.",
    },
    enquiry: {
      routesCollection: "enquiry-routes",
      successMessage: "Thank you — your message is in. You'll hear back shortly.",
    },
    blog: {
      postsCollection: "posts",
      postFooterNote: "If this was useful, the letter carries the next one straight to you.",
      backLabel: "← All posts",
    },
  });
}

async function seedNavigation(): Promise<void> {
  const item = (label: string, href: string, children: unknown[] = []) => ({
    id: slug(label),
    label,
    href,
    external: false,
    visible: true,
    children,
  });

  await writeDocument("navigation", navigationSchema, {
    header: [
      item("Home", "/"),
      item("About", "/about"),
      item("Music", "/music"),
      item("Ministry", "/ministry"),
      item("Teaching", "/teaching"),
      item("Books", "/books"),
      item("Blog", "/blog"),
      item("Work With Me", "/work-with-me"),
      item("More", "/more", [
        item("SilentShout Network", "/ministry"),
        item("WUSH", "/ministry#wush"),
        item("The 5AM Tribe", "/ministry#tribe"),
        item("Young Music Ministers Summit", "/ministry/summit"),
        item("Edwoltz Hair City", "/edwoltz"),
        item("Hair & Environment", "/edwoltz/environment"),
        item("Resources", "/books#resources"),
      ]),
      item("Contact", "/contact"),
    ],
    footer: [],
  });
}

/* ------------------------------------------------------------------ *
 * Collections
 *
 * Named, ordered lists of one item kind — the CMS equivalent of a
 * custom post type. Blocks point at them by name, which is why there
 * can be three separate programme sets without three block types.
 * ------------------------------------------------------------------ */

async function seedCollection(
  name: string,
  label: string,
  kind: CollectionKind,
  items: unknown[],
  options: { description?: string; system?: boolean } = {},
): Promise<void> {
  await writeDocument(`collections/${name}`, collectionSchema.transform(parseCollection), {
    name,
    label,
    kind,
    description: options.description,
    system: options.system ?? false,
    items,
  });
}

async function seedCollections(): Promise<void> {
  await seedCollection(
    "expressions",
    "Expressions",
    "expression",
    expressions.map((expression) => ({
      id: expression.id,
      index: expression.index,
      title: expression.title,
      tagline: expression.tagline,
      summary: expression.summary,
      includes: [...expression.includes],
      action: { ...expression.action },
      media: { ...expression.media },
      palette: expression.brand,
    })),
    {
      description:
        "The expressions of one calling. This order is the order everywhere the set is rendered — the homepage index, the footer and the sitemap.",
      system: true,
    },
  );

  await seedCollection(
    "books",
    "Books & resources",
    "book",
    books.map((book) => ({
      id: book.slug,
      slug: book.slug,
      title: book.title,
      kind: book.kind,
      description: book.description,
      themes: [...book.themes],
      action: { ...book.action },
      accentIndex: book.accentIndex,
    })),
    { description: "Each title gets a typographic cover until artwork is uploaded." },
  );

  await seedCollection(
    "releases",
    "Music releases",
    "release",
    releases.map((release) => ({
      id: slug(release.title),
      title: release.title,
      subtitle: release.subtitle,
      kind: release.kind,
      year: release.year,
      note: release.note,
      media: release.media ? { ...release.media } : undefined,
    })),
  );

  await seedCollection(
    "posts",
    "Blog posts",
    "post",
    posts.map((post) => ({
      id: post.slug,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      category: post.category,
      readingTime: post.readingTime,
      status: "published",
      media: post.media ? { ...post.media } : undefined,
      body: [...post.body],
    })),
    { system: true, description: "Published posts appear at /blog and get their own page." },
  );

  await seedCollection(
    "blog-categories",
    "Blog categories",
    "tag",
    blogCategories.map((category) => ({ id: slug(category), value: category })),
  );

  await seedCollection(
    "event-types",
    "Event types (speaking form)",
    "tag",
    speaking.eventTypes.map((eventType) => ({ id: slug(eventType), value: eventType })),
    { description: "Options in the Work With Me enquiry form." },
  );

  await seedCollection(
    "timeline",
    "Story timeline",
    "timeline",
    timeline.map((entry) => ({
      id: slug(entry.title),
      year: entry.year,
      title: entry.title,
      body: entry.body,
    })),
  );

  await seedCollection(
    "recognitions",
    "Recognition",
    "recognition",
    recognitions.map((item) => ({
      id: slug(item.title),
      title: item.title,
      source: item.source,
      year: item.year,
    })),
  );

  await seedCollection(
    "credentials",
    "Credentials",
    "credential",
    credentials.map((item) => ({
      id: slug(item.qualification),
      qualification: item.qualification,
      institution: item.institution,
    })),
    { description: "Also used in the site's Person structured data.", system: true },
  );

  const programme = (item: (typeof silentshoutArms)[number]) => ({
    id: slug(item.name),
    name: item.name,
    promise: item.promise,
    description: item.description,
    detail: [...item.detail],
    action: { ...item.action },
    media: "media" in item && item.media ? { ...(item.media as Media) } : undefined,
  });

  await seedCollection(
    "silentshout-arms",
    "SilentShout — the four arms",
    "programme",
    silentshoutArms.map(programme),
  );

  await seedCollection(
    "silentshout-programmes",
    "SilentShout — training & resources",
    "programme",
    silentshoutProgrammes.map(programme),
  );

  await seedCollection(
    "teaching-programmes",
    "Teaching programmes",
    "programme",
    teachingProgrammes.map(programme),
  );

  await seedCollection(
    "enquiry-routes",
    "Enquiry routes",
    "enquiryRoute",
    [
      {
        id: "music-silentshout",
        label: "Music & SilentShout",
        description:
          "Ministrations, worship sessions, training, the Summit and school enquiries.",
        email: "music@ebahitayo.com",
        palette: "silentshout",
      },
      {
        id: "speaking-teaching",
        label: "Speaking & Teaching",
        description:
          "Conferences, masterclasses, coaching, VisionCraft Academy and mentoring.",
        email: "speaking@ebahitayo.com",
        palette: "ebahi",
      },
      {
        id: "edwoltz",
        label: "Edwoltz Hair City",
        description: "Wig revamping, hair services, hair education and business enquiries.",
        email: "hello@edwoltzhaircity.com",
        palette: "edwoltz",
      },
    ],
    {
      description:
        "Separate inboxes keep three very different conversations from colliding. Shown on the contact page and in the footer.",
      system: true,
    },
  );
}

/* ------------------------------------------------------------------ *
 * Pages
 *
 * Each page below is the composition that used to be its JSX file:
 * an ordered list of blocks, each with its own ground, measure,
 * palette and type. The copy still comes from the seed modules.
 * ------------------------------------------------------------------ */

interface PageSeed {
  id: string;
  slug: string;
  title: string;
  description: string;
  palette?: string;
  system?: boolean;
  blocks: Record<string, unknown>[];
}

const engage = (
  eyebrow: string,
  title: string,
  actions: Record<string, unknown>[],
  body?: string,
) =>
  block(
    "engageBanner",
    { eyebrow, title, body, actions, titleType: type.sectionLg },
    { tone: "sand", size: "md", width: "wide", grain: true },
  );

const newsletterPanel = (
  eyebrow: string,
  title: string,
  lede: string | undefined,
  anchor?: string,
) =>
  block(
    "stack",
    {
      maxWidth: "2xl",
      centered: true,
      gap: "md",
      items: [
        {
          kind: "prose",
          eyebrow,
          title,
          titleType: type.sectionSm,
          titleTag: "h2",
          align: "center",
          lede,
          ledeSize: "md",
          ledeMaxWidth: "none",
        },
        { kind: "newsletter", tone: "deep", maxWidth: "md" },
      ],
    },
    { tone: "deep", size: "md", width: "default", grain: true, anchor },
  );

const pageSeeds: PageSeed[] = [
  /* ---------------------------------------------------------------- *
   * Home
   * ---------------------------------------------------------------- */
  {
    id: "home",
    slug: "",
    title: "Home",
    description: site.positioning,
    system: true,
    blocks: [
      block("hero", {
        eyebrow: site.descriptor,
        headlineWords: [...profile.heroHeadline],
        accentWordIndex: 1,
        headlineLabel: `${site.name} — ${profile.heroHeadline.join(" ")}`,
        support: profile.heroSupport,
        titleType: type.masthead,
        actions: [
          action("Explore my work", "#expressions", { variant: "solid", size: "lg" }),
          action("Work with me", "/work-with-me", { variant: "outline", size: "lg" }),
        ],
        media: { ...profile.portrait },
        badge: { label: "Since 2004", text: "Music Director, {site.church}" },
      }),

      block(
        "marquee",
        { items: [...site.thread], separator: "→", duration: 32, type: type.marquee },
        {
          tone: "sand",
          width: "full",
          grain: true,
          borderTop: true,
          borderBottom: true,
          paddingTop: "xs",
          paddingBottom: "xs",
        },
      ),

      block(
        "split",
        {
          ratio: "0.9/1.1",
          gap: "lg",
          columns: [
            {
              kind: "media",
              layout: "offsetPair",
              aspect: "4/5",
              reveal: "right",
              sizes: "(max-width: 1024px) 100vw, 40vw",
              items: [
                media(
                  "portrait-burgundy-close",
                  "Ebahi in a burgundy waistcoat, hand resting under her chin",
                  "50% 20%",
                ),
                media("portrait-prayer", "Ebahi with hands clasped in prayer"),
              ],
            },
            {
              kind: "prose",
              eyebrow: "Meet Ebahi",
              title: profile.meetHeading,
              titleType: type.sectionLgUpper,
              paragraphs: [...profile.shortBio],
              bodySize: "lg",
              offsetTop: "md",
              quote: {
                text: profile.centralIdea,
                caption: "The thread through everything",
                quoted: true,
                type: type.quote,
              },
              actions: [action("Read my story", "/about", { variant: "link" })],
            },
          ],
        },
        { tone: "canvas", size: "lg", width: "wide", anchor: "meet-ebahi" },
      ),

      block(
        "expressionIndex",
        {
          collection: "expressions",
          heading: {
            eyebrow: "My world / my work",
            title: "Different expressions.\n*One calling.*",
            lede: "Six rooms in one house. Every one of them is fed by the same conviction — that what God entrusts to a person is meant to be discovered, stewarded and spent.",
            size: "lg",
            gap: "xl",
          },
        },
        { tone: "surface", size: "lg", width: "wide", anchor: "expressions" },
      ),

      block(
        "stack",
        {
          maxWidth: "3xl",
          centered: true,
          gap: "md",
          items: [
            {
              kind: "prose",
              eyebrow: "Why",
              align: "center",
              title:
                "Because gifted people are being handed platforms before they are handed *formation* — and what is not formed privately cannot be carried publicly.",
              titleType: type.statement,
              titleTag: "p",
              paragraphs: [
                `${profile.centralIdea} That sentence governs the music, the school, the classroom, the books and the business.`,
              ],
              bodyTone: "body",
            },
          ],
        },
        { tone: "sand", size: "lg", width: "default", grain: true },
      ),

      block("featuredRelease", {
        eyebrow: "Featured project",
        title: featuredProject.title,
        meaning: featuredProject.meaning,
        quote: featuredProject.quote,
        description: featuredProject.description,
        showDescription: false,
        titleType: type.giant,
        facts: [
          { label: "Recorded", value: featuredProject.recordedNote },
          { label: "Releasing", value: featuredProject.releaseDate, accent: true },
        ],
        actions: [
          action(featuredProject.actions[0].label, featuredProject.actions[0].href, {
            variant: "accent",
            size: "lg",
          }),
          action(featuredProject.actions[1].label, featuredProject.actions[1].href, {
            variant: "outlineLight",
            size: "lg",
          }),
          action(featuredProject.actions[2].label, featuredProject.actions[2].href, {
            variant: "ghost",
            size: "lg",
          }),
        ],
        media: { ...featuredProject.media },
      }),

      block(
        "split",
        {
          ratio: "1/1",
          gap: "md",
          verticalAlign: "center",
          columns: [
            {
              kind: "media",
              items: [{ ...environment.media }],
              ratio: "cinema",
              reveal: "right",
              sizes: "(max-width: 1024px) 100vw, 45vw",
            },
            {
              kind: "prose",
              eyebrow: "Beauty, business & the environment",
              title: "What our industry leaves behind.",
              titleType: type.sectionMd,
              lede: environment.statement,
              ledeSize: "lg",
              actions: [
                action("Explore the hair & environment project", "/edwoltz/environment", {
                  variant: "outline",
                }),
              ],
            },
          ],
        },
        { tone: "canvas", size: "lg", width: "wide", palette: "edwoltz" },
      ),

      block(
        "recognitionStrip",
        {
          collection: "recognitions",
          credentialsCollection: "credentials",
          heading: { eyebrow: "Selected recognition" },
          note: "Noted briefly, because the work matters more than the shelf it sits on.",
        },
        { tone: "canvas", size: "md", width: "wide" },
      ),

      engage(
        "How can I engage?",
        "Come and build something with me.",
        [
          action("Invite Ebahi to speak", "/work-with-me"),
          action("Learn with me", "/teaching"),
          action("Contact", "/contact"),
        ],
        "Invite Ebahi to your gathering, join a programme, bring SilentShout to your music team, or simply stay close to the work.",
      ),
    ],
  },
];

/* ---------------------------------------------------------------- *
 * About
 * ---------------------------------------------------------------- */
pageSeeds.push({
  id: "about",
  slug: "about",
  title: "My Story",
  description:
    "The woman behind the work — Ebahi Tayo-Ogunleye's journey through music ministry, teaching, authorship and enterprise.",
  blocks: [
    block("pageHero", {
      eyebrow: "My story",
      title: "The woman behind the work",
      titleType: type.pageTitle,
      lede: storyIntro[0],
      media: media("editorial-veil-leaning", "Ebahi seated in an editorial portrait", "50% 25%"),
    }),

    block(
      "split",
      {
        ratio: "0.85/1.15",
        gap: "lg",
        columns: [
          {
            kind: "media",
            items: [media("portrait-burgundy-close", "Portrait of Ebahi in burgundy", "50% 20%")],
            parallax: true,
            aspect: "4/5",
            reveal: "right",
            sizes: "(max-width: 1024px) 100vw, 38vw",
          },
          {
            kind: "prose",
            eyebrow: "In her words",
            title: "I have never had a separate self for each room.",
            titleType: type.sectionMd,
            lede: storyIntro[1],
            paragraphs: fullBio.slice(0, 3),
            offsetTop: "sm",
          },
        ],
      },
      { tone: "canvas", size: "md", width: "wide" },
    ),

    block(
      "stack",
      {
        gap: "md",
        items: [
          {
            kind: "prose",
            paragraphs: fullBio.slice(3),
            bodySize: "lg",
            quote: {
              text: mission,
              caption: "Her constant prayer and core mission",
              quoted: true,
              type: type.quoteLg,
            },
          },
        ],
      },
      { tone: "canvas", size: "md", width: "default" },
    ),

    block(
      "timeline",
      {
        collection: "timeline",
        heading: {
          eyebrow: "The journey",
          title: "From a childhood ear to a ministry, a school and a business.",
          size: "lg",
          gap: "lg",
        },
      },
      { tone: "surface", size: "lg", width: "default" },
    ),

    block(
      "recognitionStrip",
      {
        collection: "recognitions",
        credentialsCollection: "credentials",
        heading: { eyebrow: "Selected recognition" },
        note: "Noted briefly, because the work matters more than the shelf it sits on.",
      },
      { tone: "canvas", size: "md", width: "wide" },
    ),

    block(
      "gallery",
      {
        items: gallery.map((item) => ({ ...item })),
        heading: {
          eyebrow: "Portrait gallery",
          title: "Selected portraits",
          lede: "Photography for press, event programmes and features. Available on request.",
          gap: "lg",
        },
      },
      { tone: "sand", size: "lg", width: "wide", grain: true },
    ),

    engage(
      "Work together",
      "If any of this is the conversation your room needs, let's talk.",
      [action("Invite Ebahi to speak", "/work-with-me"), action("Explore my music", "/music")],
      "Based in {site.location}, serving churches, organisations and creative communities.",
    ),
  ],
});

/* ---------------------------------------------------------------- *
 * Music
 * ---------------------------------------------------------------- */
pageSeeds.push({
  id: "music",
  slug: "music",
  title: "Music",
  description:
    "Music by Ebahi Tayo-Ogunleye — worship leadership, original songs, live recordings and the Emi O ri project.",
  blocks: [
    block("pageHero", {
      eyebrow: musicIntro.heading,
      title: musicIntro.opening,
      titleType: type.pageTitle,
      lede: musicIntro.body[0],
      media: media(
        "music-2",
        "An outdoor worship session set up among the trees — keyboard, microphone and open air",
        "50% 45%",
      ),
      actions: [action("Hear the featured project", "#featured", { variant: "solid", size: "lg" })],
    }),

    block(
      "featuredRelease",
      {
        eyebrow: "Featured project",
        title: featuredProject.title,
        meaning: featuredProject.meaning,
        quote: featuredProject.quote,
        description: featuredProject.description,
        showDescription: true,
        titleType: type.giant,
        facts: [
          { label: "Recorded", value: featuredProject.recordedNote },
          { label: "Releasing", value: featuredProject.releaseDate, accent: true },
        ],
        actions: [
          action(featuredProject.actions[0].label, featuredProject.actions[0].href, {
            variant: "accent",
            size: "lg",
          }),
          action(featuredProject.actions[1].label, featuredProject.actions[1].href, {
            variant: "outlineLight",
            size: "lg",
          }),
          action(featuredProject.actions[2].label, featuredProject.actions[2].href, {
            variant: "ghost",
            size: "lg",
          }),
        ],
        media: { ...featuredProject.media },
      },
      { anchor: "featured" },
    ),

    block(
      "releaseGrid",
      {
        collection: "releases",
        columns: 4,
        heading: {
          eyebrow: "The archive",
          title: "Selected songs, sessions & projects",
          lede: musicArchiveNote,
          gap: "lg",
        },
      },
      { tone: "canvas", size: "lg", width: "wide" },
    ),

    block(
      "split",
      {
        ratio: "1/1",
        gap: "md",
        columns: [
          {
            kind: "prose",
            eyebrow: "Watch & listen",
            title: "Videos and live recordings",
            titleType: type.sectionMd,
            lede: "Music videos, live worship sessions and recordings will be embedded here as each project is released.",
          },
          {
            kind: "embeds",
            columns: 2,
            items: [{ label: "Emi O ri — live", url: "" }, { label: "Worship session", url: "" }],
          },
        ],
      },
      { tone: "sand", size: "md", width: "wide", grain: true },
    ),

    engage("Music ministry", "Invite Ebahi to minister, or bring SilentShout to your music team.", [
      action("Invite Ebahi", "/work-with-me"),
      action("Visit SilentShout", "/ministry"),
    ]),
  ],
});

/* ---------------------------------------------------------------- *
 * Teaching
 * ---------------------------------------------------------------- */
pageSeeds.push({
  id: "teaching",
  slug: "teaching",
  title: "Teaching & Coaching",
  description:
    "Learn with Ebahi — VisionCraft Academy, the Coaching Hub and The Power of 90 Days framework for vision, strategy and execution.",
  blocks: [
    block("pageHero", {
      eyebrow: teachingIntro.heading,
      title: teachingIntro.opening,
      titleType: type.pageTitle,
      lede: teachingIntro.body[0],
      media: media("portrait-burgundy-full", "Ebahi in a burgundy jacket, full length", "50% 22%"),
    }),

    block(
      "split",
      {
        ratio: "0.9/1.1",
        gap: "lg",
        columns: [
          {
            kind: "prose",
            eyebrow: "Signature framework",
            title: "The Power of\n*90 Days*",
            titleType: type.sectionXlUpper,
            lede: powerOf90.promise,
            ledeSize: "md",
            ledeMaxWidth: "md",
            paragraphs: [...powerOf90.body],
            bodySize: "sm",
            bodyTone: "strong",
          },
          {
            kind: "pillars",
            columns: 2,
            numbered: true,
            cellTone: "deep",
            selfStart: true,
            items: powerOf90.movements.map((movement) => ({
              label: movement.step,
              title: movement.title,
              body: movement.body,
            })),
          },
        ],
      },
      { tone: "deep", size: "lg", width: "wide", grain: true },
    ),

    block(
      "programmeList",
      {
        collection: "teaching-programmes",
        heading: {
          eyebrow: "Programmes",
          title: "Where the teaching lives",
          lede: teachingIntro.body[1],
          gap: "xl",
        },
      },
      { tone: "canvas", size: "lg", width: "wide" },
    ),

    block(
      "stack",
      {
        gap: "md",
        items: [
          {
            kind: "prose",
            eyebrow: "Coming to this page",
            title: "Built to grow with the work.",
            titleType: type.sectionMd,
            lede: "Registration, waitlists, downloads and booking are being added as each programme opens.",
          },
          {
            kind: "pillars",
            columns: 3,
            numbered: true,
            cellTone: "sand",
            items: teachingRoadmap.map((item) => ({ title: item })),
          },
        ],
      },
      { tone: "sand", size: "md", width: "default", grain: true },
    ),

    engage("Start here", "Ninety days from now, something should be different.", [
      action("Enquire about coaching", "/contact"),
      action("Invite Ebahi to teach", "/work-with-me"),
    ]),
  ],
});

/* ---------------------------------------------------------------- *
 * Books
 * ---------------------------------------------------------------- */
pageSeeds.push({
  id: "books",
  slug: "books",
  title: "Books & Resources",
  description:
    "Dear Worship Leader, Prayed Up, Simple Praying Systems and Psalms of Ebahi — books and resources by Ebahi Tayo-Ogunleye.",
  blocks: [
    block("pageHero", {
      eyebrow: "Books & resources",
      title: booksIntro.heading,
      titleType: type.pageTitle,
      lede: booksIntro.opening,
      media: media("writing", "Ebahi writing in a journal at her desk", "50% 25%"),
    }),

    block(
      "bookShelf",
      { collection: "books" },
      { tone: "canvas", size: "lg", width: "wide", anchor: "resources" },
    ),

    block(
      "split",
      {
        ratio: "1/1",
        gap: "md",
        verticalAlign: "center",
        columns: [
          {
            kind: "prose",
            eyebrow: "Blog",
            title: "Short reads, published as the work happens.",
            titleType: type.sectionMd,
            lede: "A writing space for faith, music ministry, leadership, creativity, purpose, life and enterprise.",
            actions: [action("Read the blog", "/blog", { variant: "link" })],
          },
          {
            kind: "chips",
            variant: "filled",
            items: [...blogCategories],
          },
        ],
      },
      { tone: "sand", size: "md", width: "wide", grain: true },
    ),

    newsletterPanel("Resources", "Get new resources as they are released.", undefined),

    engage("Stocking or reviewing", "Bulk orders, reviews and interview requests are welcome.", [
      action("Get in touch", "/contact"),
      action("Invite Ebahi", "/work-with-me"),
    ]),
  ],
});

/* ---------------------------------------------------------------- *
 * Blog index
 * ---------------------------------------------------------------- */
pageSeeds.push({
  id: "blog",
  slug: "blog",
  title: "Blog",
  description: blogIntro.opening,
  system: true,
  blocks: [
    block("pageHero", {
      eyebrow: "Read",
      title: blogIntro.heading,
      titleType: type.pageTitle,
      lede: blogIntro.opening,
      media: media("writing", "Ebahi writing in a journal at her desk", "50% 25%"),
    }),

    block(
      "postGrid",
      {
        collection: "posts",
        columns: 3,
        emptyHeadline: blogIntro.empty,
        emptyNote: blogIntro.note,
        emptyCategoriesCollection: "blog-categories",
        emptyNewsletter: true,
      },
      { tone: "canvas", size: "lg", width: "wide" },
    ),
  ],
});

/* ---------------------------------------------------------------- *
 * Work With Me
 * ---------------------------------------------------------------- */
pageSeeds.push({
  id: "work-with-me",
  slug: "work-with-me",
  title: "Work With Me",
  description:
    "Invite Ebahi Tayo-Ogunleye to speak, teach or minister at your church, conference, school, organisation or creative community.",
  blocks: [
    block("pageHero", {
      eyebrow: "Speaking & collaboration",
      title: speaking.heading,
      titleType: type.pageTitle,
      lede: speaking.intro,
      media: media("editorial-stance", "Ebahi standing, editorial portrait", "50% 18%"),
    }),

    block(
      "stack",
      {
        gap: "md",
        items: [
          {
            kind: "prose",
            eyebrow: "Who I speak to",
            title: "Rooms that are trying to grow.",
            titleType: type.sectionMd,
          },
          { kind: "chips", size: "md", interactive: true, items: [...speaking.audiences] },
        ],
      },
      { tone: "canvas", size: "md", width: "wide" },
    ),

    block(
      "stack",
      {
        gap: "lg",
        items: [
          {
            kind: "prose",
            eyebrow: "Speaking areas",
            title: "What I am usually asked to bring.",
            titleType: type.sectionMd,
          },
          {
            kind: "pillars",
            columns: 3,
            numbered: true,
            cellTone: "surface",
            items: speaking.topics.map((topic) => ({ title: topic.title, body: topic.body })),
          },
        ],
      },
      { tone: "surface", size: "lg", width: "wide" },
    ),

    block(
      "split",
      {
        ratio: "0.75/1.25",
        gap: "lg",
        columns: [
          {
            kind: "group",
            layout: "stack",
            gap: "none",
            items: [
              {
                kind: "prose",
                eyebrow: "Invite Ebahi",
                title: "Tell me about your gathering.",
                titleType: type.sectionMd,
                lede: "The more you can share about the room, the better the session can be shaped for it.",
              },
              {
                kind: "media",
                items: [media("portrait-white-standing", "Ebahi standing in white", "50% 25%")],
                ratio: "portrait",
                hideOnMobile: true,
                gapTop: "md",
                sizes: "(max-width: 1024px) 100vw, 30vw",
              },
            ],
          },
          {
            kind: "enquiryForm",
            intent: "speaking",
            eventTypesCollection: "event-types",
            framed: true,
            frameTone: "surface",
          },
        ],
      },
      { tone: "canvas", size: "lg", width: "wide", anchor: "invite" },
    ),
  ],
});

/* ---------------------------------------------------------------- *
 * Contact
 * ---------------------------------------------------------------- */
pageSeeds.push({
  id: "contact",
  slug: "contact",
  title: "Contact",
  description:
    "Get in touch with Ebahi Tayo-Ogunleye — separate routes for music and SilentShout, speaking and teaching, and Edwoltz Hair City enquiries.",
  blocks: [
    block("pageHero", {
      eyebrow: "Contact",
      title: "Let's connect",
      titleType: type.pageTitle,
      lede: "Three very different conversations happen here, so they each have their own door. Choose the one that fits and you will reach the right desk.",
    }),

    block(
      "enquiryRoutes",
      { collection: "enquiry-routes", columns: 3 },
      { tone: "canvas", size: "md", width: "wide" },
    ),

    block(
      "split",
      {
        ratio: "0.75/1.25",
        gap: "lg",
        columns: [
          {
            kind: "group",
            layout: "stack",
            gap: "md",
            items: [
              {
                kind: "prose",
                eyebrow: "Send a message",
                title: "Or write once, here.",
                titleType: type.sectionMd,
                lede: "Everything sent through this form is read and routed to the right inbox.",
              },
              {
                kind: "contactDetails",
                socialsLabel: "Social",
                items: [
                  { label: "Email", value: "{site.email}", href: "mailto:{site.email}" },
                  { label: "Phone / WhatsApp", value: "{site.phone}", href: "{site.whatsapp}" },
                  { label: "Based in", value: "{site.location}", href: "" },
                ],
              },
            ],
          },
          { kind: "enquiryForm", intent: "general", framed: true, frameTone: "canvas" },
        ],
      },
      { tone: "surface", size: "lg", width: "wide" },
    ),

    newsletterPanel(
      "Stay close",
      "Follow the journey.",
      "New music, teaching, resources and dates — including the Emi O ri release.",
      "newsletter",
    ),
  ],
});

/* ---------------------------------------------------------------- *
 * Ministry — the SilentShout network
 * ---------------------------------------------------------------- */
pageSeeds.push({
  id: "ministry",
  slug: "ministry",
  title: "SilentShout Global Network",
  description: silentshout.statement,
  palette: "silentshout",
  blocks: [
    block("pageHero", {
      eyebrow: silentshout.name,
      title: silentshout.headline,
      titleType: type.pageTitle,
      lede: silentshout.statement,
      tone: "deep",
      media: media("portrait-white-standing", "Ebahi standing in white", "50% 22%"),
      actions: [
        action("The network", "#network", { variant: "accent", size: "lg" }),
        action("WUSH", "#wush", { variant: "outlineLight", size: "lg" }),
        action("The 5AM Tribe", "#tribe", { variant: "outlineLight", size: "lg" }),
      ],
    }),

    // The core idea, as a band rather than a section.
    block(
      "stack",
      {
        gap: "none",
        items: [
          {
            kind: "prose",
            title: "From spiritual formation_ → _/to earthly relevance./",
            titleType: type.statementBand,
            titleTag: "p",
          },
        ],
      },
      {
        tone: "sand",
        width: "wide",
        grain: true,
        borderBottom: true,
        paddingTop: "sm",
        paddingBottom: "sm",
      },
    ),

    block(
      "split",
      {
        ratio: "1.1/0.9",
        gap: "lg",
        columns: [
          {
            kind: "prose",
            eyebrow: "About SilentShout",
            title: "The gap nobody plans for.",
            titleType: type.sectionMd,
            paragraphs: [...silentshout.about],
            bodySize: "lg",
          },
          {
            kind: "media",
            items: [media("portrait-prayer", "Ebahi in prayer", "50% 25%")],
            ratio: "portrait",
            reveal: "left",
            sizes: "(max-width: 1024px) 100vw, 38vw",
          },
        ],
      },
      { tone: "canvas", size: "lg", width: "wide", anchor: "about" },
    ),

    block(
      "programmeList",
      {
        collection: "silentshout-arms",
        heading: {
          eyebrow: "The network",
          title: silentshout.headline,
          lede: silentshout.statement,
          gap: "xl",
        },
      },
      { tone: "surface", size: "lg", width: "wide", anchor: "network" },
    ),

    block(
      "stack",
      {
        gap: "lg",
        items: [
          {
            kind: "prose",
            eyebrow: "What we cultivate",
            title: "Four things we refuse to teach separately.",
            titleType: type.sectionMd,
          },
          {
            kind: "pillars",
            columns: 4,
            numbered: true,
            cellTone: "canvas",
            items: silentshout.pillars.map((pillar) => ({
              title: pillar.title,
              body: pillar.body,
            })),
          },
        ],
      },
      { tone: "canvas", size: "lg", width: "wide" },
    ),

    block(
      "programmeList",
      {
        collection: "silentshout-programmes",
        heading: { eyebrow: "Training & resources", title: "How SilentShout works", gap: "xl" },
      },
      { tone: "surface", size: "lg", width: "wide", anchor: "school" },
    ),

    /*
      WUSH is the umbrella the Summit below sits inside, which is why
      the two dark bands run together as one chapter. The statement,
      the editions and the gallery are three stacked parts of one
      block, so the rhythm inside the chapter stays deliberate.
    */
    block(
      "stack",
      {
        gap: "xl",
        items: [
          {
            kind: "group",
            layout: "split",
            ratio: "1/1",
            gap: "lg",
            items: [
              {
                kind: "prose",
                eyebrow: wush.expansion,
                title: wush.name,
                titleType: type.huge,
                lede: wush.statement,
                ledeSize: "xl",
                ledeMaxWidth: "xl",
              },
              {
                kind: "prose",
                paragraphs: [...wush.body],
                bodySize: "md",
                offsetTop: "sm",
              },
            ],
          },
          {
            kind: "years",
            label: wush.editionsLabel,
            items: [...wush.editions],
            type: type.numeralLg,
            dividerTop: true,
          },
          {
            kind: "gallery",
            ratio: "wide",
            items: wush.gallery.map((item) => ({ ...item })),
          },
        ],
      },
      { tone: "deep", size: "lg", width: "wide", grain: true, anchor: "wush" },
    ),

    // The Summit — one strand inside WUSH.
    block(
      "split",
      {
        ratio: "1.1/0.9",
        gap: "md",
        verticalAlign: "center",
        columns: [
          {
            kind: "prose",
            eyebrow: "Inside WUSH",
            title: summit.name,
            titleType: type.sectionXlUpper,
            note: `Theme: ${summit.theme}`,
            noteType: type.noteFlat,
            lede: summit.description,
            ledeSize: "md",
            ledeMaxWidth: "xl",
            actions: [
              action("Learn about the Summit", "/ministry/summit", {
                variant: "accent",
                size: "lg",
              }),
            ],
          },
          {
            kind: "media",
            items: [media("editorial-raised-hand", "Ebahi with a raised hand", "50% 18%")],
            ratio: "wide",
            reveal: "left",
            sizes: "(max-width: 1024px) 100vw, 40vw",
          },
        ],
      },
      { tone: "deep", size: "lg", width: "wide", grain: true },
    ),

    // The 5AM Tribe — a formation pillar, so it gets its own room.
    block(
      "split",
      {
        ratio: "0.9/1.1",
        gap: "lg",
        columns: [
          {
            kind: "prose",
            eyebrow: `Founded ${fiveAmTribe.founded}`,
            title: fiveAmTribe.name,
            titleType: type.section2xl,
            note: fiveAmTribe.promise,
            noteType: type.quote,
            noteMaxWidth: "md",
            actions: [
              action(fiveAmTribe.action.label, fiveAmTribe.action.href, {
                variant: "solid",
                size: "lg",
              }),
            ],
          },
          {
            kind: "group",
            layout: "stack",
            gap: "md",
            items: [
              { kind: "prose", paragraphs: [...fiveAmTribe.body], bodySize: "lg" },
              {
                kind: "pillars",
                columns: 2,
                numbered: true,
                cellTone: "canvas",
                items: fiveAmTribe.rhythm.map((item) => ({
                  title: item.title,
                  body: item.body,
                })),
              },
            ],
          },
        ],
      },
      { tone: "canvas", size: "lg", width: "wide", anchor: "tribe" },
    ),

    // We Evangelise — the outreach arm.
    block(
      "split",
      {
        ratio: "1/1",
        gap: "lg",
        columns: [
          {
            kind: "prose",
            eyebrow: "Outreach",
            title: weEvangelise.name,
            titleType: type.sectionMd,
            note: weEvangelise.promise,
            noteType: type.noteFlat,
            paragraphs: [...weEvangelise.body],
            actions: [
              action(weEvangelise.action.label, weEvangelise.action.href, {
                variant: "outline",
                size: "lg",
              }),
            ],
          },
          {
            kind: "stats",
            columns: 3,
            framed: true,
            selfStart: true,
            valueType: type.numeral,
            items: weEvangelise.stats.map((stat) => ({ value: stat.value, label: stat.label })),
          },
        ],
      },
      { tone: "sand", size: "lg", width: "wide", grain: true },
    ),

    engage(
      "Get involved",
      "Bring SilentShout to your music team.",
      [action("Request a workshop", "/work-with-me"), action("Contact SilentShout", "/contact")],
      "Workshops, training and school enquiries for churches, worship departments and creative collectives.",
    ),
  ],
});

/* ---------------------------------------------------------------- *
 * The Young Music Ministers Summit
 * ---------------------------------------------------------------- */
pageSeeds.push({
  id: "ministry-summit",
  slug: "ministry/summit",
  title: "The Young Music Ministers Summit",
  description: summit.description,
  palette: "silentshout",
  blocks: [
    block("pageHero", {
      eyebrow: "SilentShout presents",
      title: summit.name,
      titleType: type.pageTitle,
      lede: summit.description,
      tone: "deep",
      note: `Theme: ${summit.theme}`,
    }),

    block(
      "split",
      {
        ratio: "1.05/0.95",
        gap: "lg",
        columns: [
          {
            kind: "group",
            layout: "stack",
            gap: "md",
            items: [
              {
                kind: "prose",
                eyebrow: "Why the Summit",
                title: "A calling you did not ask for and cannot shake.",
                titleType: type.sectionMd,
                paragraphs: [...summit.body],
                bodySize: "lg",
              },
              { kind: "chips", label: "Who it is for", items: [...summit.forWho] },
            ],
          },
          {
            kind: "media",
            items: [media("garden-swing-reach", "Ebahi reaching upward", "50% 30%")],
            parallax: true,
            aspect: "4/5",
            reveal: "left",
            sizes: "(max-width: 1024px) 100vw, 40vw",
          },
        ],
      },
      { tone: "canvas", size: "lg", width: "wide" },
    ),

    block(
      "stack",
      {
        gap: "lg",
        items: [
          {
            kind: "prose",
            eyebrow: "Sessions",
            title: summit.theme,
            titleType: type.sectionMd,
            lede: "Four conversations, taught honestly, for ministers at the beginning of a long road.",
          },
          {
            kind: "pillars",
            columns: 4,
            numbered: true,
            cellTone: "surface",
            items: summit.sessions.map((session) => ({
              title: session.title,
              body: session.body,
            })),
          },
        ],
      },
      { tone: "surface", size: "lg", width: "wide" },
    ),

    newsletterPanel(
      "Registration",
      "Dates for the next Summit are being confirmed.",
      "Join the list and you will be the first to know when registration opens.",
    ),

    engage("Partner with the Summit", "Bring your music team, or host the Summit in your city.", [
      action("Talk to the team", "/contact"),
      action("Back to SilentShout", "/ministry"),
    ]),
  ],
});

/* ---------------------------------------------------------------- *
 * Edwoltz Hair City
 * ---------------------------------------------------------------- */
pageSeeds.push({
  id: "edwoltz",
  slug: "edwoltz",
  title: "Edwoltz Hair City",
  description: `${edwoltz.positioning} — the hair business founded by ${site.name}.`,
  palette: "edwoltz",
  blocks: [
    block("pageHero", {
      eyebrow: edwoltz.name,
      title: edwoltz.headline,
      titleType: type.pageTitle,
      lede: edwoltz.positioning,
      tone: "deep",
      media: { ...edwoltz.media, focus: "50% 30%" },
      actions: [
        action(edwoltz.cta.label, edwoltz.cta.href, {
          external: true,
          variant: "accent",
          size: "lg",
        }),
        action(edwoltz.youtube.label, edwoltz.youtube.href, {
          external: true,
          variant: "outlineLight",
          size: "lg",
        }),
      ],
    }),

    block(
      "split",
      {
        ratio: "1.05/0.95",
        gap: "lg",
        columns: [
          {
            kind: "prose",
            eyebrow: "A separate business",
            title: "Its own brand. Its own standards.",
            titleType: type.sectionMd,
            paragraphs: [...edwoltz.intro],
            bodySize: "lg",
          },
          {
            kind: "media",
            items: [
              media(
                "hair-pink-cape",
                "Ebahi in a pink patchwork cape, natural hair worn out",
                "50% 25%",
              ),
            ],
            ratio: "portrait",
            reveal: "left",
            sizes: "(max-width: 1024px) 100vw, 40vw",
          },
        ],
      },
      { tone: "canvas", size: "lg", width: "wide" },
    ),

    block(
      "stack",
      {
        gap: "lg",
        items: [
          {
            kind: "prose",
            eyebrow: "What Edwoltz does",
            title: "Services & education",
            titleType: type.sectionMd,
          },
          {
            kind: "pillars",
            columns: 4,
            numbered: true,
            cellTone: "surface",
            items: edwoltz.services.map((service) => ({
              title: service.title,
              body: service.body,
            })),
          },
        ],
      },
      { tone: "surface", size: "lg", width: "wide" },
    ),

    block(
      "gallery",
      {
        items: edwoltz.gallery.map((item) => ({ ...item })),
        heading: { eyebrow: "The work", title: "Hair, up close.", gap: "lg" },
      },
      { tone: "canvas", size: "lg", width: "wide" },
    ),

    block(
      "split",
      {
        ratio: "1/1",
        gap: "md",
        verticalAlign: "center",
        columns: [
          {
            kind: "media",
            items: [{ ...environment.media }],
            ratio: "wide",
            reveal: "right",
            sizes: "(max-width: 1024px) 100vw, 45vw",
          },
          {
            kind: "prose",
            eyebrow: "Beauty, business & the environment",
            title: environment.heading,
            titleType: type.sectionLg,
            lede: environment.statement,
            ledeMaxWidth: "xl",
            actions: [
              action("Explore the hair & environment project", "/edwoltz/environment", {
                variant: "accent",
              }),
            ],
          },
        ],
      },
      { tone: "deep", size: "lg", width: "wide", grain: true },
    ),

    engage(
      "Edwoltz enquiries",
      "Wig revamping, hair services, training and business enquiries.",
      [
        action("Contact Edwoltz", "/contact"),
        action(edwoltz.cta.label, edwoltz.cta.href, { external: true }),
      ],
    ),
  ],
});

/* ---------------------------------------------------------------- *
 * Hair & Environment
 * ---------------------------------------------------------------- */
pageSeeds.push({
  id: "edwoltz-environment",
  slug: "edwoltz/environment",
  title: "Hair & Environment",
  description: environment.statement,
  palette: "edwoltz",
  blocks: [
    block("pageHero", {
      eyebrow: "Hair & environment project",
      title: environment.heading,
      titleType: type.pageTitle,
      lede: environment.statement,
      tone: "deep",
    }),

    block(
      "split",
      {
        ratio: "1.05/0.95",
        gap: "lg",
        columns: [
          {
            kind: "prose",
            eyebrow: "Why this project",
            title: "Two lives, one question.",
            titleType: type.sectionMd,
            paragraphs: [...environment.body],
            bodySize: "lg",
            quote: {
              text: credentials
                .map(
                  (credential) =>
                    `**${credential.qualification}**~ — ${credential.institution}~`,
                )
                .join("\n"),
              style: "rule",
              face: "sans",
              tone: "body",
              type: { min: 0.875, vw: 0, max: 0.875, leading: 1.7 },
            },
          },
          {
            kind: "media",
            items: [media("garden-path", "Ebahi walking a garden path", "50% 40%")],
            parallax: true,
            aspect: "4/5",
            reveal: "left",
            sizes: "(max-width: 1024px) 100vw, 40vw",
          },
        ],
      },
      { tone: "canvas", size: "lg", width: "wide" },
    ),

    block(
      "stack",
      {
        gap: "lg",
        items: [
          {
            kind: "prose",
            eyebrow: "The conversations",
            title: "What we talk about",
            titleType: type.sectionMd,
          },
          {
            kind: "indexList",
            numbered: true,
            type: type.indexRow,
            items: environment.themes.map((theme) => ({ title: theme })),
            action: {
              label: environment.cta.label,
              href: environment.cta.href,
              external: true,
              variant: "outline",
              size: "lg",
            },
          },
        ],
      },
      { tone: "surface", size: "lg", width: "wide" },
    ),

    engage("Speak on this", "Invite Ebahi to speak on beauty, business and sustainability.", [
      action("Invite Ebahi", "/work-with-me"),
      action("Back to Edwoltz", "/edwoltz"),
    ]),
  ],
});

/* ------------------------------------------------------------------ *
 * Entry point
 * ------------------------------------------------------------------ */

async function seedPages(): Promise<void> {
  for (const [index, seed] of pageSeeds.entries()) {
    await writeDocument(`pages/${seed.id}`, pageSchema, {
      id: seed.id,
      slug: seed.slug,
      title: seed.title,
      status: "published",
      order: index,
      seo: { description: seed.description, keywords: [], noIndex: false },
      palette: seed.palette,
      // Authored as plain objects above; `pageSchema.parse` is what
      // proves they are valid blocks, and it runs before any write.
      blocks: seed.blocks as z.input<typeof pageSchema>["blocks"],
      inSitemap: true,
      system: seed.system ?? false,
      updatedAt: new Date("2026-10-28T00:00:00.000Z").toISOString(),
    });
  }
}

async function main(): Promise<void> {
  await mkdir(DATA_ROOT, { recursive: true });

  await seedMediaLibrary();
  await seedTheme();
  await seedSettings();
  await seedNavigation();
  await seedCollections();
  await seedPages();

  console.log(`\n✓ wrote ${written.length} document${written.length === 1 ? "" : "s"}`);
  if (written.length > 0) console.log(`  ${written.join("\n  ")}`);

  if (skipped.length > 0) {
    console.log(
      `\n· kept ${skipped.length} existing document${skipped.length === 1 ? "" : "s"} (pass --force to overwrite)`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
