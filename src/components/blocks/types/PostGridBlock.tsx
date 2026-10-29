import Link from "next/link";
import { cn } from "@/lib/cn";
import { BlockShell } from "@/components/blocks/BlockShell";
import { BlockHeading } from "@/components/ui/SectionHeading";
import { Chips } from "@/components/blocks/columns/Chips";
import { Figure } from "@/components/ui/Figure";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { getItems, getTagValues } from "@/lib/content";
import { gridColumns } from "@/lib/blocks/scale";
import { formatPostDate } from "@/lib/dates";
import type { BlockOf } from "@/content/types";

/**
 * The blog index.
 *
 * Carries its own empty state because a writing space that has not
 * been written in yet is a normal condition, not an error — and the
 * page still has to say something useful while the first posts are
 * being drafted.
 */
export async function PostGridBlock({ block }: { block: BlockOf<"postGrid"> }) {
  const { data } = block;

  const all = await getItems(data.collection, "post");

  const posts = all
    .filter((post) => post.status === "published")
    .sort((a, b) => b.date.localeCompare(a.date));

  const visible = data.limit > 0 ? posts.slice(0, data.limit) : posts;

  if (visible.length === 0) {
    const categories = await getTagValues(data.emptyCategoriesCollection);

    return (
      <BlockShell style={block.style}>
        <BlockHeading heading={data.heading} onDeep={block.style.tone === "deep"} />

        <div className="max-w-2xl">
          {data.emptyHeadline ? (
            <Reveal>
              <p className="font-display text-d-lg leading-snug">
                <RichText>{data.emptyHeadline}</RichText>
              </p>
            </Reveal>
          ) : null}

          {categories.length > 0 ? (
            <Reveal delay={0.1}>
              <Chips items={categories} className="mt-12" />
            </Reveal>
          ) : null}

          {data.emptyNote || data.emptyNewsletter ? (
            <Reveal delay={0.18}>
              <div className="mt-12">
                {data.emptyNote ? (
                  <p className="text-base leading-relaxed text-ink/75">
                    <RichText>{data.emptyNote}</RichText>
                  </p>
                ) : null}
                {data.emptyNewsletter ? <NewsletterForm className="mt-7" /> : null}
              </div>
            </Reveal>
          ) : null}
        </div>
      </BlockShell>
    );
  }

  return (
    <BlockShell style={block.style}>
      <BlockHeading heading={data.heading} onDeep={block.style.tone === "deep"} />

      <ul className={cn("grid gap-x-8 gap-y-16", gridColumns[data.columns])}>
        {visible.map((post, index) => (
          <li key={post.id}>
            <Reveal delay={(index % data.columns) * 0.06}>
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
                  <h2 className="mt-3 text-d-sm leading-tight group-hover:text-accent-ink">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">
                    <RichText>{post.excerpt}</RichText>
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted">
                    {formatPostDate(post.date)} · {post.readingTime}
                  </p>
                </Link>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </BlockShell>
  );
}
