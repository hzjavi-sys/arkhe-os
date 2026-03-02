"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Fuente = { nombre: string; url: string };
type Seccion = {
  id: string;
  titulo: string;
  descripcion?: string;
  fuentes?: Fuente[];
  subtemas?: string[];
  items?: string[];
};

type Payload = {
  ok: boolean;
  pais?: string;
  codigo?: string;
  updatedAt?: string;
  secciones?: Seccion[];
  error?: string;
};

function pill(active: boolean): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    borderRadius: 14,
    border: active ? "1px solid rgba(15,23,42,0.90)" : "1px solid rgba(15,23,42,0.14)",
    background: active ? "rgba(15,23,42,0.90)" : "rgba(255,255,255,0.86)",
    color: active ? "#fff" : "#0f172a",
    fontWeight: 900,
    textDecoration: "none",
    boxShadow: active ? "0 10px 26px rgba(2,6,23,0.16)" : "0 6px 18px rgba(2,6,23,0.10)",
    userSelect: "none",
    whiteSpace: "nowrap",
  };
}

export default function InteligenciaLegalPage() {
  const [data, setData] = useState<Payload | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/legal/uy", { cache: "no-store" });
        const j = await r.json();
        setData(j);
      } catch (e: any) {
        setData({ ok: false, error: String(e?.message || e) });
      }
    })();
  }, []);

  const secciones = useMemo(() => {
    const list = data?.secciones || [];
    const qq = q.trim().toLowerCase();
    if (!qq) return list;
    return list.filter((s) => (s.titulo || "").toLowerCase().includes(qq) || (s.descripcion || "").toLowerCase().includes(qq));
  }, [data, q]);

  return (
    <div style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 950, color: "#0f172a" }}>Inteligencia Legal</div>
          <div style={{ marginTop: 4, color: "#475569", fontWeight: 700 }}>
            {data?.ok ? `País: ${data.pais} (${data.codigo}) · updated: ${data.updatedAt}` : "Cargando / error"}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/inteligencias" style={pill(false)}>👥 Profesiones</Link>
          <Link href="/inteligencias/legal" style={pill(true)}>📜 Legislación</Link>
          <Link href="/inteligencias/ia" style={pill(false)}>🤖 IA Central</Link>
          <Link href="/inteligencias/agente" style={pill(false)}>🧠 Agente</Link>
          <Link href="/inteligencias/lenguajes" style={pill(false)}>💻 Lenguajes</Link>
        </div>
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ fontWeight: 950, color: "#0f172a" }}>Buscar</div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Constitución, DGI, BPS, Aduanas..."
          style={{
            flex: "1 1 320px",
            padding: "10px 12px",
            borderRadius: 14,
            border: "1px solid rgba(15,23,42,0.14)",
            background: "rgba(255,255,255,0.90)",
            outline: "none",
            fontWeight: 700,
            color: "#0f172a",
          }}
        />
      </div>

      {!data?.ok && (
        <div style={{ marginTop: 14, color: "#b91c1c", fontWeight: 900 }}>
          Error: {data?.error || "no encontrado o error de red"}
        </div>
      )}

      {data?.ok && (
        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
          {secciones.map((s) => (
            <div
              key={s.id}
              style={{
                borderRadius: 16,
                padding: 14,
                background: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(15,23,42,0.10)",
                boxShadow: "0 10px 26px rgba(2,6,23,0.10)",
              }}
            >
              <div style={{ fontWeight: 950, fontSize: 16, color: "#0f172a" }}>{s.titulo}</div>
              {s.descripcion ? <div style={{ marginTop: 6, color: "#475569", fontWeight: 700 }}>{s.descripcion}</div> : null}

              {(s.subtemas || []).length > 0 && (
                <>
                  <div style={{ marginTop: 10, fontWeight: 950, color: "#0f172a" }}>Subtemas</div>
                  <ul style={{ marginTop: 6, paddingLeft: 18, color: "#0f172a", fontWeight: 700 }}>
                    {s.subtemas!.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                </>
              )}

              {(s.items || []).length > 0 && (
                <>
                  <div style={{ marginTop: 10, fontWeight: 950, color: "#0f172a" }}>Organismos</div>
                  <ul style={{ marginTop: 6, paddingLeft: 18, color: "#0f172a", fontWeight: 700 }}>
                    {s.items!.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                </>
              )}

              {(s.fuentes || []).length > 0 && (
                <>
                  <div style={{ marginTop: 10, fontWeight: 950, color: "#0f172a" }}>Fuentes oficiales</div>
                  <ul style={{ marginTop: 6, paddingLeft: 18 }}>
                    {s.fuentes!.map((f) => (
                      <li key={f.url}>
                        <a href={f.url} target="_blank" rel="noreferrer" style={{ color: "#0f172a", fontWeight: 900 }}>
                          {f.nombre}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
