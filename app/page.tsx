"use client";
import React from "react";

type Proyecto = {
  id: number;
  nombre: string;
  createdAt: string;
};

export default function Home() {
  const [proyectos, setProyectos] = React.useState<Proyecto[]>([]);
  const [nombre, setNombre] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const cargar = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/proyectos", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.detail || data?.error || "GET failed");
      setProyectos(data || []);
    } catch (e: any) {
      setErr(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const crear = async () => {
    const n = nombre.trim();
    if (!n) return;
    setErr(null);
    try {
      const res = await fetch("/api/proyectos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: n }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.detail || data?.error || "POST failed");
      setNombre("");
      await cargar();
    } catch (e: any) {
      setErr(e?.message || "Error");
    }
  };

  const borrar = async (id: number) => {
    if (!confirm("¿Borrar este proyecto?")) return;
    setErr(null);
    try {
      const res = await fetch("/api/proyectos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.detail || data?.error || "DELETE failed");
      await cargar();
    } catch (e: any) {
      setErr(e?.message || "Error");
    }
  };

  React.useEffect(() => {
    cargar();
  }, []);

  return (
    <main style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0 }}>ARKHE OS</h1>
          <p style={{ marginTop: 6, color: "#666" }}>Sistema Operativo Cognitivo Universal</p>
        </div>

        <button
          onClick={logout}
          style={{
            padding: "8px 14px",
            borderRadius: 10,
            border: "none",
            background: "black",
            color: "white",
            cursor: "pointer",
          }}
        >
          Salir
        </button>
      </div>

      <div style={{ marginTop: 30, display: "flex", gap: 10, alignItems: "center" }}>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del proyecto"
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid #ddd",
            minWidth: 320,
          }}
        />
        <button
          onClick={crear}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "none",
            background: "black",
            color: "white",
            cursor: "pointer",
          }}
        >
          Crear
        </button>
      </div>

      {err && <div style={{ marginTop: 12, color: "crimson" }}>Error: {err}</div>}

      <div style={{ marginTop: 30 }}>
        <h2 style={{ marginBottom: 10 }}>Proyectos</h2>

        {loading && <div>Cargando...</div>}

        {!loading && proyectos.length === 0 && <div>Aún no hay proyectos.</div>}

        {!loading &&
          proyectos.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #eee",
                borderRadius: 12,
                padding: "10px 12px",
                marginBottom: 8,
                maxWidth: 600,
              }}
            >
              <div>• {p.nombre}</div>
              <button
                onClick={() => borrar(p.id)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                Borrar
              </button>
            </div>
          ))}
      </div>
    </main>
  );
}
