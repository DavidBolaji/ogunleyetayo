import { cn } from "@/lib/cn";
import { ActionRow } from "@/components/blocks/ActionRow";
import { BlockShell } from "@/components/blocks/BlockShell";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { RichLines, RichText } from "@/components/ui/RichText";
import { typeClass, typeStyle } from "@/lib/blocks/scale";
import type { BlockOf } from "@/content/types";

/** The closing call to action, reused at the foot of every page. */
export function EngageBannerBlock({ block }: { block: BlockOf<"engageBanner"> }) {
  const { data } = block;
  const onDeep = block.style.tone === "deep";

  return (
    <BlockShell style={block.style}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16">
        <div>
          <Reveal>
            <Eyebrow className={onDeep ? "text-accent" : undefined}>{data.eyebrow}</Eyebrow>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              className={cn("mt-5 max-w-2xl", typeClass(data.titleType))}
              style={typeStyle(data.titleType)}
            >
              <RichLines>{data.title}</RichLines>
            </h2>
          </Reveal>

          {data.body ? (
            <Reveal delay={0.1}>
              <p
                className={cn(
                  "mt-5 max-w-xl text-base leading-relaxed",
                  onDeep ? "text-on-deep-muted" : "text-ink/70",
                )}
              >
                <RichText>{data.body}</RichText>
              </p>
            </Reveal>
          ) : null}
        </div>

        <Reveal delay={0.14}>
          <ActionRow
            actions={data.actions}
            defaultSize="lg"
            defaultVariant={onDeep ? "outlineLight" : "outline"}
            leadVariant={onDeep ? "accent" : "solid"}
            className="lg:justify-end"
          />
        </Reveal>
      </div>
    </BlockShell>
  );
}
