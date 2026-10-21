import { ActionLink } from "@/components/ui/ActionLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Figure } from "@/components/ui/Figure";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { profile } from "@/content/profile";

export function MeetEbahi() {
  return (
    <Section id="meet-ebahi" tone="canvas" size="lg" width="wide">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <div className="relative">
          <Reveal from="right">
            {/* Static frame at the file's own 4:5 ratio - the parallax
                overscan would crop the crown of a portrait this tight. */}
            <Figure
              media={{
                src: "portrait-burgundy-close",
                alt: "Ebahi in a burgundy waistcoat, hand resting under her chin",
                focus: "50% 20%",
              }}
              ratio="auto"
              className="aspect-[4/5] w-full"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </Reveal>

          <Reveal delay={0.15} className="absolute -bottom-10 -right-4 hidden w-40 sm:block lg:-right-10 lg:w-52">
            <Figure
              media={{ src: "portrait-prayer", alt: "Ebahi with hands clasped in prayer" }}
              ratio="portrait"
              sizes="220px"
              className="border-4 border-canvas"
            />
          </Reveal>
        </div>

        <div className="lg:pt-8">
          <Reveal>
            <Eyebrow>Meet Ebahi</Eyebrow>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="mt-6 text-[clamp(2rem,4.6vw,3.5rem)] uppercase leading-[1.02]">
              {profile.meetHeading}
            </h2>
          </Reveal>

          <div className="mt-8 space-y-5 text-base leading-relaxed text-ink/75 sm:text-lg">
            {profile.shortBio.map((paragraph, index) => (
              <Reveal key={paragraph} delay={0.12 + index * 0.05}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <blockquote className="mt-10 border-l-2 border-accent pl-6">
              <p className="font-display text-xl italic leading-snug text-ink sm:text-2xl">
                “{profile.centralIdea}”
              </p>
              <footer className="mt-3 text-xs uppercase tracking-[0.2em] text-muted">
                The thread through everything
              </footer>
            </blockquote>
          </Reveal>

          <Reveal delay={0.36}>
            <div className="mt-10">
              <ActionLink label="Read my story" href="/about" variant="link" />
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
