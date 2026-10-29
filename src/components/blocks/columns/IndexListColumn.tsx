import { cn } from "@/lib/cn";
import { ActionLink } from "@/components/ui/ActionLink";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { typeClass, typeStyle } from "@/lib/blocks/scale";
import type { ColumnSpec } from "@/content/types";

type IndexListSpec = Extract<ColumnSpec, { kind: "indexList" }>;

/**
 * A numbered ledger of statements, each on its own hairline row. Used
 * where a list of topics deserves display type rather than bullets.
 */
export function IndexListColumn({ spec, onDeep }: { spec: IndexListSpec; onDeep: boolean }) {
  if (spec.items.length === 0) return null;

  const border = onDeep ? "border-white/15" : "border-line";

  return (
    <div>
      <ul className={cn("border-t", border)}>
        {spec.items.map((item, index) => (
          <li key={`${item.title}-${index}`} className={cn("border-b", border)}>
            <Reveal delay={index * 0.04} from="none">
              <div className="flex items-baseline gap-6 py-6">
                {spec.numbered ? (
                  <span className="font-display text-xs tabular-nums text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                ) : null}

                <div>
                  <p
                    className={cn("font-display", typeClass(spec.type))}
                    style={typeStyle(spec.type)}
                  >
                    <RichText>{item.title}</RichText>
                  </p>
                  {item.body ? (
                    <p
                      className={cn(
                        "mt-2 text-sm leading-relaxed",
                        onDeep ? "text-on-deep-muted" : "text-ink/70",
                      )}
                    >
                      <RichText>{item.body}</RichText>
                    </p>
                  ) : null}
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      {spec.action ? (
        <Reveal delay={0.2}>
          <div className="mt-12">
            <ActionLink
              {...spec.action}
              variant={spec.action.variant ?? (onDeep ? "outlineLight" : "outline")}
              size={spec.action.size ?? "lg"}
            />
          </div>
        </Reveal>
      ) : null}
    </div>
  );
}
