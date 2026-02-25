import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "../../../services/jwt";

async function requireAdmin() {
  const store = await cookies();
  const token = store.get("arkhe_jwt")?.value;
  if (!token) throw new Error("UNAUTHENTICATED");

  const payload = await verifyJwt(token);
  if (!payload?.sub) throw new Error("UNAUTHENTICATED");

  if ((payload.role || "user") !== "admin") throw new Error("FORBIDDEN");
  return payload;
}

export async function GET() {
  try {
    await requireAdmin();
    const users = await prisma.user.findMany({
      select: { id: true, username: true, role: true, createdAt: true },
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
    await requireAdmin();
    const body = await request.json();
    const username = String(body?.username || "").trim();
    const pass = String(body?.pass || "");
    const role = String(body?.role || "user");

    if (!username || !pass) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

    const exists = await prisma.user.findUnique({ where: { username } });
    if (exists) return NextResponse.json({ error: "username_ya_existe" }, { status: 409 });

    const hash = await bcrypt.hash(pass, 10);

    const user = await prisma.user.create({
      data: { username, passwordHash: hash, role: role === "admin" ? "admin" : "user" },
      select: { id: true, username: true, role: true, createdAt: true },
    });

    return NextResponse.json(user);
  } catch (e: any) {
    const msg = String(e?.message || e);
    const status = msg === "UNAUTHENTICATED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
