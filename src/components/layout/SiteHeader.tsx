"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { navigation } from "@/content/site";
import type { NavItem } from "@/content/types";
import { Wordmark } from "./Wordmark";
import { MobileNav } from "./MobileNav";

const isActive = (pathname: string, item: NavItem): boolean => {
  if (item.href === "/") return pathname === "/";
  if (item.children) {
    return item.children.some((child) => pathname.startsWith(child.href));
  }
  return pathname.startsWith(item.href);
};

export function SiteHeader() {
  const pathname = usePathname();
  const [lifted, setLifted] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpenMenu(null), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[var(--ease-out-soft)]",
        lifted
          ? "border-b border-line/70 bg-canvas/85 py-3 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent py-5",
      )}
    >
      <div className="mx-auto flex w-full max-w-[92rem] items-center justify-between gap-6 px-gutter">
        <Wordmark />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navigation.map((item) => {
              const active = isActive(pathname, item);

              if (!item.children) {
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative rounded-full px-3.5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors",
                        active ? "text-accent-ink" : "text-ink/65 hover:text-ink",
                      )}
                    >
                      {item.label}
                      {active ? (
                        <span
                          aria-hidden
                          className="absolute inset-x-3.5 -bottom-0.5 h-px bg-accent"
                        />
                      ) : null}
                    </Link>
                  </li>
                );
              }

              const open = openMenu === item.label;

              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(item.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-haspopup="true"
                    onClick={() => setOpenMenu(open ? null : item.label)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors",
                      active || open ? "text-accent-ink" : "text-ink/65 hover:text-ink",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={cn("transition-transform duration-300", open && "rotate-180")}
                    >
                      ⌄
                    </span>
                  </button>

                  <div
                    className={cn(
                      "absolute right-0 top-full w-72 origin-top-right pt-3 transition-all duration-300 ease-[var(--ease-out-soft)]",
                      open
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-1 opacity-0",
                    )}
                  >
                    <ul className="overflow-hidden rounded-2xl border border-line bg-surface p-2 shadow-[0_24px_60px_-28px_rgba(42,16,48,0.45)]">
                      {item.children?.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-ink/80 transition-colors hover:bg-sand hover:text-ink"
                          >
                            {child.label}
                            <span aria-hidden className="text-accent opacity-0 transition-opacity [li:hover_&]:opacity-100">
                              →
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
