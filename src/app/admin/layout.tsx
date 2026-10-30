import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
  // The dashboard is never for crawlers, and says so in three places:
  // here, in robots.txt, and in the middleware that guards it.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * The dashboard's outermost frame.
 *
 * Deliberately thin: it sets the admin token scope and nothing else.
 * The signed-in shell lives in the (dashboard) route group so the
 * login page can share the styling without inheriting the navigation
 * — or the session guard. The public site's header and footer belong
 * to the (site) group and never reach here.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div data-admin className="min-h-screen">
      {children}
    </div>
  );
}
