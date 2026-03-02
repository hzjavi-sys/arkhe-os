import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const p = path.join(process.cwd(), "data", "legal", "uruguay", "uruguay_full.json");
    const raw = fs.readFileSync(p, "utf-8");
    const j = JSON.parse(raw);
    return NextResponse.json({ ok: true, ...j });
  } catch (e: any) {
    const msg = String(e?.message || e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
