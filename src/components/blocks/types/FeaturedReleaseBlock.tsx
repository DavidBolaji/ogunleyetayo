import { cn } from "@/lib/cn";
import { ActionRow } from "@/components/blocks/ActionRow";
import { BlockShell } from "@/components/blocks/BlockShell";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ParallaxFigure } from "@/components/ui/ParallaxFigure";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { typeClass, typeStyle } from "@/lib/blocks/scale";
import type { BlockOf, BlockStyle } from "@/content/types";

/**
 * A project given the full stage: the title set as the largest type on
 * the site, the testimony beside it, and the facts of the release in a
 * definition list.
 *
 * Paints its own dark ground and its own glow, so it bypasses the
 * shell's tone the way the heroes do.
 */
export function FeaturedReleaseBlock({ block }: { block: BlockOf<"featuredRelease"> }) {
  const { data } = block;

  return (
    <BlockShell
      style={shellStyle(block.style)}
      chrome={false}
      container={false}
      className="grain overflow-hidden bg-deep py-24 text-on-deep sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/3 h-[28rem] w-[28rem] rounded-full bg-accent/20 blur-[130px]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[92rem] items-center gap-12 px-gutter lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow className="text-accent">{data.eyebrow}</Eyebrow>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              className={cn("mt-6 font-display", typeClass(data.titleType))}
              style={typeStyle(data.titleType)}
            >
              {data.title}
            </h2>
          </Reveal>

          {data.meaning ? (
            <Reveal delay={0.1}>
              <p className="mt-4 font-display text-lg italic text-accent sm:text-xl">
                {data.meaning}
              </p>
            </Reveal>
          ) : null}

          {data.quote ? (
            <Reveal delay={0.14}>
              <p className="mt-6 max-w-md font-display text-xl italic leading-snug text-on-deep/90 sm:text-2xl">
                “<RichText>{data.quote}</RichText>”
              </p>
            </Reveal>
          ) : null}

          {data.showDescription && data.description ? (
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-on-deep-muted">
                <RichText>{data.description}</RichText>
              </p>
            </Reveal>
          ) : null}

          {data.facts.length > 0 ? (
            <Reveal delay={0.2}>
              <dl className="mt-9 flex flex-wrap gap-x-12 gap-y-5 border-t border-white/15 pt-7">
                {data.facts.map((fact, index) => (
                  <div key={`${fact.label}-${index}`}>
                    <dt className="eyebrow text-on-deep-muted">{fact.label}</dt>
                    <dd className={cn("mt-2 text-sm", fact.accent && "text-accent")}>
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ) : null}

          {data.actions.length > 0 ? (
            <Reveal delay={0.26}>
              <ActionRow
                actions={data.actions}
                defaultSize="lg"
                defaultVariant="outlineLight"
                leadVariant="accent"
                className="mt-9"
              />
            </Reveal>
          ) : null}
        </div>

        <Reveal from="left" delay={0.1}>
          <ParallaxFigure
            media={data.media}
            className="aspect-[4/5] w-full"
            sizes="(max-width: 1024px) 100vw, 42vw"
            strength={8}
          />
        </Reveal>
      </div>
    </BlockShell>
  );
}

const shellStyle = (style: BlockStyle): BlockStyle => ({ ...style, tone: "none", grain: false });
