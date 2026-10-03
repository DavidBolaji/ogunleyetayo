import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { StructuredData } from "@/components/StructuredData";
import { MotionProvider } from "@/components/MotionProvider";
import { site } from "@/content/site";
import "@/styles/globals.css";

const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK"],
});

const sans = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.positioning,
  keywords: [
    "Ebahi Tayo-Ogunleye",
    "music minister",
    "worship leader",
    "SilentShout",
    "Young Music Ministers Summit",
    "Edwoltz Hair City",
    "VisionCraft Academy",
    "Christian author",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.positioning,
    images: [{ url: "/images/portrait-open-hands.webp", width: 1600, height: 2000, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.positioning,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#2a1030",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-brand="ebahi" className={`${display.variable} ${sans.variable}`}>
      <head>
        <noscript>
          {/* Scroll reveals never fire without JS — show the content instead. */}
          <style>{".reveal{opacity:1!important;transform:none!important}"}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-deep focus:px-5 focus:py-3 focus:text-sm focus:text-on-deep"
        >
          Skip to content
        </a>
        <StructuredData />
        <MotionProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
