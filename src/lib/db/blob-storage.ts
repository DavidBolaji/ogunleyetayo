import { del, get, list, put } from "@vercel/blob";
import { assertKey, type DocumentKey, type StorageDriver } from "./storage";

/**
 * Object-storage driver for Vercel Blob.
 *
 * Vercel runs the site as serverless functions with an ephemeral
 * filesystem, so the dashboard cannot write to disk there. This driver
 * keeps the same documents in Blob instead, and nothing above the
 * `StorageDriver` interface changes — which is the whole reason that
 * interface exists.
 *
 * The store is **private**. Content documents are not secret — they
 * are what the site says out loud — but there is no reason for them
 * to be independently fetchable, and private reads go through an
 * authenticated API rather than a CDN, which also removes any
 * question of a fresh write being shadowed by a cached response.
 *
 * Listing doubles as the index: one `list()` call returns every
 * document's path, size and upload time, which is also everything
 * `version()` needs. It is cached briefly, so a page render costs one
 * API call rather than one per document.
 */

interface Entry {
  /** Opaque version: upload time and size. */
  version: string;
  size: number;
}

const DOCUMENT_SUFFIX = ".json";

/** How long a listing is trusted before it is fetched again. */
const INDEX_TTL_MS = 5_000;

/**
 * Concurrent reads in flight.
 *
 * A static build renders every page at once, and each page asks for
 * several documents. Left unbounded that opens dozens of sockets to
 * the same host simultaneously, which is slower than queueing and —
 * on a constrained link — trips connect timeouts. Small and steady
 * beats wide and flaky.
 */
const MAX_CONCURRENT_READS = 6;

const READ_ATTEMPTS = 3;

/** Caps how many operations run at once. */
class Gate {
  private active = 0;
  private queue: (() => void)[] = [];

  constructor(private readonly limit: number) {}

  async run<T>(work: () => Promise<T>): Promise<T> {
    if (this.active >= this.limit) {
      await new Promise<void>((resolve) => this.queue.push(resolve));
    }

    this.active += 1;

    try {
      return await work();
    } finally {
      this.active -= 1;
      this.queue.shift()?.();
    }
  }
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** A Uint8Array's bytes as a standalone ArrayBuffer. */
const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer =>
  bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength
    ? (bytes.buffer as ArrayBuffer)
    : (bytes.slice().buffer as ArrayBuffer);

export class VercelBlobDriver implements StorageDriver {
  private index = new Map<string, Entry>();
  private indexedAt = 0;
  private refreshing: Promise<void> | undefined;
  private readonly gate = new Gate(MAX_CONCURRENT_READS);

  constructor(private readonly token: string | undefined) {}

  /* ---------------------------------------------------------------- *
   * Index
   * ---------------------------------------------------------------- */

  private async refresh(): Promise<void> {
    const next = new Map<string, Entry>();
    let cursor: string | undefined;

    do {
      const page = await list({ token: this.token, cursor, limit: 1000 });

      for (const blob of page.blobs) {
        next.set(blob.pathname, {
          version: `${new Date(blob.uploadedAt).getTime().toString(36)}-${blob.size.toString(36)}`,
          size: blob.size,
        });
      }

      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);

    this.index = next;
    this.indexedAt = Date.now();
  }

  /** Refreshes the listing when it is stale, coalescing concurrent calls. */
  private async ensureIndex(): Promise<void> {
    if (Date.now() - this.indexedAt < INDEX_TTL_MS) return;

    this.refreshing ??= this.refresh().finally(() => {
      this.refreshing = undefined;
    });

    await this.refreshing;
  }

  private async entry(pathname: string): Promise<Entry | undefined> {
    await this.ensureIndex();
    return this.index.get(pathname);
  }

  /* ---------------------------------------------------------------- *
   * Reading and writing
   * ---------------------------------------------------------------- */

  /**
   * Reads one object, queued and retried.
   *
   * `useCache: false` reads from origin storage: the dashboard must
   * never show an editor a stale copy of what they just saved. A
   * transient network failure is retried rather than surfaced,
   * because a single dropped connection should not fail a build.
   */
  private fetchBytes(pathname: string): Promise<Uint8Array | undefined> {
    return this.gate.run(async () => {
      let lastError: unknown;

      for (let attempt = 0; attempt < READ_ATTEMPTS; attempt += 1) {
        try {
          const result = await get(pathname, {
            access: "private",
            useCache: false,
            token: this.token,
          });

          if (!result?.stream) return undefined;

          return new Uint8Array(await new Response(result.stream).arrayBuffer());
        } catch (error) {
          lastError = error;
          if (attempt < READ_ATTEMPTS - 1) await sleep(250 * 2 ** attempt);
        }
      }

      throw lastError;
    });
  }

