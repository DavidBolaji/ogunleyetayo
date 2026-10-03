import { Marquee } from "@/components/ui/Marquee";
import { site } from "@/content/site";

/**
 * The single thread running under every expression of the work,
 * set as a continuous band between sections.
 */
export function ThreadBand() {
  const items = site.thread.map((word) => (
    <span
      key={word}
      className="font-display text-[clamp(1.75rem,4.5vw,3.25rem)] uppercase tracking-[-0.01em]"
    >
      {word}
    </span>
  ));

  return (
    <div className="grain relative border-y border-line bg-sand py-8">
      <Marquee items={items} duration={32} separator="→" className="text-ink/85" />
    </div>
  );
}
