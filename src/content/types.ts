/**
 * Shared content contracts.
 *
 * Presentation components depend on these types, never on the database
 * or the dashboard. Every type here is inferred from the matching
 * validator in [schema.ts](./schema.ts), so a field is described once
 * and the validator, the type and the dashboard form stay in step.
 */
export type {
  Action,
  ActionVariant,
  Align,
  Block,
  BlockData,
  BlockOf,
  BlockStyle,
  BlockType,
  BaseColumnSpec,
  Book,
  Collection,
  CollectionItemOf,
  CollectionKind,
  ColumnKind,
  ColumnSpec,
  Credential,
  EnquiryRoute,
  Expression,
  Media,
  MediaItem,
  MediaLibrary,
  NavItem,
  Navigation,
  Page,
  PaletteMode,
  PalettePreset,
  Post,
  Programme,
  Ratio,
  Recognition,
  Release,
  SectionHeadingData,
  Seo,
  Settings,
  SocialLink,
  Space,
  Tag,
  TextSize,
  Theme,
  TimelineEntry,
  TypeStyle,
  Tone,
  Width,
} from "./schema";

/**
 * A palette key. Open rather than a fixed union: palettes live in the
 * database, so adding one is a dashboard action, not a code change.
 * No component knows which palettes exist.
 */
export type BrandKey = string;
