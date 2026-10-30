import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { MotionProvider } from "@/components/MotionProvider";
import { requireSession } from "@/lib/auth";
import { getPage, getSettings } from "@/lib/content";

/**
 * A page rendered for the editor's preview frame.
 *
 * Deliberately outside the (dashboard) group: this is loaded into an
 * iframe, so it must carry none of the dashboard's own navigation. It
 * stays under /admin, which is what keeps it behind the session guard
 * — an unpublished page must not be readable by anyone who guesses the
 * address.
 */
export const dynamic = "force-dynamic";

export default async function EmbeddedPreview({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  await requireSession();

  // "index" stands in for the home page, whose slug is empty — a path
  // segment cannot be.
  const slug = (await params).slug.join("/").replace(/^index$/, "");
  const [page, settings] = await Promise.all([getPage(slug), getSettings()]);

  if (!page) notFound();

  if (page.blocks.length === 0) {
    return (
      <div data-preview className="flex min-h-screen items-center justify-center p-10 text-center">
        <p className="text-sm opacity-60">
          This page has no blocks yet. Add one and save to see it here.
        </p>
      </div>
    );
  }

  return (
    <div data-preview data-brand={page.palette} className="min-h-screen">
      {/* Same provider the site uses, so the preview honours a reduced
          motion preference exactly as a visitor's browser would. */}
      <MotionProvider>
        {page.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} settings={settings} />
        ))}
      </MotionProvider>
    </div>
  );
}
