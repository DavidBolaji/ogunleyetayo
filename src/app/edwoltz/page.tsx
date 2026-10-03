import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { PillarGrid } from "@/components/sections/PillarGrid";
import { EngageBanner } from "@/components/sections/EngageBanner";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Figure } from "@/components/ui/Figure";
import { ActionLink } from "@/components/ui/ActionLink";
import { edwoltz, environment } from "@/content/edwoltz";

export const metadata: Metadata = {
  title: "Edwoltz Hair City",
  description: `${edwoltz.positioning} — the hair business founded by Ebahi Tayo-Ogunleye.`,
};

export default function EdwoltzPage() {
  return (
    <div data-brand="edwoltz" className="bg-canvas">
      <PageHero
        eyebrow={edwoltz.name}
        title={edwoltz.headline}
        lede={edwoltz.positioning}
        tone="deep"
        media={{ ...edwoltz.media, focus: "50% 25%" }}
      >
        <ActionLink {...edwoltz.cta} variant="accent" size="lg" />
      </PageHero>

      <Section tone="canvas" size="lg" width="wide">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20">
          <div>
            <SectionHeading eyebrow="A separate business" title="Its own brand. Its own standards." />
            <div className="mt-8 space-y-5 text-base leading-relaxed text-ink/75 sm:text-lg">
              {edwoltz.intro.map((paragraph, index) => (
                <Reveal key={paragraph} delay={0.1 + index * 0.06}>
                  <p>{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal from="left">
            <Figure
              media={{
                src: "editorial-veil-motion",
                alt: "Editorial portrait in motion",
                focus: "50% 25%",
              }}
              ratio="portrait"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </Reveal>
        </div>
      </Section>

      <Section tone="surface" size="lg" width="wide">
        <SectionHeading eyebrow="What Edwoltz does" title="Services & education" className="mb-12" />
        <PillarGrid pillars={edwoltz.services} columns={4} tone="surface" />
      </Section>

      <Section tone="deep" size="lg" width="wide" grain>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <Reveal from="right">
            <Figure
              media={environment.media}
              ratio="wide"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </Reveal>

          <div>
            <Reveal>
              <p className="eyebrow text-accent">Beauty, business & the environment</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-6 text-[clamp(1.875rem,4.5vw,3.25rem)] leading-[1.05]">
                {environment.heading}
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-on-deep-muted">
                {environment.statement}
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-9">
                <ActionLink
                  label="Explore the hair & environment project"
                  href="/edwoltz/environment"
                  variant="accent"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <EngageBanner
        eyebrow="Edwoltz enquiries"
        title="Wig revamping, hair services, training and business enquiries."
        actions={[
          { label: "Contact Edwoltz", href: "/contact" },
          { ...edwoltz.cta },
        ]}
      />
    </div>
  );
}
