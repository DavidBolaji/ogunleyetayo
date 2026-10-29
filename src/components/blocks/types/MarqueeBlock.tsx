import { cn } from "@/lib/cn";
import { BlockShell } from "@/components/blocks/BlockShell";
import { Marquee } from "@/components/ui/Marquee";
import { typeClass, typeStyle } from "@/lib/blocks/scale";
import type { BlockOf } from "@/content/types";

/**
 * A continuous band of display type between sections — the thread
 * running under every expression of the work. Full-bleed, so it skips
 * the gutter container.
 */
export function MarqueeBlock({ block }: { block: BlockOf<"marquee"> }) {
  const { data } = block;

  const items = data.items.map((word, index) => (
    <span
      key={`${word}-${index}`}
      className={cn("font-display", typeClass(data.type))}
      style={typeStyle(data.type)}
    >
      {word}
    </span>
  ));

  return (
    <BlockShell style={block.style} container={false}>
      <Marquee
        items={items}
        duration={data.duration}
        separator={data.separator}
        className={block.style.tone === "deep" ? "text-on-deep/85" : "text-ink/85"}
      />
    </BlockShell>
  );
}
