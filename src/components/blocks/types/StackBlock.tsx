import { cn } from "@/lib/cn";
import { BlockShell } from "@/components/blocks/BlockShell";
import { ColumnRenderer, type ColumnContext } from "@/components/blocks/columns/ColumnRenderer";
import { maxWidth } from "@/lib/blocks/scale";
import type { BlockOf } from "@/content/types";

const gaps = {
  none: "",
  sm: "space-y-7",
  md: "space-y-10",
  lg: "space-y-12",
  xl: "space-y-14",
} as const;

/**
 * The single-column counterpart to `split` — a heading above a grid, a
 * centred statement, a closing panel. Same column kinds, stacked, so
 * there is one vocabulary to learn rather than two.
 */
export async function StackBlock({
  block,
  context,
}: {
  block: BlockOf<"stack">;
  context: ColumnContext;
}) {
  const { data } = block;

  return (
    <BlockShell style={block.style}>
      <div
        className={cn(
          maxWidth[data.maxWidth],
          data.centered && "mx-auto text-center",
          gaps[data.gap],
        )}
      >
        {data.items.map((spec, index) => (
          <ColumnRenderer key={`${spec.kind}-${index}`} spec={spec} context={context} />
        ))}
      </div>
    </BlockShell>
  );
}
