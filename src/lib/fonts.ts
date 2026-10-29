import {
  DM_Serif_Display,
  Fraunces,
  Inter,
  Jost,
  Manrope,
  Playfair_Display,
} from "next/font/google";

/**
 * The typefaces the dashboard can choose between.
 *
 * `next/font` resolves fonts at build time, so the set is declared here
 * rather than loaded from the database — but which pair is *used* is a
 * theme setting, so changing the site's type is still a dashboard
 * action. Adding a face is one entry in this file.
 */

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-playfair",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-dm-serif",
});

const manrope = Manrope({ subsets: ["latin"], display: "swap", variable: "--font-manrope" });
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-inter",
});
const jost = Jost({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-jost" });

export interface FontChoice {
  readonly id: string;
  readonly label: string;
  readonly role: "display" | "sans";
  /** The class that defines this font's CSS variable. */
  readonly className: string;
  /** The full font-family stack to assign. */
  readonly stack: string;
}

export const fontChoices: readonly FontChoice[] = [
  {
    id: "fraunces",
    label: "Fraunces (editorial serif)",
    role: "display",
    className: fraunces.variable,
    stack: 'var(--font-fraunces), Georgia, "Times New Roman", serif',
  },
  {
    id: "playfair",
    label: "Playfair Display (high-contrast serif)",
    role: "display",
    className: playfair.variable,
    stack: 'var(--font-playfair), Georgia, "Times New Roman", serif',
  },
  {
    id: "dm-serif",
    label: "DM Serif Display (modern serif)",
    role: "display",
    className: dmSerif.variable,
    stack: 'var(--font-dm-serif), Georgia, "Times New Roman", serif',
  },
  {
    id: "manrope",
    label: "Manrope (geometric sans)",
    role: "sans",
    className: manrope.variable,
    stack: "var(--font-manrope), ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: "inter",
    label: "Inter (neutral sans)",
    role: "sans",
    className: inter.variable,
    stack: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: "jost",
    label: "Jost (geometric display sans)",
    role: "sans",
    className: jost.variable,
    stack: "var(--font-jost), ui-sans-serif, system-ui, sans-serif",
  },
];

/**
 * Only the pair the theme selects is applied to the document, so the
 * other families are never referenced by a `font-family` and never
 * downloaded. Fraunces and Manrope — the defaults — are the only two
 * that preload, because the active pair is a request-time value and
 * `next/font` resolves preload hints at build time. Switching fonts in
 * the dashboard therefore costs the hint, not the font.
 */
export const allFontClassNames = fontChoices.map((font) => font.className).join(" ");

export const fontsFor = (role: FontChoice["role"]): readonly FontChoice[] =>
  fontChoices.filter((font) => font.role === role);

export function findFont(id: string, role: FontChoice["role"]): FontChoice {
  const choices = fontsFor(role);
  return choices.find((font) => font.id === id) ?? choices[0];
}
