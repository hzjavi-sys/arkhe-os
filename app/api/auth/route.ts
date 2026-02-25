import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signSession, sessionCookie, clearSessionCookie } from "@/lib/auth";

// POST = login (crea usuario si no existe, como veníamos haciendo)
// DELETE = logout
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim();
    const password = String(body?.password || "");

    if (!email || !password) {
      return NextResponse.json({ error: "email_y_password_requeridos" }, { status: 400 });
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: { email, password, role: "USER" },
      });
    }

    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signSession({ userId: user.id, role: user.role, email: user.email });

    const res = NextResponse.json({ ok: true, id: user.id, email: user.email, role: user.role });
    res.headers.set("Set-Cookie", sessionCookie(token));
    return res;
  } catch (err: any) {
    console.error("AUTH ERROR:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", clearSessionCookie());
  return res;
}
