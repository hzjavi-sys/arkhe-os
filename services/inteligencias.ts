import fs from "fs";
import path from "path";

export type Item = {
  id: string;
  slug: string;
  nombre: string;
  categoria?: string;
  descripcion?: string;
  funciones?: string[];
  herramientas?: string[];
  tags?: string[];
};

let cache: Item[] | null = null;

function loadCatalog(): Item[] {
  const p = path.join(process.cwd(), "data", "profesiones_catalogo.json");
  if (!fs.existsSync(p)) return [];
  const j = JSON.parse(fs.readFileSync(p, "utf-8"));
  const items: any[] = Array.isArray(j?.items) ? j.items : (Array.isArray(j) ? j : []);
  return items as Item[];
}

export function getLista(): Item[] {
  if (!cache) cache = loadCatalog();
  return cache;
}

export function getDetallePorNombre(nombre: string): Item | null {
  const n = String(nombre || "").trim().toLowerCase();
  return getLista().find((x) => String(x?.nombre || "").trim().toLowerCase() === n) || null;
}

export function getDetallePorSlug(slug: string): Item | null {
  const s = String(slug || "").trim().toLowerCase();
  return getLista().find((x) => String(x?.slug || x?.id || "").trim().toLowerCase() === s) || null;
}
