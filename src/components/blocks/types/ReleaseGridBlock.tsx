import { cn } from "@/lib/cn";
import { ActionLink } from "@/components/ui/ActionLink";
import { BlockShell } from "@/components/blocks/BlockShell";
import { BlockHeading } from "@/components/ui/SectionHeading";
import { Figure } from "@/components/ui/Figure";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { getItems } from "@/lib/content";
import { gridColumns } from "@/lib/blocks/scale";
import type { BlockOf } from "@/content/types";

/** The music archive — releases, sessions and projects as square cards. */
export async function ReleaseGridBlock({ block }: { block: BlockOf<"releaseGrid"> }) {
  const releases = await getItems(block.data.collection, "release");
  if (releases.length === 0) return null;

  const onDeep = block.style.tone === "deep";

  return (
    <BlockShell style={block.style}>
      <BlockHeading heading={block.data.heading} onDeep={onDeep} />

      <ul className={cn("grid gap-x-8 gap-y-14", gridColumns[block.data.columns])}>
        {releases.map((release, index) => (
          <li key={release.id}>
            <Reveal delay={(index % block.data.columns) * 0.06}>
              <article className="group">
                {release.media ? (
                  <Figure
                    media={release.media}
                    ratio="square"
                    sizes="(max-width: 640px) 100vw, 24vw"
                    imageClassName="transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-105"
                  />
                ) : null}

                <p className={cn("eyebrow mt-5", onDeep ? "text-accent" : "text-accent-ink")}>
                  {release.kind}
                </p>
                <h3 className="mt-2 text-xl leading-tight">{release.title}</h3>

                {release.subtitle ? (
                  <p className={cn("mt-1 text-sm", onDeep ? "text-on-deep-muted" : "text-muted")}>
                    {release.subtitle}
                  </p>
                ) : null}

                <p
                  className={cn(
                    "mt-3 text-xs uppercase tracking-[0.14em]",
                    onDeep ? "text-on-deep-muted" : "text-muted",
                  )}
                >
                  {release.year}
                </p>

                {release.note ? (
                  <p
                    className={cn(
                      "mt-3 text-sm leading-relaxed",
                      onDeep ? "text-on-deep-muted" : "text-ink/70",
                    )}
                  >
                    <RichText>{release.note}</RichText>
                  </p>
                ) : null}

                {release.action ? (
                  <div className="mt-4">
                    <ActionLink {...release.action} variant={release.action.variant ?? "link"} />
                  </div>
                ) : null}
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </BlockShell>
  );
}
