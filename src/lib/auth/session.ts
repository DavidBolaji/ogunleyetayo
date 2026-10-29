/**
 * Session cookies.
 *
 * Signed with HMAC-SHA256 via Web Crypto rather than `node:crypto`, so
 * the exact same verification runs in the Edge middleware that guards
 * `/admin` and in the server actions that perform writes. One
 * implementation, two runtimes, no chance of them disagreeing.
 *
 * The cookie carries a claim, not a key: it is stateless, so there is
 * no session table to keep, and changing `AUTH_SECRET` or the password
 * invalidates every outstanding session at once.
 */

export const SESSION_COOKIE = "etayo_admin";

interface SessionPayload {
  /** Subject — the admin username. */
  sub: string;
  /** Issued at, seconds since the epoch. */
  iat: number;
  /** Expires at, seconds since the epoch. */
  exp: number;
}

export interface Session {
  readonly username: string;
  readonly expiresAt: Date;
}

const encoder = new TextEncoder();

const toBase64Url = (bytes: Uint8Array): string => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const fromBase64Url = (value: string): Uint8Array => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, "="));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

const importKey = (secret: string): Promise<CryptoKey> =>
  crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );

/** Issues a signed token valid for `ttlSeconds`. */
export async function createSessionToken(
  username: string,
  secret: string,
  ttlSeconds: number,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = { sub: username, iat: now, exp: now + ttlSeconds };

  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const key = await importKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));

  return `${body}.${toBase64Url(new Uint8Array(signature))}`;
}

/**
 * Verifies a token and returns its session, or `undefined`.
 *
 * Signature is checked before the payload is trusted, and `verify`
 * does the comparison, so a forged token cannot be distinguished by
 * timing from a merely stale one.
 */
export async function readSessionToken(
  token: string | undefined,
  secret: string,
): Promise<Session | undefined> {
  if (!token) return undefined;

  const separator = token.lastIndexOf(".");
  if (separator <= 0) return undefined;

  const body = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  try {
    const key = await importKey(secret);

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(signature),
      encoder.encode(body),
    );

    if (!valid) return undefined;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as SessionPayload;

    if (
      typeof payload.sub !== "string" ||
      typeof payload.exp !== "number" ||
      payload.exp * 1000 <= Date.now()
    ) {
      return undefined;
    }

    return { username: payload.sub, expiresAt: new Date(payload.exp * 1000) };
  } catch {
    return undefined;
  }
}

/** Cookie attributes. Shared so the set and the clear cannot diverge. */
export const sessionCookieOptions = (maxAge: number) =>
  ({
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  }) satisfies {
    httpOnly: boolean;
    sameSite: "lax";
    secure: boolean;
    path: string;
    maxAge: number;
  };
