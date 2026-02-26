import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*"],
};

export function middleware(req: NextRequest) {
  // SOLO protegemos /admin. NO redirigimos nada más acá.
  const session = req.cookies.get("arkhe_session")?.value;
  if (!session) return NextResponse.redirect(new URL("/login", req.url));
  return NextResponse.next();
}
