import { NextResponse } from "next/server";

function norm(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
}

const FALLBACK: { nombre: string; categoria?: string }[] = [
  { nombre: "Contador público", categoria: "Empresa / Finanzas" },
  { nombre: "Abogado", categoria: "Derecho" },
  { nombre: "Médico", categoria: "Salud" },
];

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const decoded = decodeURIComponent(slug || "");

  const found = FALLBACK.find((x) => norm(x.nombre) === norm(decoded));
  if (!found) return NextResponse.json({ ok: false, error: "not_found", slug: decoded }, { status: 404 });

  return NextResponse.json({
    ok: true,
    nombre: found.nombre,
    categoria: found.categoria || null,
    descripcion: `Integración lista para conectar al “Cerebro”: ${found.nombre}.`,
    herramientas: [],
    funciones: [],
  });
}
