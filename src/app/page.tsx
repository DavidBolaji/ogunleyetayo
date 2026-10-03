import { Hero } from "@/components/sections/Hero";
import { ThreadBand } from "@/components/sections/ThreadBand";
import { MeetEbahi } from "@/components/sections/MeetEbahi";
import { ExpressionIndex } from "@/components/sections/ExpressionIndex";
import { FeaturedRelease } from "@/components/sections/FeaturedRelease";
import { RecognitionStrip } from "@/components/sections/RecognitionStrip";
import { EngageBanner } from "@/components/sections/EngageBanner";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Figure } from "@/components/ui/Figure";
import { expressions } from "@/content/expressions";
import { profile } from "@/content/profile";
import { environment } from "@/content/edwoltz";
import { ActionLink } from "@/components/ui/ActionLink";

export default function HomePage() {
  return (
    <>
      {/* Who is Ebahi? */}
      <Hero />
      <ThreadBand />
      <MeetEbahi />

      {/* What does she do? */}
      <Section id="expressions" tone="surface" size="lg" width="wide">
        <SectionHeading
          eyebrow="My world / my work"
          title={
            <>
              Different expressions.
              <br />
              <span className="italic text-accent-ink">One calling.</span>
            </>
          }
          lede="Six rooms in one house. Every one of them is fed by the same conviction — that what God entrusts to a person is meant to be discovered, stewarded and spent."
          size="lg"
          className="mb-14 sm:mb-20"
        />

        <ExpressionIndex expressions={expressions} />
      </Section>

      {/* Why does she do it? */}
      <Section tone="sand" size="lg" width="default" grain>
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow text-accent-ink">Why</p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-7 font-display text-[clamp(1.5rem,3.6vw,2.6rem)] leading-[1.25]">
              Because gifted people are being handed platforms before they are handed
              <span className="italic text-accent-ink"> formation</span> — and what is not formed
              privately cannot be carried publicly.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-8 text-base leading-relaxed text-ink/70">
              {profile.centralIdea} That sentence governs the music, the school, the classroom, the
              books and the business.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* What has she created? */}
      <FeaturedRelease />

      {/* Beauty, business & the environment */}
      <Section tone="canvas" size="lg" width="wide" brand="edwoltz">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <Reveal from="right">
            <Figure
              media={environment.media}
              ratio="cinema"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </Reveal>

          <div>
            <SectionHeading
              eyebrow="Beauty, business & the environment"
              title="What our industry leaves behind."
              lede={environment.statement}
            />
            <Reveal delay={0.2}>
              <div className="mt-8">
                <ActionLink
                  label="Explore the hair & environment project"
                  href="/edwoltz/environment"
                  variant="outline"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <RecognitionStrip />

      {/* How can I engage? */}
      <EngageBanner
        title="Come and build something with me."
        body="Invite Ebahi to your gathering, join a programme, bring SilentShout to your music team, or simply stay close to the work."
        actions={[
          { label: "Invite Ebahi to speak", href: "/work-with-me" },
          { label: "Learn with me", href: "/teaching" },
          { label: "Contact", href: "/contact" },
        ]}
      />
    </>
  );
}
