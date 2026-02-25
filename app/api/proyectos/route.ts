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

  // DEFAULT: crea para el usuario logueado
  let ownerId = session.userId;

  // ADMIN puede crear para otro por email (ownerEmail)
  const ownerEmail = body?.ownerEmail ? String(body.ownerEmail).trim() : "";
  if (ownerEmail) {
    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const u = await prisma.user.findUnique({ where: { email: ownerEmail } });
    if (!u) return NextResponse.json({ error: "owner_not_found" }, { status: 404 });
    ownerId = u.id;
  }

  const nuevo = await prisma.proyecto.create({
    data: { nombre, ownerId },
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
    const deleted = await prisma.proyecto.deleteMany({
      where: { id, ownerId: session.userId },
    });
    if (deleted.count === 0) return NextResponse.json({ error: "no_permission" }, { status: 403 });
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
    if (updated.count === 0) return NextResponse.json({ error: "no_permission" }, { status: 403 });
    return NextResponse.json({ ok: true });
  }
}
