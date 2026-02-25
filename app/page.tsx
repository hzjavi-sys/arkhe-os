"use client";
import React from "react";

type Proyecto = { id: number; nombre: string; ownerId: number; createdAt: string };
type Me = { userId: number; email: string; role: "ADMIN" | "USER" };

export default function Home() {
  const [me, setMe] = React.useState<Me | null>(null);
  const [proyectos, setProyectos] = React.useState<Proyecto[]>([]);
  const [nombre, setNombre] = React.useState("");
  const [ownerEmail, setOwnerEmail] = React.useState("");

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const cargarMe = async () => {
    const res = await fetch("/api/me", { cache: "no-store" });
    const data = await res.json().catch(() => null);
    if (res.ok) setMe(data);
  };

  const cargar = async () => {
    const res = await fetch("/api/proyectos", { cache: "no-store" });
    const data = await res.json().catch(() => []);
    setProyectos(Array.isArray(data) ? data : []);
  };

  React.useEffect(() => {
    cargarMe();
    cargar();
  }, []);

  const crear = async () => {
    if (!nombre.trim()) return;

    const payload: any = { nombre };
    if (me?.role === "ADMIN" && ownerEmail.trim()) payload.ownerEmail = ownerEmail.trim();

    await fetch("/api/proyectos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setNombre("");
    setOwnerEmail("");
    cargar();
  };

  const borrar = async (id: number) => {
    await fetch("/api/proyectos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    cargar();
  };

  return (
    <main style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0 }}>ARKHE OS</h1>
          <p style={{ marginTop: 6, color: "#666" }}>
            {me ? `${me.email} (${me.role})` : "Cargando usuario..."}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <a href="/admin/users" style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #ddd", textDecoration: "none", color: "black" }}>
            Admin Usuarios
          </a>
          <button onClick={logout} style={{ padding: "8px 12px", borderRadius: 10, border: "none", background: "black", color: "white" }}>
            Salir
          </button>
        </div>
      </div>

      <div style={{ marginTop: 20, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del proyecto" style={{ padding: "8px 10px", minWidth: 260 }} />

        {me?.role === "ADMIN" && (
          <input value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} placeholder="Owner email (solo ADMIN)" style={{ padding: "8px 10px", minWidth: 260 }} />
        )}

        <button onClick={crear} style={{ padding: "8px 12px", background: "black", color: "white", border: "none", borderRadius: 8 }}>
          Crear
        </button>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Proyectos</h3>
        {proyectos.length === 0 && <p style={{ color: "#777" }}>Aún no hay proyectos.</p>}

        {proyectos.map((p) => (
          <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 10, background: "#f2f2f2", borderRadius: 10, marginBottom: 10, maxWidth: 620 }}>
            <span>• {p.nombre} <span style={{ color: "#666", fontSize: 12 }}>(ownerId: {p.ownerId})</span></span>
            <button onClick={() => borrar(p.id)} style={{ background: "#ef4444", color: "white", border: "none", padding: "6px 10px", borderRadius: 8 }}>
              Borrar
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
