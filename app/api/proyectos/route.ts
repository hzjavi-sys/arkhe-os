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

  // ADMIN ve todo, USER solo lo suyo
  const where = session.role === "ADMIN" ? {} : { ownerId: session.userId };

  const proyectos = await prisma.proyecto.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(proyectos);
}

export async function POST(request: Request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "no_auth" }, { status: 401 });

  const body = await request.json();
  const nombre = String(body?.nombre || "").trim();
  if (!nombre) return NextResponse.json({ error: "nombre_requerido" }, { status: 400 });

  // Por defecto, siempre crea para el usuario logueado.
  // (Más adelante: si ADMIN, permitir ownerId opcional.)
  const nuevo = await prisma.proyecto.create({
    data: { nombre, ownerId: session.userId },
  });

  return NextResponse.json(nuevo);
}

export async function DELETE(request: Request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "no_auth" }, { status: 401 });

  const body = await request.json();
  const id = Number(body?.id);
  if (!id) return NextResponse.json({ error: "id_requerido" }, { status: 400 });

  if (session.role === "ADMIN") {
    await prisma.proyecto.delete({ where: { id } });
  } else {
    // USER solo borra lo suyo
    const deleted = await prisma.proyecto.deleteMany({
      where: { id, ownerId: session.userId },
    });
    if (deleted.count === 0) {
      return NextResponse.json({ error: "no_permission" }, { status: 403 });
    }
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "no_auth" }, { status: 401 });

  const body = await request.json();
  const id = Number(body?.id);
  const nombre = String(body?.nombre || "").trim();
  if (!id) return NextResponse.json({ error: "id_requerido" }, { status: 400 });
  if (!nombre) return NextResponse.json({ error: "nombre_requerido" }, { status: 400 });

  if (session.role === "ADMIN") {
    const actualizado = await prisma.proyecto.update({ where: { id }, data: { nombre } });
    return NextResponse.json(actualizado);
  } else {
    const updated = await prisma.proyecto.updateMany({
      where: { id, ownerId: session.userId },
      data: { nombre },
    });
    if (updated.count === 0) {
      return NextResponse.json({ error: "no_permission" }, { status: 403 });
    }
    return NextResponse.json({ ok: true });
  }
}
