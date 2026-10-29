import { cn } from "@/lib/cn";
import { marginTop } from "@/lib/blocks/scale";
import { Figure } from "@/components/ui/Figure";
import { ParallaxFigure } from "@/components/ui/ParallaxFigure";
import { Reveal } from "@/components/ui/Reveal";
import type { ColumnSpec, Media } from "@/content/types";

type MediaSpec = Extract<ColumnSpec, { kind: "media" }>;

const DEFAULT_SIZES = "(max-width: 1024px) 100vw, 45vw";

/** One frame, parallax or static, at the column's chosen shape. */
function Frame({
  spec,
  media,
  className,
  sizes,
}: {
  spec: MediaSpec;
  media: Media;
  className?: string;
  sizes?: string;
}) {
  // An editable aspect cannot be a Tailwind arbitrary class, so it is
  // applied inline and the ratio preset is bypassed.
  const style = spec.aspect ? { aspectRatio: spec.aspect.replace("/", " / ") } : undefined;

  if (spec.parallax) {
    return (
      <ParallaxFigure
        media={media}
        sizes={sizes ?? spec.sizes ?? DEFAULT_SIZES}
        priority={spec.priority}
        style={style}
        className={cn("w-full", spec.aspect ? undefined : "aspect-[4/5]", className)}
      />
    );
  }

  return (
    <Figure
      media={media}
      ratio={spec.aspect ? "auto" : spec.ratio}
      sizes={sizes ?? spec.sizes ?? DEFAULT_SIZES}
      priority={spec.priority}
      scrim={spec.scrim}
      caption={spec.caption}
      style={style}
      className={cn(spec.aspect && "w-full", className)}
    />
  );
}

/**
 * The image column.
 *
 * `offsetPair` is the overlapping two-frame treatment the homepage and
 * about page use — a large portrait with a smaller frame breaking its
 * bottom corner. It is one layout option rather than its own block, so
 * an editor can switch an existing section to it without rebuilding.
 */
export function MediaColumn({ spec }: { spec: MediaSpec }) {
  const [first, second] = spec.items;

  if (spec.layout === "offsetPair" && second) {
    return (
      <div className="relative">
        <Reveal from={spec.reveal}>
          <Frame spec={spec} media={first} sizes={spec.sizes ?? "(max-width: 1024px) 100vw, 40vw"} />
        </Reveal>

        <Reveal
          delay={0.15}
          className="absolute -bottom-10 -right-4 hidden w-40 sm:block lg:-right-10 lg:w-52"
        >
          <Figure
            media={second}
            ratio="portrait"
            sizes="220px"
            className="border-4 border-canvas"
          />
        </Reveal>
      </div>
    );
  }

  if (spec.layout === "stack" && spec.items.length > 1) {
    return (
      <div className="flex flex-col gap-4 sm:gap-6">
        {spec.items.map((media, index) => (
          <Reveal key={`${media.src}-${index}`} from={spec.reveal} delay={index * 0.08}>
            <Frame spec={spec} media={media} />
          </Reveal>
        ))}
      </div>
    );
  }

  return (
    <Reveal
      from={spec.reveal}
      className={cn(marginTop[spec.gapTop], spec.hideOnMobile && "hidden lg:block")}
    >
      <Frame spec={spec} media={first} />
    </Reveal>
  );
}
