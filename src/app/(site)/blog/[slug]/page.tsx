import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Figure } from "@/components/ui/Figure";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { ArticleStructuredData } from "@/components/StructuredData";
import { getPost, getPosts, getSettings } from "@/lib/content";
import { formatPostDate } from "@/lib/dates";
import { postMetadata } from "@/lib/seo";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * A blog post.
 *
 * Posts are items in a collection rather than page documents: they
 * share one template, so giving each its own block list would be
 * busywork for the writer. Publishing is a collection edit.
 */
export async function generateStaticParams() {
  return (await getPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPost(slug), getSettings()]);
  if (!post) return {};

  return postMetadata(post, settings);
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPost(slug), getSettings()]);

  if (!post) notFound();

  return (
    <>
      <ArticleStructuredData post={post} />

      <section className="grain relative overflow-hidden bg-canvas pb-14 pt-32 text-ink sm:pt-40">
        <Container width="default" className="relative z-10">
          <Reveal>
            <p className="eyebrow text-accent-ink">{post.category}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 text-d-2xl leading-[0.95]">{post.title}</h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-7 text-xs uppercase tracking-[0.14em] text-muted">
              {formatPostDate(post.date)} · {post.readingTime}
            </p>
          </Reveal>
        </Container>
      </section>

      {post.media ? (
        <Container width="default">
          <Reveal>
            <Figure
              media={post.media}
              ratio="cinema"
              sizes="(max-width: 1024px) 100vw, 70vw"
              priority
            />
          </Reveal>
        </Container>
      ) : null}

      <section className="relative isolate bg-canvas py-20 text-ink sm:py-28">
        <Container width="default">
          <div className="space-y-6 text-lg leading-relaxed text-ink/80">
            {post.body.map((paragraph, index) =>
              paragraph.startsWith("## ") ? (
                <Reveal key={index}>
                  <h2 className="pt-6 text-d-lg leading-tight">{paragraph.slice(3)}</h2>
                </Reveal>
              ) : (
                <Reveal key={index}>
                  <p>
                    <RichText>{paragraph}</RichText>
                  </p>
                </Reveal>
              ),
            )}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-16 border-t border-line pt-10">
              <p className="text-base leading-relaxed text-ink/75">
                {settings.blog.postFooterNote}
              </p>
              <NewsletterForm className="mt-7" />
              <Link
                href="/blog"
                className="mt-10 inline-block text-sm text-accent-ink underline underline-offset-4"
              >
                {settings.blog.backLabel}
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
