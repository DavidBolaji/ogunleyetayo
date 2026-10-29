import { notFound } from "next/navigation";
import { OG_CONTENT_TYPE, OG_SIZE, renderCard } from "@/lib/og/card";
import { getPost, getPosts, getSettings } from "@/lib/content";
import { formatPostDate } from "@/lib/dates";

export const runtime = "nodejs";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Article share card";

export async function generateStaticParams() {
  return (await getPosts()).map((post) => ({ slug: post.slug }));
}

/**
 * An article's card leads with its own banner and the opening of its
 * excerpt, so a shared post reads as that post rather than as the site.
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPost(slug), getSettings()]);

  if (!post) notFound();

  return renderCard({
    eyebrow: post.category,
    title: post.title,
    description: post.excerpt,
    meta: `${formatPostDate(post.date)} · ${post.readingTime} · ${settings.site.shortName}`,
    image: post.media?.src ?? settings.seo.ogImage,
  });
}
