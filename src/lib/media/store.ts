import { randomBytes } from "node:crypto";
import sharp from "sharp";
import { mediaItemSchema } from "@/content/schema";
import { db } from "@/lib/db";
import { managedBlobKey } from "./paths";
import type { MediaItem } from "@/content/types";

/**
 * The upload pipeline.
 *
 * Uploads go through exactly the same treatment as the offline
 * pipeline: resized to the site's maximum, re-encoded as WebP, and
 * given an inline LQIP so the blur-up placeholder works. Nothing is
 * served as it arrived — the bytes are re-encoded by an image library,
 * which also means a file that is not really an image never becomes
 * one on disk.
 *
 * Managed files live in the data root beside the documents rather than
 * in /public, so a deployment keeps its uploads together with its
 * content and a running server can serve a new image without a
 * rebuild.
 */

const MAX_WIDTH = 1600;
const MAX_HEIGHT = 2000;
const QUALITY = 82;
const MAX_BYTES = 12 * 1024 * 1024;

const ACCEPTED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/tiff"]);

const titleFromFilename = (filename: string): string =>
  filename
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120) || "Untitled image";

/** Ids are random, so a re-upload can never silently replace a photo. */
const newId = (): string => `up-${randomBytes(8).toString("hex")}`;

export async function storeUpload(file: File, alt: string): Promise<MediaItem> {
  if (file.size > MAX_BYTES) {
    throw new Error(`${file.name} is larger than 12MB.`);
  }

  if (file.type && !ACCEPTED.has(file.type)) {
    throw new Error(`${file.name} is a ${file.type}; upload a JPEG, PNG, WebP, AVIF or TIFF.`);
  }

  const source = sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 50e6 });

  // Reading the metadata is also the validation: a file that is not an
  // image fails here rather than landing on disk.
  const metadata = await source.metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`${file.name} could not be read as an image.`);
  }

  const pipeline = source
    .rotate()
    .resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: "inside", withoutEnlargement: true });

  const webp = await pipeline.clone().webp({ quality: QUALITY, effort: 5 }).toBuffer();
  const info = await sharp(webp).metadata();

  const blur = await pipeline.clone().resize(12).jpeg({ quality: 30 }).toBuffer();

  const id = newId();
  await db.driver.writeBlob(managedBlobKey(id), webp);

  const item = mediaItemSchema.parse({
    id,
    title: titleFromFilename(file.name),
    alt,
    focus: "50% 35%",
    width: info.width ?? metadata.width,
    height: info.height ?? metadata.height,
    blurDataURL: `data:image/jpeg;base64,${blur.toString("base64")}`,
    bytes: webp.byteLength,
    storage: "managed",
    createdAt: new Date().toISOString(),
    tags: [],
  });

  await db.media.update((library) => ({ items: [item, ...library.items] }));

  return item;
}

export interface DeleteResult {
  readonly ok: boolean;
  readonly message: string;
}

/**
 * Removes an image from the library.
 *
 * Pipeline images are only de-listed: their files are produced by
 * `npm run images` from the source photography and would reappear on
 * the next run, so deleting the file here would be a lie.
 */
export async function deleteMedia(id: string): Promise<DeleteResult> {
  const library = await db.media.read();
  const item = library.items.find((candidate) => candidate.id === id);

  if (!item) return { ok: false, message: "That image is no longer in the library." };

  if (item.storage === "managed") await db.driver.removeBlob(managedBlobKey(id));

  await db.media.write({ items: library.items.filter((candidate) => candidate.id !== id) });

  return {
    ok: true,
    message:
      item.storage === "managed"
        ? `Deleted “${item.title}”.`
        : `Removed “${item.title}” from the library. The pipeline file is still in /public/images.`,
  };
}
