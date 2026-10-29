import { renderCard } from "@/lib/og/card";
import { getPages, getPage, getSettings } from "@/lib/content";
import { db } from "@/lib/db";

/**
 * Share cards for pages.
 *
 * Pages live under a catch-all route, and Next cannot place a metadata
 * image file beneath one — a catch-all has to be the last segment of a
 * path. So page cards get their own route, keyed by page id, which is
 * a single dynamic segment and therefore pre-renders to static files
 * at build time just as the blog's cards do.
 *
 * `pageMetadata` points `og:image` here. The home page and blog posts
 * use the file convention directly, since neither sits under a
 * catch-all.
 */
export const dynamic = "force-static";

/** Reads image bytes and transcodes them — see the note in lib/og/card. */
export const runtime = "nodejs";

export async function generateStaticParams() {
  const pages = await getPages();
  return pages.filter((page) => page.slug !== "").map((page) => ({ id: page.id }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const stored = await db.pages.get(id);
  if (!stored) return new Response("Not found", { status: 404 });

  const [page, settings] = await Promise.all([getPage(stored.slug), getSettings()]);
  if (!page) return new Response("Not found", { status: 404 });

  return renderCard({
    eyebrow: settings.site.name,
    title: page.seo.title || page.title,
    description: page.seo.description || settings.site.positioning,
    meta: settings.site.location,
    image: page.seo.image || settings.seo.ogImage,
  });
}
