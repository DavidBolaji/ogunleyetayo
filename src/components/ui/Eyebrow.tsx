import { cn } from "@/lib/cn";

interface EyebrowProps {
  children: string;
  className?: string;
  /** Renders a short leading rule — used when the label sits above a heading. */
  rule?: boolean;
}

export function Eyebrow({ children, className, rule = true }: EyebrowProps) {
  return (
    <span className={cn("eyebrow inline-flex items-center gap-3 text-accent-ink", className)}>
      {rule ? <span aria-hidden className="h-px w-8 bg-current opacity-50" /> : null}
      {children}
    </span>
  );
}
