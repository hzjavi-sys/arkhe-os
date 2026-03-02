"use client";

import React, { useEffect, useMemo, useState } from "react";
import AppShell from "../../components/arkhe/AppShell";
import InteligenciasTabs from "../../components/arkhe/InteligenciasTabs";
import SidePanel from "./_components/SidePanel";

type Row = {
  id?: string;
  slug?: string;
  nombre: string;
  categoria?: string;
  tags?: string[];
};

type Det = {
  ok: boolean;
  id?: string;
  slug?: string;
  nombre?: string;
  categoria?: string;
  descripcion?: string;
  herramientas?: string[];
  funciones?: string[];
  tags?: string[];

  // PRO (si no vienen, ponemos defaults)
  queEs?: string;
  dondeBrilla?: string[];
  dondeNoConviene?: string[];
  entradasQuePide?: string[];
  salida?: string[];
  riesgos?: string[];
  argumentos?: { pros?: string[]; contras?: string[] };
};

function proize(det: Det): Det {
  const nombre = det.nombre || "";
  const categoria = det.categoria || "Varios";

  const queEs =
    det.descripcion && det.descripcion.trim().length > 0
      ? det.descripcion
      : `Profesión/carrera dentro de "${categoria}". (Base: luego agregamos guía específica, plantillas y herramientas reales).`;

  const funcionesBase =
    det.funciones && det.funciones.length > 0
      ? det.funciones
      : ["Diagnóstico", "Plan", "Ejecución", "Control", "Documentación"];

  const herramientasBase =
    det.herramientas && det.herramientas.length > 0
      ? det.herramientas
      : ["Checklist base", "Plantillas base", "Tablero simple", "Registro y seguimiento", "Guía de pasos"];

  return {
    ...det,
    queEs,
    dondeBrilla: det.dondeBrilla && det.dondeBrilla.length ? det.dondeBrilla : funcionesBase.slice(0, 6),
    dondeNoConviene: det.dondeNoConviene && det.dondeNoConviene.length ? det.dondeNoConviene : ["Si faltan datos/objetivo", "Si requiere experto sin contexto"],
    entradasQuePide: det.entradasQuePide && det.entradasQuePide.length ? det.entradasQuePide : ["Objetivo", "Contexto", "Restricciones", "Plazo"],
    salida: det.salida && det.salida.length ? det.salida : ["Ruta A/B/C", "Checklist", "Plantillas sugeridas", "Riesgos + próximos pasos"],
    riesgos: det.riesgos && det.riesgos.length ? det.riesgos : ["Datos incompletos", "Requisitos cambiantes", "Depende de validación humana cuando aplique"],
    argumentos: det.argumentos || { pros: ["Orden", "Velocidad", "Trazabilidad"], contras: ["Depende de inputs", "Requiere ajustes por caso"] },
    funciones: funcionesBase,
    herramientas: herramientasBase,
  };
}

