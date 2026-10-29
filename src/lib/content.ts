import { cache } from "react";
import { db } from "@/lib/db";
import { interpolateDeep, tokenTable } from "@/lib/interpolate";
import { managedImageUrl, staticImageUrl } from "@/lib/media/paths";
import { imageBlur } from "@/lib/images";
import type {
  Collection,
  CollectionKind,
  Media,
  MediaItem,
  Page,
  Post,
} from "@/content/types";

/**
 * The read side of the CMS.
 *
 * Every accessor is wrapped in React's `cache`, so one render pass
 * touches each document once however many blocks ask for it. Combined
 * with the version-stamped cache in the database layer, a warm page
 * render costs a handful of `stat` calls and no JSON parsing at all.
 */

export const getSettings = cache(() => db.settings.read());
export const getNavigation = cache(() => db.navigation.read());
export const getTheme = cache(() => db.theme.read());
export const getMediaLibrary = cache(() => db.media.read());

/** The media library as a lookup table, for the hydration pass below. */
const getMediaIndex = cache(async (): Promise<Map<string, MediaItem>> => {
  const library = await getMediaLibrary();
  return new Map(library.items.map((item) => [item.id, item]));
});

/* ------------------------------------------------------------------ *
 * Media hydration
 *
 * Content stores only a reference — `{ src, alt, focus }`. The served
 * URL, the LQIP and the intrinsic size live in the media library, and
 * are stitched in once per document here rather than looked up by each
 * component. That keeps `Figure` a pure, client-safe component.
 * ------------------------------------------------------------------ */

const isMediaRef = (value: object): value is Media =>
  typeof (value as Media).src === "string" && typeof (value as Media).alt === "string";

const resolveMedia = (media: Media, index: Map<string, MediaItem>): Media => {
  const item = index.get(media.src);

  if (!item) {
    // Not in the library — assume a pipeline image so images referenced
    // before the library caught up still render.
    return { ...media, url: staticImageUrl(media.src), blurDataURL: imageBlur(media.src) };
  }

  return {
    ...media,
    url: item.storage === "managed" ? managedImageUrl(item.id) : staticImageUrl(item.id),
    alt: media.alt || item.alt,
    focus: media.focus ?? item.focus,
    blurDataURL: item.blurDataURL || imageBlur(item.id),
    width: item.width,
    height: item.height,
  };
};

/** Deep-copies `value`, resolving every media reference it contains. */
function hydrateMedia<T>(value: T, index: Map<string, MediaItem>): T {
  if (Array.isArray(value)) {
    return value.map((entry) => hydrateMedia(entry, index)) as unknown as T;
  }

  if (value !== null && typeof value === "object") {
    if (isMediaRef(value)) return resolveMedia(value, index) as unknown as T;

    const out: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) out[key] = hydrateMedia(entry, index);
    return out as T;
  }

  return value;
}

/* ------------------------------------------------------------------ *
 * Pages
 * ------------------------------------------------------------------ */

export const getPages = cache(() => db.pages.list());

export const getPublishedPages = cache(() => db.pages.published());

/**
 * A page by slug ("" is the home page), ready to render: media
 * references resolved and `{site.*}` tokens substituted.
 */
export const getPage = cache(async (slug: string): Promise<Page | undefined> => {
  const page = await db.pages.findBySlug(slug);
  if (!page) return undefined;

  const [index, settings] = await Promise.all([getMediaIndex(), getSettings()]);

  return interpolateDeep(hydrateMedia(page, index), tokenTable(settings));
});

/* ------------------------------------------------------------------ *
 * Collections
 * ------------------------------------------------------------------ */

export const getCollections = cache(() => db.collections.list());

export const getCollection = cache(
  async (name: string): Promise<Collection | undefined> => db.collections.get(name),
);

/**
 * Items of a collection, narrowed to a kind and media-resolved. A
 * missing or mistyped collection yields an empty list: a block
 * pointing at a deleted collection must not take the page down.
 */
export async function getItems<K extends CollectionKind>(
  name: string | undefined,
  kind: K,
): Promise<Collection<K>["items"]> {
  const items = await db.collections.items(name, kind);
  if (items.length === 0) return items;

  return hydrateMedia(items, await getMediaIndex());
}

/** Plain string values from a `tag` collection — categories, event types. */
export async function getTagValues(name: string | undefined): Promise<string[]> {
  return (await getItems(name, "tag")).map((tag) => tag.value);
}

/* ------------------------------------------------------------------ *
 * Posts
 * ------------------------------------------------------------------ */

/** Published posts, newest first, from the collection Settings names. */
export const getPosts = cache(async (): Promise<Post[]> => {
  const settings = await getSettings();
  const posts = await getItems(settings.blog.postsCollection, "post");

  return posts
    .filter((post) => post.status === "published")
    .sort((a, b) => b.date.localeCompare(a.date));
});

export const getPost = cache(async (slug: string): Promise<Post | undefined> =>
  (await getPosts()).find((post) => post.slug === slug),
);
