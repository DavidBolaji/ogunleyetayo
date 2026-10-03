import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { PillarGrid } from "@/components/sections/PillarGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Figure } from "@/components/ui/Figure";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { speaking } from "@/content/speaking";

export const metadata: Metadata = {
  title: "Work With Me",
  description:
    "Invite Ebahi Tayo-Ogunleye to speak, teach or minister at your church, conference, school, organisation or creative community.",
};

export default function WorkWithMePage() {
  return (
    <>
      <PageHero
        eyebrow="Speaking & collaboration"
        title={speaking.heading}
        lede={speaking.intro}
        media={{
          src: "editorial-stance",
          alt: "Ebahi standing, editorial portrait",
          focus: "50% 18%",
        }}
      />

      <Section tone="canvas" size="md" width="wide">
        <SectionHeading eyebrow="Who I speak to" title="Rooms that are trying to grow." className="mb-10" />
        <Reveal delay={0.1}>
          <ul className="flex flex-wrap gap-2.5">
            {speaking.audiences.map((audience) => (
              <li
                key={audience}
                className="rounded-full border border-line px-5 py-2.5 text-sm text-ink/80 transition-colors hover:border-accent hover:text-accent-ink"
              >
                {audience}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section tone="surface" size="lg" width="wide">
        <SectionHeading
          eyebrow="Speaking areas"
          title="What I am usually asked to bring."
          className="mb-12"
        />
        <PillarGrid pillars={speaking.topics} columns={3} tone="surface" />
      </Section>

      <Section id="invite" tone="canvas" size="lg" width="wide">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Invite Ebahi"
              title="Tell me about your gathering."
              lede="The more you can share about the room, the better the session can be shaped for it."
            />

            <Reveal delay={0.16}>
              <Figure
                media={{
                  src: "portrait-white-standing",
                  alt: "Ebahi standing in white",
                  focus: "50% 25%",
                }}
                ratio="portrait"
                sizes="(max-width: 1024px) 100vw, 30vw"
                className="mt-10 hidden lg:block"
              />
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="border border-line bg-surface p-6 sm:p-10">
              <EnquiryForm intent="speaking" eventTypes={speaking.eventTypes} />
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
