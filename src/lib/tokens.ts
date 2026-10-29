/**
 * The semantic colour tokens, and how they become CSS variables.
 *
 * Shared by the theme generator (which writes palettes into the
 * document head) and the block renderer (which writes per-block
 * overrides as inline custom properties). Both go through here so a
 * token is named in exactly one place.
 */

export const colorTokens = [
  "canvas",
  "surface",
  "sand",
  "deep",
  "deepSoft",
  "ink",
  "muted",
  "line",
  "accent",
  "accentSoft",
  "accentInk",
  "onDeep",
  "onDeepMuted",
  "headingLight",
] as const;

export type ColorToken = (typeof colorTokens)[number];

export const colorTokenLabels: Record<string, string> = {
  canvas: "Canvas (page background)",
  surface: "Surface (raised panels)",
  sand: "Sand (warm band)",
  deep: "Deep (dark sections)",
  deepSoft: "Deep soft (hover on dark)",
  ink: "Ink (body text)",
  muted: "Muted text",
  line: "Hairlines & borders",
  accent: "Accent",
  accentSoft: "Accent soft (tints)",
  accentInk: "Accent ink (accent text on light)",
  onDeep: "Text on deep",
  onDeepMuted: "Muted text on deep",
  headingLight: "Headings on light surfaces",
};

/** `accentInk` → `--c-accent-ink`. */
export const cssVarName = (token: string): string =>
  `--c-${token.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;

/**
 * Only well-formed custom-property names and values are ever written
 * out. Validation already happened at the schema boundary; this is the
 * second gate, so a stored document that predates a schema change can
 * still never inject a declaration.
 */
const SAFE_TOKEN = /^[a-zA-Z][a-zA-Z0-9]*$/;
const SAFE_VALUE = /^[#a-zA-Z0-9(),.%\s/-]{1,80}$/;

export const isSafeToken = (token: string): boolean => SAFE_TOKEN.test(token);
export const isSafeValue = (value: string): boolean => SAFE_VALUE.test(value);

/** Token map → a `style` object of CSS custom properties. */
export function tokensToStyle(tokens: Record<string, string | undefined>): Record<string, string> {
  const style: Record<string, string> = {};

  for (const [token, value] of Object.entries(tokens)) {
    if (!value || !isSafeToken(token) || !isSafeValue(value)) continue;
    style[cssVarName(token)] = value;
  }

  return style;
}

/** Token map → a CSS declaration list. */
export function tokensToCss(tokens: Record<string, string>): string {
  return Object.entries(tokens)
    .filter(([token, value]) => isSafeToken(token) && isSafeValue(value))
    .map(([token, value]) => `${cssVarName(token)}:${value}`)
    .join(";");
}
