import { Figure } from "@/components/ui/Figure";
import { Reveal } from "@/components/ui/Reveal";
import type { Media } from "@/content/types";

interface GalleryProps {
  items: readonly Media[];
}

/**
 * Masonry-ish portrait gallery. Every third frame is given extra height
 * so the grid never settles into a flat, uniform rhythm.
 */
export function Gallery({ items }: GalleryProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
      {items.map((item, index) => (
        <li key={item.src} className={index % 3 === 1 ? "lg:mt-12" : undefined}>
          <Reveal delay={(index % 3) * 0.06}>
            <Figure
              media={item}
              ratio={index % 4 === 0 ? "tall" : "portrait"}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 30vw"
              imageClassName="transition-transform duration-[900ms] ease-[var(--ease-out-soft)] hover:scale-[1.04]"
            />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
