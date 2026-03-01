import { NextResponse } from "next/server";
import { getLista, getDetallePorNombre } from "../../../services/inteligencias";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const nombre = (url.searchParams.get("nombre") || "").trim();

  // Detalle por nombre (compat)
  if (nombre) {
    const found = getDetallePorNombre(nombre);
    if (!found) return NextResponse.json({ ok: false }, { status: 404 });
    return NextResponse.json({ ok: true, ...found });
  }

  // Lista
  const lista = getLista();
  return NextResponse.json(
    lista.map((p) => ({
      id: p.id,
      slug: p.slug,
      nombre: p.nombre,
      categoria: p.categoria || "",
      tags: p.tags || [],
    }))
  );
}
