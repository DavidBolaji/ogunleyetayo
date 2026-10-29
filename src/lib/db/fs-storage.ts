import { constants } from "node:fs";
import { access, mkdir, open, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { assertKey, type DocumentKey, type StorageDriver } from "./storage";

/**
 * JSON-on-disk driver.
 *
 * Writes are atomic (write to a temp file, fsync, rename) and
 * serialised per key, so two dashboard saves of the same document can
 * never interleave into a corrupt file.
 */
export class FileSystemDriver implements StorageDriver {
  private readonly locks = new Map<string, Promise<unknown>>();

  constructor(private readonly root: string) {}

  private resolve(key: DocumentKey, extension: string): string {
    const resolved = path.join(this.root, `${assertKey(key)}${extension}`);

    // Belt and braces: assertKey already refuses traversal, but the
    // resolved path must still land inside the data root.
    if (resolved !== path.normalize(resolved) || !resolved.startsWith(this.root + path.sep)) {
      throw new Error(`Storage key escapes the data root: ${key}`);
    }

    return resolved;
  }

  /** Serialises work per key so concurrent writes queue instead of racing. */
  private withLock<T>(key: string, work: () => Promise<T>): Promise<T> {
    const previous = this.locks.get(key) ?? Promise.resolve();
    const next = previous.then(work, work);

    this.locks.set(
      key,
      next.catch(() => undefined),
    );

    return next.finally(() => {
      if (this.locks.get(key) === next) this.locks.delete(key);
    });
  }

  private async writeAtomic(file: string, body: Uint8Array | string): Promise<void> {
    await mkdir(path.dirname(file), { recursive: true });

    const temp = `${file}.${randomBytes(6).toString("hex")}.tmp`;

    try {
      await writeFile(temp, body);

      // fsync before the rename, so a crash cannot leave the renamed
      // file pointing at unflushed data.
      const handle = await open(temp, "r+");
      try {
        await handle.sync();
      } finally {
        await handle.close();
      }

      await rename(temp, file);
    } catch (error) {
      await rm(temp, { force: true });
      throw error;
    }
  }

  async read(key: DocumentKey): Promise<unknown | undefined> {
    try {
      return JSON.parse(await readFile(this.resolve(key, ".json"), "utf8")) as unknown;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
      throw error;
    }
  }

  write(key: DocumentKey, value: unknown): Promise<void> {
    const file = this.resolve(key, ".json");
    // Pretty-printed: these documents are committed, so their diffs
    // should be readable.
    return this.withLock(file, () => this.writeAtomic(file, `${JSON.stringify(value, null, 2)}\n`));
  }

  async remove(key: DocumentKey): Promise<void> {
    await rm(this.resolve(key, ".json"), { force: true });
  }

  async list(prefix: DocumentKey): Promise<string[]> {
    const directory = path.join(this.root, assertKey(prefix));

    try {
      const entries = await readdir(directory, { withFileTypes: true });
      return entries
        .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
        .map((entry) => entry.name.slice(0, -".json".length))
        .sort();
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
  }

  async version(key: DocumentKey): Promise<string | undefined> {
    try {
      const info = await stat(this.resolve(key, ".json"));
      return `${info.mtimeMs.toString(36)}-${info.size.toString(36)}`;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
      throw error;
    }
  }

  writeBlob(key: DocumentKey, body: Uint8Array): Promise<void> {
    const file = this.resolve(key, "");
    return this.withLock(file, () => this.writeAtomic(file, body));
  }

  async readBlob(key: DocumentKey): Promise<Uint8Array | undefined> {
    try {
      return await readFile(this.resolve(key, ""));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
      throw error;
    }
  }

  async removeBlob(key: DocumentKey): Promise<void> {
    await rm(this.resolve(key, ""), { force: true });
  }

  /** True when the data root exists and is writable. */
  async isWritable(): Promise<boolean> {
    try {
      await mkdir(this.root, { recursive: true });
      await access(this.root, constants.W_OK);
      return true;
    } catch {
      return false;
    }
  }
}
