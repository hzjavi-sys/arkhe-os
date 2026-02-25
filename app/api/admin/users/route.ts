import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readCookieFromRequest, verifySession } from "@/lib/auth";

async function requireAdmin(req: Request) {
  const token = readCookieFromRequest(req);
  if (!token) return null;
  try {
    const session = await verifySession(token);
    if (session.role !== "ADMIN") return null;
    return session;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await request.json();
  const email = String(body?.email || "").trim();
  const password = String(body?.password || "");
  const role = (String(body?.role || "USER").toUpperCase() === "ADMIN") ? "ADMIN" : "USER";

  if (!email || !password) {
    return NextResponse.json({ error: "email_y_password_requeridos" }, { status: 400 });
  }

  // Evitar duplicados
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "email_ya_existe" }, { status: 409 });

  const user = await prisma.user.create({
    data: { email, password, role },
    select: { id: true, email: true, role: true, createdAt: true },
  });

  return NextResponse.json(user);
}

// PATCH: cambiar role y/o resetear password
export async function PATCH(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await request.json();
  const id = Number(body?.id);
  const role = body?.role ? String(body.role).toUpperCase() : null;
  const password = body?.password ? String(body.password) : null;

  if (!id) return NextResponse.json({ error: "id_requerido" }, { status: 400 });

  const data: any = {};
  if (role) data.role = (role === "ADMIN") ? "ADMIN" : "USER";
  if (password) data.password = password;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "nada_para_actualizar" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, role: true, createdAt: true },
  });

  return NextResponse.json(updated);
}
