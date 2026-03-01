import { NextResponse } from "next/server";
import { getLista } from "../../../../services/inteligencias";

function toKey(s: string) {
  return String(s || "").trim().toLowerCase();
}

function nameToSlug(nombre: string) {
  return toKey(nombre)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // saca tildes
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const s = toKey(params?.slug || "");
  const lista = getLista();

  const found =
    // 1) slug/id exacto
    lista.find((x: any) => toKey(x?.slug || x?.id || "") === s)
    // 2) slug generado desde nombre (fallback)
    || lista.find((x: any) => nameToSlug(String(x?.nombre || "")) === s)
    // 3) nombre exacto (por si te pasan nombre por error)
    || lista.find((x: any) => toKey(String(x?.nombre || "")) === s)
    || null;

  if (!found) return NextResponse.json({ ok: false }, { status: 404 });
  return NextResponse.json({ ok: true, ...found });
}
