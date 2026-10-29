import { db } from "@/lib/db";
import { managedBlobKey } from "@/lib/media/paths";

/**
 * Serves images uploaded through the dashboard.
 *
 * Managed files live in the data root rather than /public, so they are
 * streamed here. Ids are random and immutable — a new upload never
 * reuses one — which is why the response can be cached indefinitely.
 */
export const dynamic = "force-static";

const ID = /^[a-z0-9-]{1,80}$/;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const segments = (await params).path;

  // One segment, one extension: nothing here walks a directory.
  if (segments.length !== 1) return new Response("Not found", { status: 404 });

  const id = segments[0].replace(/\.webp$/, "");
  if (!ID.test(id)) return new Response("Not found", { status: 404 });

  const library = await db.media.read();
  const item = library.items.find((candidate) => candidate.id === id);

  if (!item || item.storage !== "managed") return new Response("Not found", { status: 404 });

  const bytes = await db.driver.readBlob(managedBlobKey(id));
  if (!bytes) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "image/webp",
      "Content-Length": String(bytes.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
