"use client";
import React from "react";
import AppShell from "../../../components/arkhe/AppShell";
import InteligenciasTabs from "../../../components/arkhe/InteligenciasTabs";

export default function InteligenciaLegalPage() {
  return (
    <AppShell title="Inteligencias">
      <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", marginBottom: 6 }}>Panel</div>
      <InteligenciasTabs active="/inteligencias/legal" />
      <div style={{
        borderRadius: 18,
        padding: 18,
        background: "rgba(255,255,255,0.88)",
        border: "1px solid rgba(15,23,42,0.10)",
        boxShadow: "0 14px 40px rgba(2,6,23,0.10)",
        color: "#0f172a",
      }}>
        <div style={{ fontSize: 18, fontWeight: 950 }}>⚖️ Inteligencia Legal</div>
        <div style={{ marginTop: 6, color: "#334155", fontWeight: 700 }}>
          Base lista. Próximo: Derecho por rama + leyes por país + plantillas + checklist.
        </div>
      </div>
    </AppShell>
  );
}
