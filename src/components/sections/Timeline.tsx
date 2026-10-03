import { Reveal } from "@/components/ui/Reveal";
import type { TimelineEntry } from "@/content/types";

interface TimelineProps {
  entries: readonly TimelineEntry[];
}

export function Timeline({ entries }: TimelineProps) {
  return (
    <ol className="relative border-l border-line pl-8 sm:pl-12">
      {entries.map((entry, index) => (
        <li key={entry.title} className="relative pb-12 last:pb-0">
          <Reveal delay={index * 0.04} from="right">
            <span
              aria-hidden
              className="absolute -left-[2.3rem] top-2 h-2 w-2 rounded-full bg-accent sm:-left-[3.3rem]"
            />
            <p className="eyebrow text-accent-ink">{entry.year}</p>
            <h3 className="mt-3 text-[clamp(1.35rem,2.6vw,2rem)] leading-tight">{entry.title}</h3>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-ink/70">{entry.body}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
