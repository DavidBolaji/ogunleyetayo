import { cn } from "@/lib/cn";
import { BlockShell } from "@/components/blocks/BlockShell";
import { BlockHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { getItems } from "@/lib/content";
import { gridColumns } from "@/lib/blocks/scale";
import type { BlockOf } from "@/content/types";

/**
 * Three very different conversations, each given its own door.
 *
 * Each cell carries its route's palette, so in palette mode the three
 * doors read as three brands — and in unified mode as one. The block
 * does not know which, which is the point.
 */
export async function EnquiryRoutesBlock({ block }: { block: BlockOf<"enquiryRoutes"> }) {
  const routes = await getItems(block.data.collection, "enquiryRoute");
  if (routes.length === 0) return null;

  const onDeep = block.style.tone === "deep";

  return (
    <BlockShell style={block.style}>
      <BlockHeading heading={block.data.heading} onDeep={onDeep} />

      <ul
        className={cn(
          "grid gap-px",
          onDeep ? "bg-white/15" : "bg-line",
          gridColumns[block.data.columns],
        )}
      >
        {routes.map((route, index) => (
          <li
            key={route.id}
            data-brand={route.palette}
            className={cn("p-8", onDeep ? "bg-deep" : "bg-canvas")}
          >
            <Reveal delay={index * 0.06} from="none">
              <span className="font-display text-xs tabular-nums text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-3 text-2xl leading-tight">{route.label}</h2>
              <p
                className={cn(
                  "mt-3 text-sm leading-relaxed",
                  onDeep ? "text-on-deep-muted" : "text-muted",
                )}
              >
                <RichText>{route.description}</RichText>
              </p>
              <a
                href={`mailto:${route.email}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-ink underline-offset-4 hover:underline"
              >
                {route.email}
                <span aria-hidden>→</span>
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
    </BlockShell>
  );
}