export default function ProfesionesPage() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [det, setDet] = useState<Det | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/inteligencias", { cache: "no-store" });
        const j = await r.json();
        const list: any[] = Array.isArray(j) ? j : Array.isArray(j?.items) ? j.items : [];
        setRows(list);
      } catch {
        setRows([]);
      }
    })();
  }, []);

  const filtradas = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return rows;
    return rows.filter((x) => (x.nombre || "").toLowerCase().includes(qq) || (x.categoria || "").toLowerCase().includes(qq));
  }, [q, rows]);

  async function abrir(rw: Row) {
    setOpen(true);
    setLoading(true);
    setDet(null);
    try {
      // Robusto (tildes/espacios): usamos query por nombre
      const r = await fetch(`/api/inteligencias?nombre=${encodeURIComponent(rw.nombre)}`, { cache: "no-store" });
      const j = await r.json();
      setDet(proize(j));
    } catch {
      setDet({ ok: false } as any);
    } finally {
      setLoading(false);
    }
  }

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

  const H: React.CSSProperties = { fontWeight: 950, fontSize: 16, marginTop: 18, color: "#0f172a" };
  const P: React.CSSProperties = { marginTop: 6, color: "#0f172a", fontWeight: 700, lineHeight: 1.45 };
  const UL: React.CSSProperties = { marginTop: 8, color: "#0f172a", fontWeight: 700, lineHeight: 1.6 };

  return (
    <AppShell title="Inteligencias · Profesiones">
      <div style={{ fontSize: 22, fontWeight: 950, color: "#0f172a" }}>Inteligencias</div>
      <div style={{ marginTop: 4, color: "#475569", fontWeight: 700 }}>Panel</div>

      <div style={{ marginTop: 14 }}>
        <InteligenciasTabs active="profesiones" />
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ fontSize: 18, fontWeight: 950, color: "#0f172a" }}>
          Profesiones ({filtradas.length})
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar profesión…"
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
      </div>

      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
        {filtradas.slice(0, 180).map((x) => (
          <div key={(x.id || x.slug || x.nombre) as string} style={card} onClick={() => abrir(x)}>
            <div style={{ fontWeight: 950 }}>{x.nombre}</div>
            <div style={{ marginTop: 4, color: "#475569", fontWeight: 800, fontSize: 12 }}>
              {x.categoria || "—"}
            </div>
          </div>
        ))}
      </div>

      <SidePanel open={open} title="Detalle Profesional" onClose={() => setOpen(false)}>
        {loading && <div style={{ fontWeight: 800, color: "#0f172a" }}>Cargando…</div>}

        {!loading && det && det.ok && (
          <>
            <div style={{ fontSize: 22, fontWeight: 950, color: "#0f172a" }}>{det.nombre}</div>
            <div style={{ marginTop: 6, color: "#475569", fontWeight: 800 }}>
              Categoría: <b>{det.categoria || "—"}</b>
            </div>

            <div style={H}>Qué es</div>
            <div style={P}>{det.queEs || "—"}</div>

            <div style={H}>Dónde brilla</div>
            <ul style={UL}>{(det.dondeBrilla || []).map((t) => <li key={t}>{t}</li>)}</ul>

            <div style={H}>Dónde NO conviene</div>
            <ul style={UL}>{(det.dondeNoConviene || []).map((t) => <li key={t}>{t}</li>)}</ul>

            <div style={H}>Entradas que pide</div>
            <ul style={UL}>{(det.entradasQuePide || []).map((t) => <li key={t}>{t}</li>)}</ul>

            <div style={H}>Salida</div>
            <ul style={UL}>{(det.salida || []).map((t) => <li key={t}>{t}</li>)}</ul>

            <div style={H}>Herramientas</div>
            <ul style={UL}>{(det.herramientas || []).map((t) => <li key={t}>{t}</li>)}</ul>

            <div style={H}>Funciones</div>
            <ul style={UL}>{(det.funciones || []).map((t) => <li key={t}>{t}</li>)}</ul>

            <div style={H}>Riesgos</div>
            <ul style={UL}>{(det.riesgos || []).map((t) => <li key={t}>{t}</li>)}</ul>

            <div style={H}>Argumentos</div>
            <div style={{ marginTop: 8, fontWeight: 950, color: "#0f172a" }}>Pros</div>
            <ul style={UL}>{(det.argumentos?.pros || []).map((t) => <li key={t}>{t}</li>)}</ul>
            <div style={{ marginTop: 8, fontWeight: 950, color: "#0f172a" }}>Contras</div>
            <ul style={UL}>{(det.argumentos?.contras || []).map((t) => <li key={t}>{t}</li>)}</ul>
          </>
        )}

        {!loading && det && !det.ok && (
          <div style={{ color: "#b91c1c", fontWeight: 900 }}>Error: no encontrado o error de red.</div>
        )}
      </SidePanel>
    </AppShell>
  );
}
