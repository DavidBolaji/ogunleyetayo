import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;

/**
 * Password hashing.
 *
 * scrypt from Node's standard library rather than a dependency: it is
 * a memory-hard KDF, it is already present, and one admin login does
 * not justify adding a native module to the deployment.
 *
 * Format: `scrypt$N$r$p$salt$hash`, all base64url.
 */

const PARAMS = { N: 2 ** 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const KEY_LENGTH = 32;
const SALT_LENGTH = 16;

const encode = (buffer: Buffer): string => buffer.toString("base64url");

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const key = await scryptAsync(password, salt, KEY_LENGTH, PARAMS);

  return ["scrypt", PARAMS.N, PARAMS.r, PARAMS.p, encode(salt), encode(key)].join("$");
}

/**
 * Compares a candidate against a stored digest in constant time.
 *
 * Returns false rather than throwing on a malformed digest: a broken
 * environment variable must read as "wrong password", never as an
 * error that leaks what is configured.
 */
export async function verifyPassword(password: string, digest: string): Promise<boolean> {
  const parts = digest.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;

  const [, n, r, p, saltPart, hashPart] = parts;

  const options = {
    N: Number(n),
    r: Number(r),
    p: Number(p),
    maxmem: PARAMS.maxmem,
  };

  if (!Number.isInteger(options.N) || !Number.isInteger(options.r) || !Number.isInteger(options.p)) {
    return false;
  }

  try {
    const salt = Buffer.from(saltPart, "base64url");
    const expected = Buffer.from(hashPart, "base64url");
    if (salt.length === 0 || expected.length === 0) return false;

    const actual = await scryptAsync(password, salt, expected.length, options);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

/** Constant-time comparison for the plaintext development path. */
export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");

  // timingSafeEqual requires equal lengths, and the length itself is
  // not a secret worth protecting here.
  if (left.length !== right.length) return false;

  return timingSafeEqual(left, right);
}
