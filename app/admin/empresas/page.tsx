"use client";
import React from "react";

type Empresa = { id: number; nombre: string; createdAt: string };
type CreateResp = { empresa: Empresa; adminAuto: { email: string; password: string; id: number; role: string; empresaId: number } };

export default function AdminEmpresasPage() {
  const [empresas, setEmpresas] = React.useState<Empresa[]>([]);
  const [nombre, setNombre] = React.useState("");
  const [err, setErr] = React.useState<string | null>(null);
  const [creds, setCreds] = React.useState<CreateResp["adminAuto"] | null>(null);

  const cargar = async () => {
    setErr(null);
    const res = await fetch("/api/admin/empresas", { cache: "no-store" });
    const data = await res.json().catch(() => null);
    if (!res.ok) { setErr(data?.error || "forbidden"); return; }
    setEmpresas(data || []);
  };

  React.useEffect(() => { cargar(); }, []);

  const crear = async () => {
    if (!nombre.trim()) return;
    setErr(null);
    setCreds(null);
    const res = await fetch("/api/admin/empresas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) { setErr(data?.error || "error"); return; }
    setNombre("");
    setCreds(data.adminAuto || null);
    cargar();
  };

  return (
    <main style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0 }}>Admin · Empresas</h1>
          <p style={{ color: "#666", marginTop: 6 }}>Solo SUPERADMIN</p>
        </div>
        <a href="/" style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", textDecoration: "none", color: "black" }}>
          ← Volver
        </a>
      </div>

      {err && <div style={{ color: "crimson", margin: "12px 0" }}>Error: {err}</div>}

      <div style={{ marginTop: 20, display: "flex", gap: 10, alignItems: "center" }}>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre empresa" style={{ padding: "10px 12px", minWidth: 260 }} />
        <button onClick={crear} style={{ padding: "10px 14px", background: "black", color: "white", border: "none", borderRadius: 10 }}>
          Crear
        </button>
      </div>

      {creds && (
        <div style={{ marginTop: 16, border: "1px solid #eee", borderRadius: 12, padding: 12, maxWidth: 720, background: "#fafafa" }}>
          <b>ADMIN creado automáticamente</b>
          <div style={{ marginTop: 8 }}>Email: <code>{creds.email}</code></div>
          <div>Password: <code>{creds.password}</code></div>
          <div style={{ color: "#666", marginTop: 6 }}>empresaId: {creds.empresaId}</div>
        </div>
      )}

      <div style={{ marginTop: 24, maxWidth: 720 }}>
        {empresas.map((e) => (
          <div key={e.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12, marginBottom: 10 }}>
            <b>{e.nombre}</b> <span style={{ color: "#666" }}>· id: {e.id}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
