import type { DocumentKey, StorageDriver } from "./storage";

/**
 * Copies the committed documents into an empty store, once.
 *
 * On a host with no writable disk the dashboard's edits live in object
 * storage, but the site still has to render on its very first deploy —
 * before anything has been edited and before anyone has run a sync
 * script. So the first access copies the documents that shipped with
 * the deployment into the store, drops a marker, and from then on the
 * store is the sole authority.
 *
 * Seeding once rather than reading through to the repository on every
 * miss is the point. A read-through would make deletion ambiguous: a
 * page removed in the dashboard would still be present in the
 * committed files and would quietly come back.
 */

/** Written once the copy has happened. */
const MARKER: DocumentKey = "installed";

/** The singleton documents. Collections and pages are enumerated. */
const SINGLETONS: readonly DocumentKey[] = ["settings", "navigation", "theme", "media"];

const COLLECTION_PREFIXES: readonly DocumentKey[] = ["pages", "collections"];

/** Every document key a store holds, singletons first. */
export async function documentKeys(source: StorageDriver): Promise<DocumentKey[]> {
  const nested = await Promise.all(
    COLLECTION_PREFIXES.map(async (prefix) =>
      (await source.list(prefix)).map((name) => `${prefix}/${name}`),
    ),
  );

  return [...SINGLETONS, ...nested.flat()];
}

export class BootstrappedDriver implements StorageDriver {
  private ready: Promise<void> | undefined;

  constructor(
    private readonly store: StorageDriver,
    /** Where the committed documents are read from. */
    private readonly seed: StorageDriver,
  ) {}

  /** Runs the copy at most once per instance, coalescing callers. */
  private ensure(): Promise<void> {
    this.ready ??= this.bootstrap().catch((error) => {
      // A failed copy must not be remembered as done, or the store
      // would stay half-populated for the life of the instance.
      this.ready = undefined;
      throw error;
    });

    return this.ready;
  }

  private async bootstrap(): Promise<void> {
    if (await this.store.version(MARKER)) return;

    for (const key of await documentKeys(this.seed)) {
      const value = await this.seed.read(key);
      if (value !== undefined) await this.store.write(key, value);
    }

    await this.store.write(MARKER, { installedAt: new Date().toISOString() });
  }

  async read(key: DocumentKey): Promise<unknown | undefined> {
    await this.ensure();
    return this.store.read(key);
  }

  async write(key: DocumentKey, value: unknown): Promise<void> {
    await this.ensure();
    return this.store.write(key, value);
  }

  async remove(key: DocumentKey): Promise<void> {
    await this.ensure();
    return this.store.remove(key);
  }

  async list(prefix: DocumentKey): Promise<string[]> {
    await this.ensure();
    return this.store.list(prefix);
  }

  async version(key: DocumentKey): Promise<string | undefined> {
    await this.ensure();
    return this.store.version(key);
  }

  async writeBlob(key: DocumentKey, body: Uint8Array): Promise<void> {
    await this.ensure();
    return this.store.writeBlob(key, body);
  }

  async readBlob(key: DocumentKey): Promise<Uint8Array | undefined> {
    await this.ensure();
    return this.store.readBlob(key);
  }

  async removeBlob(key: DocumentKey): Promise<void> {
    await this.ensure();
    return this.store.removeBlob(key);
  }
}
