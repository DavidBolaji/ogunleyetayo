import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import type { Align, Space, TextSize, TypeStyle } from "@/content/types";

/**
 * The presentation scales a block can choose from.
 *
 * Blocks pick a step on a ramp rather than a literal value, so
 * everything the dashboard produces still sits on the site's rhythm
 * and the theme's global type scale reaches all of it.
 */

/**
 * A fluid display-type style, as inline CSS.
 *
 * Written as a style rather than a utility class because the values
 * are continuous: generating `text-[clamp(...)]` per heading would
 * need every combination to exist in the Tailwind build, which it
 * cannot. `--type-scale` multiplies the result, so the theme's global
 * scale still reaches every heading.
 */
export function typeStyle(type: TypeStyle): CSSProperties {
  return {
    fontSize: `calc(clamp(${type.min}rem, ${type.vw}vw, ${type.max}rem) * var(--type-scale, 1))`,
    lineHeight: type.leading,
    letterSpacing: type.tracking || undefined,
  };
}

/** The casing and slant that go with a type style. */
export const typeClass = (type: TypeStyle): string =>
  cn(type.case === "upper" && "uppercase", type.italic && "italic");

/** Display type — headings, mastheads, pull-quotes. */
export const displaySize: Record<TextSize, string> = {
  xs: "text-d-xs",
  sm: "text-d-sm",
  md: "text-d-md",
  lg: "text-d-lg",
  xl: "text-d-xl",
  "2xl": "text-d-2xl",
  "3xl": "text-d-3xl",
  display: "text-d-display",
};

/** Body copy. */
export const bodySize: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-base sm:text-lg",
  xl: "text-lg",
  "2xl": "text-lg sm:text-xl",
  "3xl": "text-xl sm:text-2xl",
  display: "text-2xl sm:text-3xl",
};

export const textAlign: Record<Align, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export const itemsAlign: Record<Align, string> = {
  left: "items-start",
  center: "items-center",
  right: "items-end",
};

export const justifyAlign: Record<Align, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export const maxWidth = {
  none: "",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
} as const;

export type MaxWidth = keyof typeof maxWidth;

/** Vertical space, as a top margin — used for gaps between stacked parts. */
export const marginTop: Record<Space, string> = {
  none: "",
  xs: "mt-4",
  sm: "mt-7",
  md: "mt-10",
  lg: "mt-14 sm:mt-20",
  xl: "mt-20 sm:mt-28",
};

/** Vertical space, as a bottom margin — used under a block's heading. */
export const marginBottom: Record<Space, string> = {
  none: "",
  xs: "mb-4",
  sm: "mb-7",
  md: "mb-10",
  lg: "mb-12 sm:mb-14",
  xl: "mb-14 sm:mb-20",
};

export const gridColumns: Record<number, string> = {
  1: "",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};
