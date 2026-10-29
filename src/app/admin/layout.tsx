import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Dashboard",
  // The dashboard is never for crawlers, and says so in three places:
  // here, in robots.txt, and in the middleware that guards it.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * The dashboard's outermost frame.
 *
 * Deliberately thin: the signed-in shell lives in the (dashboard)
 * route group so the login page can share the admin's styling without
 * inheriting its navigation — or its session guard.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div data-admin className="min-h-screen">
      {children}
    </div>
  );
}
