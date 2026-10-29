import type { z } from "zod";
import type {
  mediaLibrarySchema,
  navigationSchema,
  settingsSchema,
  themeSchema,
} from "@/content/schema";

/**
 * Fallbacks for a database that has not been seeded yet.
 *
 * They exist so a fresh checkout boots and the dashboard is reachable;
 * the real content arrives from `npm run db:seed`, which writes the
 * documents in `data/`.
 */

export const defaultSettings = (): z.input<typeof settingsSchema> => ({
  site: {
    name: "New Site",
    shortName: "New Site",
    descriptor: "",
    tagline: "",
    positioning: "",
    url: "https://example.com",
    email: "",
    phone: "",
    whatsapp: "",
    location: "",
    church: "",
    wordmarkTagline: "",
  },
  seo: {
    titleTemplate: "%s",
    keywords: [],
    ogImage: "",
    themeColor: "#2a1030",
    locale: "en_NG",
  },
  socials: [],
  footer: {
    eyebrow: "",
    title: "",
    body: "",
    navLabel: "Navigate",
    exploreLabel: "Explore",
    exploreCollection: "expressions",
    connectLabel: "Connect",
    rights: "All Rights Reserved.",
  },
  enquiry: {
    routesCollection: "enquiry-routes",
    successMessage: "Thank you — your message is in.",
  },
  blog: {
    postsCollection: "posts",
    postFooterNote: "",
    backLabel: "← All posts",
  },
});

export const defaultNavigation = (): z.input<typeof navigationSchema> => ({
  header: [],
  footer: [],
});

/** The site's own palette, so an unseeded install still renders legibly. */
export const defaultTheme = (): z.input<typeof themeSchema> => ({
  basePalette: "ebahi",
  activeMode: "unified",
  palettes: [
    {
      id: "ebahi",
      label: "Ebahi",
      tokens: {
        canvas: "#fbf7f3",
        surface: "#ffffff",
        sand: "#f1e7dc",
        deep: "#2a1030",
        deepSoft: "#43204c",
        ink: "#191217",
        muted: "#6f6169",
        line: "#e3d8cd",
        accent: "#c98f1e",
        accentSoft: "#f6e9cf",
        accentInk: "#7a5407",
        onDeep: "#f6ecdb",
        onDeepMuted: "#c3aec6",
        headingLight: "#43204c",
      },
    },
  ],
  modes: [{ id: "unified", label: "Unified", suppress: [] }],
  fonts: { display: "fraunces", sans: "manrope" },
  typography: {
    scale: 1,
    headingTracking: "-0.02em",
    headingWeight: 400,
    bodySize: "1rem",
  },
});

export const defaultMediaLibrary = (): z.input<typeof mediaLibrarySchema> => ({ items: [] });
