"use client";
import React from "react";

interface Props {
  onGuardar: (nombre: string) => void;
}

export default function FormularioProyecto({ onGuardar }: Props) {
  const [nombre, setNombre] = React.useState("");

  const guardar = () => {
    if (!nombre.trim()) return;
    onGuardar(nombre);
    setNombre("");
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <input
        type="text"
        placeholder="Nombre del proyecto"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        style={{ padding: "10px", marginRight: "10px" }}
      />
      <button onClick={guardar}>
        Guardar
      </button>
    </div>
  );
}
