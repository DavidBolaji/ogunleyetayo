import Link from "next/link";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";

interface WordmarkProps {
  className?: string;
  /** Collapses to the short brand form in tight spaces. */
  compact?: boolean;
}

export function Wordmark({ className, compact = false }: WordmarkProps) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={cn("group inline-flex flex-col leading-none", className)}
    >
      <span className="font-display text-[1.05rem] tracking-tight sm:text-[1.2rem]">
        {compact ? site.shortName : site.name}
      </span>
      <span className="eyebrow mt-1 text-[0.5rem] opacity-55 transition-opacity group-hover:opacity-90">
        Faith · Creativity · Impact
      </span>
    </Link>
  );
}
