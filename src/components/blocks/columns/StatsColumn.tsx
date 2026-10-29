import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { gridColumns, typeClass, typeStyle } from "@/lib/blocks/scale";
import type { ColumnSpec } from "@/content/types";

type StatsSpec = Extract<ColumnSpec, { kind: "stats" }>;

/** Large numerals with a caption — reach, editions, years running. */
export function StatsColumn({ spec, onDeep }: { spec: StatsSpec; onDeep: boolean }) {
  if (spec.items.length === 0) return null;

  return (
    <ul
      className={cn(
        "grid gap-px",
        gridColumns[spec.columns],
        onDeep ? "bg-white/15" : "bg-line",
        spec.framed && !onDeep && "border border-line",
        spec.selfStart && "self-start lg:mt-4",
      )}
    >
      {spec.items.map((stat, index) => (
        <li key={`${stat.label}-${index}`} className={cn("p-8", onDeep ? "bg-deep" : "bg-canvas")}>
          <Reveal delay={index * 0.06} from="none">
            <p
              className={cn(
                "font-display tabular-nums",
                onDeep ? "text-accent" : "text-accent-ink",
                typeClass(spec.valueType),
              )}
              style={typeStyle(spec.valueType)}
            >
              {stat.value}
            </p>
            <p
              className={cn(
                "mt-4 text-xs uppercase leading-relaxed tracking-[0.14em]",
                onDeep ? "text-on-deep-muted" : "text-muted",
              )}
            >
              {stat.label}
            </p>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
