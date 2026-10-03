"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Reduced motion is handled here, once, for the whole site.
 *
 * `reducedMotion="user"` lets Motion drop transform animations while
 * still resolving every element to its final state. Branching on
 * `useReducedMotion()` inside components cannot do this safely: the
 * server renders the animated markup (opacity 0) and a reduced-motion
 * client would hydrate into a tree that never animates it back, leaving
 * whole sections invisible.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
