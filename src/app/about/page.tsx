import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Timeline } from "@/components/sections/Timeline";
import { Gallery } from "@/components/sections/Gallery";
import { EngageBanner } from "@/components/sections/EngageBanner";
import { RecognitionStrip } from "@/components/sections/RecognitionStrip";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxFigure } from "@/components/ui/ParallaxFigure";
import { fullBio, gallery, mission, storyIntro, timeline } from "@/content/profile";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "My Story",
  description:
    "The woman behind the work — Ebahi Tayo-Ogunleye's journey through music ministry, teaching, authorship and enterprise.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="My story"
        title="The woman behind the work"
        lede={storyIntro[0]}
        media={{
          src: "editorial-veil-leaning",
          alt: "Ebahi seated in an editorial portrait",
          focus: "50% 25%",
        }}
      />

      <Section tone="canvas" size="md" width="wide">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <Reveal from="right">
            <ParallaxFigure
              media={{
                src: "portrait-burgundy-close",
                alt: "Portrait of Ebahi in burgundy",
                focus: "50% 20%",
              }}
              className="aspect-[4/5] w-full"
              sizes="(max-width: 1024px) 100vw, 38vw"
            />
          </Reveal>

          <div className="lg:pt-6">
            <SectionHeading
              eyebrow="In her words"
              title="I have never had a separate self for each room."
              lede={storyIntro[1]}
            />

            <div className="mt-10 space-y-5 text-base leading-relaxed text-ink/75">
              {fullBio.slice(0, 3).map((paragraph, index) => (
                <Reveal key={paragraph} delay={0.1 + index * 0.06}>
                  <p>{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section tone="canvas" size="md" width="default">
        <div className="space-y-5 text-base leading-relaxed text-ink/75 sm:text-lg">
          {fullBio.slice(3).map((paragraph, index) => (
            <Reveal key={paragraph} delay={0.08 + index * 0.05}>
              <p>{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <blockquote className="mt-14 border-l-2 border-accent pl-6">
            <p className="font-display text-[clamp(1.35rem,3vw,2rem)] italic leading-snug text-ink">
              “{mission}”
            </p>
            <footer className="mt-4 text-xs uppercase tracking-[0.2em] text-muted">
              Her constant prayer and core mission
            </footer>
          </blockquote>
        </Reveal>
      </Section>

      <Section tone="surface" size="lg" width="default">
        <SectionHeading
          eyebrow="The journey"
          title="From a childhood ear to a ministry, a school and a business."
          size="lg"
          className="mb-14"
        />
        <Timeline entries={timeline} />
      </Section>

      <RecognitionStrip />

      <Section tone="sand" size="lg" width="wide" grain>
        <SectionHeading
          eyebrow="Portrait gallery"
          title="Selected portraits"
          lede="Photography for press, event programmes and features. Available on request."
          className="mb-12"
        />
        <Gallery items={gallery} />
      </Section>

      <EngageBanner
        eyebrow="Work together"
        title="If any of this is the conversation your room needs, let's talk."
        body={`Based in ${site.location}, serving churches, organisations and creative communities.`}
        actions={[
          { label: "Invite Ebahi to speak", href: "/work-with-me" },
          { label: "Explore my music", href: "/music" },
        ]}
      />
    </>
  );
}
