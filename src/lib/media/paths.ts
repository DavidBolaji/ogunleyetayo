/**
 * Where an image lives.
 *
 * `static` images were produced by the offline pipeline and are served
 * straight from /public/images. `managed` images were uploaded through
 * the dashboard and are streamed by the media route, so uploads work
 * on a running server without a rebuild.
 */
export const STATIC_IMAGE_ROOT = "/images";
export const MANAGED_IMAGE_ROOT = "/api/media";

export const staticImageUrl = (src: string): string => `${STATIC_IMAGE_ROOT}/${src}.webp`;

export const managedImageUrl = (id: string): string => `${MANAGED_IMAGE_ROOT}/${id}.webp`;

/** Storage key of a managed image's blob, inside the data root. */
export const managedBlobKey = (id: string): string => `media/${id}.webp`;
