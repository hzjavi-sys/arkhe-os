import { NextResponse } from "next/server";
import { readCookieFromRequest, verifySession } from "@/lib/auth";

export async function GET(request: Request) {
  const token = readCookieFromRequest(request);
  if (!token) return NextResponse.json({ error: "no_auth" }, { status: 401 });

  try {
    const session = await verifySession(token);
    return NextResponse.json({
      userId: session.userId,
      email: session.email,
      role: session.role,
    });
  } catch {
    return NextResponse.json({ error: "no_auth" }, { status: 401 });
  }
}
