import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { journalCategories, journalIntro } from "@/content/books";

export const metadata: Metadata = {
  title: "Journal",
  description: journalIntro.opening,
};

export default function JournalPage() {
  return (
    <>
      <PageHero eyebrow="Journal" title={journalIntro.heading} lede={journalIntro.opening} />

      <Section tone="canvas" size="lg" width="wide">
        <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {journalCategories.map((category, index) => (
            <li key={category} className="bg-canvas p-8">
              <Reveal delay={index * 0.04} from="none">
                <span className="font-display text-xs tabular-nums text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-3 font-display text-2xl leading-none">{category}</h2>
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-muted">Coming soon</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.2}>
          <div className="mt-16 max-w-xl">
            <p className="text-base leading-relaxed text-ink/75">{journalIntro.note}</p>
            <NewsletterForm className="mt-7" />
          </div>
        </Reveal>
      </Section>
    </>
  );
}
