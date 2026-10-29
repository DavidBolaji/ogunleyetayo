import { getTagValues } from "@/lib/content";
import { marginTop } from "@/lib/blocks/scale";
import { ProseColumn } from "./ProseColumn";
import { MediaColumn } from "./MediaColumn";
import { PillarsColumn } from "./PillarsColumn";
import { StatsColumn } from "./StatsColumn";
import { YearsColumn } from "./YearsColumn";
import { IndexListColumn } from "./IndexListColumn";
import { ChipsColumn } from "./ChipsColumn";
import { EmbedsColumn } from "./EmbedsColumn";
import { GalleryColumn } from "./GalleryColumn";
import { GroupColumn } from "./GroupColumn";
import {
  ContactDetailsColumn,
  EnquiryFormColumn,
  NewsletterColumn,
} from "./FormColumns";
import type { BaseColumnSpec, ColumnSpec, Settings, Tone } from "@/content/types";

export interface ColumnContext {
  settings: Settings;
  tone: Tone;
  onDeep: boolean;
}

/**
 * Dispatches one column spec to its renderer.
 *
 * This is the whole extension point for the two layout blocks: a new
 * kind of column is a schema member plus one case here, and it
 * immediately works inside every `split` and `stack` on the site
 * without either of those blocks changing.
 */
/** Renders a non-group column. Passed into `GroupColumn` so the two
 *  can recurse one level without importing each other. */
const renderBaseColumn = async (spec: BaseColumnSpec, context: ColumnContext) => (
  <ColumnRenderer spec={spec} context={context} />
);

export async function ColumnRenderer({
  spec,
  context,
}: {
  spec: ColumnSpec;
  context: ColumnContext;
}) {
  const { onDeep, tone, settings } = context;

  switch (spec.kind) {
    case "prose":
      return <ProseColumn spec={spec} onDeep={onDeep} />;

    case "media":
      return <MediaColumn spec={spec} />;

    case "pillars":
      return <PillarsColumn spec={spec} tone={tone} onDeep={onDeep} />;

    case "stats":
      return <StatsColumn spec={spec} onDeep={onDeep} />;

    case "years":
      return <YearsColumn spec={spec} onDeep={onDeep} />;

    case "indexList":
      return <IndexListColumn spec={spec} onDeep={onDeep} />;

    case "chips":
      return <ChipsColumn spec={spec} onDeep={onDeep} />;

    case "embeds":
      return <EmbedsColumn spec={spec} />;

    case "gallery":
      return <GalleryColumn spec={spec} />;

    case "group":
      return <GroupColumn spec={spec} context={context} render={renderBaseColumn} />;

    case "newsletter":
      return <NewsletterColumn spec={spec} onDeep={onDeep} />;

    case "enquiryForm":
      return (
        <EnquiryFormColumn
          spec={spec}
          eventTypes={await getTagValues(spec.eventTypesCollection)}
        />
      );

    case "contactDetails":
      return <ContactDetailsColumn spec={spec} socials={settings.socials} onDeep={onDeep} />;

    case "spacer":
      return <div aria-hidden className={marginTop[spec.height]} />;

    default: {
      // Exhaustiveness: a new column kind that forgets a case here
      // fails the build rather than rendering nothing in production.
      const never: never = spec;
      return never;
    }
  }
}
