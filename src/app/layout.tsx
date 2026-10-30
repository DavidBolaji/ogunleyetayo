import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { getSettings, getTheme } from "@/lib/content";
import { themeCss, themeFontClassNames } from "@/lib/theme";
import "@/styles/globals.css";

/**
 * The document shell.
 *
 * Only what every route needs: the html and body elements, the
 * generated palette and the typefaces. The site's own chrome — header,
 * footer, structured data — belongs to the `(site)` group, because the
 * dashboard is not the site and must not inherit a fixed header that
 * would sit on top of it.
 */

/**
 * Metadata defaults come from the settings document, so the site's
 * name, description, social card and theme colour are editable without
 * a deploy.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    metadataBase: new URL(settings.site.url),
    title: {
      default: `${settings.site.name} — ${settings.site.tagline}`,
      // Stored with a `%s` placeholder, e.g. "%s — Ebahi Tayo-Ogunleye".
      template: settings.seo.titleTemplate.includes("%s")
        ? settings.seo.titleTemplate
        : `%s — ${settings.site.name}`,
    },
    description: settings.site.positioning,
    keywords: settings.seo.keywords,
    authors: [{ name: settings.site.name }],
    robots: { index: true, follow: true },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const settings = await getSettings();

  return {
    themeColor: settings.seo.themeColor,
    width: "device-width",
    initialScale: 1,
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const theme = await getTheme();

  return (
    <html
      lang="en"
      data-brand={theme.basePalette}
      data-palette={theme.activeMode}
      className={themeFontClassNames(theme)}
    >
      <head>
        {/*
          The palette layer is generated from the theme document rather
          than hardcoded in CSS. It is inlined because it is a few
          hundred bytes, it must not flash, and it changes whenever the
          theme is edited — all of which rule out a cached file.
        */}
        <style id="theme-tokens">{themeCss(theme)}</style>
        <noscript>
          {/* Scroll reveals never fire without JS — show the content instead. */}
          <style>{".reveal{opacity:1!important;transform:none!important}"}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
