import { NextResponse } from "next/server";
import { readCookieFromRequest, verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const token = readCookieFromRequest(request);
  if (!token) return NextResponse.json({ error: "no_auth" }, { status: 401 });

  try {
    const session: any = await verifySession(token);

    // Si el token no trae empresaId, lo buscamos en DB
    let empresaId = Number(session.empresaId || 0);
    if (!empresaId) {
      const u = await prisma.user.findUnique({
        where: { id: Number(session.userId) },
        select: { empresaId: true },
      });
      empresaId = Number(u?.empresaId || 0);
    }

    return NextResponse.json({
      userId: Number(session.userId),
      email: String(session.email),
      role: String(session.role),
      empresaId,
    });
  } catch {
    return NextResponse.json({ error: "no_auth" }, { status: 401 });
  }
}
