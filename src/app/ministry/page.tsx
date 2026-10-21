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
import { Gallery } from "@/components/sections/Gallery";
import {
  fiveAmTribe,
  silentshout,
  silentshoutArms,
  silentshoutProgrammes,
  summit,
  weEvangelise,
  wush,
} from "@/content/silentshout";

export const metadata: Metadata = {
  title: "SilentShout Global Network",
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
          <ActionLink label="The network" href="#network" variant="accent" size="lg" />
          <ActionLink label="WUSH" href="#wush" variant="outlineLight" size="lg" />
          <ActionLink label="The 5AM Tribe" href="#tribe" variant="outlineLight" size="lg" />
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

      <Section id="network" tone="surface" size="lg" width="wide">
        <SectionHeading
          eyebrow="The network"
          title={silentshout.headline}
          lede={silentshout.statement}
          className="mb-14 sm:mb-20"
        />
        <ProgrammeList programmes={silentshoutArms} />
      </Section>

      <Section tone="canvas" size="lg" width="wide">
        <SectionHeading
          eyebrow="What we cultivate"
          title="Four things we refuse to teach separately."
          className="mb-12"
        />
        <PillarGrid pillars={silentshout.pillars} columns={4} />
      </Section>

      <Section id="school" tone="surface" size="lg" width="wide">
        <SectionHeading
          eyebrow="Training & resources"
          title="How SilentShout works"
          className="mb-14 sm:mb-20"
        />
        <ProgrammeList programmes={silentshoutProgrammes} />
      </Section>

      {/* WUSH — the umbrella. The Summit below sits inside it, which is
          why the two dark bands run together as one chapter. */}
      <Section id="wush" tone="deep" size="lg" width="wide" grain>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow text-accent">{wush.expansion}</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-6 text-[clamp(3rem,9vw,7rem)] uppercase leading-[0.85] tracking-[-0.04em]">
                {wush.name}
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-on-deep-muted">
                {wush.statement}
              </p>
            </Reveal>
          </div>

          <div className="space-y-5 text-base leading-relaxed text-on-deep-muted lg:pt-6">
            {wush.body.map((paragraph, index) => (
              <Reveal key={paragraph} delay={0.16 + index * 0.06}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.24}>
          <div className="mt-16 border-t border-on-deep/15 pt-8">
            <p className="eyebrow text-accent">{wush.editionsLabel}</p>
            <ol className="mt-6 flex flex-wrap items-baseline gap-x-10 gap-y-3 sm:gap-x-16">
              {wush.editions.map((year) => (
                <li
                  key={year}
                  className="font-display text-[clamp(2.25rem,7vw,5rem)] leading-none tabular-nums tracking-[-0.03em]"
                >
                  {year}
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <div className="mt-14">
          <Gallery items={wush.gallery} ratio="wide" />
        </div>
      </Section>

      {/* The Summit — one strand inside WUSH */}
      <Section tone="deep" size="lg" width="wide" grain>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <p className="eyebrow text-accent">Inside WUSH</p>
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

      {/* The 5AM Tribe — a formation pillar, so it gets its own room */}
      <Section id="tribe" tone="canvas" size="lg" width="wide">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow={`Founded ${fiveAmTribe.founded}`}
              title={fiveAmTribe.name}
              size="lg"
            />
            <Reveal delay={0.12}>
              <p className="mt-7 max-w-md font-display text-xl italic leading-snug text-accent-ink sm:text-2xl">
                {fiveAmTribe.promise}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-9">
                <ActionLink {...fiveAmTribe.action} variant="solid" size="lg" />
              </div>
            </Reveal>
          </div>

          <div>
            <div className="space-y-5 text-base leading-relaxed text-ink/75 sm:text-lg">
              {fiveAmTribe.body.map((paragraph, index) => (
                <Reveal key={paragraph} delay={0.1 + index * 0.06}>
                  <p>{paragraph}</p>
                </Reveal>
              ))}
            </div>
            <PillarGrid pillars={fiveAmTribe.rhythm} columns={2} className="mt-10" />
          </div>
        </div>
      </Section>

      {/* We Evangelise — the outreach arm */}
      <Section tone="sand" size="lg" width="wide" grain>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Outreach" title={weEvangelise.name} />
            <Reveal delay={0.12}>
              <p className="mt-6 font-display text-xl italic text-accent-ink">
                {weEvangelise.promise}
              </p>
            </Reveal>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-ink/75">
              {weEvangelise.body.map((paragraph, index) => (
                <Reveal key={paragraph} delay={0.16 + index * 0.06}>
                  <p>{paragraph}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.3}>
              <div className="mt-9">
                <ActionLink {...weEvangelise.action} variant="outline" size="lg" />
              </div>
            </Reveal>
          </div>

          <ul className="grid gap-px self-start border border-line bg-line sm:grid-cols-3 lg:mt-4">
            {weEvangelise.stats.map((stat, index) => (
              <li key={stat.label} className="bg-canvas p-8">
                <Reveal delay={index * 0.06} from="none">
                  <p className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-none tabular-nums text-accent-ink">
                    {stat.value}
                  </p>
                  <p className="mt-4 text-xs uppercase leading-relaxed tracking-[0.14em] text-muted">
                    {stat.label}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
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
