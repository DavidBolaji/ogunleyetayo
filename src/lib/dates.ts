/**
 * One date format for the whole site, so a post's date reads the same
 * in the index, the article and the dashboard.
 */
export const formatPostDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
