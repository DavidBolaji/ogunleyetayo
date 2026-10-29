import type { Metadata } from "next";
import type { Page, Post, Settings } from "@/content/types";

/**
 * Metadata, derived from the page document and the site settings.
 *
 * One function, so the title template, the social card and the
 * canonical URL cannot drift between pages — and so adding a page from
 * the dashboard gets correct metadata without anyone remembering to
 * write it.
 */

/**
 * Share cards.
 *
 * Every page advertises a composed 1200x630 card — the portrait, the
 * title and the standfirst — rather than a raw 4:5 photograph, which
 * every platform crops through the middle of.
 *
 * The home page and blog posts get theirs from the `opengraph-image`
 * file convention. Inner pages live under a catch-all route, beneath
 * which Next cannot place a metadata file, so theirs comes from
 * `/api/share/<id>` and is named explicitly here.
 */
const shareCard = (page: Page, settings: Settings) => ({
  url: new URL(`/api/share/${page.id}`, settings.site.url).toString(),
  width: 1200,
  height: 630,
  alt: `${page.seo.title || page.title} — ${settings.site.name}`,
  type: "image/jpeg",
});

export function pageMetadata(page: Page, settings: Settings): Metadata {
  // The home page keeps the layout's default title; an inner page
  // falls back to its own name.
  const title = page.seo.title || (page.slug === "" ? undefined : page.title);
  const description = page.seo.description || settings.site.positioning;
  const path = page.slug ? `/${page.slug}` : "/";
  // The home page's card comes from app/opengraph-image.tsx.
  const images = page.slug === "" ? undefined : [shareCard(page, settings)];

  return {
    ...(title ? { title } : {}),
    description,
    keywords: page.seo.keywords.length > 0 ? page.seo.keywords : settings.seo.keywords,
    alternates: { canonical: path },
    robots: page.seo.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: settings.seo.locale,
      url: new URL(path, settings.site.url).toString(),
      siteName: settings.site.name,
      title: title ?? `${settings.site.name} — ${settings.site.tagline}`,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? `${settings.site.name} — ${settings.site.tagline}`,
      description,
      images,
      creator: twitterHandle(settings),
    },
  };
}

/** Metadata for one article, including the fields a feed reader wants. */
export function postMetadata(post: Post, settings: Settings): Metadata {
  return {
    title: post.title,
    description: post.excerpt,
    keywords: [post.category, ...settings.seo.keywords].slice(0, 20),
    alternates: { canonical: `/blog/${post.slug}` },
    authors: [{ name: settings.site.name, url: settings.site.url }],
    openGraph: {
      type: "article",
      locale: settings.seo.locale,
      url: new URL(`/blog/${post.slug}`, settings.site.url).toString(),
      siteName: settings.site.name,
      title: post.title,
      description: post.excerpt,
      publishedTime: new Date(post.date).toISOString(),
      authors: [settings.site.name],
      section: post.category,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      creator: twitterHandle(settings),
    },
  };
}

/** The X/Twitter handle, if one is listed in the socials. */
const twitterHandle = (settings: Settings): string | undefined => {
  const match = settings.socials.find((social) =>
    /^(x|twitter)$/i.test(social.platform.trim()),
  );

  if (!match?.handle) return undefined;

  return match.handle.startsWith("@") ? match.handle : `@${match.handle}`;
};
