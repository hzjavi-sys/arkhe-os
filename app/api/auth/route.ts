import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signSession, sessionCookie, clearSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim();
    const password = String(body?.password || "");

    if (!email || !password) {
      return NextResponse.json({ error: "email_y_password_requeridos" }, { status: 400 });
    }

    const empresasCount = await prisma.empresa.count();

    if (empresasCount === 0) {
      const empresa = await prisma.empresa.create({ data: { nombre: "Empresa 1" } });

      const admin = await prisma.user.create({
        data: { email, password, role: "ADMIN", empresaId: empresa.id },
      });

      const token = await signSession({ userId: admin.id, role: admin.role, email: admin.email });

      const res = NextResponse.json({
        ok: true,
        bootstrap: true,
        id: admin.id,
        email: admin.email,
        role: admin.role,
        empresaId: admin.empresaId,
      });
      res.headers.set("Set-Cookie", sessionCookie(token));
      return res;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "user_not_found" }, { status: 401 });
    if (user.password !== password) return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });

    const token = await signSession({ userId: user.id, role: user.role, email: user.email });

    const res = NextResponse.json({ ok: true, id: user.id, email: user.email, role: user.role, empresaId: user.empresaId });
    res.headers.set("Set-Cookie", sessionCookie(token));
    return res;
  } catch (err: any) {
    console.error("AUTH ERROR STACK:", err?.stack || err);
    return NextResponse.json(
      { error: "server_error", detail: String(err?.message || err) },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", clearSessionCookie());
  return res;
}
