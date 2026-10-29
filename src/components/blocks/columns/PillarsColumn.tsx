import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { gridColumns } from "@/lib/blocks/scale";
import type { ColumnSpec, Tone } from "@/content/types";

type PillarsSpec = Extract<ColumnSpec, { kind: "pillars" }>;

/** Cells sit on hairline dividers, so they must match the host ground. */
const cellTones = {
  canvas: "bg-canvas text-ink",
  surface: "bg-surface text-ink",
  sand: "bg-sand text-ink",
  deep: "bg-deep text-on-deep",
} as const;

/**
 * A grid of short ideas — pillars, sessions, services, the movements of
 * a framework.
 *
 * The divider trick is a one-pixel gap filled by the grid's own
 * background, which is why each cell has to repaint the section's
 * ground. `cellTone: "inherit"` resolves to the host block's tone so an
 * editor does not have to keep the two in step by hand.
 */
export function PillarsColumn({
  spec,
  tone,
  onDeep,
}: {
  spec: PillarsSpec;
  tone: Tone;
  onDeep: boolean;
}) {
  if (spec.items.length === 0 && spec.intro.length === 0) return null;

  const resolved =
    spec.cellTone === "inherit" ? (tone === "none" ? "canvas" : tone) : spec.cellTone;

  const cell = cellTones[resolved];
  const muted = onDeep || resolved === "deep" ? "text-on-deep-muted" : "text-muted";

  return (
    <div className={spec.selfStart ? "self-start" : undefined}>
      {spec.intro.length > 0 ? (
        <div
          className={cn(
            "space-y-5 text-base leading-relaxed sm:text-lg",
            onDeep ? "text-on-deep-muted" : "text-ink/75",
          )}
        >
          {spec.intro.map((paragraph, index) => (
            <Reveal key={index} delay={0.1 + index * 0.06}>
              <p>
                <RichText>{paragraph}</RichText>
              </p>
            </Reveal>
          ))}
        </div>
      ) : null}

      {spec.items.length > 0 ? (
        <ul
          className={cn(
            "grid gap-px",
            onDeep || resolved === "deep" ? "bg-white/15" : "bg-line",
            gridColumns[spec.columns],
            spec.intro.length > 0 && "mt-10",
          )}
        >
          {spec.items.map((pillar, index) => (
            <li key={`${pillar.title}-${index}`} className={cn("p-7 sm:p-8", cell)}>
              <Reveal delay={index * 0.06} from="none">
                {spec.numbered ? (
                  <span className="font-display text-xs tabular-nums text-accent">
                    {pillar.label ?? String(index + 1).padStart(2, "0")}
                  </span>
                ) : null}
                <h3 className={cn("text-xl leading-tight", spec.numbered && "mt-3")}>
                  {pillar.title}
                </h3>
                {pillar.body ? (
                  <p className={cn("mt-3 text-sm leading-relaxed", muted)}>
                    <RichText>{pillar.body}</RichText>
                  </p>
                ) : null}
              </Reveal>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
