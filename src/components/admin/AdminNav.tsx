"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const sections = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/navigation", label: "Navigation" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/theme", label: "Theme & palettes" },
  { href: "/admin/settings", label: "Settings" },
] as const;

export function AdminNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={className} aria-label="Dashboard">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {sections.map((section) => {
          const active =
            "exact" in section && section.exact
              ? pathname === section.href
              : pathname.startsWith(section.href);

          return (
            <li key={section.href} className="shrink-0">
              <Link
                href={section.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block rounded-[var(--a-radius)] px-3 py-2 text-[0.8125rem] font-semibold transition-colors",
                  active ? "text-white" : "hover:bg-[var(--a-sunken)]",
                )}
                style={active ? { background: "var(--a-accent)" } : undefined}
              >
                {section.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
