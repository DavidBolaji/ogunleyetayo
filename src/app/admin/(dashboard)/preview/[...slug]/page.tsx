import Link from "next/link";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { getPage, getSettings } from "@/lib/content";

/**
 * Draft preview.
 *
 * Drafts are deliberately absent from the public routes, which stay
 * static. Previewing one here keeps that boundary: this page sits
 * behind the dashboard's session guard and is rendered per request, so
 * nothing unpublished is ever generated into the public build.
 */
export const dynamic = "force-dynamic";

export default async function PreviewScreen({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const slug = (await params).slug.join("/").replace(/^index$/, "");
  const [page, settings] = await Promise.all([getPage(slug), getSettings()]);

  if (!page) notFound();

  return (
    <div className="-mx-4 -my-6 sm:-mx-8 sm:-my-10">
      <div
        className="sticky top-0 z-50 flex flex-wrap items-center gap-3 border-b px-4 py-2"
        style={{ borderColor: "var(--a-line)", background: "var(--a-panel)" }}
      >
        <span
          className="adm-chip"
          style={{ background: "var(--a-accent-soft)", color: "var(--a-accent-ink)" }}
        >
          Preview · {page.status}
        </span>
        <span className="adm-help !mt-0">/{page.slug}</span>
        <Link href={`/admin/pages/${page.id}`} className="adm-btn adm-btn-ghost ml-auto">
          Edit this page
        </Link>
      </div>

      <div data-brand={page.palette} className="bg-canvas">
        {page.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} settings={settings} />
        ))}
      </div>
    </div>
  );
}
