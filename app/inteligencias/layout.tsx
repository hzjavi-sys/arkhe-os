"use client";
import React from "react";
import { usePathname } from "next/navigation";
import AppShell from "../../components/arkhe/AppShell";
import InteligenciasTabs from "../../components/arkhe/InteligenciasTabs";
import { BEACH } from "../../components/diseno/theme";

function activeFromPath(p: string) {
  if (p.startsWith("/inteligencias/legal")) return "legal";
  if (p.startsWith("/inteligencias/ia")) return "ia";
  if (p.startsWith("/inteligencias/agente")) return "agente";
  if (p.startsWith("/inteligencias/lenguajes")) return "lenguajes";
  return "profesiones";
}

export default function InteligenciasLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const active = activeFromPath(pathname) as any;

  return (
    <AppShell title="Inteligencias">
      <div
        style={{
          borderRadius: 22,
          background: BEACH.glassBg,
          border: BEACH.glassBorder,
          boxShadow: BEACH.shadow,
          padding: 18,
          backdropFilter: `blur(${BEACH.blurPx}px)`,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 950, color: BEACH.text }}>Inteligencias</div>
        <div style={{ marginTop: 4, color: BEACH.muted, fontWeight: 700 }}>Panel</div>

        <div style={{ marginTop: 14 }}>
          <InteligenciasTabs active={active} />
        </div>

        <div style={{ marginTop: 16 }}>{children}</div>
      </div>
    </AppShell>
  );
}
