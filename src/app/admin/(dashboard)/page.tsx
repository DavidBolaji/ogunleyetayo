import Link from "next/link";
import { getCollections, getMediaLibrary, getPages, getPosts, getTheme } from "@/lib/content";
import { authConfig } from "@/lib/auth";
import { DATA_ROOT, storeIsWritable, usingBlobStore } from "@/lib/db";

/** The dashboard's front door: where things stand, and where to go next. */
export default async function OverviewScreen() {
  const [pages, collections, library, posts, theme] = await Promise.all([
    getPages(),
    getCollections(),
    getMediaLibrary(),
    getPosts(),
    getTheme(),
  ]);

  const writable = await storeIsWritable();
  const config = authConfig();
  const drafts = pages.filter((page) => page.status === "draft");

  const tiles = [
    { label: "Pages", value: pages.length, href: "/admin/pages", note: `${drafts.length} draft` },
    {
      label: "Collections",
      value: collections.length,
      href: "/admin/collections",
      note: `${collections.reduce((total, entry) => total + entry.items.length, 0)} items`,
    },
    { label: "Posts", value: posts.length, href: "/admin/collections/posts", note: "published" },
    { label: "Images", value: library.items.length, href: "/admin/media", note: "in the library" },
  ];

  const mode = theme.modes.find((entry) => entry.id === theme.activeMode);

  return (
    <>
      <header className="mb-6">
        <h1 className="text-lg">Overview</h1>
        <p className="adm-help">Everything the site says is edited from here.</p>
      </header>

      {!writable ? (
        <p
          className="mb-5 rounded px-4 py-3 text-[0.8125rem]"
          style={{ background: "var(--a-danger-soft)", color: "var(--a-danger)" }}
        >
          <strong>The content store is not writable.</strong>{" "}
          {usingBlobStore ? (
            <>
              The Blob store could not be reached. Check that{" "}
              <code>BLOB_READ_WRITE_TOKEN</code> is set and still valid.
            </>
          ) : (
            <>
              Nothing can be saved until <code>{DATA_ROOT}</code> is writable by the server
              process. On a read-only or ephemeral filesystem, set{" "}
              <code>BLOB_READ_WRITE_TOKEN</code> or point <code>CMS_DATA_DIR</code> at a
              persistent volume.
            </>
          )}
        </p>
      ) : null}

      {config.problems.length > 0 ? (
        <ul className="mb-5 space-y-2">
          {config.problems.map((problem) => (
            <li
              key={problem}
              className="rounded px-4 py-3 text-[0.8125rem]"
              style={{ background: "var(--a-danger-soft)", color: "var(--a-danger)" }}
            >
              {problem}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link key={tile.label} href={tile.href} className="adm-panel p-4 transition-colors hover:border-[var(--a-accent)]">
            <p className="adm-label">{tile.label}</p>
            <p className="mt-2 text-3xl font-semibold">{tile.value}</p>
            <p className="adm-help">{tile.note}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="adm-panel p-4">
          <h2 className="text-sm">Recently edited</h2>
          <ul className="mt-3 space-y-2">
            {[...pages]
              .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""))
              .slice(0, 6)
              .map((page) => (
                <li key={page.id} className="flex items-center justify-between gap-3">
                  <Link href={`/admin/pages/${page.id}`} className="truncate text-[0.8125rem] hover:underline">
                    {page.title}
                  </Link>
                  <span className="adm-help !mt-0 shrink-0">
                    {page.updatedAt
                      ? new Date(page.updatedAt).toLocaleDateString("en-GB")
                      : "never"}
                  </span>
                </li>
              ))}
          </ul>
        </section>

        <section className="adm-panel p-4">
          <h2 className="text-sm">Appearance</h2>
          <p className="adm-help">
            Palette mode: <strong>{mode?.label ?? theme.activeMode}</strong>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {theme.palettes.map((palette) => (
              <span key={palette.id} className="adm-sunken flex items-center gap-2 px-3 py-1.5">
                <span
                  aria-hidden
                  className="h-4 w-4 rounded-full border"
                  style={{
                    background: palette.tokens.deep,
                    borderColor: palette.tokens.accent,
                  }}
                />
                <span className="text-xs">{palette.label.split("—")[0].trim()}</span>
              </span>
            ))}
          </div>
          <Link href="/admin/theme" className="adm-btn adm-btn-ghost mt-4">
            Edit palettes & type
          </Link>
        </section>
      </div>
    </>
  );
}
