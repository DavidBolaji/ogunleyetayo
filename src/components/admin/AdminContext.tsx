"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Collection, MediaItem, PalettePreset } from "@/content/types";

/**
 * Reference data the editors need.
 *
 * The media library, the list of collections and the palette set are
 * wanted by pickers several levels down a nested form. Passing them
 * through context keeps the field renderer generic — it only ever
 * forwards a value and a change handler.
 */
export interface AdminReference {
  readonly media: readonly MediaItem[];
  readonly collections: readonly Pick<Collection, "name" | "label" | "kind">[];
  readonly palettes: readonly PalettePreset[];
  readonly pages: readonly { id: string; slug: string; title: string }[];
}

const empty: AdminReference = { media: [], collections: [], palettes: [], pages: [] };

const AdminReferenceContext = createContext<AdminReference>(empty);

export const useAdminReference = (): AdminReference => useContext(AdminReferenceContext);

export function AdminReferenceProvider({
  value,
  children,
}: {
  value: AdminReference;
  children: ReactNode;
}) {
  return <AdminReferenceContext.Provider value={value}>{children}</AdminReferenceContext.Provider>;
}
