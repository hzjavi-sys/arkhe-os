"use client";
import React from "react";

type AppRow = { id: number; nombre: string; tipo: string; estado: string; createdAt: string };

export default function AppsPage() {
  const [apps, setApps] = React.useState<AppRow[]>([]);
  const [nombre, setNombre] = React.useState("");
  const [tipo, setTipo] = React.useState("web");

  const cargar = async () => {
    const r = await fetch("/api/apps", { cache: "no-store" });
    const d = await r.json().catch(() => []);
    setApps(Array.isArray(d) ? d : []);
  };

  React.useEffect(() => { cargar(); }, []);

  const crear = async () => {
    if (!nombre.trim()) return;
    await fetch("/api/apps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, tipo }),
    });
    setNombre("");
    setTipo("web");
    cargar();
  };

  const borrar = async (id: number) => {
    await fetch("/api/apps", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    cargar();
  };

  return (
    <main style={{ padding: 28, fontFamily: "Arial, sans-serif", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>Apps</h1>
        <a href="/" style={{ textDecoration: "none", border: "1px solid #ddd", padding: "10px 14px", borderRadius: 10, color: "black" }}>
          ← Volver
        </a>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", background: "#fafafa", border: "1px solid #eee", padding: 14, borderRadius: 14 }}>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre app" style={{ padding: "10px 12px", minWidth: 260, borderRadius: 10, border: "1px solid #ddd" }} />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }}>
          <option value="web">web</option>
          <option value="mobile">mobile</option>
          <option value="api">api</option>
        </select>
        <button onClick={crear} style={{ padding: "10px 14px", background: "black", color: "white", border: "none", borderRadius: 10 }}>
          Crear
        </button>
      </div>

      <div style={{ marginTop: 18 }}>
        {apps.length === 0 && <p style={{ color: "#666" }}>Aún no hay apps.</p>}

        {apps.map((a) => (
          <div key={a.id} style={{ border: "1px solid #eee", borderRadius: 14, padding: 14, marginBottom: 10, display: "flex", justifyContent: "space-between", gap: 10 }}>
            <div>
              <div style={{ fontWeight: 800 }}>{a.nombre}</div>
              <div style={{ color: "#666", marginTop: 6, fontSize: 12 }}>tipo={a.tipo} · estado={a.estado}</div>
            </div>
            <button onClick={() => borrar(a.id)} style={{ background: "#ef4444", color: "white", border: "none", padding: "10px 12px", borderRadius: 10, height: 42 }}>
              Borrar
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
