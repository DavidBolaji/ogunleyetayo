import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { enquiryRoutes, site, socials } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Ebahi Tayo-Ogunleye — separate routes for music and SilentShout, speaking and teaching, and Edwoltz Hair City enquiries.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's connect"
        lede="Three very different conversations happen here, so they each have their own door. Choose the one that fits and you will reach the right desk."
      />

      <Section tone="canvas" size="md" width="wide">
        <ul className="grid gap-px bg-line lg:grid-cols-3">
          {enquiryRoutes.map((route, index) => (
            <li key={route.email} data-brand={route.brand} className="bg-canvas p-8">
              <Reveal delay={index * 0.06} from="none">
                <span className="font-display text-xs tabular-nums text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-3 text-2xl leading-tight">{route.label}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">{route.description}</p>
                <a
                  href={`mailto:${route.email}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-ink underline-offset-4 hover:underline"
                >
                  {route.email}
                  <span aria-hidden>→</span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="surface" size="lg" width="wide">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Send a message"
              title="Or write once, here."
              lede="Everything sent through this form is read and routed to the right inbox."
            />

            <Reveal delay={0.16}>
              <dl className="mt-10 space-y-6 text-sm">
                <div>
                  <dt className="eyebrow text-muted">Email</dt>
                  <dd className="mt-2">
                    <a href={`mailto:${site.email}`} className="hover:text-accent-ink">
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-muted">Phone / WhatsApp</dt>
                  <dd className="mt-2">
                    <a href={site.whatsapp} className="hover:text-accent-ink">
                      {site.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-muted">Based in</dt>
                  <dd className="mt-2">{site.location}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-muted">Social</dt>
                  <dd className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                    {socials.map((social) => (
                      <a
                        key={social.platform}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="underline underline-offset-4 decoration-line hover:decoration-accent"
                      >
                        {social.platform}
                      </a>
                    ))}
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="border border-line bg-canvas p-6 sm:p-10">
              <EnquiryForm intent="general" />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="newsletter" tone="deep" size="md" width="default" grain>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="eyebrow text-accent">Stay close</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 text-[clamp(1.75rem,4.5vw,3rem)] leading-tight">
              Follow the journey.
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-5 text-base leading-relaxed text-on-deep-muted">
              New music, teaching, resources and dates — including the Emiore release.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <NewsletterForm className="mx-auto mt-9 max-w-md" tone="deep" />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
