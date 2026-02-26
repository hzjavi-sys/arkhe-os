import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readCookieFromRequest, verifySession } from "@/lib/auth";

async function requireSuperAdmin(req: Request) {
  const token = readCookieFromRequest(req);
  if (!token) return null;
  try {
    const s: any = await verifySession(token);
    return s.role === "SUPERADMIN" ? s : null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const sa = await requireSuperAdmin(request);
  if (!sa) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const empresas = await prisma.empresa.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(empresas);
}

export async function POST(request: Request) {
  const sa = await requireSuperAdmin(request);
  if (!sa) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await request.json();
  const nombre = String(body?.nombre || "").trim();
  if (!nombre) return NextResponse.json({ error: "nombre_requerido" }, { status: 400 });

  const empresa = await prisma.empresa.create({ data: { nombre } });

  // Admin automático:
  // email: admin+<empresaId>@arkhe.com
  // password: 1234
  const adminEmail = `admin+${empresa.id}@arkhe.com`;
  const adminPassword = "1234";

  const admin = await prisma.user.create({
    data: { email: adminEmail, password: adminPassword, role: "ADMIN", empresaId: empresa.id },
    select: { id: true, email: true, role: true, empresaId: true },
  });

  return NextResponse.json({
    empresa,
    adminAuto: { email: admin.email, password: adminPassword, id: admin.id, role: admin.role, empresaId: admin.empresaId },
  });
}
