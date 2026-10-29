import { cn } from "@/lib/cn";
import { ActionRow } from "@/components/blocks/ActionRow";
import { BlockShell } from "@/components/blocks/BlockShell";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Figure } from "@/components/ui/Figure";
import { Reveal } from "@/components/ui/Reveal";
import { RichLines, RichText } from "@/components/ui/RichText";
import { typeClass, typeStyle } from "@/lib/blocks/scale";
import type { BlockOf, BlockStyle } from "@/content/types";

/**
 * The shared opening block for every inner page — consistent, never
 * identical. Like the home hero it owns its own padding, because a
 * page's first block sits under the fixed header and needs more room
 * above than a mid-page section.
 */
export function PageHeroBlock({ block }: { block: BlockOf<"pageHero"> }) {
  const { data } = block;
  const onDeep = data.tone === "deep";

  return (
    <BlockShell
      style={shellStyle(block.style)}
      chrome={false}
      container={false}
      className={cn(
        "grain overflow-hidden pt-32 sm:pt-40",
        onDeep ? "bg-deep pb-20 text-on-deep sm:pb-28" : "bg-canvas pb-14 text-ink sm:pb-20",
      )}
    >
      <div className="relative z-10 mx-auto w-full max-w-[92rem] px-gutter">
        <div
          className={cn(
            "grid gap-10",
            data.media && "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-16",
          )}
        >
          <div>
            <Reveal>
              <Eyebrow className={onDeep ? "text-accent" : undefined}>{data.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.06}>
              <h1
                className={cn("mt-6 max-w-3xl", typeClass(data.titleType))}
                style={typeStyle(data.titleType)}
              >
                <RichLines>{data.title}</RichLines>
              </h1>
            </Reveal>

            {data.lede ? (
              <Reveal delay={0.12}>
                <p
                  className={cn(
                    "mt-7 max-w-xl text-base leading-relaxed sm:text-lg",
                    onDeep ? "text-on-deep-muted" : "text-ink/75",
                  )}
                >
                  <RichText>{data.lede}</RichText>
                </p>
              </Reveal>
            ) : null}

            {data.note ? (
              <Reveal delay={0.16}>
                <p className="mt-7 font-display text-2xl italic text-accent">
                  <RichText>{data.note}</RichText>
                </p>
              </Reveal>
            ) : null}

            {data.actions.length > 0 ? (
              <Reveal delay={0.2}>
                <ActionRow
                  actions={data.actions}
                  defaultSize="lg"
                  defaultVariant={onDeep ? "outlineLight" : "outline"}
                  leadVariant={onDeep ? "accent" : "solid"}
                  className="mt-9"
                />
              </Reveal>
            ) : null}
          </div>

          {data.media ? (
            <Reveal from="left" delay={0.1}>
              <Figure
                media={data.media}
                ratio="wide"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
            </Reveal>
          ) : null}
        </div>
      </div>
    </BlockShell>
  );
}

const shellStyle = (style: BlockStyle): BlockStyle => ({ ...style, tone: "none", grain: false });
