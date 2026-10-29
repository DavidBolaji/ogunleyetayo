"use client";

import { typePresets, findTypePreset } from "@/lib/blocks/type-presets";
import { Labelled, NumberInput, SelectInput, TextInput, ToggleInput } from "./Inputs";
import type { TypeStyle } from "@/content/types";

/**
 * The type control.
 *
 * Presets are the site's own heading steps, so reaching for "Section
 * heading" gives exactly the heading the design uses. The numbers stay
 * editable underneath because display type here is fluid — a minimum,
 * a rate of growth and a maximum — and a fixed ramp cannot express the
 * twenty-odd sizes the pages actually use.
 */
export function TypeInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: TypeStyle;
  onChange: (value: TypeStyle) => void;
}) {
  const preset = findTypePreset(value);

  const sample = {
    fontSize: `clamp(${value.min}rem, ${value.vw}vw, ${value.max}rem)`,
    lineHeight: value.leading,
    letterSpacing: value.tracking || undefined,
    textTransform: value.case === "upper" ? ("uppercase" as const) : undefined,
    fontStyle: value.italic ? ("italic" as const) : undefined,
  };

  return (
    <Labelled label={label}>
      <div className="adm-panel space-y-3 p-3">
        <SelectInput
          label="Preset"
          value={preset?.id ?? ""}
          options={[
            { value: "", label: preset ? "Custom" : "Custom — set below" },
            ...typePresets.map((entry) => ({ value: entry.id, label: entry.label })),
          ]}
          onChange={(id) => {
            const chosen = typePresets.find((entry) => entry.id === id);
            if (chosen) onChange({ ...chosen.value });
          }}
        />

        <div
          className="overflow-hidden rounded px-3 py-3"
          style={{ background: "var(--a-sunken)" }}
        >
          <p className="truncate font-[var(--font-display)]" style={sample}>
            Faith. Creativity.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <NumberInput
            label="Min (rem)"
            value={value.min}
            min={0.5}
            max={14}
            step={0.05}
            onChange={(min) => onChange({ ...value, min })}
          />
          <NumberInput
            label="Growth (vw)"
            value={value.vw}
            min={0}
            max={24}
            step={0.1}
            onChange={(vw) => onChange({ ...value, vw })}
          />
          <NumberInput
            label="Max (rem)"
            value={value.max}
            min={0.5}
            max={24}
            step={0.05}
            onChange={(max) => onChange({ ...value, max })}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <NumberInput
            label="Line height"
            value={value.leading}
            min={0.7}
            max={2.2}
            step={0.01}
            onChange={(leading) => onChange({ ...value, leading })}
          />
          <TextInput
            label="Letter spacing"
            value={value.tracking}
            placeholder="-0.03em"
            onChange={(tracking) => onChange({ ...value, tracking })}
          />
        </div>

        <div className="flex flex-wrap gap-5">
          <ToggleInput
            label="All caps"
            value={value.case === "upper"}
            onChange={(upper) => onChange({ ...value, case: upper ? "upper" : "normal" })}
          />
          <ToggleInput
            label="Italic"
            value={value.italic}
            onChange={(italic) => onChange({ ...value, italic })}
          />
        </div>
      </div>
    </Labelled>
  );
}
