import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { resolveBlockStyle } from "@/lib/blocks/style";
import type { BlockStyle } from "@/content/types";

interface BlockShellProps {
  style: BlockStyle;
  children: ReactNode;
  /** Wraps children in the gutter container. Off for full-bleed bands. */
  container?: boolean;
  /**
   * Off for blocks that lay out their own section — the heroes and the
   * featured release have bespoke padding and backgrounds. They still
   * come through here so the palette, anchor and colour overrides are
   * plumbed in exactly one place.
   */
  chrome?: boolean;
  className?: string;
  containerClassName?: string;
}

/**
 * The section every block renders inside.
 *
 * Vertical rhythm, background, width, palette and per-block colour
 * overrides are resolved here and nowhere else, which is what lets a
 * new block type arrive without touching layout — and what lets an
 * editor restyle any block without a code change.
 */
export function BlockShell({
  style,
  children,
  container = true,
  chrome = true,
  className,
  containerClassName,
}: BlockShellProps) {
  const resolved = resolveBlockStyle(style);

  return (
    <section
      id={resolved.id}
      data-brand={resolved.palette}
      style={resolved.style}
      className={cn(
        chrome ? resolved.className : cn("relative isolate", resolved.decoration),
        className,
      )}
    >
      {container ? (
        <div className={cn(resolved.containerClassName, "relative z-10", containerClassName)}>
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
}
