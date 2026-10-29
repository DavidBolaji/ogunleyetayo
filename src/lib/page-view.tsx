import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { getPage, getSettings } from "@/lib/content";

/** The home page is the page document whose slug is empty. */
export const HOME_SLUG = "";

/**
 * Renders one page document.
 *
 * Shared by the home route and the catch-all: the home page is its own
 * route only because Next cannot place a metadata image route under a
 * root optional catch-all, and that routing detail should not fork the
 * rendering.
 */
export async function PageView({ slug }: { slug: string }) {
  const [page, settings] = await Promise.all([getPage(slug), getSettings()]);

  if (!page || page.status !== "published") notFound();

  const blocks = page.blocks.map((block) => (
    <BlockRenderer key={block.id} block={block} settings={settings} />
  ));

  // A page-level palette wraps the whole document, which is how the
  // sub-brand pages adopt their identity in one place.
  return page.palette ? (
    <div data-brand={page.palette} className="bg-canvas">
      {blocks}
    </div>
  ) : (
    <>{blocks}</>
  );
}
