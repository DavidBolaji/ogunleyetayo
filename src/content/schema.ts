/**
 * The content schema — the single source of truth for the CMS.
 *
 * Every document in the file database is parsed through a schema here
 * before it is trusted, and every type in `types.ts` is inferred from
 * one of these. Defining a field once means the validator, the
 * TypeScript type and (via `fields.ts`) the dashboard form all stay in
 * step automatically.
 */
import { z } from "zod";

/* ------------------------------------------------------------------ *
 * Primitives
 * ------------------------------------------------------------------ */

/** Slug-safe identifier — used for ids, palette keys and collection names. */
export const idSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9][a-z0-9-]*$/, "Use lowercase letters, numbers and hyphens");

/**
 * A palette key. Open rather than enumerated: palettes live in the
 * database now, so adding one must not require a code change.
 */
export const brandKeySchema = idSchema;

/** Page slugs allow nesting (`ministry/summit`); the home page is "". */
export const slugSchema = z
  .string()
  .trim()
  .max(200)
  .regex(/^$|^[a-z0-9][a-z0-9-]*(\/[a-z0-9][a-z0-9-]*)*$/, "Use lowercase path segments");

/**
 * Any href the editor can enter. Internal paths, anchors, mailto, tel,
 * http(s) and `{site.*}` tokens only — `javascript:` and `data:` are
 * rejected so a link field can never become a script sink. The token
 * form is allowed because a contact link should follow the phone
 * number in Settings rather than be copied beside it.
 */
export const hrefSchema = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (value) =>
      value === "" ||
      /^(https?:\/\/|mailto:|tel:|\/|#|\{site\.[a-zA-Z]+\})/.test(value),
    "Links must start with /, #, http(s)://, mailto:, tel: or a {site.*} token",
  );

