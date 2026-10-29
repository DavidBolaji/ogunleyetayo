import type { Metadata } from "next";
import { HOME_SLUG, PageView } from "@/lib/page-view";
import { getPage, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPage(HOME_SLUG), getSettings()]);
  if (!page) return {};

  return pageMetadata(page, settings);
}

export default function HomePage() {
  return <PageView slug={HOME_SLUG} />;
}
