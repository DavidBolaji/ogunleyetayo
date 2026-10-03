import { ActionLink } from "@/components/ui/ActionLink";
import { Figure } from "@/components/ui/Figure";
import { Reveal } from "@/components/ui/Reveal";
import type { Programme } from "@/content/types";

interface ProgrammeListProps {
  programmes: readonly Programme[];
}

/** Alternating editorial rows — one component serves teaching and ministry. */
export function ProgrammeList({ programmes }: ProgrammeListProps) {
  return (
    <div className="flex flex-col gap-16 sm:gap-24">
      {programmes.map((programme, index) => {
        const flipped = index % 2 === 1;

        return (
          <article
            key={programme.name}
            className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16"
          >
            {programme.media ? (
              <Reveal
                from={flipped ? "left" : "right"}
                className={flipped ? "lg:order-2" : undefined}
              >
                <Figure
                  media={programme.media}
                  ratio="wide"
                  sizes="(max-width: 1024px) 100vw, 35vw"
                />
              </Reveal>
            ) : null}

            <div className={flipped ? "lg:order-1" : undefined}>
              <Reveal>
                <p className="eyebrow text-accent-ink">{programme.promise}</p>
              </Reveal>

              <Reveal delay={0.06}>
                <h3 className="mt-4 text-[clamp(1.75rem,3.5vw,2.75rem)] uppercase leading-none">
                  {programme.name}
                </h3>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/75">
                  {programme.description}
                </p>
              </Reveal>

              <Reveal delay={0.14}>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {programme.detail.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-line px-3.5 py-1.5 text-[0.7rem] uppercase tracking-[0.12em] text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.18}>
                <div className="mt-8">
                  <ActionLink {...programme.action} variant="outline" />
                </div>
              </Reveal>
            </div>
          </article>
        );
      })}
    </div>
  );
}
