"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { imageBlur, imageUrl } from "@/lib/images";
import type { Media } from "@/content/types";

interface ParallaxFigureProps {
  media: Media;
  /** Travel distance in percent of the container height. */
  strength?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
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
}: ParallaxFigureProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);
  const blurDataURL = imageBlur(media.src);

  return (
    <div ref={ref} className={cn("relative overflow-hidden bg-sand", className)}>
      <motion.div
        style={{ y }}
        className="absolute inset-x-0 -top-[15%] h-[130%]"
      >
        <Image
          src={imageUrl(media.src)}
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
