"use client";

import React, { useEffect, useState } from "react";
import AppShell from "../components/arkhe/AppShell";
import DataGrid, { Col } from "../components/ui/DataGrid";

type Proyecto = { id: number; nombre: string; ownerId: number; empresaId: number; createdAt: string };

export default function Page() {
  const [nombre, setNombre] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [me, setMe] = useState<{ email: string; role: string; empresaId?: number | null } | null>(null);
  const [rows, setRows] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(false);

  async function cargar() {
    setLoading(true);
    try {
      const rMe = await fetch("/api/me", { cache: "no-store" });
      const meJson = rMe.ok ? await rMe.json() : null;
      setMe(meJson);

      const r = await fetch("/api/proyectos", { cache: "no-store" });
      const data = r.ok ? await r.json() : [];
      setRows(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function crear() {
    if (!nombre.trim()) return;
    await fetch("/api/proyectos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, ownerEmail: ownerEmail.trim() || undefined }),
    });
    setNombre("");
    setOwnerEmail("");
    await cargar();
  }

  async function borrar(id: number) {
    await fetch("/api/proyectos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await cargar();
  }

  const cols: Col<Proyecto>[] = [
    { key: "id", header: "ID", width: 90, render: (p) => p.id, sortValue: (p) => p.id, searchValue: (p) => String(p.id) },
    { key: "nombre", header: "Nombre", render: (p) => <span style={{ fontWeight: 800 }}>{p.nombre}</span>, sortValue: (p) => p.nombre.toLowerCase(), searchValue: (p) => p.nombre },
    { key: "owner", header: "Owner", width: 120, render: (p) => p.ownerId, sortValue: (p) => p.ownerId, searchValue: (p) => String(p.ownerId) },
    { key: "empresa", header: "Empresa", width: 140, render: (p) => p.empresaId, sortValue: (p) => p.empresaId, searchValue: (p) => String(p.empresaId) },
    { key: "creado", header: "Creado", width: 220, render: (p) => new Date(p.createdAt).toLocaleString(), sortValue: (p) => p.createdAt, searchValue: (p) => p.createdAt },
    {
      key: "acciones",
      header: "Acciones",
      width: 160,
      render: (p) => (
        <button
          onClick={() => borrar(p.id)}
          style={{
            background: "#ef4444",
            border: "none",
            color: "white",
            padding: "10px 12px",
            borderRadius: 12,
            cursor: "pointer",
            fontWeight: 800,
          }}
        >
          Borrar
        </button>
      ),
    },
  ];

  return (
    <AppShell title="Proyectos">
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del proyecto"
          style={{
            width: 260,
            padding: "10px 12px",
            borderRadius: 12,
            background: "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.10)",
            color: "#e5e7eb",
            outline: "none",
          }}
        />

        <input
          value={ownerEmail}
          onChange={(e) => setOwnerEmail(e.target.value)}
          placeholder="Owner email (ADMIN)"
          disabled={me?.role !== "ADMIN" && me?.role !== "SUPERADMIN"}
          style={{
            width: 260,
            padding: "10px 12px",
            borderRadius: 12,
            background: "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.10)",
            color: "#e5e7eb",
            outline: "none",
            opacity: me?.role === "ADMIN" || me?.role === "SUPERADMIN" ? 1 : 0.5,
          }}
        />

        <button
          onClick={crear}
          style={{
            background: "#111827",
            border: "1px solid rgba(255,255,255,.12)",
            color: "white",
            padding: "10px 14px",
            borderRadius: 12,
            cursor: "pointer",
            fontWeight: 900,
          }}
        >
          Crear
        </button>

        <button
          onClick={cargar}
          style={{
            background: "rgba(255,255,255,.06)",
            border: "1px solid rgba(255,255,255,.12)",
            color: "white",
            padding: "10px 14px",
            borderRadius: 12,
            cursor: "pointer",
            fontWeight: 900,
          }}
        >
          Actualizar
        </button>

        {loading ? <span style={{ opacity: 0.7 }}>Cargando…</span> : null}
      </div>

      <DataGrid title="Listado de Proyectos" rows={rows} columns={cols} initialPageSize={10} />
    </AppShell>
  );
}
