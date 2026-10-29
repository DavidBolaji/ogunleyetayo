/**
 * A sliding-window throttle for the login form.
 *
 * In-process and per-instance, which is the honest scope for a
 * single-admin dashboard on a single server: it exists to make
 * password guessing impractical, not to be a distributed quota. If the
 * deployment ever becomes multi-instance this is the piece to replace.
 */

interface Window {
  hits: number[];
  blockedUntil: number;
}

const windows = new Map<string, Window>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const BLOCK_MS = 15 * 60 * 1000;
const MAX_TRACKED_KEYS = 5000;

export interface RateLimitResult {
  readonly allowed: boolean;
  readonly retryAfterSeconds: number;
}

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const window = windows.get(key) ?? { hits: [], blockedUntil: 0 };

  if (window.blockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((window.blockedUntil - now) / 1000),
    };
  }

  window.hits = window.hits.filter((hit) => now - hit < WINDOW_MS);

  if (window.hits.length >= MAX_ATTEMPTS) {
    window.blockedUntil = now + BLOCK_MS;
    window.hits = [];
    windows.set(key, window);
    return { allowed: false, retryAfterSeconds: Math.ceil(BLOCK_MS / 1000) };
  }

  window.hits.push(now);

  // Bound the map so a flood of distinct keys cannot grow it without limit.
  if (windows.size > MAX_TRACKED_KEYS) windows.clear();
  windows.set(key, window);

  return { allowed: true, retryAfterSeconds: 0 };
}

/** Called after a successful sign-in, so one typo is not held against you. */
export function clearRateLimit(key: string): void {
  windows.delete(key);
}
