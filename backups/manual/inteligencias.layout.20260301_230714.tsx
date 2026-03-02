"use client";

import React from "react";
import AppShell from "../../components/arkhe/AppShell";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function InteligenciasLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";

  const pill = (active: boolean): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 16px",
    borderRadius: 14,
    border: active ? "1px solid #0f172a" : "1px solid rgba(15,23,42,0.18)",
    background: active ? "#0f172a" : "rgba(255,255,255,0.92)",
    color: active ? "#fff" : "#0f172a",
    fontWeight: 900,
    textDecoration: "none",
    boxShadow: "0 10px 26px rgba(2,6,23,0.10)",
  });

  const is = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <AppShell title="Inteligencias">
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/inteligencias" style={pill(is("/inteligencias"))}>👥 Profesiones</Link>
          <Link href="/inteligencias/legal" style={pill(is("/inteligencias/legal"))}>📜 Legislación</Link>
          <Link href="/inteligencias/ia" style={pill(is("/inteligencias/ia"))}>🤖 IA Central</Link>
          <Link href="/inteligencias/agente" style={pill(is("/inteligencias/agente"))}>🧠 Agente</Link>
        </div>

        <div>{children}</div>
      </div>
    </AppShell>
  );
}
