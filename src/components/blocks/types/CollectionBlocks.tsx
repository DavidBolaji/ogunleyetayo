import { BlockShell } from "@/components/blocks/BlockShell";
import { BlockHeading } from "@/components/ui/SectionHeading";
import { ExpressionIndex } from "@/components/sections/ExpressionIndex";
import { ProgrammeList } from "@/components/sections/ProgrammeList";
import { BookShelf } from "@/components/sections/BookShelf";
import { Timeline } from "@/components/sections/Timeline";
import { GalleryColumn } from "@/components/blocks/columns/GalleryColumn";
import { getItems, getSettings } from "@/lib/content";
import type { BlockOf } from "@/content/types";

/**
 * Blocks that render a collection.
 *
 * Each is deliberately thin: it resolves the collection its data
 * points at, renders the shared heading, and hands the items to the
 * presentational component that already knows how to draw them. The
 * block owns the section; the component owns the list. Pointing a
 * block at a different collection is a dashboard change, and an empty
 * collection renders nothing rather than an empty frame.
 */

export async function ExpressionIndexBlock({ block }: { block: BlockOf<"expressionIndex"> }) {
  const expressions = await getItems(block.data.collection, "expression");
  if (expressions.length === 0) return null;

  return (
    <BlockShell style={block.style}>
      <BlockHeading heading={block.data.heading} onDeep={block.style.tone === "deep"} />
      <ExpressionIndex expressions={expressions} />
    </BlockShell>
  );
}

export async function ProgrammeListBlock({ block }: { block: BlockOf<"programmeList"> }) {
  const programmes = await getItems(block.data.collection, "programme");
  if (programmes.length === 0) return null;

  return (
    <BlockShell style={block.style}>
      <BlockHeading heading={block.data.heading} onDeep={block.style.tone === "deep"} />
      <ProgrammeList programmes={programmes} />
    </BlockShell>
  );
}

export async function BookShelfBlock({ block }: { block: BlockOf<"bookShelf"> }) {
  const [books, settings] = await Promise.all([
    getItems(block.data.collection, "book"),
    getSettings(),
  ]);

  if (books.length === 0) return null;

  return (
    <BlockShell style={block.style}>
      <BlockHeading heading={block.data.heading} onDeep={block.style.tone === "deep"} />
      <BookShelf books={books} author={settings.site.name} />
    </BlockShell>
  );
}

export async function TimelineBlock({ block }: { block: BlockOf<"timeline"> }) {
  const entries = await getItems(block.data.collection, "timeline");
  if (entries.length === 0) return null;

  return (
    <BlockShell style={block.style}>
      <BlockHeading heading={block.data.heading} onDeep={block.style.tone === "deep"} />
      <Timeline entries={entries} />
    </BlockShell>
  );
}

export function GalleryBlock({ block }: { block: BlockOf<"gallery"> }) {
  if (block.data.items.length === 0) return null;

  return (
    <BlockShell style={block.style}>
      <BlockHeading heading={block.data.heading} onDeep={block.style.tone === "deep"} />
      <GalleryColumn spec={{ kind: "gallery", items: block.data.items, ratio: block.data.ratio }} />
    </BlockShell>
  );
}
