import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Figure } from "@/components/ui/Figure";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { blogCategories, blogIntro, posts } from "@/content/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: blogIntro.opening,
};

const byNewest = [...posts].sort((a, b) => b.date.localeCompare(a.date));

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Read"
        title={blogIntro.heading}
        lede={blogIntro.opening}
        media={{ src: "writing", alt: "Ebahi writing in a journal at her desk", focus: "50% 25%" }}
      />

      <Section tone="canvas" size="lg" width="wide">
        {byNewest.length > 0 ? (
          <ul className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {byNewest.map((post, index) => (
              <li key={post.slug}>
                <Reveal delay={(index % 3) * 0.06}>
                  <article className="group h-full">
                    <Link href={`/blog/${post.slug}`} className="block">
                      {post.media ? (
                        <Figure
                          media={post.media}
                          ratio="wide"
                          sizes="(max-width: 640px) 100vw, 32vw"
                          imageClassName="transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-105"
                        />
                      ) : null}

                      <p className="eyebrow mt-5 text-accent-ink">{post.category}</p>
                      <h2 className="mt-3 text-[clamp(1.35rem,2.4vw,1.75rem)] leading-tight group-hover:text-accent-ink">
                        {post.title}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-ink/70">{post.excerpt}</p>
                      <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted">
                        {formatDate(post.date)} · {post.readingTime}
                      </p>
                    </Link>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        ) : (
          <div className="max-w-2xl">
            <Reveal>
              <p className="font-display text-[clamp(1.5rem,3.5vw,2.25rem)] leading-snug">
                {blogIntro.empty}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <ul className="mt-12 flex flex-wrap gap-2">
                {blogCategories.map((category) => (
                  <li
                    key={category}
                    className="rounded-full border border-line px-3.5 py-1.5 text-[0.72rem] uppercase tracking-[0.12em] text-muted"
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-12">
                <p className="text-base leading-relaxed text-ink/75">{blogIntro.note}</p>
                <NewsletterForm className="mt-7" />
              </div>
            </Reveal>
          </div>
        )}
      </Section>
    </>
  );
}
