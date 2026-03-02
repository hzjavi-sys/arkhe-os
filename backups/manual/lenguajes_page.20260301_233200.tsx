"use client";
import React, { useMemo, useState } from "react";
import { BEACH } from "../../../components/diseno/theme";

type Lang = {
  id: string;
  nombre: string;
  categoria: string;
  para: string[];
  nota: string;
  ejemplos: string[];
};

const LENGUAJES: Lang[] = [
  // Web
  { id:"js", nombre:"JavaScript", categoria:"Web", para:["Front-end","Back-end (Node.js)","Apps híbridas"], nota:"El estándar del navegador.", ejemplos:["React/Next","Node.js","Express"] },
  { id:"ts", nombre:"TypeScript", categoria:"Web", para:["Web grande y mantenible","Back-end"], nota:"JS con tipos (menos bugs).", ejemplos:["Next.js","NestJS"] },
  { id:"php", nombre:"PHP", categoria:"Web", para:["Web tradicional","CMS"], nota:"Muy usado en hosting compartido.", ejemplos:["Laravel","WordPress"] },
  { id:"py", nombre:"Python", categoria:"Web/IA", para:["Back-end","Data/IA","Automatizaciones"], nota:"Simple y poderoso.", ejemplos:["Django","FastAPI"] },
  { id:"rb", nombre:"Ruby", categoria:"Web", para:["Back-end"], nota:"Productividad alta.", ejemplos:["Rails"] },
  { id:"go", nombre:"Go", categoria:"Back-end", para:["APIs rápidas","Microservicios"], nota:"Rendimiento + simplicidad.", ejemplos:["Gin","Fiber"] },

  // Mobile
  { id:"swift", nombre:"Swift", categoria:"Mobile", para:["iOS / iPadOS"], nota:"Nativo Apple.", ejemplos:["SwiftUI","UIKit"] },
  { id:"kotlin", nombre:"Kotlin", categoria:"Mobile", para:["Android"], nota:"Nativo Android moderno.", ejemplos:["Jetpack Compose"] },
  { id:"dart", nombre:"Dart", categoria:"Mobile", para:["Apps multiplataforma"], nota:"Muy usado con Flutter.", ejemplos:["Flutter"] },
  { id:"cs", nombre:"C#", categoria:"Mobile/Juegos", para:["Apps","Juegos"], nota:"Muy fuerte con Microsoft y Unity.", ejemplos:[".NET","Unity"] },

  // Juegos / performance
  { id:"cpp", nombre:"C++", categoria:"Juegos/Performance", para:["Motores","Performance"], nota:"Muy usado en engines.", ejemplos:["Unreal","Engines propios"] },
  { id:"c", nombre:"C", categoria:"Sistemas", para:["Embebidos","Bajo nivel"], nota:"Base de muchos sistemas.", ejemplos:["Firmware"] },

  // Datos
  { id:"sql", nombre:"SQL", categoria:"Datos", para:["Bases de datos"], nota:"Lenguaje de consultas.", ejemplos:["Postgres","MySQL","SQLite"] },

  // Infra
  { id:"bash", nombre:"Bash/Shell", categoria:"DevOps", para:["Automatizar servidores"], nota:"Scripts y administración.", ejemplos:["CI/CD","Deploy"] },
];

export default function LenguajesPage() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState<Lang | null>(null);

  const filtrados = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return LENGUAJES;
    return LENGUAJES.filter((l) =>
      (l.nombre + " " + l.categoria + " " + l.para.join(" ")).toLowerCase().includes(qq)
    );
  }, [q]);

  const card: React.CSSProperties = {
    borderRadius: 16,
    padding: 14,
    background: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(15,23,42,0.10)",
    boxShadow: "0 10px 26px rgba(2,6,23,0.10)",
    color: BEACH.text,
    cursor: "pointer",
    textAlign: "left",
  };

  function abrir(l: Lang) {
    setSel(l);
    setOpen(true);
  }

  return (
    <>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ fontSize: 18, fontWeight: 950, color: BEACH.text }}>
          Lenguajes de Programación ({filtrados.length})
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar lenguaje..."
          style={{
            flex: "1 1 320px",
            padding: "10px 12px",
            borderRadius: 14,
            border: "1px solid rgba(15,23,42,0.14)",
            background: "rgba(255,255,255,0.85)",
            outline: "none",
            fontWeight: 700,
            color: BEACH.text,
          }}
        />
      </div>

      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
        {filtrados.map((l) => (
          <div key={l.id} style={card} onClick={() => abrir(l)}>
            <div style={{ fontWeight: 950 }}>{l.nombre}</div>
            <div style={{ marginTop: 4, color: BEACH.muted, fontWeight: 800, fontSize: 12 }}>{l.categoria}</div>
            <div style={{ marginTop: 6, color: BEACH.muted, fontWeight: 700, fontSize: 12 }}>
              {l.para.slice(0,3).join(" · ")}
            </div>
          </div>
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
              background: "rgba(255,255,255,0.96)",
              borderLeft: "1px solid rgba(0,0,0,0.10)",
              padding: 18,
              overflow: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 950, fontSize: 18, color: BEACH.text }}>Detalle</div>
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

            {sel && (
              <>
                <div style={{ marginTop: 14, fontSize: 22, fontWeight: 950, color: BEACH.text }}>{sel.nombre}</div>
                <div style={{ marginTop: 6, color: BEACH.muted, fontWeight: 800 }}>
                  Categoría: <b>{sel.categoria}</b>
                </div>

                <div style={{ marginTop: 14, fontWeight: 950, color: BEACH.text }}>¿Para qué sirve?</div>
                <div style={{ marginTop: 8 }}>
                  {sel.para.map((x) => (
                    <div key={x} style={{ padding: "6px 0", fontWeight: 800, color: BEACH.text }}>{x}</div>
                  ))}
                </div>

                <div style={{ marginTop: 14, fontWeight: 950, color: BEACH.text }}>Notas</div>
                <div style={{ marginTop: 8, color: BEACH.text, fontWeight: 700, lineHeight: 1.4 }}>{sel.nota}</div>

                <div style={{ marginTop: 14, fontWeight: 950, color: BEACH.text }}>Ejemplos</div>
                <div style={{ marginTop: 8 }}>
                  {sel.ejemplos.map((x) => (
                    <div key={x} style={{ padding: "6px 0", fontWeight: 800, color: BEACH.text }}>{x}</div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
