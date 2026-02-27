"use client";

import React, { useMemo, useState } from "react";
import AppShell from "../../components/arkhe/AppShell";
import { profesiones } from "../../lib/profesiones";

type Detalle = {
  ok: boolean;
  nombre: string;
  categoria?: string | null;
  descripcion?: string | null;
  herramientas?: string[];
  funciones?: string[];
};

export default function InteligenciasPage() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [detalle, setDetalle] = useState<Detalle | null>(null);
  const [loading, setLoading] = useState(false);

  const lista = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return profesiones;
    return profesiones.filter((p) => p.toLowerCase().includes(qq));
  }, [q]);

  async function abrir(nombre: string) {
    setOpen(true);
    setLoading(true);
    setDetalle(null);
    try {
      // ✅ usamos QUERY porque funciona con tildes/espacios seguro
      const r = await fetch(`/api/inteligencias?nombre=${encodeURIComponent(nombre)}`, { cache: "no-store" });
      const j = await r.json();
      setDetalle(j);
    } catch {
      setDetalle({ ok: false, nombre, descripcion: "Error de red" } as any);
    } finally {
      setLoading(false);
    }
  }

  const cardStyle: React.CSSProperties = {
    borderRadius: 14,
    padding: 14,
    background: "rgba(255,255,255,0.96)",
    border: "1px solid rgba(15,23,42,0.10)",
    boxShadow: "0 10px 30px rgba(2,6,23,0.08)",
    color: "#0f172a",
    cursor: "pointer",
    textAlign: "left",
  };

  return (
    <AppShell title="Inteligencias">
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#0f172a" }}>
          Profesiones ({lista.length})
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar profesión..."
          style={{
            flex: "1 1 320px",
            maxWidth: 560,
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid rgba(15,23,42,0.18)",
            background: "rgba(255,255,255,0.95)",
            outline: "none",
            fontSize: 16,
            color: "#0f172a",
          }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
        {lista.map((p, idx) => (
          <button key={`${p}-${idx}`} style={cardStyle} onClick={() => abrir(p)}>
            <div style={{ fontWeight: 950, fontSize: 16, lineHeight: 1.2 }}>{p}</div>
            <div style={{ marginTop: 6, fontSize: 13, opacity: 0.72 }}>
              Click para ver qué sabe hacer.
            </div>
          </button>
        ))}
      </div>

      {/* Panel lateral */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2,6,23,0.35)",
            display: "flex",
            justifyContent: "flex-end",
            zIndex: 200,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 520,
              maxWidth: "92vw",
              height: "100vh",
              background: "rgba(255,255,255,0.95)",
              borderLeft: "1px solid rgba(0,0,0,0.10)",
              padding: 18,
              overflow: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{
                width: 420,
                maxWidth: "92vw",
                height: "100%",
                overflow: "auto",
                background: "rgba(255,255,255,0.98)",
                color: "#0f172a",
                borderLeft: "1px solid rgba(15,23,42,0.12)",
                boxShadow: "-20px 0 60px rgba(2,6,23,0.18)",
                backdropFilter: "blur(8px)",
              }}>
              <div style={{ color: "#0f172a" }}>
Detalle
              </div>
</div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "rgba(255,255,255,0.9)",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Cerrar
              </button>
            </div>

            {loading && <div style={{ marginTop: 14 }}>Cargando…</div>}

            {!loading && detalle && detalle.ok && (
              <>
                <div style={{ marginTop: 14, fontSize: 22, fontWeight: 950 }}>{detalle.nombre}</div>
                <div style={{ marginTop: 6, color: "#475569", fontWeight: 700 }}>
                  Categoría: <b>{detalle.categoria || "—"}</b>
                </div>

                {detalle.descripcion && (
                  <div style={{ marginTop: 12, lineHeight: 1.4 }}>{detalle.descripcion}</div>
                )}

                <div style={{ marginTop: 16, fontWeight: 950 }}>Funciones</div>
                <div style={{ marginTop: 8 }}>
                  {(detalle.funciones || []).length === 0 ? (
                    <div style={{ color: "#64748b" }}>Todavía vacías. Ahora cargamos las 5 profesiones completas.</div>
                  ) : (
                    (detalle.funciones || []).map((f) => (
                      <div key={f} style={{ padding: "6px 0", fontWeight: 800 }}>{f}</div>
                    ))
                  )}
                </div>

                <div style={{ marginTop: 16, fontWeight: 950 }}>Herramientas</div>
                <div style={{ marginTop: 8 }}>
                  {(detalle.herramientas || []).length === 0 ? (
                    <div style={{ color: "#64748b" }}>Todavía vacío.</div>
                  ) : (
                    (detalle.herramientas || []).map((h) => (
                      <div key={h} style={{ padding: "6px 0", fontWeight: 800 }}>{h}</div>
                    ))
                  )}
                </div>
              </>
            )}

            {!loading && detalle && !detalle.ok && (
              <div style={{ marginTop: 14, color: "#b91c1c", fontWeight: 900 }}>
                Error: no encontrado o error de red.
              </div>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
