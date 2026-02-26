import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readCookieFromRequest, verifySession } from "@/lib/auth";

async function getSession(req: Request) {
  const token = readCookieFromRequest(req);
  if (!token) return null;
  try { return await verifySession(token); } catch { return null; }
}

async function getEmpresaId(session: any) {
  let empresaId = Number(session?.empresaId || 0);
  if (!empresaId) {
    const u = await prisma.user.findUnique({
      where: { id: Number(session.userId) },
      select: { empresaId: true },
    });
    empresaId = Number(u?.empresaId || 0);
  }
  return empresaId;
}

export async function GET(request: Request) {
  const s: any = await getSession(request);
  if (!s) return NextResponse.json({ error: "no_auth" }, { status: 401 });

  const empresaId = await getEmpresaId(s);

  const apps = await prisma.app.findMany({
    where: { empresaId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(apps);
}

export async function POST(request: Request) {
  const s: any = await getSession(request);
  if (!s) return NextResponse.json({ error: "no_auth" }, { status: 401 });

  const empresaId = await getEmpresaId(s);

  const body = await request.json();
  const nombre = String(body?.nombre || "").trim();
  const tipo = String(body?.tipo || "web").trim();

  if (!nombre) return NextResponse.json({ error: "nombre_requerido" }, { status: 400 });

  const app = await prisma.app.create({
    data: {
      nombre,
      tipo,
      estado: "draft",
      ownerId: Number(s.userId),
      empresaId,
    },
  });

  return NextResponse.json(app);
}

export async function PATCH(request: Request) {
  const s: any = await getSession(request);
  if (!s) return NextResponse.json({ error: "no_auth" }, { status: 401 });

  const empresaId = await getEmpresaId(s);

  const body = await request.json();
  const id = Number(body?.id);
  if (!id) return NextResponse.json({ error: "id_requerido" }, { status: 400 });

  // solo dentro de la empresa
  const data: any = {};
  if (body?.nombre) data.nombre = String(body.nombre).trim();
  if (body?.tipo) data.tipo = String(body.tipo).trim();
  if (body?.estado) data.estado = String(body.estado).trim();

  const updated = await prisma.app.updateMany({
    where: { id, empresaId },
    data,
  });

  if (updated.count === 0) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const s: any = await getSession(request);
  if (!s) return NextResponse.json({ error: "no_auth" }, { status: 401 });

  const empresaId = await getEmpresaId(s);

  const body = await request.json();
  const id = Number(body?.id);
  if (!id) return NextResponse.json({ error: "id_requerido" }, { status: 400 });

  const deleted = await prisma.app.deleteMany({ where: { id, empresaId } });
  if (deleted.count === 0) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
