"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const directions = {
  up: { x: 0, y: 24 },
  down: { x: 0, y: -24 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
  none: { x: 0, y: 0 },
} as const;

const elements = {
  div: motion.div,
  span: motion.span,
  li: motion.li,
} as const;

interface RevealProps {
  children: ReactNode;
  delay?: number;
  from?: keyof typeof directions;
  className?: string;
  /** Keeps the wrapper valid inside inline or list contexts. */
  as?: keyof typeof elements;
}

/**
 * Scroll-entry animation used across the site.
 *
 * Reduced motion is not handled here — `MotionProvider` covers it for
 * every animated element at once. See the note in that file.
 */
export function Reveal({ children, delay = 0, from = "up", className, as = "div" }: RevealProps) {
  const Component = elements[as];

  return (
    <Component
      className={cn("reveal", className)}
      initial={{ opacity: 0, ...directions[from] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -10% 0px" }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}
