import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const proyectos = await prisma.proyecto.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, nombre: true, createdAt: true },
  });
  return NextResponse.json(proyectos);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const nombre = String(body?.nombre || "").trim();
  if (!nombre) return NextResponse.json({ error: "nombre_requerido" }, { status: 400 });

  const nuevo = await prisma.proyecto.create({
    data: { nombre },
    select: { id: true, nombre: true, createdAt: true },
  });
  return NextResponse.json(nuevo);
}

export async function DELETE(request: Request) {
  const body = await request.json().catch(() => ({}));
  const id = Number(body?.id);
  if (!id) return NextResponse.json({ error: "id_requerido" }, { status: 400 });

  await prisma.proyecto.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
