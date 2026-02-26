import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "arkhe_session";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Falta JWT_SECRET en .env");
  return new TextEncoder().encode(secret);
}

function getToken(req: NextRequest) {
  return req.cookies.get(COOKIE_NAME)?.value || null;
}

async function getPayload(token: string) {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as any;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Nunca tocar APIs (evita romper fetch/curl)
  if (pathname.startsWith("/api")) return NextResponse.next();
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico")) return NextResponse.next();
  if (pathname.startsWith("/login")) return NextResponse.next();

  // Páginas protegidas: requieren sesión válida
  const token = getToken(req);
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    const payload = await getPayload(token);

    // /admin/* solo ADMIN (y SUPERADMIN si existe)
    if (pathname.startsWith("/admin")) {
      const role = String(payload?.role || "");
      if (role !== "ADMIN" && role !== "SUPERADMIN") {
        const url = req.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
