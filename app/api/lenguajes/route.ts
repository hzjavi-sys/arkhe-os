import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const p = path.join(process.cwd(), "data", "lenguajes_catalogo.json");
    const j = JSON.parse(fs.readFileSync(p, "utf-8"));
    const items = Array.isArray(j?.items) ? j.items : [];
    return NextResponse.json({ ok: true, total: items.length, items });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: "read_failed", detail: String(e?.message || e) }, { status: 500 });
  }
}
