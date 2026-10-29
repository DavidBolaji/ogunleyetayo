import Link from "next/link";
import { cn } from "@/lib/cn";

interface WordmarkProps {
  name: string;
  shortName: string;
  tagline: string;
  className?: string;
  /** Collapses to the short brand form in tight spaces. */
  compact?: boolean;
}

export function Wordmark({ name, shortName, tagline, className, compact = false }: WordmarkProps) {
  return (
    <Link
      href="/"
      aria-label={`${name} — home`}
      className={cn("group inline-flex flex-col leading-none", className)}
    >
      <span className="font-display text-[1.05rem] tracking-tight sm:text-[1.2rem]">
        {compact ? shortName : name}
      </span>
      {tagline ? (
        <span className="eyebrow mt-1 text-[0.5rem] opacity-55 transition-opacity group-hover:opacity-90">
          {tagline}
        </span>
      ) : null}
    </Link>
  );
}
