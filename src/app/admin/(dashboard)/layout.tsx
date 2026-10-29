import Link from "next/link";
import type { ReactNode } from "react";
import { requireSession } from "@/lib/auth";
import { getSettings } from "@/lib/content";
import { signOutAction } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";

/**
 * Never cached.
 *
 * A dashboard that serves a prerendered page would show whoever opened
 * it whatever the build saw — stale content at best, and content from
 * before the session check at worst. Editing screens are always
 * rendered per request.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * The signed-in shell.
 *
 * `requireSession` runs here rather than only in the middleware: a
 * layout is the last common ancestor of every dashboard page, so one
 * guard covers all of them, and it keeps working if the matcher is
 * ever changed.
 */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const [session, settings] = await Promise.all([requireSession(), getSettings()]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[100rem] flex-col lg:flex-row">
      <aside
        className="shrink-0 border-b px-4 py-5 lg:w-60 lg:border-b-0 lg:border-r lg:py-8"
        style={{ borderColor: "var(--a-line)" }}
      >
        <div className="flex items-center justify-between gap-3 lg:block">
          <div>
            <p className="adm-label">{settings.site.shortName || settings.site.name}</p>
            <p className="mt-1 text-base font-semibold">Dashboard</p>
          </div>

          <Link href="/" target="_blank" className="adm-btn adm-btn-quiet lg:mt-3 lg:w-full">
            View site ↗
          </Link>
        </div>

        <AdminNav className="mt-6" />

        <form action={signOutAction} className="mt-8 border-t pt-4" style={{ borderColor: "var(--a-line)" }}>
          <p className="adm-help !mt-0 mb-2">Signed in as {session.username}</p>
          <button type="submit" className="adm-btn adm-btn-ghost w-full">
            Sign out
          </button>
        </form>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-10">{children}</main>
    </div>
  );
}
