import { imageBlurData } from "./image-blur";
import { staticImageUrl } from "./media/paths";
import type { Media } from "@/content/types";

/**
 * Resolves a `Media` reference to something `next/image` can render.
 *
 * `url` and `blurDataURL` are filled in by the media hydration pass in
 * [content.ts](./content.ts) when a document is loaded, so this stays a
 * pure function and `Figure` can remain usable inside client
 * components. The fallbacks cover images that are referenced directly
 * in code rather than loaded from the database.
 */
export const imageUrl = (src: string): string => staticImageUrl(src);

/** Returns the pre-generated LQIP for a photo produced by the pipeline. */
export const imageBlur = (src: string): string | undefined => imageBlurData[src];

export const resolveImageUrl = (media: Media): string => media.url ?? imageUrl(media.src);

export const resolveImageBlur = (media: Media): string | undefined =>
  media.blurDataURL ?? imageBlur(media.src);
