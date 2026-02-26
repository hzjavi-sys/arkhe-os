import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readCookieFromRequest, verifySession } from "@/lib/auth";

async function getSession(req: Request) {
  const token = readCookieFromRequest(req);
  if (!token) return null;
  try { return await verifySession(token); } catch { return null; }
}

async function empresaIdFromSession(s: any) {
  let empresaId = Number(s?.empresaId || 0);
  if (!empresaId) {
    const u = await prisma.user.findUnique({ where: { id: Number(s.userId) }, select: { empresaId: true } });
    empresaId = Number(u?.empresaId || 0);
  }
  return empresaId;
}

export async function GET(request: Request) {
  const s: any = await getSession(request);
  if (!s) return NextResponse.json({ error: "no_auth" }, { status: 401 });
  const empresaId = await empresaIdFromSession(s);

  const notas = await prisma.nota.findMany({
    where: { empresaId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(notas);
}

export async function POST(request: Request) {
  const s: any = await getSession(request);
  if (!s) return NextResponse.json({ error: "no_auth" }, { status: 401 });
  const empresaId = await empresaIdFromSession(s);

  const body = await request.json();
  const titulo = String(body?.titulo || "").trim();
  const contenido = String(body?.contenido || "").trim();
  if (!titulo) return NextResponse.json({ error: "titulo_requerido" }, { status: 400 });

  const nota = await prisma.nota.create({ data: { titulo, contenido, empresaId } });
  return NextResponse.json(nota);
}

export async function DELETE(request: Request) {
  const s: any = await getSession(request);
  if (!s) return NextResponse.json({ error: "no_auth" }, { status: 401 });
  const empresaId = await empresaIdFromSession(s);

  const body = await request.json();
  const id = Number(body?.id);
  if (!id) return NextResponse.json({ error: "id_requerido" }, { status: 400 });

  const n = await prisma.nota.findUnique({ where: { id } });
  if (!n) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (n.empresaId !== empresaId) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  await prisma.nota.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
