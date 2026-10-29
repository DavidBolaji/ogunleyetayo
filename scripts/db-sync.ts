#!/usr/bin/env node
/**
 * Moves content between the repository and the Blob store.
 *
 *   npm run db:pull    # Blob  -> data/   (bring live edits into git)
 *   npm run db:push    # data/ -> Blob    (overwrite the live content)
 *
 * The site seeds Blob from the committed documents on its first
 * deploy, so neither command is needed to get started. `pull` is how
 * edits made in the production dashboard get back under version
 * control; `push` is how you force the live site back to what is in
 * the repository.
 *
 * Needs BLOB_READ_WRITE_TOKEN. Both directions also carry uploaded
 * images, so a pull is a complete backup.
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { VercelBlobDriver } from "../src/lib/db/blob-storage";
import { FileSystemDriver } from "../src/lib/db/fs-storage";
import { documentKeys } from "../src/lib/db/bootstrap-storage";

const DATA_ROOT = path.resolve(process.env.CMS_DATA_DIR ?? "data");
const MEDIA_PREFIX = "media";

const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();

if (!token) {
  console.error(
    "BLOB_READ_WRITE_TOKEN is not set.\n" +
      "Find it in the Vercel dashboard under Storage → your Blob store → .env.local tab.",
  );
  process.exit(1);
}

const blob = new VercelBlobDriver(token);
const files = new FileSystemDriver(DATA_ROOT);

/** Local image files, as blob keys. */
async function localMediaKeys(): Promise<string[]> {
  try {
    const names = await readdir(path.join(DATA_ROOT, MEDIA_PREFIX));
    return names.filter((name) => name.endsWith(".webp")).map((name) => `${MEDIA_PREFIX}/${name}`);
  } catch {
    return [];
  }
}

async function pull(): Promise<void> {
  const keys = await documentKeys(blob);
  let documents = 0;

  for (const key of keys) {
    const value = await blob.read(key);
    if (value === undefined) continue;

    await files.write(key, value);
    documents += 1;
    console.log(`  ← ${key}.json`);
  }

  const mediaKeys = await blob.listBlobKeys(MEDIA_PREFIX);
  let images = 0;

  for (const key of mediaKeys) {
    const bytes = await blob.readBlob(key);
    if (!bytes) continue;

    const file = path.join(DATA_ROOT, key);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, bytes);
    images += 1;
    console.log(`  ← ${key}`);
  }

  console.log(`\n✓ pulled ${documents} document(s) and ${images} image(s) into ${DATA_ROOT}`);
  if (documents > 0) console.log("  Review with `git diff data/`, then commit.");
}

async function push(): Promise<void> {
  const keys = await documentKeys(files);
  let documents = 0;

  for (const key of keys) {
    const value = await files.read(key);
    if (value === undefined) continue;

    await blob.write(key, value);
    documents += 1;
    console.log(`  → ${key}.json`);
  }

  let images = 0;

  for (const key of await localMediaKeys()) {
    await blob.writeBlob(key, await readFile(path.join(DATA_ROOT, key)));
    images += 1;
    console.log(`  → ${key}`);
  }

  // Claim the store as installed, so the running site does not try to
  // seed over what was just pushed.
  await blob.write("installed", { installedAt: new Date().toISOString() });

  console.log(`\n✓ pushed ${documents} document(s) and ${images} image(s) to the Blob store`);
  console.log("  Redeploy, or edit anything in the dashboard, to rebuild the pages.");
}

const direction = process.argv[2];

const run = direction === "pull" ? pull : direction === "push" ? push : undefined;

if (!run) {
  console.error("Usage: db-sync (pull|push)");
  process.exit(1);
}

run().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
