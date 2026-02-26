"use client";

import React from "react";
import AppShell from "../components/arkhe/AppShell";
import DataGrid from "../components/ui/DataGrid";
import type { ColumnDef } from "@tanstack/react-table";

type Proyecto = {
  id: number;
  nombre: string;
  ownerId: number;
  empresaId: number;
  createdAt: string;
};

export default function ProyectosPage() {
  const [rows, setRows] = React.useState<Proyecto[]>([]);
  const [nombre, setNombre] = React.useState("");

  const cargar = async () => {
    const r = await fetch("/api/proyectos", { cache: "no-store" });
    const d = await r.json().catch(() => []);
    setRows(Array.isArray(d) ? d : []);
  };

  React.useEffect(() => {
    cargar();
  }, []);

  const crear = async () => {
    const n = nombre.trim();
    if (!n) return;
    await fetch("/api/proyectos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: n }),
    });
    setNombre("");
    cargar();
  };

  const borrar = async (id: number) => {
    if (!confirm("¿Borrar este proyecto?")) return;
    await fetch("/api/proyectos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    cargar();
  };

  const columns: ColumnDef<Proyecto>[] = [
    { header: "ID", accessorKey: "id" },
    { header: "Nombre", accessorKey: "nombre" },
    { header: "Owner", accessorKey: "ownerId" },
    { header: "Empresa", accessorKey: "empresaId" },
    {
      header: "Creado",
      accessorKey: "createdAt",
      cell: (info) => {
        const v = info.getValue() as string;
        try { return new Date(v).toLocaleString(); } catch { return v; }
      },
    },
    {
      header: "Acciones",
      id: "acciones",
      cell: (info) => {
        const p = info.row.original;
        return (
          <button
            onClick={() => borrar(p.id)}
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            Borrar
          </button>
        );
      },
    },
  ];

  return (
    <AppShell title="Proyectos" defaultModule="proyectos">
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del proyecto"
          style={{ padding: "10px 12px", minWidth: 280, borderRadius: 12, border: "1px solid #e5e7eb" }}
        />
        <button
          onClick={crear}
          style={{
            background: "black",
            color: "white",
            border: "none",
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
            background: "white",
            color: "#111827",
            border: "1px solid #e5e7eb",
            padding: "10px 14px",
            borderRadius: 12,
            cursor: "pointer",
            fontWeight: 900,
          }}
        >
          Actualizar
        </button>
      </div>

      <DataGrid<Proyecto> rows={rows} columns={columns} title="Listado de Proyectos" />
    </AppShell>
  );
}
