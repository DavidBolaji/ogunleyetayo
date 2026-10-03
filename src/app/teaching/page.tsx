import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ProgrammeList } from "@/components/sections/ProgrammeList";
import { EngageBanner } from "@/components/sections/EngageBanner";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { powerOf90, teachingIntro, teachingProgrammes, teachingRoadmap } from "@/content/teaching";

export const metadata: Metadata = {
  title: "Teaching & Coaching",
  description:
    "Learn with Ebahi — VisionCraft Academy, the Coaching Hub and The Power of 90 Days framework for vision, strategy and execution.",
};

export default function TeachingPage() {
  return (
    <>
      <PageHero
        eyebrow={teachingIntro.heading}
        title={teachingIntro.opening}
        lede={teachingIntro.body[0]}
        media={{
          src: "portrait-burgundy-full",
          alt: "Ebahi in a burgundy jacket, full length",
          focus: "50% 22%",
        }}
      />

      {/* The Power of 90 Days */}
      <Section tone="deep" size="lg" width="wide" grain>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow text-accent">Signature framework</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-6 text-[clamp(2rem,5.5vw,4rem)] uppercase leading-[0.95]">
                The Power of
                <br />
                <span className="italic text-accent">90 Days</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-on-deep-muted">
                {powerOf90.promise}
              </p>
            </Reveal>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-on-deep/80">
              {powerOf90.body.map((paragraph, index) => (
                <Reveal key={paragraph} delay={0.16 + index * 0.05}>
                  <p>{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <ol className="grid gap-px self-start bg-white/15 sm:grid-cols-2">
            {powerOf90.movements.map((movement, index) => (
              <li key={movement.step} className="bg-deep p-7">
                <Reveal delay={index * 0.07} from="none">
                  <span className="font-display text-xs tabular-nums text-accent">
                    {movement.step}
                  </span>
                  <h3 className="mt-3 text-xl leading-tight">{movement.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-on-deep-muted">{movement.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tone="canvas" size="lg" width="wide">
        <SectionHeading
          eyebrow="Programmes"
          title="Where the teaching lives"
          lede={teachingIntro.body[1]}
          className="mb-14 sm:mb-20"
        />
        <ProgrammeList programmes={teachingProgrammes} />
      </Section>

      <Section tone="sand" size="md" width="default" grain>
        <SectionHeading
          eyebrow="Coming to this page"
          title="Built to grow with the work."
          lede="Registration, waitlists, downloads and booking are being added as each programme opens."
          className="mb-10"
        />
        <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {teachingRoadmap.map((item, index) => (
            <li key={item} className="bg-sand p-6">
              <Reveal delay={index * 0.05} from="none">
                <span className="font-display text-xs tabular-nums text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-base">{item}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <EngageBanner
        eyebrow="Start here"
        title="Ninety days from now, something should be different."
        actions={[
          { label: "Enquire about coaching", href: "/contact" },
          { label: "Invite Ebahi to teach", href: "/work-with-me" },
        ]}
      />
    </>
  );
}
