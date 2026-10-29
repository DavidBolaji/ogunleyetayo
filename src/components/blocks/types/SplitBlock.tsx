import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { BlockShell } from "@/components/blocks/BlockShell";
import { ColumnRenderer, type ColumnContext } from "@/components/blocks/columns/ColumnRenderer";
import type { BlockOf } from "@/content/types";

const gaps = {
  sm: "gap-6 lg:gap-10",
  md: "gap-10 lg:gap-16",
  lg: "gap-12 lg:gap-20",
  xl: "gap-12 lg:gap-24",
} as const;

const verticalAlign = {
  start: "",
  center: "items-center",
  end: "items-end",
} as const;

/**
 * The two-column workhorse.
 *
 * Almost every editorial section on the site is "something beside
 * something else" — copy beside a portrait, a heading beside a grid of
 * ideas, a form beside the contact details. Rather than a block type
 * per combination, this block composes two columns of any kind, which
 * is what keeps the catalogue small enough to learn and large enough
 * to rebuild any page in it.
 *
 * The ratio arrives as a CSS custom property because an editable grid
 * template cannot be a Tailwind arbitrary class.
 */
export async function SplitBlock({
  block,
  context,
}: {
  block: BlockOf<"split">;
  context: ColumnContext;
}) {
  const { data } = block;
  const [left, right] = data.columns;

  const [leftFraction, rightFraction] = data.ratio.split("/");
  const style = {
    "--split-cols": `minmax(0,${leftFraction}fr) minmax(0,${rightFraction}fr)`,
  } as CSSProperties;

  const order = (position: "left" | "right") => {
    const classes: string[] = [];
    if (data.reverseOnMobile) classes.push(position === "left" ? "order-2" : "order-1");
    if (data.reverseOnDesktop) {
      const prefix = data.breakpoint === "sm" ? "sm" : "lg";
      classes.push(position === "left" ? `${prefix}:order-2` : `${prefix}:order-1`);
    }
    return classes.length > 0 ? cn(classes) : undefined;
  };

  return (
    <BlockShell style={block.style}>
      <div
        style={style}
        className={cn(
          "split",
          data.breakpoint === "sm" ? "split-sm" : "split-lg",
          gaps[data.gap],
          verticalAlign[data.verticalAlign],
        )}
      >
        <div className={order("left")}>
          <ColumnRenderer spec={left} context={context} />
        </div>
        <div className={order("right")}>
          <ColumnRenderer spec={right} context={context} />
        </div>
      </div>
    </BlockShell>
  );
}
