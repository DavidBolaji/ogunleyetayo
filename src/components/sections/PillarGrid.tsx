import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

export interface Pillar {
  readonly title: string;
  readonly body: string;
}

const columnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

/** Cells sit on hairline dividers, so they must match the host section. */
const cellTones = {
  canvas: "bg-canvas text-ink",
  surface: "bg-surface text-ink",
  sand: "bg-sand text-ink",
  deep: "bg-deep text-on-deep",
} as const;

interface PillarGridProps {
  pillars: readonly Pillar[];
  numbered?: boolean;
  columns?: keyof typeof columnClasses;
  tone?: keyof typeof cellTones;
  className?: string;
}

/** A reusable grid of short ideas — used by ministry, speaking and Edwoltz. */
export function PillarGrid({
  pillars,
  numbered = true,
  columns = 4,
  tone = "canvas",
  className,
}: PillarGridProps) {
  const muted = tone === "deep" ? "text-on-deep-muted" : "text-muted";

  return (
    <ul className={cn("grid gap-px bg-line", columnClasses[columns], className)}>
      {pillars.map((pillar, index) => (
        <li key={pillar.title} className={cn("p-7 sm:p-8", cellTones[tone])}>
          <Reveal delay={index * 0.06} from="none">
            {numbered ? (
              <span className="font-display text-xs text-accent tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
            ) : null}
            <h3 className="mt-3 text-xl leading-tight">{pillar.title}</h3>
            <p className={cn("mt-3 text-sm leading-relaxed", muted)}>{pillar.body}</p>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
