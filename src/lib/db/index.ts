import path from "node:path";
import { z } from "zod";
import {
  collectionSchema,
  mediaLibrarySchema,
  navigationSchema,
  pageSchema,
  parseCollection,
  settingsSchema,
  themeSchema,
  type Collection,
  type CollectionKind,
  type Page,
} from "@/content/schema";
import { BootstrappedDriver } from "./bootstrap-storage";
import { Document, invalidateDocumentCache } from "./document";
import { FileSystemDriver } from "./fs-storage";
import { VercelBlobDriver } from "./blob-storage";
import type { StorageDriver } from "./storage";
import {
  defaultMediaLibrary,
  defaultNavigation,
  defaultSettings,
  defaultTheme,
} from "./defaults";

/**
 * The database composition root.
 *
 * `CMS_DATA_DIR` moves the whole store — useful for a mounted volume
 * in production, or a throwaway directory in a test.
 */
export const DATA_ROOT = path.resolve(process.env.CMS_DATA_DIR ?? "data");

const files = new FileSystemDriver(DATA_ROOT);

/**
 * Which store the site runs on.
 *
 * With a Blob token present — a serverless host, where the filesystem
 * is read-only — documents live in object storage, seeded once from
 * the copies committed in the repository. Without one, they are plain
 * files on disk, which is what local development and any host with a
 * real volume want.
 *
 * This is the only place that decides. Everything above it works
 * against `StorageDriver`.
 */
export const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN?.trim() || undefined;

export const usingBlobStore = BLOB_TOKEN !== undefined;

const driver: StorageDriver = usingBlobStore
  ? new BootstrappedDriver(new VercelBlobDriver(BLOB_TOKEN), files)
  : files;

/* ------------------------------------------------------------------ *
 * Pages
 * ------------------------------------------------------------------ */

/**
 * One document per page, so a dashboard save rewrites only the page
 * being edited and the committed diffs stay readable.
 */
class PageStore {
  constructor(private readonly driver: StorageDriver) {}

  private document(id: string) {
    return new Document({ driver: this.driver, key: `pages/${id}`, schema: pageSchema });
  }

  async ids(): Promise<string[]> {
    return this.driver.list("pages");
  }

  async list(): Promise<Page[]> {
    const ids = await this.ids();
    const pages = await Promise.all(ids.map((id) => this.document(id).tryRead()));

    return pages
      .filter((page): page is Page => page !== undefined)
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  }

  async published(): Promise<Page[]> {
    return (await this.list()).filter((page) => page.status === "published");
  }

  async get(id: string): Promise<Page | undefined> {
    return this.document(id).tryRead();
  }

  async findBySlug(slug: string): Promise<Page | undefined> {
    return (await this.list()).find((page) => page.slug === slug);
  }

  async save(page: z.input<typeof pageSchema>): Promise<Page> {
    const parsed = pageSchema.parse(page);
    return this.document(parsed.id).write({ ...parsed, updatedAt: new Date().toISOString() });
  }

  async remove(id: string): Promise<void> {
    await this.document(id).remove();
  }

  /** Applies a new order from a list of ids, leaving omitted pages last. */
  async reorder(ids: readonly string[]): Promise<void> {
    const pages = await this.list();

    await Promise.all(
      pages.map((page) => {
        const index = ids.indexOf(page.id);
        const order = index === -1 ? ids.length + page.order : index;
        return order === page.order ? undefined : this.save({ ...page, order });
      }),
    );
  }
}

/* ------------------------------------------------------------------ *
 * Collections
 * ------------------------------------------------------------------ */

/**
 * A collection is a named, ordered list of one item kind — the CMS
 * equivalent of a custom post type. Adding a second set of programmes
 * or a second book series is a dashboard action, not a code change.
 */
class CollectionStore {
  constructor(private readonly driver: StorageDriver) {}

  private document(name: string) {
    return new Document({
      driver: this.driver,
      key: `collections/${name}`,
      schema: collectionSchema.transform(parseCollectionItems),
    });
  }

  async names(): Promise<string[]> {
    return this.driver.list("collections");
  }

  async list(): Promise<Collection[]> {
    const names = await this.names();
    const collections = await Promise.all(names.map((name) => this.document(name).tryRead()));

    return collections
      .filter((collection): collection is Collection => collection !== undefined)
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  async get(name: string): Promise<Collection | undefined> {
    if (!name) return undefined;
    return this.document(name).tryRead();
  }

  /**
   * Items of a collection, narrowed to a kind. Returns an empty array
   * when the collection is missing or holds a different kind — a block
   * pointing at a deleted collection must not take the page down.
   */
  async items<K extends CollectionKind>(
    name: string | undefined,
    kind: K,
  ): Promise<Collection<K>["items"]> {
    if (!name) return [];

    const collection = await this.get(name);
    if (!collection || collection.kind !== kind) return [];

    return collection.items as Collection<K>["items"];
  }

  async save(collection: z.input<typeof collectionSchema>): Promise<Collection> {
    const parsed = parseCollection(collection);
    return this.document(parsed.name).write(parsed);
  }

  async remove(name: string): Promise<void> {
    await this.document(name).remove();
  }
}

/** Parses a collection's items against the schema for its kind. */
const parseCollectionItems = (shell: z.output<typeof collectionSchema>): Collection =>
  parseCollection(shell) as Collection;

/* ------------------------------------------------------------------ *
 * The database
 * ------------------------------------------------------------------ */

export const db = {
  driver,
  settings: new Document({
    driver,
    key: "settings",
    schema: settingsSchema,
    fallback: defaultSettings,
  }),
  navigation: new Document({
    driver,
    key: "navigation",
    schema: navigationSchema,
    fallback: defaultNavigation,
  }),
  theme: new Document({ driver, key: "theme", schema: themeSchema, fallback: defaultTheme }),
  media: new Document({
    driver,
    key: "media",
    schema: mediaLibrarySchema,
    fallback: defaultMediaLibrary,
  }),
  pages: new PageStore(driver),
  collections: new CollectionStore(driver),
} as const;

export { invalidateDocumentCache };

/**
 * Whether the dashboard can actually save.
 *
 * Reported on the overview screen, because a content manager that
 * silently fails to persist is worse than one that says it cannot.
 */
export async function storeIsWritable(): Promise<boolean> {
  if (usingBlobStore) {
    try {
      // Reaching the store at all proves the token works.
      await driver.list("pages");
      return true;
    } catch {
      return false;
    }
  }

  return files.isWritable();
}
