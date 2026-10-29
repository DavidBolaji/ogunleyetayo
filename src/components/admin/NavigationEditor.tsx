"use client";

import { randomId } from "@/lib/admin/ids";
import { saveNavigationAction } from "@/app/admin/actions";
import { SaveBar, useEditor } from "./Editor";
import { TextInput, ToggleInput } from "./fields/Inputs";
import type { Navigation, NavItem } from "@/content/types";

interface PageRef {
  id: string;
  slug: string;
  title: string;
  status: string;
}

const newItem = (label = "New link", href = "/"): NavItem => ({
  id: `nav-${randomId()}`,
  label,
  href,
  external: false,
  visible: true,
  children: [],
});

/**
 * The site's menus.
 *
 * Two lists: the header, which may nest one level into a dropdown, and
 * the footer column, which mirrors the header's top level when left
 * empty so a new page appears in both without being added twice.
 */
export function NavigationEditor({
  navigation,
  pages,
}: {
  navigation: Navigation;
  pages: readonly PageRef[];
}) {
  const editor = useEditor<Navigation>(navigation, saveNavigationAction);

  const update = (list: "header" | "footer", items: NavItem[]) =>
    editor.setValue((current) => ({ ...current, [list]: items }));

  return (
    <>
      <SaveBar
        editor={editor}
        title="Navigation"
        description="The header menu, its dropdowns, and the footer column."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ItemList
          title="Header menu"
          help="A link with children becomes a dropdown. Children are flattened on small screens."
          items={editor.value.header}
          pages={pages}
          onChange={(items) => update("header", items)}
          allowChildren
        />

        <ItemList
          title="Footer column"
          help="Leave empty to mirror the header's top-level links."
          items={editor.value.footer}
          pages={pages}
          onChange={(items) => update("footer", items)}
        />
      </div>
    </>
  );
}

function ItemList({
  title,
  help,
  items,
  pages,
  onChange,
  allowChildren = false,
  nested = false,
}: {
  title: string;
  help?: string;
  items: readonly NavItem[];
  pages: readonly PageRef[];
  onChange: (items: NavItem[]) => void;
  allowChildren?: boolean;
  nested?: boolean;
}) {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const replace = (index: number, item: NavItem) =>
    onChange(items.map((entry, position) => (position === index ? item : entry)));

  return (
    <section className={nested ? undefined : "adm-panel p-4"}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm">{title}</h2>
          {help ? <p className="adm-help">{help}</p> : null}
        </div>

        <button
          type="button"
          className="adm-btn adm-btn-quiet shrink-0"
          onClick={() => onChange([...items, newItem()])}
        >
          + Link
        </button>
      </div>

      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={item.id} className="adm-sunken p-3">
            <div className="mb-2 flex items-center gap-1">
              <span className="adm-label flex-1 truncate !text-[0.6875rem]">
                {item.label || "Untitled"}
              </span>
              <button
                type="button"
                className="adm-btn adm-btn-quiet"
                disabled={index === 0}
                onClick={() => move(index, index - 1)}
                title="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                className="adm-btn adm-btn-quiet"
                disabled={index === items.length - 1}
                onClick={() => move(index, index + 1)}
                title="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                className="adm-btn adm-btn-quiet"
                style={{ color: "var(--a-danger)" }}
                onClick={() => onChange(items.filter((_, position) => position !== index))}
              >
                Remove
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput
                label="Label"
                value={item.label}
                onChange={(label) => replace(index, { ...item, label })}
              />
              <TextInput
                label="Links to"
                value={item.href}
                onChange={(href) =>
                  replace(index, { ...item, href, external: /^https?:\/\//.test(href) })
                }
              />
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              {pages.map((page) => (
                <button
                  key={page.id}
                  type="button"
                  className="adm-btn adm-btn-quiet !py-1 !text-[0.6875rem]"
                  title={page.status === "draft" ? "This page is a draft" : undefined}
                  onClick={() =>
                    replace(index, {
                      ...item,
                      href: page.slug ? `/${page.slug}` : "/",
                      label: item.label === "New link" ? page.title : item.label,
                      external: false,
                    })
                  }
                >
                  {page.title}
                  {page.status === "draft" ? " ·draft" : ""}
                </button>
              ))}
            </div>

            <div className="mt-2 flex flex-wrap gap-5">
              <ToggleInput
                label="Visible"
                value={item.visible}
                onChange={(visible) => replace(index, { ...item, visible })}
              />
              <ToggleInput
                label="Opens in a new tab"
                value={item.external}
                onChange={(external) => replace(index, { ...item, external })}
              />
            </div>

            {allowChildren ? (
              <div className="mt-3 border-t pt-3" style={{ borderColor: "var(--a-line)" }}>
                <ItemList
                  title="Dropdown"
                  items={item.children}
                  pages={pages}
                  nested
                  onChange={(children) => replace(index, { ...item, children })}
                />
              </div>
            ) : null}
          </li>
        ))}

        {items.length === 0 ? (
          <li className="adm-help">No links yet.</li>
        ) : null}
      </ul>
    </section>
  );
}
