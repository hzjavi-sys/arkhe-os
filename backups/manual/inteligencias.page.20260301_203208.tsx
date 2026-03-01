"use client";

import React, { useEffect, useMemo, useState } from "react";
import AppShell from "../../components/arkhe/AppShell";
import InteligenciasTabs from "../../components/arkhe/InteligenciasTabs";

type Item = { id: string; slug: string; nombre: string; categoria?: string; tags?: string[] };

type Detalle = {
  ok: boolean;
  id?: string;
  slug?: string;
  nombre: string;
  categoria?: string;
  descripcion?: string;
  funciones?: string[];
  herramientas?: string[];
  tags?: string[];
};

export default function InteligenciasPage() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detalle, setDetalle] = useState<Detalle | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/inteligencias", { cache: "no-store" });
        const j = await r.json();
        const list: any[] = Array.isArray(j) ? j : (Array.isArray(j?.items) ? j.items : []);
        setItems(list as Item[]);
      } catch (e) {
        console.error("LOAD_INTELIGENCIAS_ERROR", e);
        setItems([]);
      }
    })();
  }, []);

  const filtradas = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return items;
    return items.filter((p) => (p.nombre || "").toLowerCase().includes(qq));
  }, [q, items]);

  async function abrir(p: Item) {
    setOpen(true);
    setLoading(true);
    setDetalle(null);
    try {
      // ✅ usamos ?nombre= porque es lo más robusto (tildes/espacios)
      const url = `/api/inteligencias?nombre=${encodeURIComponent(p.nombre)}`;
      const r = await fetch(url, { cache: "no-store" });
      const j = await r.json();
      setDetalle(j);
    } catch {
      setDetalle({ ok: false, nombre: p.nombre, descripcion: "Error de red." });
    } finally {
      setLoading(false);
    }
  }

  const cardStyle: React.CSSProperties = {
    borderRadius: 14,
    padding: 14,
    background: "rgba(255,255,255,0.90)",
    border: "1px solid rgba(15,23,42,0.10)",
    boxShadow: "0 10px 30px rgba(2,6,23,0.10)",
    color: "#0f172a",
    cursor: "pointer",
    textAlign: "left",
  };

  return (
    <AppShell title="Inteligencias">
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 18, fontWeight: 950, color: "#0f172a" }}>Panel</div>
        <InteligenciasTabs active="profesiones" />
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginTop: 14 }}>
        <div style={{ fontSize: 18, fontWeight: 950, color: "#0f172a" }}>
          Profesiones ({filtradas.length})
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar profesión..."
          style={{
            flex: "1 1 320px",
            maxWidth: 520,
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(15,23,42,0.15)",
            background: "rgba(255,255,255,0.95)",
            outline: "none",
            fontWeight: 700,
          }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(260px, 1fr))", gap: 12, marginTop: 12 }}>
        {filtradas.map((p) => (
          <div key={p.id} style={cardStyle} onClick={() => abrir(p)}>
            <div style={{ fontWeight: 950 }}>{p.nombre}</div>
            <div style={{ marginTop: 6, color: "#334155", fontWeight: 800, fontSize: 13 }}>
              {p.categoria || "Varios"}
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(2,6,23,0.35)", display: "flex", justifyContent: "flex-end", zIndex: 200 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 520,
              maxWidth: "92vw",
              height: "100vh",
              background: "rgba(255,255,255,0.96)",
              borderLeft: "1px solid rgba(0,0,0,0.10)",
              padding: 18,
              overflow: "auto",
              color: "#0f172a",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 950, fontSize: 18 }}>Detalle</div>
              <button
                onClick={() => setOpen(false)}
                style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.12)", background: "rgba(255,255,255,0.9)", fontWeight: 900, cursor: "pointer" }}
              >
                Cerrar
              </button>
            </div>

            {loading && <div style={{ marginTop: 14 }}>Cargando…</div>}

            {!loading && detalle?.ok && (
              <>
                <div style={{ marginTop: 14, fontSize: 22, fontWeight: 950 }}>{detalle.nombre}</div>
                <div style={{ marginTop: 6, color: "#475569", fontWeight: 800 }}>
                  Categoría: <b>{detalle.categoria || "—"}</b>
                </div>

                <div style={{ marginTop: 16, fontWeight: 950 }}>Funciones</div>
                <div style={{ marginTop: 8 }}>
                  {(detalle.funciones || []).length === 0 ? (
                    <div style={{ color: "#64748b" }}>Todavía vacío.</div>
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
