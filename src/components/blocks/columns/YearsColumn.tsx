import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { typeClass, typeStyle } from "@/lib/blocks/scale";
import type { ColumnSpec } from "@/content/types";

type YearsSpec = Extract<ColumnSpec, { kind: "years" }>;

/**
 * A row of years set as display numerals — the editions of a gathering.
 * Ordered, because the sequence is the point.
 */
export function YearsColumn({ spec, onDeep }: { spec: YearsSpec; onDeep: boolean }) {
  if (spec.items.length === 0) return null;

  return (
    <Reveal>
      <div className={cn(spec.dividerTop && (onDeep ? "border-t border-on-deep/15 pt-8" : "border-t border-line pt-8"))}>
        {spec.label ? (
          <p className={cn("eyebrow", onDeep ? "text-accent" : "text-accent-ink")}>{spec.label}</p>
        ) : null}

        <ol
          className={cn(
            "flex flex-wrap items-baseline gap-x-10 gap-y-3 sm:gap-x-16",
            spec.label && "mt-6",
          )}
        >
          {spec.items.map((item) => (
            <li
              key={item}
              className={cn("font-display tabular-nums", typeClass(spec.type))}
              style={typeStyle(spec.type)}
            >
              {item}
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  );
}
