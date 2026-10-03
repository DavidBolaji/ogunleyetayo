import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Figure } from "@/components/ui/Figure";
import { Reveal } from "@/components/ui/Reveal";
import type { BrandKey, Media } from "@/content/types";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  lede?: string;
  media?: Media;
  brand?: BrandKey;
  tone?: "canvas" | "deep";
  children?: ReactNode;
}

/** Shared opening block for every inner page — consistent, never identical. */
export function PageHero({
  eyebrow,
  title,
  lede,
  media,
  brand,
  tone = "canvas",
  children,
}: PageHeroProps) {
  const onDeep = tone === "deep";

  return (
    <section
      data-brand={brand}
      className={cn(
        "grain relative overflow-hidden pt-32 sm:pt-40",
        onDeep ? "bg-deep text-on-deep pb-20 sm:pb-28" : "bg-canvas text-ink pb-14 sm:pb-20",
      )}
    >
      <Container width="wide" className="relative z-10">
        <div
          className={cn(
            "grid gap-10",
            media && "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-16",
          )}
        >
          <div>
            <Reveal>
              <Eyebrow className={onDeep ? "text-accent" : undefined}>{eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-6 max-w-3xl text-[clamp(2.5rem,7vw,5.5rem)] uppercase leading-[0.92] tracking-[-0.03em]">
                {title}
              </h1>
            </Reveal>

            {lede ? (
              <Reveal delay={0.12}>
                <p
                  className={cn(
                    "mt-7 max-w-xl text-lg leading-relaxed",
                    onDeep ? "text-on-deep-muted" : "text-ink/70",
                  )}
                >
                  {lede}
                </p>
              </Reveal>
            ) : null}

            {children ? (
              <Reveal delay={0.18}>
                <div className="mt-9">{children}</div>
              </Reveal>
            ) : null}
          </div>

          {media ? (
            <Reveal delay={0.1} from="left">
              <Figure
                media={media}
                ratio="wide"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
