import { cn } from "@/lib/cn";
import { justifyAlign } from "@/lib/blocks/scale";
import type { Align } from "@/content/types";

interface ChipsProps {
  items: readonly string[];
  onDeep?: boolean;
  size?: "sm" | "md";
  variant?: "outline" | "filled";
  interactive?: boolean;
  align?: Align;
  className?: string;
}

/**
 * The hairline pill list — used for what a programme includes, who a
 * session is for, and the blog's category index. One component, so the
 * pills are identical wherever they appear.
 */
export function Chips({
  items,
  onDeep = false,
  size = "sm",
  variant = "outline",
  interactive = false,
  align = "left",
  className,
}: ChipsProps) {
  if (items.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap", size === "sm" ? "gap-2" : "gap-2.5", justifyAlign[align], className)}>
      {items.map((item) => (
        <li
          key={item}
          className={cn(
            "rounded-full border",
            size === "sm"
              ? "px-3.5 py-1.5 text-[0.7rem] uppercase tracking-[0.12em]"
              : "px-5 py-2.5 text-sm",
            onDeep ? "border-white/20 text-on-deep-muted" : "border-line text-muted",
            variant === "filled" && !onDeep && "bg-surface",
            interactive &&
              !onDeep &&
              "transition-colors hover:border-accent hover:text-accent-ink",
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
