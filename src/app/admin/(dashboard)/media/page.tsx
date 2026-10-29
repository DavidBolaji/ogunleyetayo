import { getMediaLibrary } from "@/lib/content";
import { MediaManager } from "@/components/admin/MediaManager";

export default async function MediaScreen() {
  const library = await getMediaLibrary();

  return <MediaManager library={library} />;
}
