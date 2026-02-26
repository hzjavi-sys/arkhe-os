import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readCookieFromRequest, verifySession } from "@/lib/auth";

async function getSessionWithEmpresa(req: Request) {
  const token = readCookieFromRequest(req);
  if (!token) return null;

  try {
    const s: any = await verifySession(token);

    // Completar empresaId desde DB si falta
    let empresaId = Number(s.empresaId || 0);
    if (!empresaId) {
      const u = await prisma.user.findUnique({
        where: { id: Number(s.userId) },
        select: { empresaId: true, role: true, email: true },
      });
      empresaId = Number(u?.empresaId || 0);
      // mantener role/email desde token si existen
      s.empresaId = empresaId;
    }

    return s;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const s = await getSessionWithEmpresa(request);
  if (!s) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  if (s.role !== "ADMIN" && s.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const where = s.role === "SUPERADMIN" ? {} : { empresaId: Number(s.empresaId) };

  const users = await prisma.user.findMany({
    where,
    select: { id: true, email: true, role: true, createdAt: true, empresaId: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const s = await getSessionWithEmpresa(request);
  if (!s) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  if (s.role !== "ADMIN" && s.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const email = String(body?.email || "").trim();
  const password = String(body?.password || "");
  const role = (String(body?.role || "USER").toUpperCase() === "ADMIN") ? "ADMIN" : "USER";

  if (!email || !password) return NextResponse.json({ error: "email_y_password_requeridos" }, { status: 400 });

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "email_ya_existe" }, { status: 409 });

  let empresaId = Number(s.empresaId);
  if (s.role === "SUPERADMIN" && body?.empresaId) empresaId = Number(body.empresaId);

  const user = await prisma.user.create({
    data: { email, password, role, empresaId },
    select: { id: true, email: true, role: true, createdAt: true, empresaId: true },
  });

  return NextResponse.json(user);
}

export async function PATCH(request: Request) {
  const s = await getSessionWithEmpresa(request);
  if (!s) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  if (s.role !== "ADMIN" && s.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const id = Number(body?.id);
  const role = body?.role ? String(body.role).toUpperCase() : null;
  const password = body?.password ? String(body.password) : null;

  if (!id) return NextResponse.json({ error: "id_requerido" }, { status: 400 });

  if (s.role === "ADMIN") {
    const target = await prisma.user.findFirst({ where: { id, empresaId: Number(s.empresaId) } });
    if (!target) return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const data: any = {};
  if (role) data.role = role === "SUPERADMIN" ? "SUPERADMIN" : (role === "ADMIN" ? "ADMIN" : "USER");
  if (password) data.password = password;

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, role: true, createdAt: true, empresaId: true },
  });

  return NextResponse.json(updated);
}
