import { Gallery } from "@/components/sections/Gallery";
import type { ColumnSpec } from "@/content/types";

type GallerySpec = Extract<ColumnSpec, { kind: "gallery" }>;

/**
 * A photo grid. Shared by the `gallery` block and the `gallery` column
 * so the two cannot drift: the block is this column plus a section of
 * its own.
 */
export function GalleryColumn({ spec }: { spec: GallerySpec }) {
  if (spec.items.length === 0) return null;

  return <Gallery items={spec.items} ratio={spec.ratio} />;
}
