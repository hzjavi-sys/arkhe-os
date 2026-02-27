"use client";
import React, { useEffect, useState } from "react";
import AppShell from "../../components/arkhe/AppShell";

export default function HomePage() {
  const [me, setMe] = useState<{ email: string; role: "ADMIN" | "USER" } | null>(null);

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setMe)
      .catch(() => setMe(null));
  }, []);

  return (
    <AppShell>
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <div style={{ fontSize: 24, fontWeight: 900 }}>Home</div>
        <div style={{ color: "#64748b", fontWeight: 800 }}>
          {me ? `${me.email} (${me.role})` : ""}
        </div>
      </div>

      <div style={{ marginTop: 14, color: "#334155", fontWeight: 700 }}>
        Accesos rápidos (los submenús los armamos después).
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
        <a href="/" style={chip}>Proyectos</a>
        <a href="/notas" style={chip}>Notas</a>
        <a href="/admin/users" style={chip}>Admin Usuarios</a>
        <a href="/admin/empresas" style={chip}>Admin Empresas</a>
      </div>
    </AppShell>
  );
}

const chip: React.CSSProperties = {
  display: "inline-block",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(15,23,42,0.12)",
  background: "rgba(255,255,255,0.75)",
  textDecoration: "none",
  color: "#0f172a",
  fontWeight: 900
};
