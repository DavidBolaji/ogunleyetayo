import { ActionLink } from "@/components/ui/ActionLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ParallaxFigure } from "@/components/ui/ParallaxFigure";
import { Reveal } from "@/components/ui/Reveal";
import { featuredProject } from "@/content/music";

interface FeaturedReleaseProps {
  /** Homepage uses the compact framing; the music page gives it the full stage. */
  variant?: "compact" | "full";
}

export function FeaturedRelease({ variant = "compact" }: FeaturedReleaseProps) {
  return (
    <section className="grain relative overflow-hidden bg-deep py-24 text-on-deep sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/3 h-[28rem] w-[28rem] rounded-full bg-accent/20 blur-[130px]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[92rem] items-center gap-12 px-gutter lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow className="text-accent">Featured project</Eyebrow>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="mt-6 font-display text-[clamp(3.5rem,12vw,9rem)] uppercase leading-[0.82] tracking-[-0.04em]">
              {featuredProject.title}
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-7 max-w-md font-display text-xl italic leading-snug text-on-deep/90 sm:text-2xl">
              “{featuredProject.quote}”
            </p>
          </Reveal>

          {variant === "full" ? (
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-on-deep-muted">
                {featuredProject.description}
              </p>
            </Reveal>
          ) : null}

          <Reveal delay={0.2}>
            <dl className="mt-9 flex flex-wrap gap-x-12 gap-y-5 border-t border-white/15 pt-7">
              <div>
                <dt className="eyebrow text-on-deep-muted">Recorded</dt>
                <dd className="mt-2 text-sm">{featuredProject.recordedNote}</dd>
              </div>
              <div>
                <dt className="eyebrow text-on-deep-muted">Releasing</dt>
                <dd className="mt-2 text-sm text-accent">{featuredProject.releaseDate}</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.26}>
            <div className="mt-9 flex flex-wrap gap-3">
              <ActionLink {...featuredProject.actions[0]} variant="accent" size="lg" />
              <ActionLink {...featuredProject.actions[1]} variant="outlineLight" size="lg" />
              <ActionLink
                {...featuredProject.actions[2]}
                variant="ghost"
                size="lg"
                className="text-on-deep hover:bg-white/10"
              />
            </div>
          </Reveal>
        </div>

        <Reveal from="left" delay={0.1}>
          <ParallaxFigure
            media={featuredProject.media}
            className="aspect-[4/5] w-full"
            sizes="(max-width: 1024px) 100vw, 42vw"
            strength={10}
          />
        </Reveal>
      </div>
    </section>
  );
}
