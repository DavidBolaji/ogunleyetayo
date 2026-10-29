import type { TypeStyle } from "@/content/types";

/**
 * The site's own display-type steps, offered as presets in the
 * dashboard.
 *
 * These are the values the hand-built pages used, so an editor
 * reaching for "Section heading" gets exactly the heading the designer
 * set — while the numbers underneath stay editable for anything the
 * presets do not cover.
 */
export interface TypePreset {
  readonly id: string;
  readonly label: string;
  readonly value: TypeStyle;
}

const preset = (id: string, label: string, value: Partial<TypeStyle> & Pick<TypeStyle, "min" | "vw" | "max">): TypePreset => ({
  id,
  label,
  value: {
    leading: 1.05,
    tracking: "",
    case: "normal",
    italic: false,
    ...value,
  },
});

export const typePresets: readonly TypePreset[] = [
  preset("masthead", "Masthead (home hero)", {
    min: 2.75,
    vw: 7.6,
    max: 6.5,
    leading: 0.86,
    tracking: "-0.03em",
    case: "upper",
  }),
  preset("page-title", "Page title", {
    min: 2.5,
    vw: 7,
    max: 5.5,
    leading: 0.92,
    tracking: "-0.03em",
    case: "upper",
  }),
  preset("hero-giant", "Giant (featured release)", {
    min: 3.5,
    vw: 12,
    max: 9,
    leading: 0.82,
    tracking: "-0.04em",
    case: "upper",
  }),
  preset("hero-large", "Large display", {
    min: 3,
    vw: 9,
    max: 7,
    leading: 0.85,
    tracking: "-0.04em",
    case: "upper",
  }),
  preset("section-2xl", "Section heading — 2XL", { min: 2.25, vw: 6, max: 4.5 }),
  preset("section-xl-upper", "Section heading — XL, caps", {
    min: 2,
    vw: 5.5,
    max: 4,
    leading: 0.95,
    case: "upper",
  }),
  preset("section-lg-upper", "Section heading — L, caps", {
    min: 2,
    vw: 4.6,
    max: 3.5,
    leading: 1.02,
    case: "upper",
  }),
  preset("section-lg", "Section heading — L", { min: 1.875, vw: 4.5, max: 3.25 }),
  preset("section-md", "Section heading — M", { min: 1.875, vw: 4.2, max: 3.25 }),
  preset("section-sm", "Section heading — S", { min: 1.75, vw: 4.5, max: 3, leading: 1.15 }),
  preset("row-title", "Row title (programmes)", {
    min: 1.75,
    vw: 3.5,
    max: 2.75,
    leading: 1,
    case: "upper",
  }),
  preset("ledger", "Ledger row (expressions)", {
    min: 1.6,
    vw: 3,
    max: 2.6,
    leading: 1,
    case: "upper",
  }),
  preset("statement", "Statement", { min: 1.5, vw: 3.6, max: 2.6, leading: 1.25 }),
  preset("statement-band", "Statement band", {
    min: 1.5,
    vw: 4.5,
    max: 3.25,
    leading: 1.05,
    tracking: "-0.02em",
    case: "upper",
  }),
  preset("card-lg", "Card title — L", { min: 1.5, vw: 3.5, max: 2.25, leading: 1.15 }),
  preset("card-md", "Card title — M", { min: 1.35, vw: 2.6, max: 2, leading: 1.15 }),
  preset("card-sm", "Card title — S", { min: 1.35, vw: 2.4, max: 1.75, leading: 1.15 }),
  preset("quote", "Pull-quote", { min: 1.25, vw: 2.4, max: 1.5, leading: 1.3, italic: true }),
  preset("quote-lg", "Pull-quote — L", {
    min: 1.35,
    vw: 3,
    max: 2,
    leading: 1.25,
    italic: true,
  }),
  preset("numeral", "Numerals (stats, years)", {
    min: 2.5,
    vw: 6,
    max: 4,
    leading: 1,
  }),
  preset("numeral-lg", "Numerals — L (editions)", {
    min: 2.25,
    vw: 7,
    max: 5,
    leading: 1,
    tracking: "-0.03em",
  }),
  preset("marquee", "Marquee band", {
    min: 1.75,
    vw: 4.5,
    max: 3.25,
    leading: 1,
    tracking: "-0.01em",
    case: "upper",
  }),
];

export const findTypePreset = (value: TypeStyle): TypePreset | undefined =>
  typePresets.find(
    (candidate) =>
      candidate.value.min === value.min &&
      candidate.value.vw === value.vw &&
      candidate.value.max === value.max &&
      candidate.value.leading === value.leading,
  );
