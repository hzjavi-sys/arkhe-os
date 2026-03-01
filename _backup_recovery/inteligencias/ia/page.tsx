"use client";
import React from "react";
import AppShell from "../../../components/arkhe/AppShell";

export default function IACentralPage() {
  return (
    <AppShell title="IA Central">
      <div style={{ color: "#0f172a", fontWeight: 800, marginBottom: 10 }}>
        Base lista. Próximo: Director + planner + conectores (web/imagen/video/código).
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {["Director", "Chat", "Web", "Imagen", "Video", "Código"].map((x) => (
          <span
            key={x}
            style={{
              display: "inline-flex",
              padding: "10px 12px",
              borderRadius: 999,
              background: "rgba(15,23,42,0.06)",
              border: "1px solid rgba(15,23,42,0.12)",
              fontWeight: 900,
              color: "#0f172a",
            }}
          >
            {x}
          </span>
        ))}
      </div>

      <div style={{ marginTop: 14, color: "#334155" }}>
        (Acá vamos a conectar búsqueda web, generación de imágenes/video, y generación de código, sin tocar Profesional ni Legal.)
      </div>
    </AppShell>
  );
}
