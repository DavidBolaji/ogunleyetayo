import Image from "next/image";
import { cn } from "@/lib/cn";
import { ActionRow } from "@/components/blocks/ActionRow";
import { BlockShell } from "@/components/blocks/BlockShell";
import { RichText } from "@/components/ui/RichText";
import { resolveImageBlur, resolveImageUrl } from "@/lib/images";
import { typeClass, typeStyle } from "@/lib/blocks/scale";
import type { BlockOf, BlockStyle } from "@/content/types";

/**
 * The editorial masthead: the headline is set as full-width display
 * type, the portrait runs off the right edge, and the words arrive in
 * sequence.
 *
 * Entrance animation stays pure CSS. The portrait is the largest
 * contentful paint, so nothing here may wait on hydration to become
 * visible — which is also why the block renders its own section rather
 * than taking the shared padding.
 */
export function HeroBlock({ block }: { block: BlockOf<"hero"> }) {
  const { data } = block;
  const media = data.media;
  const blurDataURL = resolveImageBlur(media);

  return (
    <BlockShell
      style={blockStyle(block.style)}
      chrome={false}
      container={false}
      className="overflow-hidden bg-canvas pt-32 sm:pt-40 lg:pt-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-24 h-[34rem] w-[34rem] rounded-full bg-accent-soft/70 blur-[120px]"
      />

      <div className="relative mx-auto w-full max-w-[92rem] px-gutter">
        {data.eyebrow ? (
          <p className="eyebrow hero-rise text-accent-ink">{data.eyebrow}</p>
        ) : null}

        <div className="mt-8 grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
          <div className="order-2 lg:order-1">
            <h1 className="sr-only">
              {data.headlineLabel ?? data.headlineWords.join(" ")}
            </h1>

            <div aria-hidden className="flex flex-col">
              {data.headlineWords.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  style={{
                    ...typeStyle(data.titleType),
                    animationDelay: `${0.12 + index * 0.12}s`,
                  }}
                  className={cn("hero-rise font-display", typeClass(data.titleType))}
                >
                  {index === data.accentWordIndex ? (
                    <span className="italic text-accent-ink">{word}</span>
                  ) : (
                    word
                  )}
                </span>
              ))}
            </div>

            <div className="hero-rise mt-9 max-w-xl" style={{ animationDelay: "0.5s" }}>
              {data.support ? (
                <p className="max-w-md text-lg leading-relaxed text-ink/75">
                  <RichText>{data.support}</RichText>
                </p>
              ) : null}

              <ActionRow
                actions={data.actions}
                defaultSize="lg"
                defaultVariant="outline"
                leadVariant="solid"
                className="mt-8"
              />
            </div>
          </div>

          <div className="hero-settle relative order-1 lg:order-2 lg:mr-[calc(var(--spacing-gutter)*-1)]">
            <div className="relative aspect-[4/5] overflow-hidden bg-sand lg:aspect-auto lg:h-[min(66vh,720px)]">
              <Image
                src={resolveImageUrl(media)}
                alt={media.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 46vw"
                placeholder={blurDataURL ? "blur" : "empty"}
                blurDataURL={blurDataURL}
                style={{ objectPosition: media.focus ?? "50% 35%" }}
                className="object-cover"
              />
            </div>

            {data.badge ? (
              <div className="absolute -left-3 bottom-6 hidden max-w-[13rem] bg-deep p-5 text-on-deep sm:block lg:-left-10">
                <p className="eyebrow text-accent">{data.badge.label}</p>
                <p className="mt-2 text-sm leading-snug">
                  <RichText>{data.badge.text}</RichText>
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </BlockShell>
  );
}

/** The hero paints its own ground, so the shell must not paint one too. */
const blockStyle = (style: BlockStyle): BlockStyle => ({ ...style, tone: "none" });
