import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import type { Action } from "@/content/types";

const variants = {
  solid:
    "bg-deep text-on-deep hover:bg-deep-soft border border-transparent",
  outline:
    "border border-current text-ink hover:bg-ink hover:text-canvas",
  outlineLight:
    "border border-current text-on-deep hover:bg-on-deep hover:text-deep",
  accent:
    "bg-accent text-white hover:brightness-95 border border-transparent",
  ghost:
    "border border-transparent text-current hover:bg-black/5",
  link: "",
} as const;

const sizes = {
  sm: "px-4 py-2 text-[0.75rem]",
  md: "px-6 py-3 text-[0.8125rem]",
  lg: "px-8 py-4 text-sm",
} as const;

export type ActionVariant = keyof typeof variants;

interface ActionLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    Action {
  variant?: ActionVariant;
  size?: keyof typeof sizes;
}

/**
 * Every call to action on the site renders through here, so an `Action`
 * from the content layer can be dropped into any surface unchanged.
 */
export function ActionLink({
  label,
  href,
  external,
  variant = "solid",
  size = "md",
  className,
  ...rest
}: ActionLinkProps) {
  const isExternal = external ?? /^https?:\/\//.test(href);

  const classes =
    variant === "link"
      ? cn(
          "group inline-flex items-center gap-2 font-semibold uppercase tracking-[0.18em] text-[0.75rem] text-accent-ink",
          className,
        )
      : cn(
          "group inline-flex items-center justify-center gap-2.5 rounded-full font-semibold uppercase tracking-[0.16em] transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5",
          variants[variant],
          sizes[size],
          className,
        );

  const content = (
    <>
      <span>{label}</span>
      <span
        aria-hidden
        className="transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1"
      >
        →
      </span>
    </>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}
