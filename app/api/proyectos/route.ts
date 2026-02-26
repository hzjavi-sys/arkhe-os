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
  try {
    const s: any = await getSession(request);
    if (!s) return NextResponse.json({ error: "no_auth" }, { status: 401 });

    const url = new URL(request.url);
    const qEmpresaId = url.searchParams.get("empresaId");
    const myEmpresaId = await getEmpresaId(s);

    const role = String(s.role || "");
    const empresaId = (role === "SUPERADMIN" && qEmpresaId) ? Number(qEmpresaId) : myEmpresaId;

    const proyectos = await prisma.proyecto.findMany({
      where: { empresaId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(proyectos);
  } catch (err: any) {
    return NextResponse.json({ error: "GET_failed", detail: String(err?.message || err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const s: any = await getSession(request);
    if (!s) return NextResponse.json({ error: "no_auth" }, { status: 401 });

    const body = await request.json();
    const nombre = String(body?.nombre || "").trim();
    if (!nombre) return NextResponse.json({ error: "nombre_requerido" }, { status: 400 });

    const role = String(s.role || "");
    const myEmpresaId = await getEmpresaId(s);

    // SUPERADMIN puede crear en otra empresa si manda empresaId
    const empresaId = (role === "SUPERADMIN" && body?.empresaId) ? Number(body.empresaId) : myEmpresaId;

    // owner:
    // - USER/ADMIN: owner es él mismo
    // - ADMIN/SUPERADMIN: puede asignar por ownerEmail dentro de la misma empresa
    let ownerId = Number(s.userId);

    if ((role === "ADMIN" || role === "SUPERADMIN") && body?.ownerEmail) {
      const ownerEmail = String(body.ownerEmail).trim();
      const u = await prisma.user.findFirst({
        where: { email: ownerEmail, empresaId },
        select: { id: true },
      });
      if (!u) return NextResponse.json({ error: "ownerEmail_no_encontrado_en_empresa" }, { status: 400 });
      ownerId = u.id;
    }

    const nuevo = await prisma.proyecto.create({
      data: { nombre, ownerId, empresaId },
    });

    return NextResponse.json(nuevo);
  } catch (err: any) {
    return NextResponse.json({ error: "POST_failed", detail: String(err?.message || err) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const s: any = await getSession(request);
    if (!s) return NextResponse.json({ error: "no_auth" }, { status: 401 });

    const body = await request.json();
    const id = Number(body?.id);
    if (!id) return NextResponse.json({ error: "id_requerido" }, { status: 400 });

    const role = String(s.role || "");
    const myEmpresaId = await getEmpresaId(s);

    const p = await prisma.proyecto.findUnique({ where: { id } });
    if (!p) return NextResponse.json({ error: "not_found" }, { status: 404 });

    // Aislamiento: solo dentro de su empresa, salvo SUPERADMIN
    if (role !== "SUPERADMIN" && p.empresaId !== myEmpresaId) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    await prisma.proyecto.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: "DELETE_failed", detail: String(err?.message || err) }, { status: 500 });
  }
}
