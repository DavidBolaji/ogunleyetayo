"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface MarqueeProps {
  items: readonly ReactNode[];
  /** Seconds for one full pass. Lower is faster. */
  duration?: number;
  reverse?: boolean;
  separator?: ReactNode;
  className?: string;
}

/**
 * Seamless horizontal ticker. The item list is rendered twice and the
 * track translated by exactly half its width, so the loop never jumps.
 */
export function Marquee({
  items,
  duration = 38,
  reverse = false,
  separator = "✦",
  className,
}: MarqueeProps) {
  const track = [...items, ...items];

  return (
    <div className={cn("marquee group relative flex overflow-hidden", className)}>
      <div
        className="marquee-track flex shrink-0 items-center gap-10 pr-10"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {track.map((item, index) => (
          <span key={index} className="flex shrink-0 items-center gap-10">
            {item}
            <span aria-hidden className="text-accent opacity-70">
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
