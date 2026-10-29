import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { tokensToStyle } from "@/lib/tokens";
import type { BlockStyle, Space } from "@/content/types";

/**
 * Resolves a block's stored presentation into the attributes its
 * section element needs.
 *
 * Padding is expressed per edge so two consecutive blocks can share
 * one visual band — the mechanism that lets a heading, a feature and a
 * gallery read as a single dark chapter while remaining three
 * independently movable blocks in the dashboard.
 */

const tones = {
  canvas: "bg-canvas text-ink",
  surface: "bg-surface text-ink",
  sand: "bg-sand text-ink",
  deep: "bg-deep text-on-deep",
  none: "",
} as const;

/** Symmetric padding, used when neither edge is overridden. */
const symmetric = {
  sm: "py-14 sm:py-16",
  md: "py-20 sm:py-28",
  lg: "py-24 sm:py-36",
} as const;

const top: Record<Space, string> = {
  none: "pt-0",
  xs: "pt-8",
  sm: "pt-12",
  md: "pt-20 sm:pt-28",
  lg: "pt-24 sm:pt-36",
  xl: "pt-32 sm:pt-40",
};

const bottom: Record<Space, string> = {
  none: "pb-0",
  xs: "pb-8",
  sm: "pb-12",
  md: "pb-20 sm:pb-28",
  lg: "pb-24 sm:pb-36",
  xl: "pb-32 sm:pb-40",
};

const widths = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-[92rem]",
  full: "max-w-none",
} as const;

export interface ResolvedBlockStyle {
  id?: string;
  className: string;
  /** Tone and padding only — for blocks that lay out their own section. */
  decoration: string;
  containerClassName: string;
  style?: CSSProperties;
  palette?: string;
  /** True when the block paints a dark ground, for child components. */
  onDeep: boolean;
}

export function resolveBlockStyle(style: BlockStyle): ResolvedBlockStyle {
  const overridden = style.paddingTop !== undefined || style.paddingBottom !== undefined;

  const padding = overridden
    ? cn(top[style.paddingTop ?? style.size], bottom[style.paddingBottom ?? style.size])
    : symmetric[style.size];

  const tokens: Record<string, string | undefined> = { ...style.colors };

  // A custom heading colour has to pin the light variant too, because
  // the surface rules in globals.css resolve --c-heading from it.
  if (tokens.heading) tokens.headingLight = tokens.heading;

  const custom = tokensToStyle(tokens);

  const decoration = cn(
    style.grain && "grain",
    style.borderTop && "border-t border-line",
    style.borderBottom && "border-b border-line",
  );

  return {
    id: style.anchor || undefined,
    decoration,
    className: cn("relative isolate", tones[style.tone], padding, decoration),
    containerClassName: cn("mx-auto w-full px-gutter", widths[style.width]),
    style: Object.keys(custom).length > 0 ? (custom as CSSProperties) : undefined,
    palette: style.palette || undefined,
    onDeep: style.tone === "deep",
  };
}
