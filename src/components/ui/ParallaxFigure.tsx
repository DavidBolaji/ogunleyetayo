"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { resolveImageBlur, resolveImageUrl } from "@/lib/images";
import type { Media } from "@/content/types";

interface ParallaxFigureProps {
  media: Media;
  /** Travel distance in percent of the container height. */
  strength?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Inline styles on the frame — used for editable aspect ratios. */
  style?: CSSProperties;
}

/**
 * A photo that drifts slightly slower than the page. The image is
 * over-sized vertically so the drift never exposes an edge.
 */
export function ParallaxFigure({
  media,
  strength = 12,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  className,
  style,
}: ParallaxFigureProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);
  const blurDataURL = resolveImageBlur(media);

  return (
    <div ref={ref} style={style} className={cn("relative overflow-hidden bg-sand", className)}>
      <motion.div
        style={{ y }}
        className="absolute inset-x-0 -top-[15%] h-[130%]"
      >
        <Image
          src={resolveImageUrl(media)}
          alt={media.alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder={blurDataURL ? "blur" : "empty"}
          blurDataURL={blurDataURL}
          style={{ objectPosition: media.focus ?? "50% 35%" }}
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
