import { findFont } from "./fonts";
import { tokensToCss } from "./tokens";
import type { PalettePreset, Theme } from "@/content/types";

/**
 * Turns the stored theme into the stylesheet the site runs on.
 *
 * The CSS variable layer that globals.css used to hardcode is
 * generated here instead, so palettes, the active palette mode and the
 * type scale are all database values. The *structure* — which token
 * resolves on which surface, the Tailwind theme mapping — stays in
 * globals.css, because that is design-system architecture rather than
 * content.
 */

const paletteBlock = (selector: string, palette: PalettePreset): string => {
  const body = tokensToCss(palette.tokens);
  return body ? `${selector}{${body}}` : "";
};

/**
 * The generated stylesheet.
 *
 * Emitted inline in the document head: it is a few hundred bytes, it
 * must not flash, and it changes whenever the theme is edited — all of
 * which rule out a cached external file.
 */
export function themeCss(theme: Theme): string {
  const base =
    theme.palettes.find((palette) => palette.id === theme.basePalette) ?? theme.palettes[0];

  const displayFont = findFont(theme.fonts.display, "display");
  const sansFont = findFont(theme.fonts.sans, "sans");

  const rules: string[] = [];

  // The base palette answers for :root, so any element without a
  // palette — or carrying a suppressed one — inherits it.
  rules.push(paletteBlock(`:root,[data-brand="${base.id}"]`, base));

  rules.push(
    `:root{` +
      `--font-display-family:${displayFont.stack};` +
      `--font-sans-family:${sansFont.stack};` +
      `--type-scale:${theme.typography.scale};` +
      `--heading-tracking:${theme.typography.headingTracking};` +
      `--heading-weight:${theme.typography.headingWeight};` +
      `--body-size:${theme.typography.bodySize}` +
      `}`,
  );

  // Non-base palettes are scoped per mode, so a mode can silence a
  // palette simply by listing it — no token duplication, and a newly
  // added palette works in every mode by default.
  for (const mode of theme.modes) {
    for (const palette of theme.palettes) {
      if (palette.id === base.id || mode.suppress.includes(palette.id)) continue;
      rules.push(
        paletteBlock(`[data-palette="${mode.id}"] [data-brand="${palette.id}"]`, palette),
      );
    }
  }

  return rules.filter(Boolean).join("\n");
}

/** All loaded font variable classes plus the pair the theme selects. */
export function themeFontClassNames(theme: Theme): string {
  return [findFont(theme.fonts.display, "display").className, findFont(theme.fonts.sans, "sans").className]
    .filter(Boolean)
    .join(" ");
}

export const paletteOptions = (theme: Theme) =>
  theme.palettes.map((palette) => ({ value: palette.id, label: palette.label }));
