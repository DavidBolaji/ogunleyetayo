import { NextResponse, type NextRequest } from "next/server";
import { readSessionToken, SESSION_COOKIE } from "@/lib/auth/session";

/**
 * Turns anonymous dashboard requests into a redirect to the login page.
 *
 * This is a convenience, not the security boundary: every dashboard
 * page calls `requireSession()` and every write action calls
 * `assertSession()`, so a request that somehow skipped the middleware
 * still gets nowhere. Verification uses Web Crypto, so the same code
 * runs here on the edge as on the server.
 */
export const config = {
  matcher: ["/admin/:path*"],
};

const LOGIN_PATH = "/admin/login";

/** Mirrors the fallback in lib/auth/config.ts — see the note there. */
const sessionSecret = (): string =>
  process.env.AUTH_SECRET?.trim() ||
  `dev:${process.env.ADMIN_USERNAME?.trim() || "admin"}:${
    process.env.ADMIN_PASSWORD_HASH?.trim() || process.env.ADMIN_PASSWORD?.trim() || "unset"
  }`;

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const session = await readSessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
    sessionSecret(),
  );

  if (pathname === LOGIN_PATH) {
    // Already signed in — no reason to show the form again.
    if (session) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  if (!session) {
    const login = new URL(LOGIN_PATH, request.url);
    // Remember where they were headed, so the form can send them on.
    if (pathname !== "/admin") login.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}
