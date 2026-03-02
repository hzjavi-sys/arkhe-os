"use client";

import React, { useEffect, useMemo, useState } from "react";
import { BEACH } from "../../../components/diseno/theme";

type Lang = {
  id: string;
  nombre: string;
  categoria: string;
  plataformas: string[];
  queEs: string;
  brillaEn: string[];
  noConviene: string[];
  stackRecomendado: any;
  salidas: string[];
  facilidad: string;
  velocidad: string;
  performance: string;
  ecosistema: string;
  notas?: string;
};

type ApiResp = { ok: boolean; total: number; items: Lang[] };

const PLATAFORMAS = [
  { id: "web", label: "Web" },
  { id: "backend", label: "Backend/APIs" },
  { id: "ios", label: "iOS" },
  { id: "android", label: "Android" },
  { id: "juegos", label: "Juegos" },
  { id: "datos", label: "Datos" },
  { id: "devops", label: "DevOps" },
  { id: "automation", label: "Automatización" },
];

export default function LenguajesPage() {
  const [q, setQ] = useState("");
  const [plat, setPlat] = useState<string>("todos");
  const [items, setItems] = useState<Lang[]>([]);
  const [sel, setSel] = useState<Lang | null>(null);

  useEffect(() => {
    fetch("/api/lenguajes", { cache: "no-store" })
      .then((r) => r.json())
      .then((j: ApiResp) => setItems(j.ok ? j.items : []))
      .catch(() => setItems([]));
  }, []);

  const filtrados = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return items.filter((x) => {
      const okPlat = plat === "todos" ? true : (x.plataformas || []).includes(plat);
      const hay =
        !qq ||
        x.nombre.toLowerCase().includes(qq) ||
        x.categoria.toLowerCase().includes(qq) ||
        (x.queEs || "").toLowerCase().includes(qq) ||
        (x.brillaEn || []).join(" ").toLowerCase().includes(qq);
      return okPlat && hay;
    });
  }, [items, q, plat]);

  const card: React.CSSProperties = {
    borderRadius: 16,
    padding: 14,
    background: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(15,23,42,0.10)",
    boxShadow: "0 10px 26px rgba(2,6,23,0.10)",
    color: "#0f172a",
    cursor: "pointer",
    textAlign: "left",
  };

  return (
    <>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ fontSize: 18, fontWeight: 950, color: "#0f172a" }}>
          Lenguajes ({filtrados.length})
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar..."
          style={{
            flex: "1 1 320px",
            padding: "10px 12px",
            borderRadius: 14,
            border: "1px solid rgba(15,23,42,0.14)",
            background: "rgba(255,255,255,0.85)",
            outline: "none",
            fontWeight: 700,
            color: "#0f172a",
          }}
        />

        <select
          value={plat}
          onChange={(e) => setPlat(e.target.value)}
          style={{
            padding: "10px 12px",
            borderRadius: 14,
            border: "1px solid rgba(15,23,42,0.14)",
            background: "rgba(255,255,255,0.85)",
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          <option value="todos">Todas</option>
          {PLATAFORMAS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 520px", gap: 14, marginTop: 14 }}>
        {/* LISTA */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
          {filtrados.map((l) => (
            <div key={l.id} style={card} onClick={() => setSel(l)}>
              <div style={{ fontWeight: 950 }}>{l.nombre}</div>
              <div style={{ marginTop: 4, color: "#475569", fontWeight: 800, fontSize: 12 }}>
                {l.categoria} · {l.performance} perf · {l.velocidad} velocidad
              </div>
              <div style={{ marginTop: 8, color: "#0f172a", fontWeight: 700, fontSize: 13, lineHeight: 1.25 }}>
                {l.queEs}
              </div>
              <div style={{ marginTop: 8, color: "#475569", fontWeight: 700, fontSize: 12 }}>
                Plataformas: {(l.plataformas || []).join(", ")}
              </div>
            </div>
          ))}
        </div>

        {/* DETALLE */}
        <div
          style={{
            borderRadius: 18,
            padding: 16,
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(15,23,42,0.10)",
            boxShadow: "0 10px 26px rgba(2,6,23,0.10)",
            minHeight: 260,
          }}
        >
          {!sel ? (
            <div style={{ color: "#475569", fontWeight: 800 }}>
              Elegí un lenguaje para ver detalle (sirve para decidir con qué construir la app).
            </div>
          ) : (
            <>
              <div style={{ fontSize: 20, fontWeight: 950, color: "#0f172a" }}>{sel.nombre}</div>
              <div style={{ marginTop: 4, color: "#475569", fontWeight: 800 }}>{sel.categoria}</div>

              <div style={{ marginTop: 14, fontWeight: 950, color: "#0f172a" }}>Qué es</div>
              <div style={{ marginTop: 6, lineHeight: 1.4 }}>{sel.queEs}</div>

              <div style={{ marginTop: 14, fontWeight: 950, color: "#0f172a" }}>Dónde brilla</div>
              <ul style={{ marginTop: 6 }}>
                {(sel.brillaEn || []).map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>

              <div style={{ marginTop: 14, fontWeight: 950, color: "#0f172a" }}>Dónde NO conviene</div>
              <ul style={{ marginTop: 6 }}>
                {(sel.noConviene || []).map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>

              <div style={{ marginTop: 14, fontWeight: 950, color: "#0f172a" }}>Stack recomendado</div>
              <pre
                style={{
                  marginTop: 8,
                  padding: 12,
                  borderRadius: 12,
                  background: "rgba(15,23,42,0.04)",
                  border: "1px solid rgba(15,23,42,0.08)",
                  overflow: "auto",
                  fontSize: 12,
                }}
              >
{JSON.stringify(sel.stackRecomendado, null, 2)}
              </pre>

              <div style={{ marginTop: 14, fontWeight: 950, color: "#0f172a" }}>Salidas</div>
              <div style={{ marginTop: 6 }}>{(sel.salidas || []).join(" · ")}</div>

              <div style={{ marginTop: 14, fontWeight: 950, color: "#0f172a" }}>Métricas</div>
              <div style={{ marginTop: 6, color: "#475569", fontWeight: 800 }}>
                Facilidad: {sel.facilidad} · Velocidad: {sel.velocidad} · Performance: {sel.performance} · Ecosistema:{" "}
                {sel.ecosistema}
              </div>

              {sel.notas ? (
                <>
                  <div style={{ marginTop: 14, fontWeight: 950, color: "#0f172a" }}>Notas</div>
                  <div style={{ marginTop: 6, lineHeight: 1.4 }}>{sel.notas}</div>
                </>
              ) : null}

              <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid rgba(15,23,42,0.10)" }}>
                <div style={{ fontWeight: 950, color: "#0f172a" }}>Recomendación rápida (para el creador de apps)</div>
                <div style={{ marginTop: 6, color: "#475569", fontWeight: 800 }}>
                  Próximo paso: el “Director” le pasa parámetros (plataforma, urgencia, presupuesto, performance, etc.) y
                  este módulo devuelve el stack sugerido.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
