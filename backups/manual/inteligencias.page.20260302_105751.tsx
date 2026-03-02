"use client";

import React, { useEffect, useMemo, useState } from "react";

type Item = {
  id?: string;
  slug?: string;
  nombre: string;
  categoria?: string;
  tags?: string[];
};

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

  // Cargar lista desde API real
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("/api/inteligencias", { cache: "no-store" });
        const j = await r.json();
        const arr: Item[] = Array.isArray(j) ? j : Array.isArray(j?.items) ? j.items : [];
        if (!alive) return;
        setItems(arr);
      } catch (e) {
        console.error("LOAD_INTELIGENCIAS_LIST_ERROR", e);
        if (!alive) return;
        setItems([]);
      }
    })();
    return () => {
      alive = false;
    };
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
      // ✅ usamos query por nombre: soporta tildes y espacios
      const r = await fetch(`/api/inteligencias?nombre=${encodeURIComponent(p.nombre)}`, {
        cache: "no-store",
      });
      const j = (await r.json()) as Detalle;
      setDetalle(j);
    } catch (e) {
      console.error("LOAD_INTELIGENCIAS_DETALLE_ERROR", e);
      setDetalle({ ok: false, nombre: p.nombre, descripcion: "Error de red" });
    } finally {
      setLoading(false);
    }
  }

  // Estilos (mantiene look “playa”)
  const styles: Record<string, React.CSSProperties> = {
    page: {
      padding: 18,
      borderRadius: 18,
      background: "rgba(255,255,255,0.22)",
      border: "1px solid rgba(255,255,255,0.25)",
      backdropFilter: "blur(10px)",
      boxShadow: "0 20px 70px rgba(2,6,23,0.18)",
    },
    headerRow: {
      display: "flex",
      gap: 12,
      alignItems: "center",
      flexWrap: "wrap",
      marginTop: 10,
      marginBottom: 14,
    },
    title: { fontSize: 22, fontWeight: 950, color: "#0f172a" },
    count: { fontWeight: 900, color: "#0f172a" },
    search: {
      flex: "1 1 340px",
      maxWidth: 520,
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid rgba(15,23,42,0.12)",
      background: "rgba(255,255,255,0.9)",
      fontWeight: 800,
      outline: "none",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: 12,
    },
    grid2: {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: 12,
    },
    card: {
      borderRadius: 14,
      padding: 14,
      background: "rgba(255,255,255,0.90)",
      border: "1px solid rgba(15,23,42,0.10)",
      boxShadow: "0 10px 30px rgba(2,6,23,0.10)",
      color: "#0f172a",
      cursor: "pointer",
      textAlign: "left",
      minHeight: 72,
    },
    cardName: { fontWeight: 950, fontSize: 13, letterSpacing: 0.2 },
    cardCat: { marginTop: 6, fontWeight: 800, fontSize: 12, color: "#334155" },
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(2,6,23,0.35)",
      display: "flex",
      justifyContent: "flex-end",
      zIndex: 300,
    },
    panel: {
      width: 520,
      maxWidth: "92vw",
      height: "100vh",
      background: "rgba(255,255,255,0.96)",
      borderLeft: "1px solid rgba(15,23,42,0.12)",
      boxShadow: "-20px 0 60px rgba(2,6,23,0.18)",
      padding: 18,
      overflow: "auto",
      color: "#0f172a",
    },
    panelTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 10,
      marginBottom: 10,
    },
    panelTitle: { fontWeight: 950, fontSize: 18, color: "#0f172a" },
    closeBtn: {
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid rgba(0,0,0,0.12)",
      background: "rgba(255,255,255,0.9)",
      fontWeight: 900,
      cursor: "pointer",
    },
    sectionTitle: { marginTop: 16, fontWeight: 950 },
    muted: { color: "#64748b", fontWeight: 700 },
    pillItem: { padding: "6px 0", fontWeight: 800 },
  };

  // Responsive simple: si pantalla chica, 2 columnas
  const isNarrow =
    typeof window !== "undefined" ? window.matchMedia("(max-width: 1050px)").matches : false;

  return (
    <div style={styles.page}>
      <div style={{ fontSize: 13, fontWeight: 900, color: "#334155" }}>Panel</div>
      <div style={styles.headerRow}>
        <div style={styles.title}>
          Profesiones <span style={styles.count}>({filtradas.length})</span>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar profesión..."
          style={styles.search}
        />
      </div>

      <div style={isNarrow ? styles.grid2 : styles.grid}>
        {filtradas.map((p) => (
          <div key={p.slug || p.id || p.nombre} style={styles.card} onClick={() => abrir(p)}>
            <div style={styles.cardName}>{p.nombre}</div>
            <div style={styles.cardCat}>{p.categoria || "Varios"}</div>
          </div>
        ))}
      </div>

      {/* Panel lateral */}
      {open && (
        <div style={styles.overlay} onClick={() => setOpen(false)}>
          <div style={styles.panel} onClick={(e) => e.stopPropagation()}>
            <div style={styles.panelTop}>
              <div style={styles.panelTitle}>Detalle</div>
              <button style={styles.closeBtn} onClick={() => setOpen(false)}>
                Cerrar
              </button>
            </div>

            {loading && <div style={{ marginTop: 14 }}>Cargando…</div>}

            {!loading && detalle && detalle.ok && (
              <>
                <div style={{ marginTop: 10, fontSize: 22, fontWeight: 950 }}>{detalle.nombre}</div>
                <div style={{ marginTop: 6, fontWeight: 800, color: "#334155" }}>
                  Categoría: <b>{detalle.categoria || "—"}</b>
                </div>

                {detalle.descripcion ? (
                  <div style={{ marginTop: 12, lineHeight: 1.45 }}>{detalle.descripcion}</div>
                ) : (
                  <div style={{ marginTop: 12, ...styles.muted }}>Sin descripción todavía.</div>
                )}

                <div style={styles.sectionTitle}>Funciones</div>
                <div style={{ marginTop: 8 }}>
                  {(detalle.funciones || []).length === 0 ? (
                    <div style={styles.muted}>Todavía vacías.</div>
                  ) : (
                    (detalle.funciones || []).map((f) => (
                      <div key={f} style={styles.pillItem}>
                        {f}
                      </div>
                    ))
                  )}
                </div>

                <div style={styles.sectionTitle}>Herramientas</div>
                <div style={{ marginTop: 8 }}>
                  {(detalle.herramientas || []).length === 0 ? (
                    <div style={styles.muted}>Todavía vacío.</div>
                  ) : (
                    (detalle.herramientas || []).map((h) => (
                      <div key={h} style={styles.pillItem}>
                        {h}
                      </div>
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
    </div>
  );
}
