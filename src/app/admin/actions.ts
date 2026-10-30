"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  collectionSchema,
  collectionItemSchemaFor,
  mediaLibrarySchema,
  navigationSchema,
  pageSchema,
  parseCollection,
  settingsSchema,
  themeSchema,
  type CollectionKind,
} from "@/content/schema";
import { db } from "@/lib/db";
import { assertSession, signIn, signOut } from "@/lib/auth";
import { deleteMedia, storeUpload } from "@/lib/media/store";

/**
 * Every write in the dashboard.
 *
 * Three things happen in the same order for all of them: the session
 * is asserted, the payload is parsed against the real schema, and the
 * affected routes are revalidated. Authorisation lives here rather
 * than only in the middleware because a server action is a callable
 * endpoint, not a page view — the middleware makes the redirect
 * pleasant, this makes it safe.
 *
 * Payloads arrive as JSON strings from the editors, which hold the
 * document in state. That keeps nested arrays and ordering intact —
 * something a flat form body cannot express without re-encoding every
 * path by hand.
 */

export interface ActionResult {
  readonly ok: boolean;
  readonly message: string;
}

const ok = (message: string): ActionResult => ({ ok: true, message });
const fail = (message: string): ActionResult => ({ ok: false, message });

/** Turns a validation failure into something an editor can act on. */
function describe(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues
      .slice(0, 4)
      .map((issue) => `${issue.path.join(" › ") || "value"}: ${issue.message}`)
      .join("; ");
  }

  return error instanceof Error ? error.message : "Something went wrong.";
}

const parseJson = (payload: string): unknown => {
  try {
    return JSON.parse(payload) as unknown;
  } catch {
    throw new Error("The editor sent malformed data. Reload and try again.");
  }
};

/**
 * Refreshes the public site after a change.
 *
 * Pages are statically rendered, so an edit has to invalidate them
 * explicitly. The layout is revalidated too because navigation, the
 * footer, the palette and the type scale all live there.
 */
function refreshSite(path?: string): void {
  revalidatePath("/", "layout");
  if (path) revalidatePath(path);
}

/* ------------------------------------------------------------------ *
 * Session
 * ------------------------------------------------------------------ */

