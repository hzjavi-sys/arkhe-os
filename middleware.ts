import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "arkhe_session";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secretStr = process.env.JWT_SECRET || "";
    const secret = new TextEncoder().encode(secretStr);
    const { payload } = await jwtVerify(token, secret);

    if (req.nextUrl.pathname.startsWith("/admin")) {
      const role = String((payload as any).role || "");
      if (role !== "ADMIN" && role !== "SUPERADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
