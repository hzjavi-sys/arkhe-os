import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const proyectos = await prisma.proyecto.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(proyectos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const nombre = String(body?.nombre || "").trim();
  if (!nombre) return NextResponse.json({ error: "nombre_requerido" }, { status: 400 });

  const nuevo = await prisma.proyecto.create({
    data: { nombre },
  });

  return NextResponse.json(nuevo);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  if (!id) return NextResponse.json({ error: "id_requerido" }, { status: 400 });

  await prisma.proyecto.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
cat > app/page.tsx
"use client";
import React from "react";
import FormularioProyecto from "../components/FormularioProyecto";

type Proyecto = {
  id: number;
  nombre: string;
  createdAt: string;
};

export default function Home() {
  const [mostrarFormulario, setMostrarFormulario] = React.useState(false);
  const [proyectos, setProyectos] = React.useState<Proyecto[]>([]);
  const [cargando, setCargando] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const cargarProyectos = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch("/api/proyectos", { cache: "no-store" });
      if (!res.ok) throw new Error("GET /api/proyectos falló");
      const data = await res.json();
      setProyectos(data);
    } catch (e: any) {
      setError(e?.message || "Error desconocido");
    } finally {
      setCargando(false);
    }
  };

  React.useEffect(() => {
    cargarProyectos();
  }, []);

  const agregarProyecto = async (nombre: string) => {
    setError(null);
    try {
      const res = await fetch("/api/proyectos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });
      if (!res.ok) throw new Error("POST /api/proyectos falló");
      setMostrarFormulario(false);
      await cargarProyectos();
    } catch (e: any) {
      setError(e?.message || "Error desconocido");
    }
  };

  const borrarProyecto = async (id: number) => {
    if (!confirm("¿Borrar este proyecto?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/proyectos?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("DELETE /api/proyectos falló");
      await cargarProyectos();
    } catch (e: any) {
      setError(e?.message || "Error desconocido");
    }
  };

  return (
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "40px", marginBottom: "20px" }}>ARKHE OS</h1>

      <p style={{ fontSize: "18px", marginBottom: "20px" }}>
        Sistema Operativo Cognitivo Universal
      </p>

      <button
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
        style={{
          padding: "20px 40px",
          fontSize: "18px",
          borderRadius: "10px",
          border: "none",
          backgroundColor: "black",
          color: "white",
          cursor: "pointer",
        }}
      >
        Crear Proyecto
      </button>

      {mostrarFormulario && <FormularioProyecto onGuardar={agregarProyecto} />}

      <div style={{ marginTop: "25px", color: "#b00020" }}>
        {error ? `Error: ${error}` : ""}
      </div>

      <div style={{ marginTop: "60px" }}>
        <h2>Proyectos (DB real)</h2>

        {cargando && <p>Cargando...</p>}

        {!cargando && proyectos.length === 0 && <p>Aún no hay proyectos creados.</p>}

        {!cargando &&
          proyectos.map((p) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div>• {p.nombre}</div>
              <button onClick={() => borrarProyecto(p.id)} style={{ padding: "4px 10px" }}>
                Borrar
              </button>
            </div>
          ))}
      </div>
    </main>
  );
}curl http://localhost:3000/api/proyectos
curl -i http://localhost:3000/api/proyectos
