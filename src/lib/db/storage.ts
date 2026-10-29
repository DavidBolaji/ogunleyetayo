/**
 * The storage contract.
 *
 * Everything above this line works in documents and collections; only
 * the driver below it knows about files. Swapping the filesystem for
 * object storage, SQLite or a managed KV means writing one more driver
 * and changing the composition in `index.ts` — no caller changes.
 */

/** A document key: slash-separated, lowercase, no traversal. */
export type DocumentKey = string;

export interface StorageDriver {
  /** Parsed JSON for `key`, or `undefined` when the document is absent. */
  read(key: DocumentKey): Promise<unknown | undefined>;
  /** Replaces `key` atomically — readers never observe a partial write. */
  write(key: DocumentKey, value: unknown): Promise<void>;
  remove(key: DocumentKey): Promise<void>;
  /** Keys directly under `prefix`, without the prefix or extension. */
  list(prefix: DocumentKey): Promise<string[]>;
  /**
   * An opaque version for `key` — cheap to obtain and different
   * whenever the content differs. Lets the cache above this layer stay
   * correct even when a document is changed outside the process (a
   * `git pull`, a hand edit). `undefined` means the document is absent.
   */
  version(key: DocumentKey): Promise<string | undefined>;
  /** Puts a binary blob in the store and returns nothing. */
  writeBlob(key: DocumentKey, body: Uint8Array): Promise<void>;
  readBlob(key: DocumentKey): Promise<Uint8Array | undefined>;
  removeBlob(key: DocumentKey): Promise<void>;
}

const KEY_SEGMENT = /^[a-z0-9][a-z0-9._-]*$/;

/**
 * Rejects anything that is not a plain relative key. Document keys can
 * reach this layer from the dashboard, so traversal is refused here
 * rather than trusted to callers.
 */
export function assertKey(key: string): string {
  const segments = key.split("/");

  const valid =
    segments.length > 0 &&
    segments.length <= 4 &&
    segments.every((segment) => KEY_SEGMENT.test(segment) && segment !== "." && segment !== "..");

  if (!valid) throw new Error(`Invalid storage key: ${key}`);

  return key;
}
