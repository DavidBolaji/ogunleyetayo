import { OG_CONTENT_TYPE, OG_SIZE, renderCard } from "@/lib/og/card";
import { getPage, getSettings } from "@/lib/content";

/** Reads image bytes and transcodes them — see the note in lib/og/card. */
export const runtime = "nodejs";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Share card";

/** The home page's card leads with the person rather than a page name. */
export default async function Image() {
  const [page, settings] = await Promise.all([getPage(""), getSettings()]);

  return renderCard({
    eyebrow: settings.site.descriptor.split("·")[0].trim(),
    title: settings.site.name,
    description: page?.seo.description || settings.site.positioning,
    meta: settings.site.tagline,
    image: page?.seo.image || settings.seo.ogImage,
  });
}
