"use client";
import React from "react";
import AppShell from "../../../components/arkhe/AppShell";

export default function AgentePage() {
  return (
    <AppShell title="Inteligencias">
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 18, fontWeight: 950, color: "#0f172a" }}>Panel</div>
        </div>

      <div style={{ marginTop: 14, borderRadius: 16, background: "rgba(255,255,255,0.90)", border: "1px solid rgba(15,23,42,0.10)", padding: 18 }}>
        <div style={{ fontWeight: 950, fontSize: 18 }}>🧠 Agente (Gente)</div>
        <div style={{ marginTop: 8, color: "#334155", fontWeight: 700 }}>
          Base lista. Próximo: wizard de creación de proyecto + director + dock inferior del proyecto activo.
        </div>
      </div>
    </AppShell>
  );
}
