"use client";
import React from "react";
import FormularioProyecto from "../components/FormularioProyecto";

export default function Home() {
  const [mostrarFormulario, setMostrarFormulario] = React.useState(false);
  const [proyectos, setProyectos] = React.useState<any[]>([]);

  // Cargar desde API
  const cargarProyectos = async () => {
    const res = await fetch("/api/proyectos");
    const data = await res.json();
    setProyectos(data);
  };

  React.useEffect(() => {
    cargarProyectos();
  }, []);

  const agregarProyecto = async (nombre: string) => {
    await fetch("/api/proyectos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
    });

    setMostrarFormulario(false);
    cargarProyectos();
  };

  return (
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "40px", marginBottom: "20px" }}>
        ARKHE OS
      </h1>

      <p style={{ fontSize: "18px", marginBottom: "40px" }}>
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
          cursor: "pointer"
        }}
      >
        Crear Proyecto
      </button>

      {mostrarFormulario && (
        <FormularioProyecto onGuardar={agregarProyecto} />
      )}

      <div style={{ marginTop: "60px" }}>
        <h2>Proyectos</h2>
        {proyectos.length === 0 && (
          <p>Aún no hay proyectos creados.</p>
        )}
        {proyectos.map((p) => (
          <p key={p.id}>• {p.nombre}</p>
        ))}
      </div>
    </main>
  );
}
