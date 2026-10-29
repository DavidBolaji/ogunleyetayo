import type { MetadataRoute } from "next";
import { getPosts, getPublishedPages, getSettings } from "@/lib/content";

/** Driven by the database, so a page added in the dashboard is indexed. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, pages, posts] = await Promise.all([
    getSettings(),
    getPublishedPages(),
    getPosts(),
  ]);

  const base = settings.site.url.replace(/\/$/, "");

  const pageEntries = pages
    .filter((page) => page.inSitemap && !page.seo.noIndex)
    .map((page) => ({
      url: page.slug ? `${base}/${page.slug}` : base,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: page.slug === "" ? 1 : 0.8,
    }));

  const postEntries = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...pageEntries, ...postEntries];
}
