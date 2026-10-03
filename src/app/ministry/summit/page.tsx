import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { PillarGrid } from "@/components/sections/PillarGrid";
import { EngageBanner } from "@/components/sections/EngageBanner";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxFigure } from "@/components/ui/ParallaxFigure";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { summit } from "@/content/silentshout";

export const metadata: Metadata = {
  title: "The Young Music Ministers Summit",
  description: summit.description,
};

export default function SummitPage() {
  return (
    <div data-brand="silentshout" className="bg-canvas">
      <PageHero
        eyebrow="SilentShout presents"
        title={summit.name}
        lede={summit.description}
        tone="deep"
      >
        <p className="font-display text-2xl italic text-accent">Theme: {summit.theme}</p>
      </PageHero>

      <Section tone="canvas" size="lg" width="wide">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Why the Summit" title="A calling you did not ask for and cannot shake." />
            <div className="mt-8 space-y-5 text-base leading-relaxed text-ink/75 sm:text-lg">
              {summit.body.map((paragraph, index) => (
                <Reveal key={paragraph} delay={0.1 + index * 0.06}>
                  <p>{paragraph}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.26}>
              <div className="mt-10">
                <p className="eyebrow text-accent-ink">Who it is for</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {summit.forWho.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-line px-3.5 py-1.5 text-[0.72rem] uppercase tracking-[0.12em] text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal from="left">
            <ParallaxFigure
              media={{ src: "garden-swing-reach", alt: "Ebahi reaching upward", focus: "50% 30%" }}
              className="aspect-[4/5] w-full"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </Reveal>
        </div>
      </Section>

      <Section tone="surface" size="lg" width="wide">
        <SectionHeading
          eyebrow="Sessions"
          title="Stewarding the Call"
          lede="Four conversations, taught honestly, for ministers at the beginning of a long road."
          className="mb-12"
        />
        <PillarGrid pillars={summit.sessions} columns={4} tone="surface" />
      </Section>

      <Section tone="deep" size="md" width="default" grain>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="eyebrow text-accent">Registration</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 text-[clamp(1.75rem,4.5vw,3rem)] leading-tight">
              Dates for the next Summit are being confirmed.
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-5 text-base leading-relaxed text-on-deep-muted">
              Join the list and you will be the first to know when registration opens.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <NewsletterForm className="mx-auto mt-9 max-w-md" tone="deep" />
          </Reveal>
        </div>
      </Section>

      <EngageBanner
        eyebrow="Partner with the Summit"
        title="Bring your music team, or host the Summit in your city."
        actions={[
          { label: "Talk to the team", href: "/contact" },
          { label: "Back to SilentShout", href: "/ministry" },
        ]}
      />
    </div>
  );
}
