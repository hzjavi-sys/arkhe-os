import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readCookieFromRequest, verifySession } from "@/lib/auth";

async function getSession(req: Request) {
  const token = readCookieFromRequest(req);
  if (!token) return null;
  try {
    return await verifySession(token);
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const s: any = await getSession(request);
    if (!s) return NextResponse.json({ error: "forbidden", detail: "no_session" }, { status: 403 });

    // Si empresaId falta en token, lo buscamos en DB
    let empresaId = Number(s.empresaId || 0);
    if (!empresaId) {
      const u = await prisma.user.findUnique({
        where: { id: Number(s.userId) },
        select: { empresaId: true, role: true },
      });
      empresaId = Number(u?.empresaId || 0);
      s.empresaId = empresaId;
      s.role = s.role || u?.role;
    }

    const role = String(s.role || "");
    if (role !== "ADMIN" && role !== "SUPERADMIN") {
      return NextResponse.json({ error: "forbidden", detail: "role_not_admin", role }, { status: 403 });
    }

    const where = role === "SUPERADMIN" ? {} : { empresaId: Number(s.empresaId) };

    const users = await prisma.user.findMany({
      where,
      select: { id: true, email: true, role: true, createdAt: true, empresaId: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
  } catch (err: any) {
    console.error("ADMIN USERS GET ERROR:", err?.stack || err);
    return NextResponse.json(
      { error: "server_error", detail: String(err?.message || err) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const s: any = await getSession(request);
    if (!s) return NextResponse.json({ error: "forbidden", detail: "no_session" }, { status: 403 });

    let empresaId = Number(s.empresaId || 0);
    if (!empresaId) {
      const u = await prisma.user.findUnique({ where: { id: Number(s.userId) }, select: { empresaId: true, role: true } });
      empresaId = Number(u?.empresaId || 0);
      s.empresaId = empresaId;
      s.role = s.role || u?.role;
    }

    const roleMe = String(s.role || "");
    if (roleMe !== "ADMIN" && roleMe !== "SUPERADMIN") {
      return NextResponse.json({ error: "forbidden", detail: "role_not_admin", role: roleMe }, { status: 403 });
    }

    const body = await request.json();
    const email = String(body?.email || "").trim();
    const password = String(body?.password || "");
    const roleIn = String(body?.role || "USER").toUpperCase();
    const role = roleIn === "ADMIN" ? "ADMIN" : roleIn === "SUPERADMIN" ? "SUPERADMIN" : "USER";

    if (!email || !password) return NextResponse.json({ error: "email_y_password_requeridos" }, { status: 400 });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: "email_ya_existe" }, { status: 409 });

    let empresaDest = Number(s.empresaId);
    if (roleMe === "SUPERADMIN" && body?.empresaId) empresaDest = Number(body.empresaId);

    const user = await prisma.user.create({
      data: { email, password, role, empresaId: empresaDest },
      select: { id: true, email: true, role: true, createdAt: true, empresaId: true },
    });

    return NextResponse.json(user);
  } catch (err: any) {
    console.error("ADMIN USERS POST ERROR:", err?.stack || err);
    return NextResponse.json(
      { error: "server_error", detail: String(err?.message || err) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const s: any = await getSession(request);
    if (!s) return NextResponse.json({ error: "forbidden", detail: "no_session" }, { status: 403 });

    let empresaId = Number(s.empresaId || 0);
    if (!empresaId) {
      const u = await prisma.user.findUnique({ where: { id: Number(s.userId) }, select: { empresaId: true, role: true } });
      empresaId = Number(u?.empresaId || 0);
      s.empresaId = empresaId;
      s.role = s.role || u?.role;
    }

    const roleMe = String(s.role || "");
    if (roleMe !== "ADMIN" && roleMe !== "SUPERADMIN") {
      return NextResponse.json({ error: "forbidden", detail: "role_not_admin", role: roleMe }, { status: 403 });
    }

    const body = await request.json();
    const id = Number(body?.id);
    const roleIn = body?.role ? String(body.role).toUpperCase() : null;
    const password = body?.password ? String(body.password) : null;

    if (!id) return NextResponse.json({ error: "id_requerido" }, { status: 400 });

    if (roleMe === "ADMIN") {
      const target = await prisma.user.findFirst({ where: { id, empresaId: Number(s.empresaId) } });
      if (!target) return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const data: any = {};
    if (roleIn) data.role = roleIn === "SUPERADMIN" ? "SUPERADMIN" : (roleIn === "ADMIN" ? "ADMIN" : "USER");
    if (password) data.password = password;

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, role: true, createdAt: true, empresaId: true },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("ADMIN USERS PATCH ERROR:", err?.stack || err);
    return NextResponse.json(
      { error: "server_error", detail: String(err?.message || err) },
      { status: 500 }
    );
  }
}
