import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { FeaturedRelease } from "@/components/sections/FeaturedRelease";
import { EngageBanner } from "@/components/sections/EngageBanner";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Figure } from "@/components/ui/Figure";
import { ActionLink } from "@/components/ui/ActionLink";
import { musicArchiveNote, musicIntro, releases } from "@/content/music";

export const metadata: Metadata = {
  title: "Music",
  description:
    "Music by Ebahi Tayo-Ogunleye — worship leadership, original songs, live recordings and the Emiore project.",
};

export default function MusicPage() {
  return (
    <>
      <PageHero
        eyebrow={musicIntro.heading}
        title={musicIntro.opening}
        lede={musicIntro.body[0]}
        media={{ src: "garden-swing-laugh", alt: "Ebahi laughing on a garden swing", focus: "50% 30%" }}
      >
        <ActionLink label="Hear the featured project" href="#featured" variant="solid" size="lg" />
      </PageHero>

      <div id="featured">
        <FeaturedRelease variant="full" />
      </div>

      <Section tone="canvas" size="lg" width="wide">
        <SectionHeading
          eyebrow="The archive"
          title="Selected songs, sessions & projects"
          lede={musicArchiveNote}
          className="mb-14"
        />

        <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {releases.map((release, index) => (
            <li key={release.title}>
              <Reveal delay={(index % 4) * 0.06}>
                <article className="group">
                  {release.media ? (
                    <Figure
                      media={release.media}
                      ratio="square"
                      sizes="(max-width: 640px) 100vw, 24vw"
                      imageClassName="transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-105"
                    />
                  ) : null}

                  <p className="eyebrow mt-5 text-accent-ink">{release.kind}</p>
                  <h3 className="mt-2 text-xl leading-tight">{release.title}</h3>
                  {release.subtitle ? (
                    <p className="mt-1 text-sm text-muted">{release.subtitle}</p>
                  ) : null}
                  <p className="mt-3 text-xs uppercase tracking-[0.14em] text-muted">
                    {release.year}
                  </p>
                  {release.note ? (
                    <p className="mt-3 text-sm leading-relaxed text-ink/70">{release.note}</p>
                  ) : null}
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="sand" size="md" width="wide" grain>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <SectionHeading
            eyebrow="Watch & listen"
            title="Videos and live recordings"
            lede="Music videos, live worship sessions and recordings will be embedded here as each project is released."
          />

          {/* Ready-made embed slots — drop in a YouTube or Spotify iframe per release. */}
          <div className="grid gap-4 sm:grid-cols-2">
            {["Emiore — live", "Worship session"].map((label) => (
              <Reveal key={label}>
                <div className="flex aspect-video items-center justify-center border border-dashed border-line bg-surface/60 p-6 text-center">
                  <div>
                    <p className="eyebrow text-muted">Embed slot</p>
                    <p className="mt-2 text-sm text-ink/70">{label}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <EngageBanner
        eyebrow="Music ministry"
        title="Invite Ebahi to minister, or bring SilentShout to your music team."
        actions={[
          { label: "Invite Ebahi", href: "/work-with-me" },
          { label: "Visit SilentShout", href: "/ministry" },
        ]}
      />
    </>
  );
}
