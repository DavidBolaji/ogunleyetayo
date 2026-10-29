"use client";

import { useAdminReference } from "@/components/admin/AdminContext";
import { Labelled } from "./Inputs";

/** Chooses a palette for a block or page. Palettes are database values. */
export function PalettePicker({
  label,
  help,
  value,
  onChange,
}: {
  label: string;
  help?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const { palettes } = useAdminReference();

  return (
    <Labelled label={label} help={help}>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => onChange("")}
          className="adm-btn adm-btn-ghost"
          style={
            value === "" ? { borderColor: "var(--a-accent)", color: "var(--a-accent)" } : undefined
          }
        >
          Inherit
        </button>

        {palettes.map((palette) => (
          <button
            key={palette.id}
            type="button"
            onClick={() => onChange(palette.id)}
            title={palette.label}
            className="adm-btn adm-btn-ghost"
            style={
              value === palette.id
                ? { borderColor: "var(--a-accent)", color: "var(--a-accent)" }
                : undefined
            }
          >
            <span
              aria-hidden
              className="h-3 w-3 rounded-full border"
              style={{
                background: palette.tokens.deep ?? "#000",
                borderColor: palette.tokens.accent ?? "transparent",
              }}
            />
            {palette.label.split("—")[0].trim()}
          </button>
        ))}
      </div>
    </Labelled>
  );
}
