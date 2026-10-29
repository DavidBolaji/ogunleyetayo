import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { displaySize, marginBottom, textAlign } from "@/lib/blocks/scale";
import { RichLines, RichText } from "./RichText";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";
import type { SectionHeadingData } from "@/content/types";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center" | "right";
  size?: "md" | "lg";
  className?: string;
  children?: ReactNode;
  onDeep?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  size = "md",
  className,
  children,
  onDeep = false,
}: SectionHeadingProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        align === "right" && "items-end text-right",
        className,
      )}
    >
      {eyebrow ? (
        <Reveal>
          <Eyebrow className={onDeep ? "text-accent" : undefined}>{eyebrow}</Eyebrow>
        </Reveal>
      ) : null}

      <Reveal delay={0.06}>
        <h2 className={cn("leading-[1.05]", size === "lg" ? displaySize["2xl"] : displaySize.xl)}>
          {title}
        </h2>
      </Reveal>

      {lede ? (
        <Reveal delay={0.12}>
          <div
            className={cn(
              "max-w-2xl text-base leading-relaxed opacity-80 sm:text-lg",
              align === "center" && "mx-auto",
            )}
          >
            {lede}
          </div>
        </Reveal>
      ) : null}

      {children ? <Reveal delay={0.18}>{children}</Reveal> : null}
    </header>
  );
}

/**
 * The database-driven form of the same heading. Every collection block
 * opens with one, so the heading is described once in the schema and
 * rendered once here rather than re-implemented per block.
 */
export function BlockHeading({
  heading,
  onDeep = false,
}: {
  heading: SectionHeadingData | undefined;
  onDeep?: boolean;
}) {
  if (!heading || (!heading.eyebrow && !heading.title && !heading.lede)) return null;

  return (
    <SectionHeading
      eyebrow={heading.eyebrow}
      title={<RichLines>{heading.title}</RichLines>}
      lede={heading.lede ? <RichText>{heading.lede}</RichText> : undefined}
      align={heading.align}
      size={heading.size}
      onDeep={onDeep}
      className={cn(marginBottom[heading.gap], textAlign[heading.align])}
    />
  );
}
