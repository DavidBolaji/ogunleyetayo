import type { Metadata } from "next";
import { PageView } from "@/lib/page-view";
import { getPage, getPublishedPages, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

/**
 * Every inner page on the site.
 *
 * Pages are documents in the database — an ordered list of blocks — so
 * adding, reordering or retiring a page is a dashboard action rather
 * than a new file. `generateStaticParams` still pre-renders all of
 * them and the dashboard revalidates the affected paths on save, so
 * the public site keeps serving static HTML.
 */
export async function generateStaticParams() {
  const pages = await getPublishedPages();

  return pages
    .filter((page) => page.slug !== "")
    .map((page) => ({ slug: page.slug.split("/") }));
}

const slugOf = async (params: PageProps["params"]): Promise<string> =>
  (await params).slug.join("/");

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPage(await slugOf(params)), getSettings()]);

  if (!page) return {};

  return pageMetadata(page, settings);
}

export default async function DynamicPage({ params }: PageProps) {
  return <PageView slug={await slugOf(params)} />;
}