export const colorSchema = z
  .string()
  .trim()
  .regex(
    /^(#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|rgba?\([^()]{0,64}\)|hsla?\([^()]{0,64}\)|transparent|currentColor)$/,
    "Enter a hex, rgb() or hsl() colour",
  );

export const mediaSchema = z.object({
  /** Key of an item in the media library. */
  src: z.string().trim().min(1).max(200),
  alt: z.string().trim().max(400),
  /** CSS object-position, for art-directing tight crops. */
  focus: z.string().trim().max(40).optional(),
  /* The three fields below are hydrated from the media library when a
     document is loaded. They are never authored, and are optional so a
     reference stays valid if its library entry is missing. */
  url: z.string().optional(),
  blurDataURL: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

export const actionVariantSchema = z.enum([
  "solid",
  "outline",
  "outlineLight",
  "accent",
  "ghost",
  "link",
]);

export const actionSizeSchema = z.enum(["sm", "md", "lg"]);

export const actionSchema = z.object({
  label: z.string().trim().min(1).max(160),
  href: hrefSchema,
  /** Marks links that leave the personal-brand site. */
  external: z.boolean().optional(),
  variant: actionVariantSchema.optional(),
  size: actionSizeSchema.optional(),
});

/* ------------------------------------------------------------------ *
 * Presentation vocabulary
 *
 * These mirror the design system's existing scales rather than
 * exposing raw CSS, so anything the dashboard produces still sits on
 * the site's rhythm.
 * ------------------------------------------------------------------ */

export const toneSchema = z.enum(["canvas", "surface", "sand", "deep", "none"]);
export const spaceSchema = z.enum(["none", "xs", "sm", "md", "lg", "xl"]);
export const widthSchema = z.enum(["narrow", "default", "wide", "full"]);
export const alignSchema = z.enum(["left", "center", "right"]);
/** Body-copy steps. Body text sits on a short, genuinely discrete ramp. */
export const textSizeSchema = z.enum(["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "display"]);

/**
 * A fluid display-type style.
 *
 * Stored as the three numbers of a `clamp()` plus the leading, tracking
 * and casing that go with it, rather than a step on a fixed ramp. The
 * site's typography uses more than twenty distinct display sizes, each
 * tuned to its section, so an enum would have forced every heading onto
 * a neighbouring step. This keeps each one exact while still letting
 * the theme's global `typography.scale` multiply all of them, and gives
 * the dashboard real font-size control instead of three t-shirt sizes.
 */
export const typeStyleSchema = z.object({
  /** Minimum size, in rem. */
  min: z.number().min(0.5).max(14),
  /** Fluid middle, in vw. */
  vw: z.number().min(0).max(24),
  /** Maximum size, in rem. */
  max: z.number().min(0.5).max(24),
  leading: z.number().min(0.7).max(2.2).default(1.05),
  tracking: z
    .string()
    .trim()
    .regex(/^$|^-?\d(?:\.\d{1,3})?em$/)
    .default(""),
  case: z.enum(["normal", "upper"]).default("normal"),
  italic: z.boolean().default(false),
});
export const ratioSchema = z.enum(["portrait", "tall", "square", "wide", "cinema", "auto"]);
export const revealSchema = z.enum(["up", "down", "left", "right", "none"]);

/** Semantic token overrides. Written as inline CSS variables, so a
 *  block can carry its own palette without any hardcoded colour. */
export const colorOverridesSchema = z
  .object({
    canvas: colorSchema,
    surface: colorSchema,
    sand: colorSchema,
    deep: colorSchema,
    deepSoft: colorSchema,
    ink: colorSchema,
    muted: colorSchema,
    line: colorSchema,
    accent: colorSchema,
    accentSoft: colorSchema,
    accentInk: colorSchema,
    onDeep: colorSchema,
    onDeepMuted: colorSchema,
    heading: colorSchema,
  })
  .partial();

export const blockStyleSchema = z.object({
  tone: toneSchema.default("canvas"),
  size: z.enum(["sm", "md", "lg"]).default("md"),
  /** Overrides `size` on one edge — lets neighbouring blocks share a band. */
  paddingTop: spaceSchema.optional(),
  paddingBottom: spaceSchema.optional(),
  width: widthSchema.default("default"),
  /** Adopts a palette for this block only. */
  palette: brandKeySchema.optional(),
  grain: z.boolean().default(false),
  align: alignSchema.default("left"),
  /** Renders as the section's `id`, so in-page links keep working. */
  anchor: z
    .string()
    .trim()
    .max(80)
    .regex(/^$|^[a-z0-9][a-z0-9-]*$/)
    .optional(),
  colors: colorOverridesSchema.default({}),
  /** Hairline divider above or below the block. */
  borderTop: z.boolean().default(false),
  borderBottom: z.boolean().default(false),
});

/* ------------------------------------------------------------------ *
 * Column kinds
 *
 * The `split` and `stack` blocks are composed from these, which is
 * what keeps the block catalogue small: one text column definition
 * serves every editorial two-column section on the site.
 * ------------------------------------------------------------------ */

const quoteSchema = z.object({
  text: z.string().trim().max(1200),
  caption: z.string().trim().max(200).optional(),
  /** `rule` is the bordered pull-quote; `plain` is unadorned display type. */
  style: z.enum(["rule", "plain"]).default("rule"),
  type: typeStyleSchema.default({ min: 1.25, vw: 2.4, max: 1.5, leading: 1.3, italic: true }),
  /** `sans` is for small print set against the accent rule. */
  face: z.enum(["display", "sans"]).default("display"),
  tone: z.enum(["heading", "accent", "body"]).default("heading"),
  /** Wraps the text in typographic quotation marks. */
  quoted: z.boolean().default(false),
});

const proseColumn = z.object({
  kind: z.literal("prose"),
  eyebrow: z.string().trim().max(160).optional(),
  title: z.string().trim().max(400).optional(),
  titleType: typeStyleSchema.default({ min: 1.875, vw: 4.2, max: 3.25, leading: 1.05 }),
  /**
   * `p` keeps a long statement out of the heading outline and lets it
   * take the body colour — display type that is not a heading.
   */
  titleTag: z.enum(["h1", "h2", "h3", "p"]).default("h2"),
  /**
   * A line of accent display type directly under the title — a theme, a
   * promise, a one-line claim. Frequent enough in the design to be a
   * field rather than a second column.
   */
  note: z.string().trim().max(600).optional(),
  noteType: typeStyleSchema.default({ min: 1.25, vw: 1.6, max: 1.5, leading: 1.375, italic: true }),
  noteMaxWidth: z.enum(["none", "sm", "md", "lg", "xl", "2xl", "3xl"]).default("none"),
  lede: z.string().trim().max(2000).optional(),
  /** Defaults to `bodySize` when unset. */
  ledeSize: textSizeSchema.optional(),
  ledeMaxWidth: z.enum(["none", "sm", "md", "lg", "xl", "2xl", "3xl"]).default("2xl"),
  paragraphs: z.array(z.string().trim().max(4000)).default([]),
  bodySize: textSizeSchema.default("md"),
  /** How strongly body copy reads against its ground. */
  bodyTone: z.enum(["body", "muted", "strong"]).default("body"),
  quote: quoteSchema.optional(),
  actions: z.array(actionSchema).max(6).default([]),
  chips: z.array(z.string().trim().max(120)).default([]),
  chipsLabel: z.string().trim().max(160).optional(),
  align: alignSchema.optional(),
  maxWidth: z.enum(["none", "sm", "md", "lg", "xl", "2xl", "3xl"]).default("none"),
  /** Top padding that optically settles a column against a tall image. */
  offsetTop: z.enum(["none", "sm", "md"]).default("none"),
});

const mediaColumn = z.object({
  kind: z.literal("media"),
  items: z.array(mediaSchema).min(1).max(4),
  /** `offsetPair` is the overlapping two-frame treatment on the homepage. */
  layout: z.enum(["single", "offsetPair", "stack"]).default("single"),
  ratio: ratioSchema.default("portrait"),
  /** Fixed aspect expressed as a Tailwind arbitrary value, e.g. `4/5`. */
  aspect: z
    .string()
    .trim()
    .regex(/^$|^\d{1,2}\/\d{1,2}$/)
    .optional(),
  parallax: z.boolean().default(false),
  scrim: z.enum(["none", "soft", "strong"]).default("none"),
  caption: z.string().trim().max(200).optional(),
  reveal: revealSchema.default("right"),
  sizes: z.string().trim().max(200).optional(),
  priority: z.boolean().default(false),
  /** Some frames are a desktop luxury and crowd a narrow screen. */
  hideOnMobile: z.boolean().default(false),
  gapTop: spaceSchema.default("none"),
});

const pillarsColumn = z.object({
  kind: z.literal("pillars"),
  items: z
    .array(
      z.object({
        /** Overrides the auto "01" counter — used for named steps. */
        label: z.string().trim().max(24).optional(),
        title: z.string().trim().max(240),
        body: z.string().trim().max(1200).optional(),
      }),
    )
    .default([]),
  columns: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).default(4),
  numbered: z.boolean().default(true),
  /** Cells sit on hairline dividers, so they must match the host tone. */
  cellTone: z.enum(["canvas", "surface", "sand", "deep", "inherit"]).default("inherit"),
  intro: z.array(z.string().trim().max(4000)).default([]),
  selfStart: z.boolean().default(false),
});

const statsColumn = z.object({
  kind: z.literal("stats"),
  items: z
    .array(z.object({ value: z.string().trim().max(40), label: z.string().trim().max(240) }))
    .default([]),
  columns: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).default(3),
  valueType: typeStyleSchema.default({ min: 2.5, vw: 6, max: 4, leading: 1 }),
  framed: z.boolean().default(true),
  selfStart: z.boolean().default(true),
});

const chipsColumn = z.object({
  kind: z.literal("chips"),
  label: z.string().trim().max(160).optional(),
  items: z.array(z.string().trim().max(160)).default([]),
  size: z.enum(["sm", "md"]).default("sm"),
  /** `filled` sits on the surface colour; `outline` is a hairline pill. */
  variant: z.enum(["outline", "filled"]).default("outline"),
  interactive: z.boolean().default(false),
});

const yearsColumn = z.object({
  kind: z.literal("years"),
  label: z.string().trim().max(160).optional(),
  items: z.array(z.string().trim().max(40)).default([]),
  type: typeStyleSchema.default({ min: 2.25, vw: 7, max: 5, leading: 1, tracking: "-0.03em" }),
  dividerTop: z.boolean().default(false),
});

const indexListColumn = z.object({
  kind: z.literal("indexList"),
  items: z
    .array(
      z.object({
        title: z.string().trim().max(400),
        body: z.string().trim().max(1200).optional(),
      }),
    )
    .default([]),
  numbered: z.boolean().default(true),
  type: typeStyleSchema.default({ min: 1.25, vw: 2.6, max: 2, leading: 1.25 }),
  action: actionSchema.optional(),
});

const embedsColumn = z.object({
  kind: z.literal("embeds"),
  items: z
    .array(
      z.object({
        label: z.string().trim().max(200).optional(),
        /** A YouTube, Vimeo or Spotify URL. Empty renders a marked slot. */
        url: hrefSchema.default(""),
      }),
    )
    .default([]),
  columns: z.union([z.literal(1), z.literal(2)]).default(2),
});

const newsletterColumn = z.object({
  kind: z.literal("newsletter"),
  note: z.string().trim().max(1200).optional(),
  tone: z.enum(["light", "deep"]).default("light"),
  maxWidth: z.enum(["none", "sm", "md", "lg"]).default("md"),
});

const enquiryFormColumn = z.object({
  kind: z.literal("enquiryForm"),
  intent: z.enum(["general", "speaking"]).default("general"),
  eventTypesCollection: z.string().trim().max(120).optional(),
  framed: z.boolean().default(true),
  frameTone: z.enum(["canvas", "surface"]).default("canvas"),
});

const contactDetailsColumn = z.object({
  kind: z.literal("contactDetails"),
  items: z
    .array(
      z.object({
        label: z.string().trim().max(120),
        /** Supports `{site.email}`-style tokens resolved from settings. */
        value: z.string().trim().max(400),
        href: hrefSchema.default(""),
      }),
    )
    .default([]),
  socialsLabel: z.string().trim().max(120).optional(),
});

const galleryColumn = z.object({
  kind: z.literal("gallery"),
  items: z.array(mediaSchema).default([]),
  /** Left off, the grid alternates portrait and tall frames. */
  ratio: ratioSchema.optional(),
});

const spacerColumn = z.object({
  kind: z.literal("spacer"),
  height: spaceSchema.default("md"),
});

const baseColumns = [
  proseColumn,
  mediaColumn,
  pillarsColumn,
  statsColumn,
  chipsColumn,
  yearsColumn,
  indexListColumn,
  embedsColumn,
  newsletterColumn,
  enquiryFormColumn,
  contactDetailsColumn,
  galleryColumn,
  spacerColumn,
] as const;

export const baseColumnSchema = z.discriminatedUnion("kind", [...baseColumns]);

/**
 * One level of nesting.
 *
 * Several sections are "a heading, then a grid" or "copy and a list in
 * one half of a split". A group gives those a home without a block
 * type each, and without making the column union recursive — which
 * `discriminatedUnion` cannot express and an editor would struggle to
 * reason about anyway.
 */
const groupColumn = z.object({
  kind: z.literal("group"),
  layout: z.enum(["stack", "split"]).default("stack"),
  items: z.array(baseColumnSchema).min(1).max(6),
  /** Only read when `layout` is "split". */
  ratio: z
    .string()
    .trim()
    .regex(/^\d(?:\.\d{1,2})?\/\d(?:\.\d{1,2})?$/)
    .default("1/1"),
  gap: z.enum(["none", "sm", "md", "lg", "xl"]).default("md"),
  verticalAlign: z.enum(["start", "center", "end"]).default("start"),
  breakpoint: z.enum(["sm", "lg"]).default("lg"),
});

export const columnSchema = z.discriminatedUnion("kind", [...baseColumns, groupColumn]);

export const columnKinds = [
  "prose",
  "media",
  "pillars",
  "stats",
  "chips",
  "years",
  "indexList",
  "embeds",
  "newsletter",
  "enquiryForm",
  "contactDetails",
  "gallery",
  "spacer",
  "group",
] as const;

/* ------------------------------------------------------------------ *
 * Blocks
 * ------------------------------------------------------------------ */

/** Optional opening heading shared by every collection-driven block. */
const headingSchema = z
  .object({
    eyebrow: z.string().trim().max(160).optional(),
    title: z.string().trim().max(400).optional(),
    lede: z.string().trim().max(2000).optional(),
    align: alignSchema.default("left"),
    size: z.enum(["md", "lg"]).default("md"),
    /** Overrides `size` with an exact type style. */
    titleType: typeStyleSchema.optional(),
    gap: spaceSchema.default("lg"),
  })
  .optional();

const collectionRef = z.string().trim().min(1).max(120);

const heroData = z.object({
  eyebrow: z.string().trim().max(240).optional(),
  headlineWords: z.array(z.string().trim().max(80)).min(1).max(6),
  /**
   * The page's real <h1>. The masthead words are set as separate lines
   * for the staggered entrance and are hidden from assistive tech, so
   * the accessible heading is written once, here.
   */
  headlineLabel: z.string().trim().max(240).optional(),
  /** Which word takes the italic accent treatment; -1 for none. */
  accentWordIndex: z.number().int().min(-1).max(5).default(1),
  support: z.string().trim().max(1200).optional(),
  actions: z.array(actionSchema).max(4).default([]),
  media: mediaSchema,
  badge: z
    .object({ label: z.string().trim().max(80), text: z.string().trim().max(240) })
    .optional(),
  titleType: typeStyleSchema.default({
    min: 2.75,
    vw: 7.6,
    max: 6.5,
    leading: 0.86,
    tracking: "-0.03em",
    case: "upper",
  }),
});

const pageHeroData = z.object({
  eyebrow: z.string().trim().max(240),
  title: z.string().trim().max(400),
  lede: z.string().trim().max(2000).optional(),
  media: mediaSchema.optional(),
  tone: z.enum(["canvas", "deep"]).default("canvas"),
  actions: z.array(actionSchema).max(5).default([]),
  /** A line of display type under the actions — e.g. "Theme: …". */
  note: z.string().trim().max(400).optional(),
  titleType: typeStyleSchema.default({
    min: 2.5,
    vw: 7,
    max: 5.5,
    leading: 0.92,
    tracking: "-0.03em",
    case: "upper",
  }),
});

const marqueeData = z.object({
  items: z.array(z.string().trim().max(80)).min(1).max(12),
  separator: z.string().trim().max(8).default("→"),
  duration: z.number().int().min(8).max(120).default(32),
  type: typeStyleSchema.default({
    min: 1.75,
    vw: 4.5,
    max: 3.25,
    leading: 1,
    tracking: "-0.01em",
    case: "upper",
  }),
});

const splitData = z.object({
  columns: z.tuple([columnSchema, columnSchema]),
  /** Grid ratio as `left/right` fractions. */
  ratio: z
    .string()
    .trim()
    .regex(/^\d(?:\.\d{1,2})?\/\d(?:\.\d{1,2})?$/)
    .default("1/1"),
  verticalAlign: z.enum(["start", "center", "end"]).default("start"),
  gap: z.enum(["sm", "md", "lg", "xl"]).default("lg"),
  /** Puts the right-hand column first on narrow screens. */
  reverseOnMobile: z.boolean().default(false),
  /** Swaps the columns from the breakpoint up. */
  reverseOnDesktop: z.boolean().default(false),
  breakpoint: z.enum(["sm", "lg"]).default("lg"),
});

const stackData = z.object({
  items: z.array(columnSchema).min(1).max(8),
  maxWidth: z.enum(["none", "sm", "md", "lg", "xl", "2xl", "3xl"]).default("none"),
  centered: z.boolean().default(false),
  gap: z.enum(["none", "sm", "md", "lg", "xl"]).default("md"),
});

const expressionIndexData = z.object({ heading: headingSchema, collection: collectionRef });
const programmeListData = z.object({ heading: headingSchema, collection: collectionRef });
const bookShelfData = z.object({ heading: headingSchema, collection: collectionRef });
const timelineData = z.object({ heading: headingSchema, collection: collectionRef });

const releaseGridData = z.object({
  heading: headingSchema,
  collection: collectionRef,
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(4),
});

const postGridData = z.object({
  heading: headingSchema,
  collection: collectionRef,
  columns: z.union([z.literal(2), z.literal(3)]).default(3),
  /** 0 means every published post. */
  limit: z.number().int().min(0).max(60).default(0),
  emptyHeadline: z.string().trim().max(1200).optional(),
  emptyNote: z.string().trim().max(1200).optional(),
  emptyCategoriesCollection: z.string().trim().max(120).optional(),
  emptyNewsletter: z.boolean().default(true),
});

const galleryData = z.object({
  heading: headingSchema,
  items: z.array(mediaSchema).default([]),
  /** Left off, the grid alternates portrait and tall frames. */
  ratio: ratioSchema.optional(),
});

/* The gallery block and the gallery column share one payload shape and
   one renderer; the block exists only so a gallery can be a section of
   its own with its own ground. */

const featuredReleaseData = z.object({
  eyebrow: z.string().trim().max(160).default("Featured project"),
  title: z.string().trim().max(120),
  meaning: z.string().trim().max(240).optional(),
  quote: z.string().trim().max(600).optional(),
  description: z.string().trim().max(2000).optional(),
  showDescription: z.boolean().default(false),
  facts: z
    .array(
      z.object({
        label: z.string().trim().max(80),
        value: z.string().trim().max(240),
        accent: z.boolean().default(false),
      }),
    )
    .max(4)
    .default([]),
  actions: z.array(actionSchema).max(4).default([]),
  media: mediaSchema,
  titleType: typeStyleSchema.default({
    min: 3.5,
    vw: 12,
    max: 9,
    leading: 0.82,
    tracking: "-0.04em",
    case: "upper",
  }),
});

const recognitionStripData = z.object({
  heading: headingSchema,
  note: z.string().trim().max(1200).optional(),
  collection: collectionRef,
  credentialsCollection: collectionRef,
});

const engageBannerData = z.object({
  eyebrow: z.string().trim().max(160).default("How can I engage?"),
  title: z.string().trim().max(400),
  body: z.string().trim().max(2000).optional(),
  actions: z.array(actionSchema).min(1).max(5),
  titleType: typeStyleSchema.default({ min: 1.875, vw: 4.5, max: 3.25, leading: 1.05 }),
});

const enquiryRoutesData = z.object({
  heading: headingSchema,
  collection: collectionRef,
  columns: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(3),
});

/**
 * Every block carries the same envelope — identity, visibility,
 * presentation — around a type-specific payload. Written through this
 * factory so the discriminated union keeps precise types.
 */
const blockOf = <T extends string, D extends z.ZodTypeAny>(type: T, data: D) =>
  z.object({
    id: z.string().trim().min(1).max(60),
    type: z.literal(type),
    visible: z.boolean().default(true),
    /** Shown in the dashboard's block list instead of the type name. */
    name: z.string().trim().max(160).optional(),
    style: blockStyleSchema,
    data,
  });

export const blockSchema = z.discriminatedUnion("type", [
  blockOf("hero", heroData),
  blockOf("pageHero", pageHeroData),
  blockOf("marquee", marqueeData),
  blockOf("split", splitData),
  blockOf("stack", stackData),
  blockOf("expressionIndex", expressionIndexData),
  blockOf("programmeList", programmeListData),
  blockOf("bookShelf", bookShelfData),
  blockOf("releaseGrid", releaseGridData),
  blockOf("postGrid", postGridData),
  blockOf("timeline", timelineData),
  blockOf("gallery", galleryData),
  blockOf("featuredRelease", featuredReleaseData),
  blockOf("recognitionStrip", recognitionStripData),
  blockOf("engageBanner", engageBannerData),
  blockOf("enquiryRoutes", enquiryRoutesData),
]);

/** Payload schema per block type — the dashboard validates against these. */
export const blockDataSchemas = {
  hero: heroData,
  pageHero: pageHeroData,
  marquee: marqueeData,
  split: splitData,
  stack: stackData,
  expressionIndex: expressionIndexData,
  programmeList: programmeListData,
  bookShelf: bookShelfData,
  releaseGrid: releaseGridData,
  postGrid: postGridData,
  timeline: timelineData,
  gallery: galleryData,
  featuredRelease: featuredReleaseData,
  recognitionStrip: recognitionStripData,
  engageBanner: engageBannerData,
  enquiryRoutes: enquiryRoutesData,
} as const;

export type BlockType = keyof typeof blockDataSchemas;

export const blockTypes = [
  "hero",
  "pageHero",
  "marquee",
  "split",
  "stack",
  "expressionIndex",
  "programmeList",
  "bookShelf",
  "releaseGrid",
  "postGrid",
  "timeline",
  "gallery",
  "featuredRelease",
  "recognitionStrip",
  "engageBanner",
  "enquiryRoutes",
] as const satisfies readonly BlockType[];

export const blockDataSchemaFor = <T extends BlockType>(type: T) => blockDataSchemas[type];

/* ------------------------------------------------------------------ *
 * Documents
 * ------------------------------------------------------------------ */

export const seoSchema = z.object({
  title: z.string().trim().max(200).optional(),
  description: z.string().trim().max(400).optional(),
  keywords: z.array(z.string().trim().max(80)).max(30).default([]),
  image: z.string().trim().max(200).optional(),
  noIndex: z.boolean().default(false),
});

export const pageSchema = z.object({
  id: idSchema,
  slug: slugSchema,
  title: z.string().trim().min(1).max(200),
  status: z.enum(["published", "draft"]).default("draft"),
  /** Sort position in the dashboard's page list. */
  order: z.number().int().min(0).max(9999).default(0),
  seo: seoSchema.default({ keywords: [], noIndex: false }),
  /** Wraps the whole page in a palette — how the brand pages work. */
  palette: brandKeySchema.optional(),
  blocks: z.array(blockSchema).default([]),
  /** Excluded from the sitemap when false. */
  inSitemap: z.boolean().default(true),
  /** System pages cannot be deleted from the dashboard. */
  system: z.boolean().default(false),
  updatedAt: z.string().datetime().optional(),
});

export const navItemSchema: z.ZodType<NavItem, z.ZodTypeDef, unknown> = z.lazy(() =>
  z.object({
    id: z.string().trim().min(1).max(60),
    label: z.string().trim().min(1).max(120),
    href: hrefSchema,
    external: z.boolean().default(false),
    visible: z.boolean().default(true),
    children: z.array(navItemSchema).max(20).default([]),
  }),
);

export const navigationSchema = z.object({
  header: z.array(navItemSchema).max(20).default([]),
  /** Footer "Navigate" column; left empty it mirrors the top-level header. */
  footer: z.array(navItemSchema).max(20).default([]),
});

export const socialSchema = z.object({
  id: z.string().trim().min(1).max(60),
  platform: z.string().trim().min(1).max(60),
  handle: z.string().trim().max(120),
  href: hrefSchema,
});

export const settingsSchema = z.object({
  site: z.object({
    name: z.string().trim().min(1).max(200),
    shortName: z.string().trim().max(120),
    descriptor: z.string().trim().max(400),
    tagline: z.string().trim().max(200),
    positioning: z.string().trim().max(2000),
    url: z.string().trim().url(),
    email: z.string().trim().max(200),
    phone: z.string().trim().max(60),
    whatsapp: z.string().trim().max(400),
    location: z.string().trim().max(200),
    church: z.string().trim().max(240),
    wordmarkTagline: z.string().trim().max(120),
  }),
  seo: z.object({
    titleTemplate: z.string().trim().max(120).default("%s"),
    keywords: z.array(z.string().trim().max(80)).max(40).default([]),
    ogImage: z.string().trim().max(200),
    themeColor: colorSchema,
    locale: z.string().trim().max(20).default("en_NG"),
  }),
  socials: z.array(socialSchema).max(20).default([]),
  footer: z.object({
    eyebrow: z.string().trim().max(160),
    title: z.string().trim().max(400),
    body: z.string().trim().max(1200),
    navLabel: z.string().trim().max(120),
    exploreLabel: z.string().trim().max(120),
    exploreCollection: z.string().trim().max(120),
    connectLabel: z.string().trim().max(120),
    rights: z.string().trim().max(200),
  }),
  enquiry: z.object({
    routesCollection: z.string().trim().max(120),
    successMessage: z.string().trim().max(400),
  }),
  blog: z.object({
    postsCollection: z.string().trim().max(120).default("posts"),
    /** The line above the newsletter form at the foot of an article. */
    postFooterNote: z.string().trim().max(600),
    backLabel: z.string().trim().max(120).default("← All posts"),
  }),
});

export const themeTokensSchema = z.record(z.string().max(60), colorSchema);

export const palettePresetSchema = z.object({
  id: brandKeySchema,
  label: z.string().trim().min(1).max(120),
  tokens: themeTokensSchema,
});

export const paletteModeSchema = z.object({
  id: idSchema,
  label: z.string().trim().min(1).max(120),
  description: z.string().trim().max(600).optional(),
  /**
   * Palettes that fall back to the base palette while this mode is
   * active. This is how "unified" mode works: the sub-brand palettes
   * still exist and every block still carries its palette key, but
   * none of them is painted onto the page.
   */
  suppress: z.array(brandKeySchema).max(40).default([]),
});

export const themeSchema = z.object({
  /** The palette every surface falls back to. */
  basePalette: brandKeySchema,
  activeMode: idSchema,
  palettes: z.array(palettePresetSchema).min(1),
  modes: z.array(paletteModeSchema).default([]),
  fonts: z.object({
    display: idSchema,
    sans: idSchema,
  }),
  typography: z.object({
    /** Multiplies every display size — the global type scale. */
    scale: z.number().min(0.7).max(1.6).default(1),
    headingTracking: z.string().trim().max(20).default("-0.02em"),
    headingWeight: z.number().int().min(100).max(900).default(400),
    bodySize: z.string().trim().max(20).default("1rem"),
  }),
});

export const mediaItemSchema = z.object({
  /** The key referenced by `Media.src`. */
  id: z.string().trim().min(1).max(200),
  title: z.string().trim().max(200),
  alt: z.string().trim().max(400),
  focus: z.string().trim().max(40).default("50% 35%"),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  blurDataURL: z.string().max(4000),
  bytes: z.number().int().nonnegative().default(0),
  /**
   * `static` files were produced by the offline pipeline and live in
   * /public/images. `managed` files were uploaded through the dashboard
   * and are served from the media store.
   */
  storage: z.enum(["static", "managed"]).default("managed"),
  createdAt: z.string().datetime(),
  tags: z.array(z.string().trim().max(60)).max(20).default([]),
});

export const mediaLibrarySchema = z.object({
  items: z.array(mediaItemSchema).default([]),
});

/* ------------------------------------------------------------------ *
 * Collections
 *
 * A collection is a named, ordered list of one item kind. New
 * collections are a dashboard action, not a code change — which is how
 * a second set of programmes or a second book series gets added.
 * ------------------------------------------------------------------ */

export const expressionItemSchema = z.object({
  id: idSchema,
  index: z.string().trim().max(8),
  title: z.string().trim().min(1).max(200),
  tagline: z.string().trim().max(600),
  summary: z.string().trim().max(2000),
  includes: z.array(z.string().trim().max(160)).max(20).default([]),
  action: actionSchema,
  media: mediaSchema,
  palette: brandKeySchema.optional(),
});

export const bookItemSchema = z.object({
  id: idSchema,
  slug: idSchema,
  title: z.string().trim().min(1).max(200),
  kind: z.string().trim().max(80),
  description: z.string().trim().max(2000),
  themes: z.array(z.string().trim().max(80)).max(12).default([]),
  action: actionSchema.optional(),
  /** Picks the typographic cover treatment. */
  accentIndex: z.number().int().min(0).max(11).default(0),
  cover: mediaSchema.optional(),
});

export const releaseItemSchema = z.object({
  id: idSchema,
  title: z.string().trim().min(1).max(200),
  subtitle: z.string().trim().max(240).optional(),
  kind: z.string().trim().max(60),
  year: z.string().trim().max(60),
  note: z.string().trim().max(600).optional(),
  media: mediaSchema.optional(),
  action: actionSchema.optional(),
});

export const postItemSchema = z.object({
  id: idSchema,
  slug: idSchema,
  title: z.string().trim().min(1).max(240),
  excerpt: z.string().trim().max(1200),
  /** ISO date — sorted on directly. */
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  category: z.string().trim().max(80),
  readingTime: z.string().trim().max(40),
  status: z.enum(["published", "draft"]).default("published"),
  media: mediaSchema.optional(),
  /** Paragraphs. A string starting with "## " renders as a subheading. */
  body: z.array(z.string().trim().max(8000)).default([]),
});

export const timelineItemSchema = z.object({
  id: idSchema,
  year: z.string().trim().max(80),
  title: z.string().trim().min(1).max(240),
  body: z.string().trim().max(2000),
});

export const recognitionItemSchema = z.object({
  id: idSchema,
  title: z.string().trim().min(1).max(240),
  source: z.string().trim().max(240),
  year: z.string().trim().max(40),
});

export const credentialItemSchema = z.object({
  id: idSchema,
  qualification: z.string().trim().min(1).max(240),
  institution: z.string().trim().max(240),
});

export const programmeItemSchema = z.object({
  id: idSchema,
  name: z.string().trim().min(1).max(200),
  promise: z.string().trim().max(400),
  description: z.string().trim().max(2000),
  detail: z.array(z.string().trim().max(160)).max(12).default([]),
  action: actionSchema,
  media: mediaSchema.optional(),
});

export const enquiryRouteItemSchema = z.object({
  id: idSchema,
  label: z.string().trim().min(1).max(200),
  description: z.string().trim().max(600),
  email: z.string().trim().email(),
  palette: brandKeySchema.optional(),
});

export const tagItemSchema = z.object({
  id: idSchema,
  value: z.string().trim().min(1).max(160),
});

const collectionItemSchemas = {
  expression: expressionItemSchema,
  book: bookItemSchema,
  release: releaseItemSchema,
  post: postItemSchema,
  timeline: timelineItemSchema,
  recognition: recognitionItemSchema,
  credential: credentialItemSchema,
  programme: programmeItemSchema,
  enquiryRoute: enquiryRouteItemSchema,
  tag: tagItemSchema,
} as const;

export type CollectionKind = keyof typeof collectionItemSchemas;

export const collectionKindSchema = z.enum([
  "expression",
  "book",
  "release",
  "post",
  "timeline",
  "recognition",
  "credential",
  "programme",
  "enquiryRoute",
  "tag",
]);

export const collectionKinds = collectionKindSchema.options satisfies readonly CollectionKind[];

export const collectionItemSchemaFor = <K extends CollectionKind>(kind: K) =>
  collectionItemSchemas[kind];

/** A stored collection document. Items are validated against `kind`. */
export const collectionSchema = z.object({
  name: idSchema,
  label: z.string().trim().min(1).max(160),
  kind: collectionKindSchema,
  description: z.string().trim().max(600).optional(),
  system: z.boolean().default(false),
  items: z.array(z.unknown()).default([]),
});

/** Parses a collection document and its items against the item schema. */
export const parseCollection = (input: unknown) => {
  const shell = collectionSchema.parse(input);
  const itemSchema = collectionItemSchemas[shell.kind];
  return { ...shell, items: z.array(itemSchema).parse(shell.items) };
};

/* ------------------------------------------------------------------ *
 * Inferred types
 * ------------------------------------------------------------------ */

export type Media = z.infer<typeof mediaSchema>;
export type Action = z.infer<typeof actionSchema>;
export type ActionVariant = z.infer<typeof actionVariantSchema>;
export type BlockStyle = z.infer<typeof blockStyleSchema>;
export type ColumnSpec = z.infer<typeof columnSchema>;
export type BaseColumnSpec = z.infer<typeof baseColumnSchema>;
export type ColumnKind = ColumnSpec["kind"];
export type Block = z.infer<typeof blockSchema>;
export type BlockOf<T extends BlockType> = Extract<Block, { type: T }>;
export type BlockData<T extends BlockType> = BlockOf<T>["data"];
export type Page = z.infer<typeof pageSchema>;
export type Seo = z.infer<typeof seoSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type Theme = z.infer<typeof themeSchema>;
export type PalettePreset = z.infer<typeof palettePresetSchema>;
export type PaletteMode = z.infer<typeof paletteModeSchema>;
export type MediaItem = z.infer<typeof mediaItemSchema>;
export type MediaLibrary = z.infer<typeof mediaLibrarySchema>;
export type SocialLink = z.infer<typeof socialSchema>;
export type SectionHeadingData = NonNullable<z.infer<typeof headingSchema>>;
export type Tone = z.infer<typeof toneSchema>;
export type Space = z.infer<typeof spaceSchema>;
export type Width = z.infer<typeof widthSchema>;
export type Align = z.infer<typeof alignSchema>;
export type TextSize = z.infer<typeof textSizeSchema>;
export type TypeStyle = z.infer<typeof typeStyleSchema>;
export type Ratio = z.infer<typeof ratioSchema>;

export type Expression = z.infer<typeof expressionItemSchema>;
export type Book = z.infer<typeof bookItemSchema>;
export type Release = z.infer<typeof releaseItemSchema>;
export type Post = z.infer<typeof postItemSchema>;
export type TimelineEntry = z.infer<typeof timelineItemSchema>;
export type Recognition = z.infer<typeof recognitionItemSchema>;
export type Credential = z.infer<typeof credentialItemSchema>;
export type Programme = z.infer<typeof programmeItemSchema>;
export type EnquiryRoute = z.infer<typeof enquiryRouteItemSchema>;
export type Tag = z.infer<typeof tagItemSchema>;

export type CollectionItemOf<K extends CollectionKind> = z.infer<
  (typeof collectionItemSchemas)[K]
>;

export interface Collection<K extends CollectionKind = CollectionKind> {
  name: string;
  label: string;
  kind: K;
  description?: string;
  system: boolean;
  items: CollectionItemOf<K>[];
}

/** Navigation is recursive, so its type is declared rather than inferred. */
export interface NavItem {
  id: string;
  label: string;
  href: string;
  external: boolean;
  visible: boolean;
  children: NavItem[];
}

export type Navigation = z.infer<typeof navigationSchema>;
