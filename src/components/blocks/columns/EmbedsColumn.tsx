import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { toEmbed } from "@/lib/embed";
import type { ColumnSpec } from "@/content/types";

type EmbedsSpec = Extract<ColumnSpec, { kind: "embeds" }>;

/**
 * Video and audio embeds, with a marked slot for the ones that are not
 * ready yet.
 *
 * The placeholder is deliberate: the music page is an archive in
 * progress, and an empty, labelled frame reads as "coming" rather than
 * as a broken player. Pasting a URL into the slot turns it into the
 * real embed with no other change.
 */
export function EmbedsColumn({ spec }: { spec: EmbedsSpec }) {
  if (spec.items.length === 0) return null;

  return (
    <div className={cn("grid gap-4", spec.columns === 2 && "sm:grid-cols-2")}>
      {spec.items.map((item, index) => {
        const embed = item.url ? toEmbed(item.url, item.label ?? "Embedded media") : undefined;

        return (
          <Reveal key={`${item.label ?? index}`} delay={index * 0.06}>
            {embed ? (
              <div className="relative aspect-video overflow-hidden bg-sand">
                <iframe
                  src={embed.src}
                  title={embed.title}
                  allow={embed.allow}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center border border-dashed border-line bg-surface/60 p-6 text-center">
                <div>
                  <p className="eyebrow text-muted">Embed slot</p>
                  {item.label ? <p className="mt-2 text-sm text-ink/70">{item.label}</p> : null}
                </div>
              </div>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}
