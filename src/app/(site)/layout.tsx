import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { StructuredData } from "@/components/StructuredData";
import { MotionProvider } from "@/components/MotionProvider";
import { getNavigation, getSettings } from "@/lib/content";

/**
 * The public site's chrome.
 *
 * Scoped to this route group rather than the document root so it ends
 * at the edge of the site. The header is fixed to the top of the
 * viewport, which meant that while it lived in the root layout it was
 * painted over the dashboard as well.
 */
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [settings, navigation] = await Promise.all([getSettings(), getNavigation()]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-deep focus:px-5 focus:py-3 focus:text-sm focus:text-on-deep"
      >
        Skip to content
      </a>
      <StructuredData />
      <MotionProvider>
        <SiteHeader navigation={navigation.header} settings={settings} />
        <main id="main">{children}</main>
        <SiteFooter />
      </MotionProvider>
    </>
  );
}
