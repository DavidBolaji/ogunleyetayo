import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { EngageBanner } from "@/components/sections/EngageBanner";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxFigure } from "@/components/ui/ParallaxFigure";
import { ActionLink } from "@/components/ui/ActionLink";
import { environment } from "@/content/edwoltz";
import { credentials } from "@/content/profile";

export const metadata: Metadata = {
  title: "Hair & Environment",
  description: environment.statement,
};

export default function EnvironmentPage() {
  return (
    <div data-brand="edwoltz" className="bg-canvas">
      <PageHero
        eyebrow="Hair & environment project"
        title={environment.heading}
        lede={environment.statement}
        tone="deep"
      />

      <Section tone="canvas" size="lg" width="wide">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Why this project" title="Two lives, one question." />
            <div className="mt-8 space-y-5 text-base leading-relaxed text-ink/75 sm:text-lg">
              {environment.body.map((paragraph, index) => (
                <Reveal key={paragraph} delay={0.1 + index * 0.06}>
                  <p>{paragraph}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.24}>
              <div className="mt-10 border-l-2 border-accent pl-6">
                {credentials.map((credential) => (
                  <p key={credential.qualification} className="text-sm text-ink/80">
                    <span className="font-semibold">{credential.qualification}</span>
                    <span className="text-muted"> — {credential.institution}</span>
                  </p>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal from="left">
            <ParallaxFigure
              media={{ src: "garden-path", alt: "Ebahi walking a garden path", focus: "50% 40%" }}
              className="aspect-[4/5] w-full"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </Reveal>
        </div>
      </Section>

      <Section tone="surface" size="lg" width="wide">
        <SectionHeading eyebrow="The conversations" title="What we talk about" className="mb-12" />
        <ul className="border-t border-line">
          {environment.themes.map((theme, index) => (
            <li key={theme} className="border-b border-line">
              <Reveal delay={index * 0.04} from="none">
                <div className="flex items-baseline gap-6 py-6">
                  <span className="font-display text-xs tabular-nums text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="font-display text-[clamp(1.25rem,2.6vw,2rem)] leading-tight">
                    {theme}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.2}>
          <div className="mt-12">
            <ActionLink {...environment.cta} variant="outline" size="lg" />
          </div>
        </Reveal>
      </Section>

      <EngageBanner
        eyebrow="Speak on this"
        title="Invite Ebahi to speak on beauty, business and sustainability."
        actions={[
          { label: "Invite Ebahi", href: "/work-with-me" },
          { label: "Back to Edwoltz", href: "/edwoltz" },
        ]}
      />
    </div>
  );
}
