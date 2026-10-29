import type { ColumnContext } from "./columns/ColumnRenderer";
import { HeroBlock } from "./types/HeroBlock";
import { PageHeroBlock } from "./types/PageHeroBlock";
import { MarqueeBlock } from "./types/MarqueeBlock";
import { SplitBlock } from "./types/SplitBlock";
import { StackBlock } from "./types/StackBlock";
import { FeaturedReleaseBlock } from "./types/FeaturedReleaseBlock";
import { EngageBannerBlock } from "./types/EngageBannerBlock";
import { RecognitionStripBlock } from "./types/RecognitionStripBlock";
import { ReleaseGridBlock } from "./types/ReleaseGridBlock";
import { PostGridBlock } from "./types/PostGridBlock";
import { EnquiryRoutesBlock } from "./types/EnquiryRoutesBlock";
import {
  BookShelfBlock,
  ExpressionIndexBlock,
  GalleryBlock,
  ProgrammeListBlock,
  TimelineBlock,
} from "./types/CollectionBlocks";
import type { Block, Settings } from "@/content/types";

/**
 * Dispatches a stored block to its renderer.
 *
 * This switch is the one place that knows the block catalogue. Adding
 * a block type means a schema member, a renderer and a case here —
 * pages, navigation, the dashboard and the database all pick it up
 * without changes, because they work in terms of `Block`, never in
 * terms of a particular block.
 */
export async function BlockRenderer({
  block,
  settings,
}: {
  block: Block;
  settings: Settings;
}) {
  // Hidden blocks stay in the document so an editor can bring them
  // back; they simply do not render.
  if (!block.visible) return null;

  const context: ColumnContext = {
    settings,
    tone: block.style.tone,
    onDeep: block.style.tone === "deep",
  };

  switch (block.type) {
    case "hero":
      return <HeroBlock block={block} />;
    case "pageHero":
      return <PageHeroBlock block={block} />;
    case "marquee":
      return <MarqueeBlock block={block} />;
    case "split":
      return <SplitBlock block={block} context={context} />;
    case "stack":
      return <StackBlock block={block} context={context} />;
    case "expressionIndex":
      return <ExpressionIndexBlock block={block} />;
    case "programmeList":
      return <ProgrammeListBlock block={block} />;
    case "bookShelf":
      return <BookShelfBlock block={block} />;
    case "releaseGrid":
      return <ReleaseGridBlock block={block} />;
    case "postGrid":
      return <PostGridBlock block={block} />;
    case "timeline":
      return <TimelineBlock block={block} />;
    case "gallery":
      return <GalleryBlock block={block} />;
    case "featuredRelease":
      return <FeaturedReleaseBlock block={block} />;
    case "recognitionStrip":
      return <RecognitionStripBlock block={block} />;
    case "engageBanner":
      return <EngageBannerBlock block={block} />;
    case "enquiryRoutes":
      return <EnquiryRoutesBlock block={block} />;
    default: {
      // Exhaustiveness: a block type without a case fails the build
      // rather than silently disappearing from a page in production.
      const never: never = block;
      return never;
    }
  }
}
