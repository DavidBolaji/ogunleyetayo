"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { colorTokenLabels, colorTokens } from "@/lib/tokens";
import { fontsFor } from "@/lib/fonts";
import { saveThemeAction } from "@/app/admin/actions";
import { SaveBar, useEditor } from "./Editor";
import { ColorInput, NumberInput, SelectInput, TextInput, ToggleInput } from "./fields/Inputs";
import type { PalettePreset, Theme } from "@/content/types";

const slug = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "palette";

const blankPalette = (label: string): PalettePreset => ({
  id: slug(label),
  label,
  tokens: Object.fromEntries(colorTokens.map((token) => [token, "#000000"])),
});

/**
 * Palettes, palette modes and the type scale.
 *
 * A palette is a set of semantic tokens — "deep", "accent", "ink" —
 * not a list of places to paint. Components only ever ask for a token,
 * so adding a palette here immediately makes it available to every
 * block and page without a line of code.
 *
 * A mode decides which palettes are actually painted. "Unified"
 * suppresses the sub-brand palettes so the whole site speaks in one
 * voice; switching to per-brand mode lets them paint their own pages
 * again, because every block still carries its palette either way.
 */
export function ThemeEditor({ theme }: { theme: Theme }) {
  const editor = useEditor<Theme>(theme, saveThemeAction);
  const [open, setOpen] = useState<string | null>(theme.basePalette);
  const [newPalette, setNewPalette] = useState("");

  const value = editor.value;
  const activeMode = value.modes.find((mode) => mode.id === value.activeMode);

  const setPalettes = (palettes: PalettePreset[]) =>
    editor.setValue((current) => ({ ...current, palettes }));

  const updateToken = (id: string, token: string, colour: string) =>
    setPalettes(
      value.palettes.map((palette) =>
        palette.id === id
          ? { ...palette, tokens: { ...palette.tokens, [token]: colour } }
          : palette,
      ),
    );

  return (
    <>
      <SaveBar
        editor={editor}
        title="Theme & palettes"
        description="Colour, typeface and the global type scale. Every block reads from here."
      />

      <div className="space-y-6">
        <section className="adm-panel p-4">
          <h2 className="text-sm">Palette mode</h2>
          <p className="adm-help">
            {activeMode?.description ?? "Decides which palettes are painted onto the site."}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {value.modes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => editor.setValue((current) => ({ ...current, activeMode: mode.id }))}
                className={cn(
                  "adm-btn",
                  mode.id === value.activeMode ? "adm-btn-primary" : "adm-btn-ghost",
                )}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {activeMode ? (
            <div className="mt-4">
              <p className="adm-label mb-2">Palettes suppressed in this mode</p>
              <div className="flex flex-wrap gap-4">
                {value.palettes
                  .filter((palette) => palette.id !== value.basePalette)
                  .map((palette) => (
                    <ToggleInput
                      key={palette.id}
                      label={palette.label.split("—")[0].trim()}
                      value={activeMode.suppress.includes(palette.id)}
                      onChange={(suppressed) =>
                        editor.setValue((current) => ({
                          ...current,
                          modes: current.modes.map((mode) =>
                            mode.id === current.activeMode
                              ? {
                                  ...mode,
                                  suppress: suppressed
                                    ? [...mode.suppress, palette.id]
                                    : mode.suppress.filter((entry) => entry !== palette.id),
                                }
                              : mode,
                          ),
                        }))
                      }
                    />
                  ))}
              </div>
              <p className="adm-help">
                A suppressed palette falls back to the base palette. Blocks keep their palette
                either way, so this is reversible at any time.
              </p>
            </div>
          ) : null}
        </section>

        <section className="adm-panel p-4">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-sm">Palettes</h2>
              <p className="adm-help">
                The base palette answers for anything without one of its own.
              </p>
            </div>

            <div className="flex items-end gap-2">
              <TextInput
                label="New palette"
                value={newPalette}
                onChange={setNewPalette}
                placeholder="Ocean"
              />
              <button
                type="button"
                className="adm-btn adm-btn-ghost shrink-0"
                disabled={!newPalette.trim()}
                onClick={() => {
                  const palette = blankPalette(newPalette.trim());
                  if (value.palettes.some((entry) => entry.id === palette.id)) return;
                  setPalettes([...value.palettes, palette]);
                  setOpen(palette.id);
                  setNewPalette("");
                }}
              >
                Add
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {value.palettes.map((palette) => (
              <div key={palette.id} className="adm-sunken overflow-hidden">
                <div className="flex flex-wrap items-center gap-2 px-3 py-2">
                  <button
                    type="button"
                    onClick={() => setOpen(open === palette.id ? null : palette.id)}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  >
                    <span aria-hidden className="adm-help !mt-0 w-3">
                      {open === palette.id ? "▾" : "▸"}
                    </span>
                    <span className="flex shrink-0 gap-1">
                      {(["deep", "accent", "canvas", "ink"] as const).map((token) => (
                        <span
                          key={token}
                          aria-hidden
                          className="h-4 w-4 rounded-full border"
                          style={{
                            background: palette.tokens[token],
                            borderColor: "var(--a-line-strong)",
                          }}
                        />
                      ))}
                    </span>
                    <span className="truncate text-[0.8125rem] font-semibold">{palette.label}</span>
                  </button>

                  {palette.id === value.basePalette ? (
                    <span
                      className="adm-chip"
                      style={{ background: "var(--a-accent-soft)", color: "var(--a-accent-ink)" }}
                    >
                      base
                    </span>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="adm-btn adm-btn-quiet"
                        onClick={() =>
                          editor.setValue((current) => ({ ...current, basePalette: palette.id }))
                        }
                      >
                        Make base
                      </button>
                      <button
                        type="button"
                        className="adm-btn adm-btn-quiet"
                        style={{ color: "var(--a-danger)" }}
                        onClick={() =>
                          setPalettes(value.palettes.filter((entry) => entry.id !== palette.id))
                        }
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>

                {open === palette.id ? (
                  <div className="border-t p-3" style={{ borderColor: "var(--a-line)" }}>
                    <TextInput
                      label="Name"
                      value={palette.label}
                      onChange={(label) =>
                        setPalettes(
                          value.palettes.map((entry) =>
                            entry.id === palette.id ? { ...entry, label } : entry,
                          ),
                        )
                      }
                    />

                    <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {colorTokens.map((token) => (
                        <ColorInput
                          key={token}
                          label={colorTokenLabels[token] ?? token}
                          value={palette.tokens[token] ?? ""}
                          onChange={(colour) => updateToken(palette.id, token, colour)}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="adm-panel p-4">
          <h2 className="mb-3 text-sm">Typography</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectInput
              label="Display typeface"
              value={value.fonts.display}
              options={fontsFor("display").map((font) => ({ value: font.id, label: font.label }))}
              onChange={(display) =>
                editor.setValue((current) => ({
                  ...current,
                  fonts: { ...current.fonts, display },
                }))
              }
            />

            <SelectInput
              label="Body typeface"
              value={value.fonts.sans}
              options={fontsFor("sans").map((font) => ({ value: font.id, label: font.label }))}
              onChange={(sans) =>
                editor.setValue((current) => ({ ...current, fonts: { ...current.fonts, sans } }))
              }
            />

            <NumberInput
              label="Global type scale"
              help="Multiplies every display size. 1 is the design's own scale."
              value={value.typography.scale}
              min={0.7}
              max={1.6}
              step={0.01}
              onChange={(scale) =>
                editor.setValue((current) => ({
                  ...current,
                  typography: { ...current.typography, scale },
                }))
              }
            />

            <NumberInput
              label="Heading weight"
              value={value.typography.headingWeight}
              min={100}
              max={900}
              step={100}
              onChange={(headingWeight) =>
                editor.setValue((current) => ({
                  ...current,
                  typography: { ...current.typography, headingWeight },
                }))
              }
            />

            <TextInput
              label="Heading letter spacing"
              value={value.typography.headingTracking}
              placeholder="-0.02em"
              onChange={(headingTracking) =>
                editor.setValue((current) => ({
                  ...current,
                  typography: { ...current.typography, headingTracking },
                }))
              }
            />

            <TextInput
              label="Body size"
              value={value.typography.bodySize}
              placeholder="1rem"
              onChange={(bodySize) =>
                editor.setValue((current) => ({
                  ...current,
                  typography: { ...current.typography, bodySize },
                }))
              }
            />
          </div>
        </section>
      </div>
    </>
  );
}
