import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { BrandKey } from "@/content/types";
import { Container, type ContainerWidth } from "./Container";

const tones = {
  canvas: "bg-canvas text-ink",
  surface: "bg-surface text-ink",
  sand: "bg-sand text-ink",
  deep: "bg-deep text-on-deep",
} as const;

export type SectionTone = keyof typeof tones;

const sizes = {
  sm: "py-14 sm:py-16",
  md: "py-20 sm:py-28",
  lg: "py-24 sm:py-36",
} as const;

interface SectionProps {
  children: ReactNode;
  id?: string;
  tone?: SectionTone;
  size?: keyof typeof sizes;
  width?: ContainerWidth;
  /** Adopt a sub-brand palette for this section only. */
  brand?: BrandKey;
  grain?: boolean;
  className?: string;
}

/**
 * The single layout unit every page is assembled from. Sections are
 * closed to modification and open to extension: new looks arrive as new
 * tones, not as new bespoke wrappers.
 */
export function Section({
  children,
  id,
  tone = "canvas",
  size = "md",
  width = "default",
  brand,
  grain = false,
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      data-brand={brand}
      className={cn("relative isolate", tones[tone], sizes[size], grain && "grain", className)}
    >
      <Container width={width}>{children}</Container>
    </section>
  );
}
