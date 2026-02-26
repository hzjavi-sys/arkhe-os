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
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "no_auth" }, { status: 401 });

  // 👇 Aislamiento por empresa
  const empresaId = Number((session as any).empresaId ?? 0);
  if (!empresaId) return NextResponse.json({ error: "no_empresa" }, { status: 400 });

  // ADMIN ve todo dentro de su empresa, USER solo lo suyo dentro de su empresa
  const where =
    session.role === "ADMIN"
      ? { empresaId }
      : { empresaId, ownerId: session.userId };

  const proyectos = await prisma.proyecto.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(proyectos);
}

export async function POST(request: Request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "no_auth" }, { status: 401 });

  const empresaId = Number((session as any).empresaId ?? 0);
  if (!empresaId) return NextResponse.json({ error: "no_empresa" }, { status: 400 });

  const body = await request.json();
  const nombre = String(body?.nombre || "").trim();
  if (!nombre) return NextResponse.json({ error: "nombre_requerido" }, { status: 400 });

  let ownerId = session.userId;

  // ADMIN puede crear para otro por email, pero siempre dentro de su empresa
  const ownerEmail = body?.ownerEmail ? String(body.ownerEmail).trim() : "";
  if (ownerEmail) {
    if (session.role !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });

    const u = await prisma.user.findFirst({
      where: { email: ownerEmail, empresaId },
    });
    if (!u) return NextResponse.json({ error: "owner_not_found_in_empresa" }, { status: 404 });

    ownerId = u.id;
  }

  const nuevo = await prisma.proyecto.create({
    data: { nombre, ownerId, empresaId },
  });

  return NextResponse.json(nuevo);
}

export async function DELETE(request: Request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "no_auth" }, { status: 401 });

  const empresaId = Number((session as any).empresaId ?? 0);
  if (!empresaId) return NextResponse.json({ error: "no_empresa" }, { status: 400 });

  const body = await request.json();
  const id = Number(body?.id);
  if (!id) return NextResponse.json({ error: "id_requerido" }, { status: 400 });

  if (session.role === "ADMIN") {
    // ADMIN borra cualquiera, pero solo dentro de su empresa
    const deleted = await prisma.proyecto.deleteMany({ where: { id, empresaId } });
    if (deleted.count === 0) return NextResponse.json({ error: "not_found" }, { status: 404 });
  } else {
    // USER solo borra lo suyo dentro de su empresa
    const deleted = await prisma.proyecto.deleteMany({
      where: { id, empresaId, ownerId: session.userId },
    });
    if (deleted.count === 0) return NextResponse.json({ error: "no_permission" }, { status: 403 });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "no_auth" }, { status: 401 });

  const empresaId = Number((session as any).empresaId ?? 0);
  if (!empresaId) return NextResponse.json({ error: "no_empresa" }, { status: 400 });

  const body = await request.json();
  const id = Number(body?.id);
  const nombre = String(body?.nombre || "").trim();
  if (!id) return NextResponse.json({ error: "id_requerido" }, { status: 400 });
  if (!nombre) return NextResponse.json({ error: "nombre_requerido" }, { status: 400 });

  if (session.role === "ADMIN") {
    const updated = await prisma.proyecto.updateMany({
      where: { id, empresaId },
      data: { nombre },
    });
    if (updated.count === 0) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } else {
    const updated = await prisma.proyecto.updateMany({
      where: { id, empresaId, ownerId: session.userId },
      data: { nombre },
    });
    if (updated.count === 0) return NextResponse.json({ error: "no_permission" }, { status: 403 });
    return NextResponse.json({ ok: true });
  }
}
