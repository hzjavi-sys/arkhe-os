"use client";

import React, { useEffect, useState } from "react";
import AppShell from "../../components/arkhe/AppShell";

type Nota = { id: number; titulo: string; contenido?: string | null; createdAt: string };

export default function NotasPage() {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [rows, setRows] = useState<Nota[]>([]);
  const [loading, setLoading] = useState(false);

  async function cargar() {
    setLoading(true);
    try {
      const r = await fetch("/api/notas", { cache: "no-store" });
      const data = r.ok ? await r.json() : [];
      setRows(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function crear() {
    if (!titulo.trim()) return;
    await fetch("/api/notas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, contenido }),
    });
    setTitulo("");
    setContenido("");
    await cargar();
  }

  async function borrar(id: number) {
    await fetch("/api/notas", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await cargar();
  }

  return (
    <AppShell title="Notas">
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10, marginBottom: 14 }}>
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título"
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            background: "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.10)",
            color: "#e5e7eb",
            outline: "none",
          }}
        />
        <textarea
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          placeholder="Contenido (opcional)"
          rows={4}
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            background: "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.10)",
            color: "#e5e7eb",
            outline: "none",
            resize: "vertical",
          }}
        />
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={crear}
            style={{
              background: "linear-gradient(90deg, rgba(59,130,246,.9), rgba(168,85,247,.9))",
              border: "none",
              color: "white",
              padding: "10px 14px",
              borderRadius: 12,
              cursor: "pointer",
              fontWeight: 900,
            }}
          >
            Crear
          </button>
          <button
            onClick={cargar}
            style={{
              background: "rgba(255,255,255,.06)",
              border: "1px solid rgba(255,255,255,.12)",
              color: "white",
              padding: "10px 14px",
              borderRadius: 12,
              cursor: "pointer",
              fontWeight: 900,
            }}
          >
            Actualizar
          </button>
          {loading ? <span style={{ opacity: 0.7 }}>Cargando…</span> : null}
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {rows.length === 0 ? (
          <div style={{ opacity: 0.8 }}>No hay notas todavía.</div>
        ) : (
          rows.map((n) => (
            <div
              key={n.id}
              style={{
                border: "1px solid rgba(255,255,255,.10)",
                borderRadius: 16,
                padding: 14,
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                background: "rgba(255,255,255,.03)",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 900 }}>{n.titulo}</div>
                {n.contenido ? (
                  <div style={{ opacity: 0.8, marginTop: 6, whiteSpace: "pre-wrap" }}>{n.contenido}</div>
                ) : null}
                <div style={{ opacity: 0.55, fontSize: 12, marginTop: 8 }}>
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => borrar(n.id)}
                style={{
                  background: "#ef4444",
                  border: "none",
                  color: "white",
                  padding: "10px 12px",
                  borderRadius: 12,
                  cursor: "pointer",
                  fontWeight: 900,
                  height: 42,
                  flexShrink: 0,
                }}
              >
                Borrar
              </button>
            </div>
          ))
        )}
      </div>
    </AppShell>
  );
}
