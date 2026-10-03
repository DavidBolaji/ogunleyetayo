import { imageBlurData } from "./image-blur";

const IMAGE_ROOT = "/images";

/** Resolves a content `Media.src` basename to its public URL. */
export const imageUrl = (src: string): string => `${IMAGE_ROOT}/${src}.webp`;

/** Returns the pre-generated LQIP for a photo, if one exists. */
export const imageBlur = (src: string): string | undefined => imageBlurData[src];
