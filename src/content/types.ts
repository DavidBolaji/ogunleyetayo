/**
 * Shared content contracts.
 *
 * Presentation components depend on these interfaces, never on the
 * concrete content modules. Adding a new project, book or programme is
 * a data change, not a component change.
 */

/** The three sub-brands the site acts as an umbrella for. */
export type BrandKey = "ebahi" | "silentshout" | "edwoltz";

export interface Media {
  /** Basename of a file in /public/images, without extension. */
  readonly src: string;
  readonly alt: string;
  /** CSS object-position, for art-directing tight crops. */
  readonly focus?: string;
}

export interface Action {
  readonly label: string;
  readonly href: string;
  /** Marks links that leave the personal-brand site. */
  readonly external?: boolean;
}

/** Anything that can be rendered in a card, index row or feature block. */
export interface Expression {
  readonly id: string;
  readonly index: string;
  readonly title: string;
  readonly tagline: string;
  readonly summary: string;
  readonly includes: readonly string[];
  readonly action: Action;
  readonly media: Media;
  readonly brand: BrandKey;
}

export interface Book {
  readonly slug: string;
  readonly title: string;
  readonly kind: string;
  readonly description: string;
  readonly themes: readonly string[];
  readonly action?: Action;
  readonly accentIndex: number;
}

export interface Release {
  readonly title: string;
  readonly subtitle?: string;
  readonly kind: "single" | "live" | "album" | "video" | "project";
  readonly year: string;
  readonly note?: string;
  readonly media?: Media;
}

export interface Programme {
  readonly name: string;
  readonly promise: string;
  readonly description: string;
  readonly detail: readonly string[];
  readonly action: Action;
  readonly media?: Media;
}

export interface TimelineEntry {
  readonly year: string;
  readonly title: string;
  readonly body: string;
}

export interface Recognition {
  readonly title: string;
  readonly source: string;
  readonly year: string;
}

export interface Credential {
  readonly qualification: string;
  readonly institution: string;
}

export interface EnquiryRoute {
  readonly label: string;
  readonly description: string;
  readonly email: string;
  readonly brand: BrandKey;
}

export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly children?: readonly NavItem[];
}

export interface SocialLink {
  readonly platform: "Instagram" | "YouTube" | "TikTok";
  readonly handle: string;
  readonly href: string;
}
