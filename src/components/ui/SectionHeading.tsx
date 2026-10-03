import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  size?: "md" | "lg";
  className?: string;
  children?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  size = "md",
  className,
  children,
}: SectionHeadingProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      ) : null}

      <Reveal delay={0.06}>
        <h2
          className={cn(
            "leading-[1.05]",
            size === "lg"
              ? "text-[clamp(2.25rem,6vw,4.5rem)]"
              : "text-[clamp(1.875rem,4.2vw,3.25rem)]",
          )}
        >
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
