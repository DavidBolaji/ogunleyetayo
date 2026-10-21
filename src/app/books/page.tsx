import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { BookShelf } from "@/components/sections/BookShelf";
import { EngageBanner } from "@/components/sections/EngageBanner";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ActionLink } from "@/components/ui/ActionLink";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { books, booksIntro } from "@/content/books";
import { blogCategories } from "@/content/posts";

export const metadata: Metadata = {
  title: "Books & Resources",
  description:
    "Dear Worship Leader, Prayed Up, Simple Praying Systems and Psalms of Ebahi — books and resources by Ebahi Tayo-Ogunleye.",
};

export default function BooksPage() {
  return (
    <>
      <PageHero
        eyebrow="Books & resources"
        title={booksIntro.heading}
        lede={booksIntro.opening}
        media={{
          src: "writing",
          alt: "Ebahi writing in a journal at her desk",
          focus: "50% 25%",
        }}
      />

      <Section id="resources" tone="canvas" size="lg" width="wide">
        <BookShelf books={books} />
      </Section>

      <Section tone="sand" size="md" width="wide" grain>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <SectionHeading
            eyebrow="Blog"
            title="Short reads, published as the work happens."
            lede="A writing space for faith, music ministry, leadership, creativity, purpose, life and enterprise."
          >
            <div className="mt-2">
              <ActionLink label="Read the blog" href="/blog" variant="link" />
            </div>
          </SectionHeading>

          <Reveal delay={0.1}>
            <ul className="flex flex-wrap gap-2">
              {blogCategories.map((category) => (
                <li
                  key={category}
                  className="rounded-full border border-line bg-surface px-4 py-2 text-[0.72rem] uppercase tracking-[0.14em] text-muted"
                >
                  {category}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section tone="deep" size="md" width="default" grain>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="eyebrow text-accent">Resources</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 text-[clamp(1.75rem,4.5vw,3rem)] leading-tight">
              Get new resources as they are released.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <NewsletterForm className="mx-auto mt-8 max-w-md" tone="deep" />
          </Reveal>
        </div>
      </Section>

      <EngageBanner
        eyebrow="Stocking or reviewing"
        title="Bulk orders, reviews and interview requests are welcome."
        actions={[
          { label: "Get in touch", href: "/contact" },
          { label: "Invite Ebahi", href: "/work-with-me" },
        ]}
      />
    </>
  );
}
