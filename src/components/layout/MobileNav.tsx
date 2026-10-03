"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { navigation, socials } from "@/content/site";
import type { NavItem } from "@/content/types";

/** Flattens the "More" group so mobile navigation stays one level deep. */
const flatten = (items: readonly NavItem[]): readonly NavItem[] =>
  items.flatMap((item) => (item.children ? item.children : [item]));

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const items = flatten(navigation);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="relative z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface/80 backdrop-blur"
      >
        <span className="sr-only">Menu</span>
        <span aria-hidden className="flex w-5 flex-col gap-[5px]">
          <span
            className={cn(
              "h-px w-full bg-ink transition-transform duration-300",
              open && "translate-y-[6px] rotate-45",
            )}
          />
          <span className={cn("h-px w-full bg-ink transition-opacity duration-200", open && "opacity-0")} />
          <span
            className={cn(
              "h-px w-full bg-ink transition-transform duration-300",
              open && "-translate-y-[6px] -rotate-45",
            )}
          />
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-deep text-on-deep"
          >
            <nav aria-label="Mobile" className="flex h-full flex-col overflow-y-auto px-gutter pb-12 pt-28">
              <ul className="flex flex-col">
                {items.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + index * 0.035, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-white/10"
                  >
                    <Link
                      href={item.href}
                      className="flex items-baseline justify-between py-4 font-display text-2xl tracking-tight"
                    >
                      {item.label}
                      <span aria-hidden className="text-xs text-on-deep-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto pt-10">
                <p className="eyebrow text-on-deep-muted">Connect</p>
                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                  {socials.map((social) => (
                    <li key={social.platform}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-sm underline underline-offset-4 decoration-white/30 hover:decoration-accent"
                      >
                        {social.platform}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
