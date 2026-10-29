/**
 * Dashboard credentials, read from the environment.
 *
 * Nothing about who may sign in is stored in the database or in the
 * repository: rotating the password is an environment change and a
 * restart, and a leaked copy of `data/` grants nobody access.
 *
 *   ADMIN_USERNAME        defaults to "admin"
 *   ADMIN_PASSWORD_HASH   scrypt digest — preferred
 *   ADMIN_PASSWORD        plaintext — convenient locally, refused in production
 *   AUTH_SECRET           signs session cookies; required in production
 *   SESSION_TTL_HOURS     defaults to 12
 */

export interface AuthConfig {
  readonly username: string;
  readonly passwordHash?: string;
  readonly plainPassword?: string;
  readonly secret: string;
  readonly ttlSeconds: number;
  /** Problems that make signing in impossible, for the login screen. */
  readonly problems: readonly string[];
}

const DEFAULT_TTL_HOURS = 12;

const read = (name: string): string | undefined => {
  const value = process.env[name];
  return value && value.trim() !== "" ? value.trim() : undefined;
};

export function authConfig(): AuthConfig {
  const isProduction = process.env.NODE_ENV === "production";

  const username = read("ADMIN_USERNAME") ?? "admin";
  const passwordHash = read("ADMIN_PASSWORD_HASH");
  const plainPassword = read("ADMIN_PASSWORD");
  const envSecret = read("AUTH_SECRET");

  const problems: string[] = [];

  if (!passwordHash && !plainPassword) {
    problems.push(
      "No password is configured. Set ADMIN_PASSWORD_HASH (preferred) or ADMIN_PASSWORD.",
    );
  }

  if (isProduction && !passwordHash && plainPassword) {
    problems.push(
      "ADMIN_PASSWORD is plaintext and is refused in production. Generate a digest with `npm run admin:password` and set ADMIN_PASSWORD_HASH.",
    );
  }

  if (isProduction && !envSecret) {
    problems.push("AUTH_SECRET is not set. Generate one with `openssl rand -hex 32`.");
  }

  /*
   * Without AUTH_SECRET, development derives a stable key from the
   * credentials so sessions survive a reload. It is deliberately not
   * allowed to stand in for a real secret in production — the check
   * above refuses to sign in at all there.
   */
  const secret = envSecret ?? `dev:${username}:${passwordHash ?? plainPassword ?? "unset"}`;

  const ttlHours = Number(read("SESSION_TTL_HOURS") ?? DEFAULT_TTL_HOURS);

  return {
    username,
    passwordHash,
    plainPassword: isProduction && passwordHash ? undefined : plainPassword,
    secret,
    ttlSeconds: Math.round(
      (Number.isFinite(ttlHours) && ttlHours > 0 ? ttlHours : DEFAULT_TTL_HOURS) * 3600,
    ),
    problems,
  };
}

/** True when the dashboard can be signed into at all. */
export const isAuthConfigured = (config: AuthConfig): boolean => config.problems.length === 0;
