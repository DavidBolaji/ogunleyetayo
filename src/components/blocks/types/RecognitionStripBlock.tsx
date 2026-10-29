import { BlockShell } from "@/components/blocks/BlockShell";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { getItems } from "@/lib/content";
import type { BlockOf } from "@/content/types";

/**
 * Awards and qualifications, noted briefly. Two collections rather than
 * one: recognitions change, credentials do not, and they are edited in
 * different places.
 */
export async function RecognitionStripBlock({ block }: { block: BlockOf<"recognitionStrip"> }) {
  const { data } = block;

  const [recognitions, credentials] = await Promise.all([
    getItems(data.collection, "recognition"),
    getItems(data.credentialsCollection, "credential"),
  ]);

  if (recognitions.length === 0 && credentials.length === 0) return null;

  return (
    <BlockShell style={block.style}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] lg:gap-20">
        <Reveal>
          <div>
            {data.heading?.eyebrow ? <Eyebrow>{data.heading.eyebrow}</Eyebrow> : null}
            {data.note ? (
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
                <RichText>{data.note}</RichText>
              </p>
            ) : null}
          </div>
        </Reveal>

        <div>
          <ul className="border-t border-line">
            {recognitions.map((item, index) => (
              <li key={item.id} className="border-b border-line">
                <Reveal delay={index * 0.05} from="none">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-5">
                    <p className="font-display text-xl tracking-tight sm:text-2xl">{item.title}</p>
                    <p className="text-sm text-muted">{item.source}</p>
                    <p className="text-xs tabular-nums text-accent-ink">{item.year}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          {credentials.length > 0 ? (
            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-wrap gap-x-12 gap-y-4">
                {credentials.map((credential) => (
                  <div key={credential.id} className="max-w-xs">
                    <p className="text-sm font-semibold">{credential.qualification}</p>
                    <p className="text-xs text-muted">{credential.institution}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          ) : null}
        </div>
      </div>
    </BlockShell>
  );
}
