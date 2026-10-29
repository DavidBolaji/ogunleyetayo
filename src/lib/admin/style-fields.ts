import { f, options, type Field } from "./fields";
import { colorTokenLabels, colorTokens } from "@/lib/tokens";

/**
 * How a block looks.
 *
 * These are the same controls the design system already exposes —
 * ground, rhythm, measure, palette — rather than raw CSS, so anything
 * assembled in the dashboard still sits on the site's grid. The colour
 * overrides are the escape hatch: they write semantic tokens as inline
 * custom properties, which is why a one-off section can take its own
 * palette without a hex value appearing in any component.
 */
export const blockStyleFields: readonly Field[] = [
  f.select("tone", "Background", options.tone),
  f.select("size", "Vertical rhythm", options.size),
  f.select("width", "Measure", options.width),
  f.select("align", "Alignment", options.align),
  { kind: "palette", name: "palette", label: "Palette" },
  f.text("anchor", "Anchor", {
    half: true,
    placeholder: "expressions",
    help: "Lets other links point at this block with #anchor.",
  }),
  f.toggle("grain", "Paper grain"),
  f.toggle("borderTop", "Hairline above"),
  f.toggle("borderBottom", "Hairline below"),
  f.fieldset(
    "Fine spacing",
    [
      f.select("paddingTop", "Space above", [
        { value: "", label: "Match the rhythm" },
        ...options.space,
      ]),
      f.select("paddingBottom", "Space below", [
        { value: "", label: "Match the rhythm" },
        ...options.space,
      ]),
    ],
    true,
  ),
  f.group(
    "colors",
    "Colour overrides",
    colorTokens.map((token) => ({
      kind: "color" as const,
      name: token,
      label: colorTokenLabels[token] ?? token,
      half: true,
    })),
    true,
  ),
];
