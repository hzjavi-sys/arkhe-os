"use client";
import React, { useEffect, useMemo, useState } from "react";
import AppShell from "../../components/arkhe/AppShell";
import InteligenciasTabs from "../../components/arkhe/InteligenciasTabs";

type Item = {
  id: string;
  slug: string;
  nombre: string;
  categoria?: string;
  descripcion?: string;
  funciones?: string[];
  herramientas?: string[];
  tags?: string[];
};

type Detalle = { ok: boolean } & Partial<Item>;

export default function InteligenciasPage() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [detalle, setDetalle] = useState<Detalle | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/inteligencias", { cache: "no-store" });
        const j = await r.json();
        const arr: Item[] = Array.isArray(j) ? j : (Array.isArray(j?.items) ? j.items : []);
        setItems(arr);
      } catch (e) {
        console.error("LOAD_INTELIGENCIAS_LIST_ERROR", e);
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
      const r = await fetch(`/api/inteligencias/slug/${encodeURIComponent(p.slug || p.id)}`, { cache: "no-store" });
      const j = await r.json();
      setDetalle(j);
    } catch {
      setDetalle({ ok: false } as any);
    } finally {
      setLoading(false);
    }
  }

  const cardStyle: React.CSSProperties = {
    borderRadius: 14,
    padding: 14,
    background: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(15,23,42,0.10)",
    boxShadow: "0 10px 30px rgba(2,6,23,0.08)",
    color: "#0f172a",
    cursor: "pointer",
    textAlign: "left",
  };

  return (
    <AppShell title="Inteligencias">
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a" }}>Panel</div>
      </div>

      <InteligenciasTabs active="/inteligencias" />

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a" }}>
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
            background: "rgba(255,255,255,0.90)",
            outline: "none",
            fontWeight: 700,
          }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
        {filtradas.map((p) => (
          <div key={p.id} style={cardStyle} onClick={() => abrir(p)}>
            <div style={{ fontWeight: 950, fontSize: 13, letterSpacing: 0.2 }}>{p.nombre}</div>
            <div style={{ marginTop: 6, color: "#475569", fontWeight: 800, fontSize: 12 }}>
              {p.categoria || "—"}
            </div>
          </div>
        ))}
      </div>

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
              background: "rgba(255,255,255,0.96)",
              borderLeft: "1px solid rgba(0,0,0,0.10)",
              padding: 18,
              overflow: "auto",
              color: "#0f172a",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 950, fontSize: 18, color: "#0f172a" }}>Detalle</div>
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

            {!loading && detalle && (detalle as any).ok && (
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

            {!loading && detalle && !(detalle as any).ok && (
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
