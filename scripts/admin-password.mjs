#!/usr/bin/env node
/**
 * Generates an ADMIN_PASSWORD_HASH for the dashboard.
 *
 *   npm run admin:password                # prompts, input hidden
 *   npm run admin:password -- 'secret'    # non-interactive
 *
 * Copy the printed lines into your environment (Vercel project
 * settings, or .env.local for development). The plaintext is never
 * written anywhere by this script.
 */
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import { createInterface } from "node:readline";

const scryptAsync = promisify(scrypt);

// Must stay in step with src/lib/auth/password.ts.
const PARAMS = { N: 2 ** 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const KEY_LENGTH = 32;
const SALT_LENGTH = 16;

const PROMPT = "New dashboard password: ";

const ask = () =>
  new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });

    process.stdout.write(PROMPT);

    // Redraw the prompt on every keystroke so the password is not echoed.
    const hide = () => rl.output.write(`\u001b[2K\u001b[200D${PROMPT}`);
    rl.input.on("data", hide);

    rl.question("", (answer) => {
      rl.input.off("data", hide);
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });

const password = process.argv[2] ?? (await ask());

if (!password || password.length < 10) {
  console.error("\nUse at least 10 characters.");
  process.exit(1);
}

const salt = randomBytes(SALT_LENGTH);
const key = await scryptAsync(password, salt, KEY_LENGTH, PARAMS);

const digest = [
  "scrypt",
  PARAMS.N,
  PARAMS.r,
  PARAMS.p,
  salt.toString("base64url"),
  key.toString("base64url"),
].join("$");

console.log("\nSet these in your environment:\n");
console.log(`ADMIN_USERNAME=admin`);
console.log(`ADMIN_PASSWORD_HASH=${digest}`);
console.log(`AUTH_SECRET=${randomBytes(32).toString("hex")}\n`);
