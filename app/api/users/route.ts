import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "../../../services/jwt";

async function requireAdminAndEmpresa() {
  const store = await cookies();
  const token = store.get("arkhe_jwt")?.value;
  if (!token) throw new Error("UNAUTHENTICATED");

  const payload: any = await verifyJwt(token);
  const userId = Number(payload?.sub || 0);
  if (!userId) throw new Error("UNAUTHENTICATED");

  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, empresaId: true },
  });

  if (!u) throw new Error("UNAUTHENTICATED");
  if (u.role !== "ADMIN") throw new Error("FORBIDDEN");

  return { empresaId: u.empresaId };
}

export async function GET() {
  try {
    const { empresaId } = await requireAdminAndEmpresa();

    const users = await prisma.user.findMany({
      where: { empresaId },
      select: { id: true, email: true, role: true, createdAt: true },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(users);
  } catch (e: any) {
    const msg = String(e?.message || e);
    const status = msg === "UNAUTHENTICATED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const { empresaId } = await requireAdminAndEmpresa();
    const body = await request.json();

    const email = String(body?.email || "").trim().toLowerCase();
    const pass = String(body?.pass || "");
    const roleIn = String(body?.role || "USER").trim().toUpperCase();
    const role = roleIn === "ADMIN" ? "ADMIN" : "USER";

    if (!email || !pass) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: "email_ya_existe" }, { status: 409 });

    const hash = await bcrypt.hash(pass, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hash,   // tu modelo usa password
        role,             // enum ADMIN/USER
        empresaId,        // requerido por schema
      },
      select: { id: true, email: true, role: true, createdAt: true },
    });

    return NextResponse.json(user);
  } catch (e: any) {
    const msg = String(e?.message || e);
    const status = msg === "UNAUTHENTICATED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
