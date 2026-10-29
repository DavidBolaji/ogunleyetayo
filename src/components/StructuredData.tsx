import { getItems, getSettings } from "@/lib/content";
import { staticImageUrl } from "@/lib/media/paths";
import type { Post } from "@/content/types";

/**
 * Person schema, so search engines understand who the site is about.
 * Built from the settings document and the credentials collection, so
 * it stays true as those are edited.
 */
export async function StructuredData() {
  const settings = await getSettings();
  const credentials = await getItems("credentials", "credential");
  const { site, seo } = settings;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    email: site.email ? `mailto:${site.email}` : undefined,
    image: seo.ogImage ? new URL(staticImageUrl(seo.ogImage), site.url).toString() : undefined,
    description: site.positioning,
    jobTitle: site.descriptor
      .split("·")
      .map((part) => part.trim())
      .filter(Boolean),
    worksFor: site.church ? { "@type": "Organization", name: site.church } : undefined,
    address: site.location
      ? { "@type": "PostalAddress", addressLocality: site.location }
      : undefined,
    alumniOf: credentials.map((credential) => ({
      "@type": "EducationalOrganization",
      name: credential.institution,
    })),
    sameAs: settings.socials.map((social) => social.href),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Article schema for a blog post.
 *
 * Separate from the Person schema above because it describes the page
 * rather than the site, and because search and social previews treat
 * an Article's headline, image and dates as first-class.
 */
export async function ArticleStructuredData({ post }: { post: Post }) {
  const settings = await getSettings();
  const { site } = settings;

  const url = new URL(`/blog/${post.slug}`, site.url).toString();
  const image = post.media?.src ?? settings.seo.ogImage;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    articleSection: post.category,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    image: image ? new URL(staticImageUrl(image), site.url).toString() : undefined,
    author: { "@type": "Person", name: site.name, url: site.url },
    publisher: { "@type": "Person", name: site.name, url: site.url },
    inLanguage: settings.seo.locale.replace("_", "-"),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
