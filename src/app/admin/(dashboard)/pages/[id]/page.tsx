import { notFound } from "next/navigation";
import { PageEditor } from "@/components/admin/PageEditor";
import { adminReference } from "@/lib/admin/reference";
import { db } from "@/lib/db";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [page, reference] = await Promise.all([db.pages.get(id), adminReference()]);

  if (!page) notFound();

  return <PageEditor page={page} reference={reference} />;
}
