"use client";
import React from "react";
import AppShell from "../../../components/arkhe/AppShell";
import InteligenciasTabs from "../../../components/arkhe/InteligenciasTabs";

export default function IACentralPage() {
  return (
    <AppShell title="Inteligencias">
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 18, fontWeight: 950, color: "#0f172a" }}>Panel</div>
        <InteligenciasTabs active="ia" />
      </div>

      <div style={{ marginTop: 14, borderRadius: 16, background: "rgba(255,255,255,0.90)", border: "1px solid rgba(15,23,42,0.10)", padding: 18 }}>
        <div style={{ fontWeight: 950, fontSize: 18 }}>🤖 IA Central</div>
        <div style={{ marginTop: 8, color: "#334155", fontWeight: 700 }}>
          Base lista. Próximo: Director + planner (web/app/API/automatización) + conectores (web/imagen/video/código).
        </div>
      </div>
    </AppShell>
  );
}
