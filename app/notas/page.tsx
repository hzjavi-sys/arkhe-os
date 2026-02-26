"use client";
import React from "react";

type Nota = { id: number; titulo: string; contenido: string; createdAt: string };

export default function NotasPage() {
  const [notas, setNotas] = React.useState<Nota[]>([]);
  const [titulo, setTitulo] = React.useState("");
  const [contenido, setContenido] = React.useState("");

  const cargar = async () => {
    const res = await fetch("/api/notas", { cache: "no-store" });
    const data = await res.json().catch(() => []);
    setNotas(Array.isArray(data) ? data : []);
  };

  React.useEffect(() => { cargar(); }, []);

  const crear = async () => {
    if (!titulo.trim()) return;
    await fetch("/api/notas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, contenido }),
    });
    setTitulo(""); setContenido("");
    cargar();
  };

  const borrar = async (id: number) => {
    await fetch("/api/notas", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    cargar();
  };

  return (
    <main style={{ padding: 30, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginTop: 0 }}>Notas</h1>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título" style={{ padding: "10px 12px", minWidth: 260 }} />
        <input value={contenido} onChange={(e) => setContenido(e.target.value)} placeholder="Contenido (opcional)" style={{ padding: "10px 12px", minWidth: 360 }} />
        <button onClick={crear} style={{ padding: "10px 14px", background: "black", color: "white", border: "none", borderRadius: 10 }}>
          Crear
        </button>
        <a href="/" style={{ marginLeft: "auto", textDecoration: "none", border: "1px solid #ddd", padding: "10px 14px", borderRadius: 10, color: "black" }}>
          ← Volver
        </a>
      </div>

      <div style={{ marginTop: 20, maxWidth: 900 }}>
        {notas.length === 0 && <p style={{ color: "#666" }}>Aún no hay notas.</p>}
        {notas.map((n) => (
          <div key={n.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12, marginBottom: 10, display: "flex", justifyContent: "space-between", gap: 10 }}>
            <div>
              <b>{n.titulo}</b>
              {n.contenido && <div style={{ color: "#555", marginTop: 6 }}>{n.contenido}</div>}
            </div>
            <button onClick={() => borrar(n.id)} style={{ background: "#ef4444", color: "white", border: "none", padding: "8px 12px", borderRadius: 10, height: 40 }}>
              Borrar
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
