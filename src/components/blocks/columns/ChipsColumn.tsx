import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { Chips } from "./Chips";
import type { ColumnSpec } from "@/content/types";

type ChipsSpec = Extract<ColumnSpec, { kind: "chips" }>;

export function ChipsColumn({ spec, onDeep }: { spec: ChipsSpec; onDeep: boolean }) {
  if (spec.items.length === 0) return null;

  return (
    <Reveal delay={0.1}>
      <div>
        {spec.label ? (
          <p className={cn("eyebrow mb-5", onDeep ? "text-accent" : "text-accent-ink")}>
            {spec.label}
          </p>
        ) : null}
        <Chips
          items={spec.items}
          onDeep={onDeep}
          size={spec.size}
          variant={spec.variant}
          interactive={spec.interactive}
        />
      </div>
    </Reveal>
  );
}
