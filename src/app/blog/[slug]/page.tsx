import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Figure } from "@/components/ui/Figure";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { posts } from "@/content/posts";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();

  return (
    <>
      <section className="grain relative overflow-hidden bg-canvas pb-14 pt-32 text-ink sm:pt-40">
        <Container width="default" className="relative z-10">
          <Reveal>
            <p className="eyebrow text-accent-ink">{post.category}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.95]">{post.title}</h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-7 text-xs uppercase tracking-[0.14em] text-muted">
              {formatDate(post.date)} · {post.readingTime}
            </p>
          </Reveal>
        </Container>
      </section>

      {post.media ? (
        <Container width="default">
          <Reveal>
            <Figure media={post.media} ratio="cinema" sizes="(max-width: 1024px) 100vw, 70vw" priority />
          </Reveal>
        </Container>
      ) : null}

      <Section tone="canvas" size="md" width="default">
        <div className="space-y-6 text-lg leading-relaxed text-ink/80">
          {post.body.map((paragraph) =>
            paragraph.startsWith("## ") ? (
              <Reveal key={paragraph}>
                <h2 className="pt-6 text-[clamp(1.5rem,3vw,2.25rem)] leading-tight">
                  {paragraph.slice(3)}
                </h2>
              </Reveal>
            ) : (
              <Reveal key={paragraph}>
                <p>{paragraph}</p>
              </Reveal>
            ),
          )}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-16 border-t border-line pt-10">
            <p className="text-base leading-relaxed text-ink/75">
              If this was useful, the letter carries the next one straight to you.
            </p>
            <NewsletterForm className="mt-7" />
            <Link href="/blog" className="mt-10 inline-block text-sm text-accent-ink underline underline-offset-4">
              ← All posts
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
