import { getCollections, getMediaLibrary, getPages, getTheme } from "@/lib/content";
import type { AdminReference } from "@/components/admin/AdminContext";

/**
 * The reference data every editor needs: the media library, the
 * collections a block can point at, the palettes, and the pages a
 * button can link to. Loaded once per screen and handed to the client
 * through context.
 */
export async function adminReference(): Promise<AdminReference> {
  const [library, collections, theme, pages] = await Promise.all([
    getMediaLibrary(),
    getCollections(),
    getTheme(),
    getPages(),
  ]);

  return {
    media: library.items,
    collections: collections.map(({ name, label, kind }) => ({ name, label, kind })),
    palettes: theme.palettes,
    pages: pages.map(({ id, slug, title }) => ({ id, slug, title })),
  };
}
