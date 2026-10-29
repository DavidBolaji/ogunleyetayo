/**
 * Short ids for things created in the dashboard.
 *
 * Block ids only have to be unique within a page and stable across
 * saves — they key React lists and nothing else — so a short random
 * suffix is enough, and reads better in a committed document than a
 * UUID.
 */
export const randomId = (): string => Math.random().toString(36).slice(2, 8);
