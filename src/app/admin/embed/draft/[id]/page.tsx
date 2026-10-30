import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { MotionProvider } from "@/components/MotionProvider";
import { requireSession } from "@/lib/auth";
import { getSettings, hydrateDraft } from "@/lib/content";
import { db } from "@/lib/db";

/**
 * The page an editor is holding, unsaved.
 *
 * Rendered from the parked draft rather than the stored page, so the
 * frame beside the editor shows the work in progress. Never cached:
 * the whole point is that it changes as somebody types.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DraftPreview({ params }: { params: Promise<{ id: string }> }) {
  await requireSession();

  const { id } = await params;

  // Falls back to the stored page: the frame mounts before the editor
  // has parked anything, and an empty preview on open would read as a
  // broken one.
  const [draft, stored, settings] = await Promise.all([
    db.previews.get(id),
    db.pages.get(id),
    getSettings(),
  ]);

  const source = draft ?? stored;
  if (!source) notFound();

  const page = await hydrateDraft(source);

  if (page.blocks.length === 0) {
    return (
      <div data-preview className="flex min-h-screen items-center justify-center p-10 text-center">
        <p className="text-sm opacity-60">
          This page has no blocks yet. Add one to see it here.
        </p>
      </div>
    );
  }

  return (
    <div data-preview data-brand={page.palette} className="min-h-screen">
      <MotionProvider>
        {page.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} settings={settings} />
        ))}
      </MotionProvider>
    </div>
  );
}
