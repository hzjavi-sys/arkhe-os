import { NextResponse } from "next/server";

export async function requirePermission() {
  return { ok: true };
}
