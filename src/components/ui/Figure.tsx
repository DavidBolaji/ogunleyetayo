import Image from "next/image";
import { cn } from "@/lib/cn";
import { imageBlur, imageUrl } from "@/lib/images";
import type { Media } from "@/content/types";

const ratios = {
  portrait: "aspect-[3/4]",
  tall: "aspect-[4/6]",
  square: "aspect-square",
  wide: "aspect-[4/3]",
  cinema: "aspect-[16/10]",
  auto: "",
} as const;

interface FigureProps {
  media: Media;
  ratio?: keyof typeof ratios;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  /** Warm overlay used when type sits on top of the photo. */
  scrim?: "none" | "soft" | "strong";
  caption?: string;
}

const scrims = {
  none: "",
  soft: "after:absolute after:inset-0 after:content-[''] after:bg-gradient-to-t after:from-black/45 after:via-black/5 after:to-transparent",
  strong:
    "after:absolute after:inset-0 after:content-[''] after:bg-gradient-to-t after:from-black/75 after:via-black/30 after:to-black/10",
} as const;

/** The single image surface — every photo on the site renders through it. */
export function Figure({
  media,
  ratio = "portrait",
  sizes = "(max-width: 768px) 100vw, 45vw",
  priority = false,
  className,
  imageClassName,
  scrim = "none",
  caption,
}: FigureProps) {
  const blurDataURL = imageBlur(media.src);

  return (
    <figure className={cn("relative overflow-hidden bg-sand", ratios[ratio], scrims[scrim], className)}>
      <Image
        src={imageUrl(media.src)}
        alt={media.alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={blurDataURL ? "blur" : "empty"}
        blurDataURL={blurDataURL}
        style={{ objectPosition: media.focus ?? "50% 35%" }}
        className={cn("object-cover", imageClassName)}
      />
      {caption ? (
        <figcaption className="absolute bottom-0 left-0 z-10 p-5 text-xs uppercase tracking-[0.2em] text-white/90">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
