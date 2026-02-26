"use client";
import React from "react";

type Proyecto = { id: number; nombre: string; ownerId: number; empresaId: number; createdAt: string };
type Me = { userId: number; email: string; role: "SUPERADMIN" | "ADMIN" | "USER"; empresaId: number };

export default function Home() {
  const [me, setMe] = React.useState<Me | null>(null);
  const [proyectos, setProyectos] = React.useState<Proyecto[]>([]);
  const [nombre, setNombre] = React.useState("");
  const [ownerEmail, setOwnerEmail] = React.useState("");
  const [empresaIdCrear, setEmpresaIdCrear] = React.useState("");

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

  React.useEffect(() => { cargarMe(); cargar(); }, []);

  const crear = async () => {
    if (!nombre.trim()) return;
    const payload: any = { nombre };

    if ((me?.role === "ADMIN" || me?.role === "SUPERADMIN") && ownerEmail.trim()) payload.ownerEmail = ownerEmail.trim();
    if (me?.role === "SUPERADMIN" && empresaIdCrear.trim()) payload.empresaId = Number(empresaIdCrear);

    await fetch("/api/proyectos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setNombre(""); setOwnerEmail(""); setEmpresaIdCrear("");
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

  const canAdminUsers = me?.role === "ADMIN" || me?.role === "SUPERADMIN";
  const canAdminEmpresas = me?.role === "SUPERADMIN";

  return (
    <main style={{ fontFamily: "Arial, sans-serif", display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "100vh" }}>
      <aside style={{ borderRight: "1px solid #eee", padding: 18 }}>
        <div style={{ fontWeight: 800, fontSize: 18 }}>ARKHE OS</div>
        <div style={{ color: "#666", marginTop: 6, fontSize: 12 }}>
          {me ? `${me.email}` : "Cargando..."}
        </div>
        <div style={{ color: "#666", marginTop: 6, fontSize: 12 }}>
          {me ? `role=${me.role} · empresaId=${me.empresaId}` : ""}
        </div>

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          <a href="/" style={{ textDecoration: "none", color: "black", padding: 10, borderRadius: 10, background: "#f6f6f6" }}>Proyectos</a>
          <a href="/notas" style={{ textDecoration: "none", color: "black", padding: 10, borderRadius: 10, background: "#f6f6f6" }}>Notas</a>
          {canAdminUsers && <a href="/admin/users" style={{ textDecoration: "none", color: "black", padding: 10, borderRadius: 10, background: "#f6f6f6" }}>Admin Usuarios</a>}
          {canAdminEmpresas && <a href="/admin/empresas" style={{ textDecoration: "none", color: "black", padding: 10, borderRadius: 10, background: "#f6f6f6" }}>Admin Empresas</a>}
          <button onClick={logout} style={{ marginTop: 10, padding: 10, borderRadius: 10, border: "none", background: "black", color: "white" }}>Salir</button>
        </div>
      </aside>

      <section style={{ padding: 24 }}>
        <h1 style={{ marginTop: 0 }}>Proyectos</h1>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del proyecto" style={{ padding: "10px 12px", minWidth: 260 }} />

          {(me?.role === "ADMIN" || me?.role === "SUPERADMIN") && (
            <input value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} placeholder="Owner email (ADMIN)" style={{ padding: "10px 12px", minWidth: 260 }} />
          )}

          {me?.role === "SUPERADMIN" && (
            <input value={empresaIdCrear} onChange={(e) => setEmpresaIdCrear(e.target.value)} placeholder="empresaId (SUPERADMIN)" style={{ padding: "10px 12px", width: 200 }} />
          )}

          <button onClick={crear} style={{ padding: "10px 14px", background: "black", color: "white", border: "none", borderRadius: 10 }}>
            Crear
          </button>
        </div>

        <div style={{ marginTop: 20, maxWidth: 900 }}>
          {proyectos.length === 0 && <p style={{ color: "#666" }}>Aún no hay proyectos.</p>}
          {proyectos.map((p) => (
            <div key={p.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12, marginBottom: 10, display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div>
                <b>{p.nombre}</b>
                <div style={{ color: "#666", marginTop: 6, fontSize: 12 }}>
                  ownerId={p.ownerId} · empresaId={p.empresaId}
                </div>
              </div>
              <button onClick={() => borrar(p.id)} style={{ background: "#ef4444", color: "white", border: "none", padding: "8px 12px", borderRadius: 10, height: 40 }}>
                Borrar
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
