import { getCollections } from "@/lib/content";
import { CollectionIndex } from "@/components/admin/CollectionIndex";

export default async function CollectionsScreen() {
  const collections = await getCollections();

  return (
    <CollectionIndex
      collections={collections.map((collection) => ({
        name: collection.name,
        label: collection.label,
        kind: collection.kind,
        description: collection.description,
        system: collection.system,
        count: collection.items.length,
      }))}
    />
  );
}
