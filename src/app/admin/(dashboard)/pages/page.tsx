import Link from "next/link";
import { getPages } from "@/lib/content";
import { PageList } from "@/components/admin/PageList";

export default async function PagesScreen() {
  const pages = await getPages();

  return (
    <>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg">Pages</h1>
          <p className="adm-help">
            Every page on the site. Drag the arrows to change the order they appear in the
            dashboard; the site's own menu is edited under Navigation.
          </p>
        </div>

        <Link href="/admin/pages#new" className="adm-btn adm-btn-ghost">
          Jump to new page
        </Link>
      </header>

      <PageList pages={pages} />
    </>
  );
}