  private async upload(
    pathname: string,
    body: Uint8Array | string,
    contentType: string,
  ): Promise<void> {
    // The SDK accepts an ArrayBuffer but not a Uint8Array view, so the
    // bytes are handed over as the buffer they sit in.
    const payload = typeof body === "string" ? body : toArrayBuffer(body);

    await put(pathname, payload, {
      access: "private",
      token: this.token,
      contentType,
      // Deterministic paths: a document must be addressable by its key,
      // and a rewrite must replace the previous version rather than
      // accumulate copies beside it.
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    const size = typeof body === "string" ? new TextEncoder().encode(body).length : body.byteLength;

    // Record the new version immediately, so the write is visible to
    // this instance without waiting for the listing to expire.
    this.index.set(pathname, {
      version: `${Date.now().toString(36)}-${size.toString(36)}`,
      size,
    });
  }

  async read(key: DocumentKey): Promise<unknown | undefined> {
    const pathname = `${assertKey(key)}${DOCUMENT_SUFFIX}`;

    const entry = await this.entry(pathname);
    if (!entry || entry.size === 0) return undefined;

    const bytes = await this.fetchBytes(pathname);
    if (!bytes) return undefined;

    try {
      return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
    } catch {
      return undefined;
    }
  }

  async write(key: DocumentKey, value: unknown): Promise<void> {
    // Pretty-printed to match the filesystem driver, so a document
    // pulled back into the repository has a readable diff.
    await this.upload(
      `${assertKey(key)}${DOCUMENT_SUFFIX}`,
      `${JSON.stringify(value, null, 2)}\n`,
      "application/json",
    );
  }

  async remove(key: DocumentKey): Promise<void> {
    const pathname = `${assertKey(key)}${DOCUMENT_SUFFIX}`;
    if (!(await this.entry(pathname))) return;

    await del(pathname, { token: this.token });
    this.index.delete(pathname);
  }

  async list(prefix: DocumentKey): Promise<string[]> {
    await this.ensureIndex();

    const root = `${assertKey(prefix)}/`;
    const names: string[] = [];

    for (const [pathname, entry] of this.index) {
      if (!pathname.startsWith(root) || !pathname.endsWith(DOCUMENT_SUFFIX)) continue;
      if (entry.size === 0) continue;

      const name = pathname.slice(root.length, -DOCUMENT_SUFFIX.length);
      // Direct children only, matching the filesystem driver.
      if (name.includes("/")) continue;

      names.push(name);
    }

    return names.sort();
  }

  async version(key: DocumentKey): Promise<string | undefined> {
    const entry = await this.entry(`${assertKey(key)}${DOCUMENT_SUFFIX}`);
    return entry && entry.size > 0 ? entry.version : undefined;
  }

  /* ---------------------------------------------------------------- *
   * Binary blobs — uploaded images
   * ---------------------------------------------------------------- */

  async writeBlob(key: DocumentKey, body: Uint8Array): Promise<void> {
    await this.upload(assertKey(key), body, "image/webp");
  }

  async readBlob(key: DocumentKey): Promise<Uint8Array | undefined> {
    const pathname = assertKey(key);

    const entry = await this.entry(pathname);
    if (!entry || entry.size === 0) return undefined;

    return this.fetchBytes(pathname);
  }

  async removeBlob(key: DocumentKey): Promise<void> {
    const pathname = assertKey(key);
    if (!(await this.entry(pathname))) return;

    await del(pathname, { token: this.token });
    this.index.delete(pathname);
  }

  /**
   * Every binary object under `prefix`, as full keys.
   *
   * Not part of `StorageDriver` — nothing in the application needs to
   * enumerate uploads. The sync script does, so that a backup pulls
   * the images down as well as the documents.
   */
  async listBlobKeys(prefix: string): Promise<string[]> {
    await this.ensureIndex();

    const root = `${prefix}/`;

    return [...this.index.keys()]
      .filter((pathname) => pathname.startsWith(root) && !pathname.endsWith(DOCUMENT_SUFFIX))
      .sort();
  }

  /** True when the store is reachable. */
  async isWritable(): Promise<boolean> {
    try {
      await this.ensureIndex();
      return true;
    } catch {
      return false;
    }
  }
}