export async function signInAction(
  _previous: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const result = await signIn(username, password);
  if (!result.ok) return fail(result.message ?? "Sign-in failed.");

  // Only ever follow an internal path, so a crafted ?next= cannot
  // bounce someone off the site after authenticating.
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOutAction(): Promise<void> {
  await signOut();
  redirect("/admin/login");
}

/* ------------------------------------------------------------------ *
 * Pages
 * ------------------------------------------------------------------ */

export async function savePageAction(payload: string): Promise<ActionResult> {
  try {
    await assertSession();

    const page = pageSchema.parse(parseJson(payload));
    await db.pages.save(page);

    refreshSite(page.slug ? `/${page.slug}` : "/");

    return ok(`Saved “${page.title}”.`);
  } catch (error) {
    return fail(describe(error));
  }
}

export async function createPageAction(
  _previous: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await assertSession();

    const title = String(formData.get("title") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim().replace(/^\/+|\/+$/g, "");

    if (!title) return fail("Give the page a name.");

    const id = slug === "" ? "home" : slug.replace(/\//g, "-");

    if (await db.pages.get(id)) return fail(`A page with the address “/${slug}” already exists.`);

    const existing = await db.pages.list();

    await db.pages.save({
      id,
      slug,
      title,
      status: "draft",
      order: existing.length,
      seo: { keywords: [], noIndex: false },
      blocks: [],
      inSitemap: true,
      system: false,
    });

    refreshSite();
  } catch (error) {
    return fail(describe(error));
  }

  redirect("/admin/pages");
}

/**
 * Parks the page an editor is holding so the preview frame can render
 * it.
 *
 * Deliberately does not revalidate: this is unsaved work, and nothing
 * public should be rebuilt because somebody is typing.
 */
export async function savePreviewAction(payload: string): Promise<ActionResult> {
  try {
    await assertSession();

    const page = pageSchema.parse(parseJson(payload));
    await db.previews.save(page);

    return ok("Preview updated.");
  } catch (error) {
    return fail(describe(error));
  }
}

export async function deletePageAction(id: string): Promise<ActionResult> {
  try {
    await assertSession();

    const page = await db.pages.get(id);
    if (!page) return fail("That page no longer exists.");
    if (page.system) return fail(`“${page.title}” is a system page and cannot be deleted.`);

    await db.pages.remove(id);
    await db.previews.remove(id);
    refreshSite();

    return ok(`Deleted “${page.title}”.`);
  } catch (error) {
    return fail(describe(error));
  }
}

export async function reorderPagesAction(ids: string[]): Promise<ActionResult> {
  try {
    await assertSession();
    await db.pages.reorder(ids);
    refreshSite();

    return ok("Order saved.");
  } catch (error) {
    return fail(describe(error));
  }
}

/* ------------------------------------------------------------------ *
 * Navigation, settings, theme
 * ------------------------------------------------------------------ */

export async function saveNavigationAction(payload: string): Promise<ActionResult> {
  try {
    await assertSession();

    await db.navigation.write(navigationSchema.parse(parseJson(payload)));
    refreshSite();

    return ok("Navigation saved.");
  } catch (error) {
    return fail(describe(error));
  }
}

export async function saveSettingsAction(payload: string): Promise<ActionResult> {
  try {
    await assertSession();

    await db.settings.write(settingsSchema.parse(parseJson(payload)));
    refreshSite();

    return ok("Settings saved.");
  } catch (error) {
    return fail(describe(error));
  }
}

export async function saveThemeAction(payload: string): Promise<ActionResult> {
  try {
    await assertSession();

    await db.theme.write(themeSchema.parse(parseJson(payload)));
    refreshSite();

    return ok("Theme saved.");
  } catch (error) {
    return fail(describe(error));
  }
}

/* ------------------------------------------------------------------ *
 * Collections
 * ------------------------------------------------------------------ */

export async function saveCollectionAction(payload: string): Promise<ActionResult> {
  try {
    await assertSession();

    const collection = parseCollection(parseJson(payload));
    await db.collections.save(collection);
    refreshSite();

    return ok(`Saved “${collection.label}”.`);
  } catch (error) {
    return fail(describe(error));
  }
}

export async function createCollectionAction(
  _previous: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  let name: string;

  try {
    await assertSession();

    const label = String(formData.get("label") ?? "").trim();
    const kind = String(formData.get("kind") ?? "") as CollectionKind;

    if (!label) return fail("Give the collection a name.");
    if (!collectionItemSchemaFor(kind)) return fail("Choose what the collection holds.");

    name =
      label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60) || "collection";

    if (await db.collections.get(name)) return fail(`“${label}” already exists.`);

    await db.collections.save(
      collectionSchema.parse({ name, label, kind, system: false, items: [] }),
    );

    refreshSite();
  } catch (error) {
    return fail(describe(error));
  }

  redirect(`/admin/collections/${name}`);
}

export async function deleteCollectionAction(name: string): Promise<ActionResult> {
  try {
    await assertSession();

    const collection = await db.collections.get(name);
    if (!collection) return fail("That collection no longer exists.");
    if (collection.system) {
      return fail(`“${collection.label}” is in use across the site and cannot be deleted.`);
    }

    await db.collections.remove(name);
    refreshSite();

    return ok(`Deleted “${collection.label}”.`);
  } catch (error) {
    return fail(describe(error));
  }
}

/* ------------------------------------------------------------------ *
 * Media
 * ------------------------------------------------------------------ */

export async function uploadMediaAction(
  _previous: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await assertSession();

    const files = formData.getAll("files").filter((entry): entry is File => entry instanceof File);
    if (files.length === 0) return fail("Choose at least one image.");

    const added: string[] = [];

    for (const file of files) {
      if (file.size === 0) continue;
      added.push((await storeUpload(file, String(formData.get("alt") ?? ""))).title);
    }

    if (added.length === 0) return fail("Those files could not be read.");

    refreshSite();

    return ok(`Added ${added.length} image${added.length === 1 ? "" : "s"}.`);
  } catch (error) {
    return fail(describe(error));
  }
}

export async function updateMediaAction(payload: string): Promise<ActionResult> {
  try {
    await assertSession();

    await db.media.write(mediaLibrarySchema.parse(parseJson(payload)));
    refreshSite();

    return ok("Library saved.");
  } catch (error) {
    return fail(describe(error));
  }
}

export async function deleteMediaAction(id: string): Promise<ActionResult> {
  try {
    await assertSession();

    const result = await deleteMedia(id);
    if (!result.ok) return fail(result.message);

    refreshSite();

    return ok(result.message);
  } catch (error) {
    return fail(describe(error));
  }
}
