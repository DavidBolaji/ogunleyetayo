import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import type { BaseColumnSpec, ColumnSpec } from "@/content/types";
import type { ColumnContext } from "./ColumnRenderer";

type GroupSpec = Extract<ColumnSpec, { kind: "group" }>;

const stackGaps = {
  none: "",
  sm: "space-y-6",
  md: "space-y-10",
  lg: "space-y-12",
  xl: "space-y-14",
} as const;

const splitGaps = {
  none: "gap-0",
  sm: "gap-6 lg:gap-10",
  md: "gap-10 lg:gap-16",
  lg: "gap-12 lg:gap-20",
  xl: "gap-12 lg:gap-24",
} as const;

const verticalAlign = { start: "", center: "items-center", end: "items-end" } as const;

/**
 * A group of columns inside a column.
 *
 * One level of nesting is enough to express every composite section on
 * the site — copy with a chip list under it, a heading above a grid,
 * two columns inside one half of a split — without a block type for
 * each shape.
 */
export async function GroupColumn({
  spec,
  context,
  render,
}: {
  spec: GroupSpec;
  context: ColumnContext;
  /** Injected to avoid a circular import with the dispatcher. */
  render: (spec: BaseColumnSpec, context: ColumnContext) => Promise<React.ReactNode>;
}) {
  const children = await Promise.all(
    spec.items.map(async (item, index) => (
      <div key={`${item.kind}-${index}`}>{await render(item, context)}</div>
    )),
  );

  if (spec.layout === "stack") {
    return <div className={stackGaps[spec.gap]}>{children}</div>;
  }

  const [left, right] = spec.ratio.split("/");

  return (
    <div
      style={{ "--split-cols": `minmax(0,${left}fr) minmax(0,${right}fr)` } as CSSProperties}
      className={cn(
        "split",
        spec.breakpoint === "sm" ? "split-sm" : "split-lg",
        splitGaps[spec.gap],
        verticalAlign[spec.verticalAlign],
      )}
    >
      {children}
    </div>
  );
}
