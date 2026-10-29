import { notFound } from "next/navigation";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { adminReference } from "@/lib/admin/reference";
import { db } from "@/lib/db";

export default async function CollectionScreen({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const [collection, reference] = await Promise.all([db.collections.get(name), adminReference()]);

  if (!collection) notFound();

  return <CollectionEditor collection={collection} reference={reference} />;
}
