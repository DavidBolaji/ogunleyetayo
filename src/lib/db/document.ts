import type { z } from "zod";
import type { DocumentKey, StorageDriver } from "./storage";

interface CacheEntry {
  version: string;
  value: unknown;
}

/**
 * Parsed documents, keyed by storage key and stamped with the version
 * they were parsed from.
 *
 * A read costs one `version()` call — a stat, tens of microseconds —
 * and skips both the file read and the schema parse when nothing has
 * changed. Validation therefore happens once per edit rather than once
 * per request, which is what keeps page renders cheap.
 */
const cache = new Map<string, CacheEntry>();

/** Drops cached documents. Called after a write, and by tests. */
export function invalidateDocumentCache(key?: string): void {
  if (key === undefined) cache.clear();
  else cache.delete(key);
}

export interface DocumentOptions<S extends z.ZodTypeAny> {
  driver: StorageDriver;
  key: DocumentKey;
  schema: S;
  /** Used when the document does not exist yet. Omit for optional documents. */
  fallback?: () => z.input<S>;
}

/**
 * A single validated JSON document.
 *
 * Reads are cached and schema-checked; writes are validated before
 * they touch the disk, so an invalid document can never be persisted.
 */
export class Document<S extends z.ZodTypeAny> {
  constructor(private readonly options: DocumentOptions<S>) {}

  get key(): string {
    return this.options.key;
  }

  /** The stored document, or `undefined` when it does not exist. */
  async tryRead(): Promise<z.output<S> | undefined> {
    const { driver, key, schema } = this.options;

    const version = await driver.version(key);
    if (version === undefined) return undefined;

    const cached = cache.get(key);
    if (cached && cached.version === version) return cached.value as z.output<S>;

    const raw = await driver.read(key);
    if (raw === undefined) return undefined;

    const value = schema.parse(raw) as z.output<S>;
    cache.set(key, { version, value });

    return value;
  }

  async read(): Promise<z.output<S>> {
    const stored = await this.tryRead();
    if (stored !== undefined) return stored;

    const { schema, fallback, key } = this.options;
    if (!fallback) throw new Error(`Missing document: ${key}`);

    return schema.parse(fallback()) as z.output<S>;
  }

  /** Validates, persists and returns the stored document. */
  async write(input: z.input<S>): Promise<z.output<S>> {
    const { driver, key, schema } = this.options;

    const value = schema.parse(input) as z.output<S>;
    await driver.write(key, value);
    invalidateDocumentCache(key);

    return value;
  }

  /** Read-modify-write. The callback receives the validated current value. */
  async update(
    mutate: (current: z.output<S>) => z.input<S> | Promise<z.input<S>>,
  ): Promise<z.output<S>> {
    return this.write(await mutate(await this.read()));
  }

  /** Writes the fallback document, discarding whatever is stored. */
  async reset(): Promise<z.output<S>> {
    const { fallback, key } = this.options;
    if (!fallback) throw new Error(`No fallback for document: ${key}`);
    return this.write(fallback());
  }

  async remove(): Promise<void> {
    await this.options.driver.remove(this.options.key);
    invalidateDocumentCache(this.options.key);
  }

  async exists(): Promise<boolean> {
    return (await this.options.driver.version(this.options.key)) !== undefined;
  }
}
