import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { authConfig, isAuthConfigured, type AuthConfig } from "./config";
import { safeEqual, verifyPassword } from "./password";
import { checkRateLimit, clearRateLimit } from "./rate-limit";
import {
  createSessionToken,
  readSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
  type Session,
} from "./session";

export { authConfig, isAuthConfigured } from "./config";
export { hashPassword } from "./password";
export { SESSION_COOKIE } from "./session";
export type { Session } from "./session";
export type { AuthConfig } from "./config";

/** The current session, if the request carries a valid cookie. */
export async function getSession(): Promise<Session | undefined> {
  const config = authConfig();
  if (!isAuthConfigured(config)) return undefined;

  const store = await cookies();
  return readSessionToken(store.get(SESSION_COOKIE)?.value, config.secret);
}

/**
 * The guard every dashboard page starts with.
 *
 * The middleware already turns anonymous `/admin` requests away, but
 * middleware is a routing concern and cannot be the only gate.
 * Authorisation is enforced here, next to the work; the middleware
 * only exists to make the redirect pleasant.
 */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** For server actions: throws rather than redirecting, so a form can report it. */
export async function assertSession(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new Error("Your session has expired. Please sign in again.");
  return session;
}

export interface SignInResult {
  readonly ok: boolean;
  readonly message?: string;
}

/** Best-effort client identity for throttling. */
async function clientKey(): Promise<string> {
  const list = await headers();

  const forwarded = list.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || list.get("x-real-ip") || "local";

  return `login:${ip}`;
}

/**
 * Checks credentials and, on success, sets the session cookie.
 *
 * Both branches do the same work where it matters: a wrong username
 * still runs the key derivation, so response time does not reveal
 * whether the username was right.
 */
export async function signIn(username: string, password: string): Promise<SignInResult> {
  const config = authConfig();

  if (!isAuthConfigured(config)) {
    return { ok: false, message: config.problems.join(" ") };
  }

  const key = await clientKey();
  const limit = checkRateLimit(key);

  if (!limit.allowed) {
    const minutes = Math.ceil(limit.retryAfterSeconds / 60);
    return {
      ok: false,
      message: `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
    };
  }

  const passwordOk = await checkPassword(config, password);
  const usernameOk = safeEqual(username, config.username);

  if (!usernameOk || !passwordOk) {
    return { ok: false, message: "That username and password do not match." };
  }

  clearRateLimit(key);

  const token = await createSessionToken(config.username, config.secret, config.ttlSeconds);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions(config.ttlSeconds));

  return { ok: true };
}

const checkPassword = async (config: AuthConfig, password: string): Promise<boolean> => {
  if (config.passwordHash) return verifyPassword(password, config.passwordHash);
  if (config.plainPassword) return safeEqual(password, config.plainPassword);
  return false;
};

export async function signOut(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", sessionCookieOptions(0));
}
