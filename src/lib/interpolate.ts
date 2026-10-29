import type { Settings } from "@/content/types";

/**
 * Resolves `{site.email}`-style tokens in editable copy.
 *
 * Contact details, closing lines and footers repeat the same handful of
 * facts. Storing a token instead of the literal means changing a phone
 * number in Settings updates every page that mentions it, rather than
 * leaving stale copies behind — the usual failure mode of a CMS where
 * every string is independent.
 *
 * Substitution is a plain lookup over a fixed table, so nothing an
 * editor types can reach anything that is not listed here.
 */
const TOKEN = /\{(site\.[a-zA-Z]+)\}/g;

export function tokenTable(settings: Settings): Record<string, string> {
  const { site } = settings;

  return {
    "site.name": site.name,
    "site.shortName": site.shortName,
    "site.descriptor": site.descriptor,
    "site.tagline": site.tagline,
    "site.email": site.email,
    "site.phone": site.phone,
    "site.whatsapp": site.whatsapp,
    "site.location": site.location,
    "site.church": site.church,
    "site.url": site.url,
  };
}

export const interpolate = (value: string, table: Record<string, string>): string =>
  value.includes("{") ? value.replace(TOKEN, (match, key: string) => table[key] ?? match) : value;

/** Deep-copies `value`, resolving tokens in every string it contains. */
export function interpolateDeep<T>(value: T, table: Record<string, string>): T {
  if (typeof value === "string") return interpolate(value, table) as unknown as T;

  if (Array.isArray(value)) {
    return value.map((entry) => interpolateDeep(entry, table)) as unknown as T;
  }

  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) out[key] = interpolateDeep(entry, table);
    return out as T;
  }

  return value;
}

/** The tokens an editor can use, for the dashboard's help text. */
export const availableTokens = [
  "{site.name}",
  "{site.shortName}",
  "{site.descriptor}",
  "{site.tagline}",
  "{site.email}",
  "{site.phone}",
  "{site.whatsapp}",
  "{site.location}",
  "{site.church}",
  "{site.url}",
] as const;
