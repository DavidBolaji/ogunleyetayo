"use client";

import { saveSettingsAction } from "@/app/admin/actions";
import { availableTokens } from "@/lib/interpolate";
import { f } from "@/lib/admin/fields";
import { AdminReferenceProvider, type AdminReference } from "./AdminContext";
import { Fields } from "./FieldRenderer";
import { SaveBar, useEditor } from "./Editor";
import type { Settings } from "@/content/types";

type Values = Record<string, unknown>;

/**
 * Site-wide settings.
 *
 * These are the facts the site repeats — the name, the inboxes, the
 * location — and the places those facts are written once. Copy
 * elsewhere refers to them with `{site.*}` tokens, so changing a phone
 * number here changes it everywhere rather than leaving stale copies
 * on three pages.
 */
const fields = [
  f.group("site", "Identity", [
    f.text("name", "Full name"),
    f.text("shortName", "Short name", { half: true }),
    f.text("tagline", "Tagline", { half: true }),
    f.text("descriptor", "Descriptor", {
      help: "The line above the masthead. Separate roles with ·.",
    }),
    f.area("positioning", "Positioning statement", {
      rows: 4,
      help: "The default description for search results and share cards.",
    }),
    f.text("url", "Site address", { half: true, placeholder: "https://example.com" }),
    f.text("wordmarkTagline", "Wordmark tagline", { half: true }),
    f.text("email", "Email", { half: true }),
    f.text("phone", "Phone", { half: true }),
    f.text("whatsapp", "WhatsApp link", { half: true }),
    f.text("location", "Based in", { half: true }),
    f.text("church", "Church", { half: true }),
  ]),

  f.group("seo", "Search & sharing", [
    f.text("titleTemplate", "Title template", {
      half: true,
      placeholder: "%s — Name",
      help: "%s is replaced by the page's own title.",
    }),
    f.text("locale", "Locale", { half: true, placeholder: "en_NG" }),
    f.media("ogImage", "Default share portrait", "Used on the generated share card."),
    f.strings("keywords", "Keywords"),
    f.color("themeColor", "Browser theme colour"),
  ]),

  f.list(
    "socials",
    "Social links",
    "Link",
    [
      f.text("id", "Key", { half: true }),
      f.text("platform", "Platform", { half: true }),
      f.text("handle", "Handle", { half: true }),
      f.text("href", "Address"),
    ],
    { help: "An X or Twitter entry is also used for the share card's attribution." },
  ),

  f.group("footer", "Footer", [
    f.text("eyebrow", "Eyebrow"),
    f.rich("title", "Heading", { rows: 2 }),
    f.rich("body", "Body", { rows: 2 }),
    f.text("navLabel", "Navigation column label", { half: true }),
    f.text("exploreLabel", "Explore column label", { half: true }),
    f.collection("exploreCollection", "Explore column collection", "expression"),
    f.text("connectLabel", "Social column label", { half: true }),
    f.text("rights", "Rights line", { half: true }),
  ]),

  f.group("enquiry", "Enquiries", [
    f.collection("routesCollection", "Enquiry routes", "enquiryRoute"),
    f.area("successMessage", "Confirmation message", { rows: 2 }),
  ]),

  f.group("blog", "Blog", [
    f.collection("postsCollection", "Posts collection", "post"),
    f.rich("postFooterNote", "Line above the form at the foot of an article", { rows: 2 }),
    f.text("backLabel", "Back link label", { half: true }),
  ]),
];

export function SettingsEditor({
  settings,
  reference,
}: {
  settings: Settings;
  reference: AdminReference;
}) {
  const editor = useEditor<Settings>(settings, saveSettingsAction);

  return (
    <AdminReferenceProvider value={reference}>
      <SaveBar
        editor={editor}
        title="Settings"
        description="The facts the whole site refers to."
      />

      <p className="adm-help mb-4">
        Copy anywhere on the site can refer to these with a token:{" "}
        <code>{availableTokens.join("  ")}</code>
      </p>

      <div className="adm-panel p-4">
        <Fields
          fields={fields}
          value={editor.value as unknown as Values}
          onChange={(next) => editor.setValue(next as unknown as Settings)}
        />
      </div>
    </AdminReferenceProvider>
  );
}
