import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { PillarGrid } from "@/components/sections/PillarGrid";
import { ProgrammeList } from "@/components/sections/ProgrammeList";
import { EngageBanner } from "@/components/sections/EngageBanner";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Figure } from "@/components/ui/Figure";
import { ActionLink } from "@/components/ui/ActionLink";
import { silentshout, silentshoutProgrammes, summit } from "@/content/silentshout";

export const metadata: Metadata = {
  title: "SilentShout School of Music Ministry",
  description: silentshout.statement,
};

export default function MinistryPage() {
  return (
    <div data-brand="silentshout" className="bg-canvas">
      <PageHero
        eyebrow={silentshout.name}
        title={silentshout.headline}
        lede={silentshout.statement}
        tone="deep"
        media={{ src: "portrait-white-standing", alt: "Ebahi standing in white", focus: "50% 22%" }}
      >
        <div className="flex flex-wrap gap-3">
          <ActionLink label="About the school" href="#about" variant="accent" size="lg" />
          <ActionLink label="The Summit" href="/ministry/summit" variant="outlineLight" size="lg" />
        </div>
      </PageHero>

      {/* Core idea band */}
      <div className="grain border-b border-line bg-sand py-12">
        <div className="mx-auto w-full max-w-[92rem] px-gutter">
          <Reveal>
            <p className="font-display text-[clamp(1.5rem,4.5vw,3.25rem)] uppercase leading-[1.05] tracking-[-0.02em]">
              From spiritual formation
              <span className="text-accent"> → </span>
              <span className="italic">to earthly relevance.</span>
            </p>
          </Reveal>
        </div>
      </div>

      <Section id="about" tone="canvas" size="lg" width="wide">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
          <div>
            <SectionHeading eyebrow="About SilentShout" title="The gap nobody plans for." />
            <div className="mt-8 space-y-5 text-base leading-relaxed text-ink/75 sm:text-lg">
              {silentshout.about.map((paragraph, index) => (
                <Reveal key={paragraph} delay={0.1 + index * 0.06}>
                  <p>{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal from="left">
            <Figure
              media={{ src: "portrait-prayer", alt: "Ebahi in prayer", focus: "50% 25%" }}
              ratio="portrait"
              sizes="(max-width: 1024px) 100vw, 38vw"
            />
          </Reveal>
        </div>
      </Section>

      <Section tone="surface" size="lg" width="wide">
        <SectionHeading
          eyebrow="What we cultivate"
          title="Four things we refuse to teach separately."
          className="mb-12"
        />
        <PillarGrid pillars={silentshout.pillars} columns={4} tone="surface" />
      </Section>

      <Section tone="canvas" size="lg" width="wide">
        <SectionHeading
          eyebrow="Training & resources"
          title="How SilentShout works"
          className="mb-14 sm:mb-20"
        />
        <ProgrammeList programmes={silentshoutProgrammes} />
      </Section>

      {/* Summit feature */}
      <Section tone="deep" size="lg" width="wide" grain>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <p className="eyebrow text-accent">Featured gathering</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-6 text-[clamp(2rem,5.5vw,4rem)] uppercase leading-[0.95]">
                {summit.name}
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 font-display text-xl italic text-accent">Theme: {summit.theme}</p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-on-deep-muted">
                {summit.description}
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <div className="mt-9">
                <ActionLink label="Learn about the Summit" href="/ministry/summit" variant="accent" size="lg" />
              </div>
            </Reveal>
          </div>

          <Reveal from="left" delay={0.1}>
            <Figure
              media={{ src: "editorial-raised-hand", alt: "Ebahi with a raised hand", focus: "50% 18%" }}
              ratio="wide"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </Reveal>
        </div>
      </Section>

      <EngageBanner
        eyebrow="Get involved"
        title="Bring SilentShout to your music team."
        body="Workshops, training and school enquiries for churches, worship departments and creative collectives."
        actions={[
          { label: "Request a workshop", href: "/work-with-me" },
          { label: "Contact SilentShout", href: "/contact" },
        ]}
      />
    </div>
  );
}
