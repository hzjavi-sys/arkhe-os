import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "arkhe_session";

function getToken(req: NextRequest) {
  return req.cookies.get(COOKIE_NAME)?.value || null;
}

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Falta JWT_SECRET en .env");
  return new TextEncoder().encode(secret);
}

async function isValidSession(token: string) {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Permitir siempre recursos internos y auth
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // Permitir la página de login
  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // Proteger el resto
  const token = getToken(req);
  if (!token || !(await isValidSession(token))) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Aplica a todo menos /api/auth (lo filtramos arriba)
export const config = {
  matcher: ["/((?!api/auth).*)"],
};
