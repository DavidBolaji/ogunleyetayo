"use client";

import { options } from "@/lib/admin/fields";
import { useAdminReference } from "@/components/admin/AdminContext";
import { Labelled, SelectInput, TextInput, ToggleInput } from "./Inputs";
import type { Action } from "@/content/types";

export const emptyAction = (): Action => ({ label: "", href: "" });

/**
 * One call to action.
 *
 * Variant and size are optional on purpose: left on "block default"
 * the button takes the treatment its block intends, which is what
 * keeps a page's hierarchy intact when someone adds a button to it.
 */
export function ActionInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Action;
  onChange: (value: Action) => void;
}) {
  const { pages } = useAdminReference();

  return (
    <Labelled label={label}>
      <div className="adm-panel space-y-2.5 p-3">
        <TextInput
          label="Button text"
          value={value.label}
          onChange={(next) => onChange({ ...value, label: next })}
          placeholder="Explore my work"
        />

        <TextInput
          label="Links to"
          value={value.href}
          onChange={(next) =>
            onChange({ ...value, href: next, external: /^https?:\/\//.test(next) || undefined })
          }
          placeholder="/books, #section, https://…"
          help="A page path, an anchor on this page, or a full address."
        />

        {pages.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {pages.slice(0, 12).map((page) => (
              <button
                key={page.id}
                type="button"
                className="adm-btn adm-btn-quiet !py-1 !text-[0.6875rem]"
                onClick={() =>
                  onChange({ ...value, href: page.slug ? `/${page.slug}` : "/", external: undefined })
                }
              >
                {page.title}
              </button>
            ))}
          </div>
        ) : null}

        <div className="grid gap-2.5 sm:grid-cols-2">
          <SelectInput
            label="Style"
            value={value.variant ?? ""}
            options={options.variant}
            onChange={(next) =>
              onChange({ ...value, variant: (next || undefined) as Action["variant"] })
            }
          />
          <SelectInput
            label="Size"
            value={value.size ?? ""}
            options={options.actionSize}
            onChange={(next) => onChange({ ...value, size: (next || undefined) as Action["size"] })}
          />
        </div>

        <ToggleInput
          label="Opens in a new tab"
          value={value.external ?? false}
          onChange={(next) => onChange({ ...value, external: next || undefined })}
        />
      </div>
    </Labelled>
  );
}
