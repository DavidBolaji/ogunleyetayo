"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import type { NavItem, SocialLink } from "@/content/types";

/** Flattens grouped items so mobile navigation stays one level deep. */
const flatten = (items: readonly NavItem[]): readonly NavItem[] =>
  items.flatMap((item) =>
    item.children.length > 0 ? item.children.filter((child) => child.visible) : [item],
  );

interface MobileNavProps {
  items: readonly NavItem[];
  socials: readonly SocialLink[];
}

export function MobileNav({ items, socials }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = flatten(items);

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
          <span
            className={cn(
              "h-px w-full bg-ink transition-opacity duration-200",
              open && "opacity-0",
            )}
          />
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
            <nav
              aria-label="Mobile"
              className="flex h-full flex-col overflow-y-auto overscroll-contain px-gutter pb-12 pt-28"
            >
              <ul className="flex flex-col">
                {links.map((item, index) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.05 + index * 0.035,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="border-b border-white/10"
                  >
                    <Link
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noreferrer noopener" : undefined}
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

              {socials.length > 0 ? (
                <div className="mt-auto pt-10">
                  <p className="eyebrow text-on-deep-muted">Connect</p>
                  <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                    {socials.map((social) => (
                      <li key={social.id}>
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
              ) : null}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
