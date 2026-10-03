import Image from "next/image";
import { ActionLink } from "@/components/ui/ActionLink";
import { imageBlur, imageUrl } from "@/lib/images";
import { profile } from "@/content/profile";
import { site } from "@/content/site";

/**
 * Editorial hero: the name is set as a full-width masthead, the portrait
 * runs off the right edge, and the headline words arrive in sequence.
 *
 * Entrance animation is pure CSS. The portrait is the largest contentful
 * paint, so nothing here may wait on hydration to become visible.
 */
export function Hero() {
  const blurDataURL = imageBlur(profile.portrait.src);

  return (
    <section className="relative overflow-hidden bg-canvas pt-32 sm:pt-40 lg:pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-24 h-[34rem] w-[34rem] rounded-full bg-accent-soft/70 blur-[120px]"
      />

      <div className="relative mx-auto w-full max-w-[92rem] px-gutter">
        <p className="eyebrow hero-rise text-accent-ink">{site.descriptor}</p>

        <div className="mt-8 grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
          <div className="order-2 lg:order-1">
            <h1 className="sr-only">
              {site.name} — {profile.heroHeadline.join(" ")}
            </h1>

            <div aria-hidden className="flex flex-col">
              {profile.heroHeadline.map((word, index) => (
                <span
                  key={word}
                  style={{ animationDelay: `${0.12 + index * 0.12}s` }}
                  className="hero-rise font-display text-[clamp(2.75rem,7.6vw,6.5rem)] uppercase leading-[0.86] tracking-[-0.03em]"
                >
                  {index === 1 ? <span className="italic text-accent-ink">{word}</span> : word}
                </span>
              ))}
            </div>

            <div className="hero-rise mt-9 max-w-xl" style={{ animationDelay: "0.5s" }}>
              <p className="max-w-md text-lg leading-relaxed text-ink/75">{profile.heroSupport}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <ActionLink label="Explore my work" href="#expressions" variant="solid" size="lg" />
                <ActionLink label="Work with me" href="/work-with-me" variant="outline" size="lg" />
              </div>
            </div>
          </div>

          <div className="hero-settle relative order-1 lg:order-2 lg:mr-[calc(var(--spacing-gutter)*-1)]">
            <div className="relative aspect-[4/5] overflow-hidden bg-sand lg:aspect-auto lg:h-[min(66vh,720px)]">
              <Image
                src={imageUrl(profile.portrait.src)}
                alt={profile.portrait.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 46vw"
                placeholder={blurDataURL ? "blur" : "empty"}
                blurDataURL={blurDataURL}
                style={{ objectPosition: profile.portrait.focus }}
                className="object-cover"
              />
            </div>

            <div className="absolute -left-3 bottom-6 hidden max-w-[13rem] bg-deep p-5 text-on-deep sm:block lg:-left-10">
              <p className="eyebrow text-accent">Since 2004</p>
              <p className="mt-2 text-sm leading-snug">Music Director, {site.church}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
